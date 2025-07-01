
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
  const { previousAnswers, educationLevel, currentQuestionIndex } = data;

  // Create context from previous answers for adaptive questioning
  let context = `Student is at ${educationLevel} level. `;
  if (previousAnswers && previousAnswers.length > 0) {
    context += `Previous responses: ${previousAnswers.map((a: any) => `Q: ${a.question} A: ${a.answer}`).join('; ')}`;
  }

  const prompt = `
As an AI career counselor for Indian students, generate 3-5 adaptive follow-up questions based on the student's profile and previous responses.

Context: ${context}

Requirements:
1. Questions should be specific to Indian education system and career paths
2. Adapt based on student's interests shown in previous answers
3. Include questions about:
   - Specific subjects they excel in
   - Career aspirations and role models
   - Preferred work environment
   - Technology comfort level
   - Creative vs analytical preferences
4. Make questions engaging and age-appropriate
5. Each question should have 4-5 multiple choice options or be open-ended where appropriate

Return response as JSON with this structure:
{
  "questions": [
    {
      "id": "q_unique_id",
      "question": "Question text",
      "type": "radio|text|textarea",
      "options": ["option1", "option2", ...] // only for radio type
    }
  ],
  "reasoning": "Why these questions were chosen"
}
`;

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

  const aiResponse = await response.json();
  const content = aiResponse.choices[0].message.content;
  
  try {
    const parsedContent = JSON.parse(content);
    return new Response(JSON.stringify(parsedContent), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (parseError) {
    console.error('Failed to parse AI response:', parseError);
    // Fallback questions if AI response parsing fails
    const fallbackQuestions = {
      questions: [
        {
          id: "interests_general",
          question: "Which activities do you find most engaging?",
          type: "radio",
          options: ["Problem-solving and puzzles", "Creative projects", "Helping others", "Leading teams", "Analyzing information"]
        }
      ],
      reasoning: "Fallback question due to parsing error"
    };
    
    return new Response(JSON.stringify(fallbackQuestions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function analyzeResponsesAndGenerateRecommendations(data: any, userId: string) {
  const { responses, educationLevel, studentName } = data;

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

  const aiResponse = await response.json();
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
}

async function generateCareerReport(data: any, userId: string) {
  const { careerData, studentResponses, studentName } = data;

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

  const aiResponse = await response.json();
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
}
