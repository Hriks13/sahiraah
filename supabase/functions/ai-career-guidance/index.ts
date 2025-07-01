
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data, userId } = await req.json();
    console.log(`AI Career Guidance - Action: ${action}`);

    switch (action) {
      case 'generate_adaptive_questions':
        return await generateAdaptiveQuestions(data, userId);
      case 'analyze_responses':
        return await analyzeResponsesAndGenerateRecommendations(data, userId);
      case 'generate_career_report':
        return await generateCareerReport(data, userId);
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error in AI career guidance:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateAdaptiveQuestions(data: any, userId: string) {
  const { previousAnswers = [], educationLevel = "", currentQuestionIndex = 0 } = data;

  // Create context from previous answers for adaptive questioning
  let context = "";
  if (educationLevel) {
    context += `Student is at ${educationLevel} level. `;
  }
  
  if (previousAnswers && previousAnswers.length > 0) {
    const answersText = previousAnswers.map((a: any) => `Q: ${a.question} A: ${a.answer}`).join('; ');
    context += `Previous responses: ${answersText}`;
  }

  const prompt = `
As an AI career counselor for Indian students, generate 1-2 adaptive follow-up questions based on the student's profile and previous responses.

Context: ${context || "This is the initial assessment for a student."}
Question Number: ${currentQuestionIndex + 1}

Requirements:
1. Questions should be specific to Indian education system and career paths
2. Adapt based on student's interests shown in previous answers
3. If this is the first question, ask about their current education level and interests
4. If they've answered basic questions, dive deeper into their preferences:
   - Specific subjects they excel in
   - Career aspirations and role models
   - Preferred work environment (remote, office, field work)
   - Technology comfort level
   - Creative vs analytical preferences
   - Problem-solving style
5. Make questions engaging and age-appropriate
6. Each question should have 4-5 multiple choice options

Return response as JSON with this structure:
{
  "questions": [
    {
      "id": "q_${currentQuestionIndex + 1}",
      "question": "Question text",
      "type": "radio",
      "options": ["option1", "option2", "option3", "option4"]
    }
  ],
  "reasoning": "Why this question was chosen based on previous answers",
  "isComplete": false
}

If you think we have enough information after 5-6 questions, set isComplete to true.
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    
    if (!aiResponse.choices || !aiResponse.choices[0] || !aiResponse.choices[0].message) {
      throw new Error('Invalid response structure from OpenAI');
    }

    const content = aiResponse.choices[0].message.content;
    
    try {
      const parsedContent = JSON.parse(content);
      console.log("AI Generated Question Reasoning:", parsedContent.reasoning);
      
      return new Response(JSON.stringify(parsedContent), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.log('Raw AI response:', content);
      
      // Fallback questions based on current question index
      const fallbackQuestions = getFallbackQuestion(currentQuestionIndex);
      
      return new Response(JSON.stringify(fallbackQuestions), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    
    // Fallback questions if OpenAI fails
    const fallbackQuestions = getFallbackQuestion(currentQuestionIndex);
    
    return new Response(JSON.stringify(fallbackQuestions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

function getFallbackQuestion(questionIndex: number) {
  const fallbackQuestions = [
    {
      questions: [{
        id: `q_${questionIndex + 1}`,
        question: "What is your current education level?",
        type: "radio",
        options: ["10th Standard", "PU/11th-12th", "Diploma", "Graduate", "Post-Graduate"]
      }],
      reasoning: "Starting with basic education level",
      isComplete: false
    },
    {
      questions: [{
        id: `q_${questionIndex + 1}`,
        question: "Which subjects do you enjoy the most?",
        type: "radio",
        options: ["Mathematics & Science", "Languages & Literature", "Arts & Creative", "Social Sciences", "Technology & Computers"]
      }],
      reasoning: "Understanding subject preferences",
      isComplete: false
    },
    {
      questions: [{
        id: `q_${questionIndex + 1}`,
        question: "What type of work environment appeals to you?",
        type: "radio",
        options: ["Office-based teamwork", "Independent remote work", "Field work & travel", "Creative studio", "Laboratory/Research"]
      }],
      reasoning: "Exploring work environment preferences",
      isComplete: false
    },
    {
      questions: [{
        id: `q_${questionIndex + 1}`,
        question: "How comfortable are you with technology?",
        type: "radio",
        options: ["Very comfortable - I love new tech", "Comfortable - I can learn quickly", "Moderate - I use basics well", "Limited - I prefer non-tech work"]
      }],
      reasoning: "Assessing technology comfort level",
      isComplete: false
    },
    {
      questions: [{
        id: `q_${questionIndex + 1}`,
        question: "What motivates you most in work?",
        type: "radio",
        options: ["Helping others and making impact", "Solving complex problems", "Creating something new", "Leading and managing teams", "Financial success and growth"]
      }],
      reasoning: "Understanding core motivations",
      isComplete: true
    }
  ];
  
  return fallbackQuestions[Math.min(questionIndex, fallbackQuestions.length - 1)];
}

async function analyzeResponsesAndGenerateRecommendations(data: any, userId: string) {
  const { responses, educationLevel = "", studentName = "Student" } = data;

  if (!responses || Object.keys(responses).length === 0) {
    throw new Error('No responses provided for analysis');
  }

  const prompt = `
Analyze the following student responses and generate personalized career recommendations for an Indian student.

Student Profile:
- Name: ${studentName}
- Education Level: ${educationLevel}
- Responses: ${JSON.stringify(responses)}

Generate comprehensive career recommendations including:

1. Top 3-4 career matches with detailed explanations
2. Specific skills to develop
3. Recommended courses and learning paths
4. Industry insights for Indian market
5. Salary expectations and growth prospects
6. Action plan for next 6 months

Return response as JSON:
{
  "recommendations": [
    {
      "title": "Career Title",
      "matchPercentage": 85,
      "description": "Detailed description",
      "reasons": ["reason1", "reason2"],
      "skillsRequired": ["skill1", "skill2"],
      "learningPath": {
        "immediate": ["course1", "course2"],
        "shortTerm": ["course3", "course4"],
        "longTerm": ["course5", "course6"]
      },
      "salaryRange": "₹X-Y LPA",
      "industryInsights": "Market insights",
      "nextSteps": ["step1", "step2"]
    }
  ],
  "overallAnalysis": "Student's strengths and areas for development",
  "actionPlan": ["action1", "action2", "action3"]
}
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    
    if (!aiResponse.choices || !aiResponse.choices[0] || !aiResponse.choices[0].message) {
      throw new Error('Invalid response structure from OpenAI');
    }

    const content = aiResponse.choices[0].message.content;

    try {
      const parsedContent = JSON.parse(content);
      
      // Store recommendations in database
      for (const recommendation of parsedContent.recommendations) {
        await supabase
          .from('user_career_history')
          .insert({
            user_id: userId,
            career: recommendation.title,
            reason: recommendation.reasons.join('. '),
            roadmap_summary: `Immediate: ${recommendation.learningPath.immediate.join(', ')}. Short-term: ${recommendation.learningPath.shortTerm.join(', ')}. Long-term: ${recommendation.learningPath.longTerm.join(', ')}.`,
            tags: recommendation.skillsRequired,
            courses: {
              beginner: recommendation.learningPath.immediate.map((course: string) => ({
                title: course,
                platform: "Recommended",
                link: "#",
                estimatedTime: "4-6 weeks"
              })),
              intermediate: recommendation.learningPath.shortTerm.map((course: string) => ({
                title: course,
                platform: "Recommended", 
                link: "#",
                estimatedTime: "8-12 weeks"
              })),
              advanced: recommendation.learningPath.longTerm.map((course: string) => ({
                title: course,
                platform: "Recommended",
                link: "#", 
                estimatedTime: "12+ weeks"
              }))
            }
          });
      }

      return new Response(JSON.stringify(parsedContent), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Failed to parse AI recommendation response:', parseError);
      return new Response(JSON.stringify({ error: 'Failed to generate recommendations' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error calling OpenAI for recommendations:', error);
    return new Response(JSON.stringify({ error: 'Failed to analyze responses' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function generateCareerReport(data: any, userId: string) {
  const { careerData, studentResponses = {}, studentName = "Student" } = data;

  const prompt = `
Generate a comprehensive career guidance report for ${studentName} based on their quiz responses and selected career path.

Career: ${careerData.title}
Student Responses: ${JSON.stringify(studentResponses)}

Create a detailed report including:
1. Executive summary of the student's profile
2. Detailed career match analysis
3. Strengths and areas for improvement
4. Step-by-step learning roadmap with timelines
5. Market outlook and opportunities
6. Specific action items for the next 3, 6, and 12 months

Return as JSON:
{
  "executiveSummary": "Brief overview of student profile and career fit",
  "matchAnalysis": {
    "score": 85,
    "strengths": ["strength1", "strength2"],
    "improvements": ["area1", "area2"]
  },
  "learningRoadmap": {
    "phase1": {
      "title": "Foundation (0-3 months)",
      "skills": ["skill1", "skill2"],
      "resources": ["resource1", "resource2"]
    },
    "phase2": {
      "title": "Development (3-6 months)", 
      "skills": ["skill3", "skill4"],
      "resources": ["resource3", "resource4"]
    },
    "phase3": {
      "title": "Specialization (6-12 months)",
      "skills": ["skill5", "skill6"],
      "resources": ["resource5", "resource6"]
    }
  },
  "marketOutlook": "Industry trends and opportunities",
  "actionPlan": {
    "next3Months": ["action1", "action2"],
    "next6Months": ["action3", "action4"],
    "next12Months": ["action5", "action6"]
  }
}
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    
    if (!aiResponse.choices || !aiResponse.choices[0] || !aiResponse.choices[0].message) {
      throw new Error('Invalid response structure from OpenAI');
    }

    const content = aiResponse.choices[0].message.content;

    try {
      const parsedContent = JSON.parse(content);
      
      // Update career history with report data
      await supabase
        .from('user_career_history')
        .update({
          report_data: parsedContent
        })
        .eq('user_id', userId)
        .eq('career', careerData.title);

      return new Response(JSON.stringify(parsedContent), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Failed to parse AI report response:', parseError);
      return new Response(JSON.stringify({ error: 'Failed to generate report' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error calling OpenAI for report:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate career report' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
