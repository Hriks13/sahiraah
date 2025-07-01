
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
      case 'start_ai_session':
        return await startAISession(data, userId);
      case 'process_answer_and_continue':
        return await processAnswerAndContinue(data, userId);
      case 'generate_final_recommendations':
        return await generateFinalRecommendations(data, userId);
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

async function startAISession(data: any, userId: string) {
  console.log('Starting AI session for user:', userId);
  
  const prompt = `
As an AI career counselor for Indian students, start an intelligent career assessment session.

Generate the first question to begin understanding this student's profile. This should be a foundational question that will help guide the entire assessment.

Consider asking about:
- Their current education level and field of study
- What subjects or activities they're most passionate about
- Their career dreams or role models
- What kind of impact they want to make

Make the question engaging, personal, and appropriate for Indian students aged 16-25.

Return response as JSON:
{
  "question": {
    "id": "q_1",
    "text": "Your personalized question here",
    "type": "text",
    "reasoning": "Why you chose this question to start the assessment"
  },
  "sessionContext": {
    "phase": "initial_discovery",
    "questionCount": 1,
    "keyInsights": []
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
    const content = aiResponse.choices[0].message.content;
    const parsedContent = JSON.parse(content);

    // Store session start in database
    await supabase
      .from('user_quiz_sessions')
      .insert({
        user_id: userId,
        session_started_at: new Date().toISOString(),
        current_question_index: 0,
        total_questions: 1,
        is_completed: false
      });

    return new Response(JSON.stringify(parsedContent), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error starting AI session:', error);
    
    // Fallback first question
    const fallbackResponse = {
      question: {
        id: "q_1",
        text: "What's your name and what are you currently studying or working on?",
        type: "text",
        reasoning: "Starting with basic introduction to personalize the experience"
      },
      sessionContext: {
        phase: "initial_discovery",
        questionCount: 1,
        keyInsights: []
      }
    };

    return new Response(JSON.stringify(fallbackResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function processAnswerAndContinue(data: any, userId: string) {
  const { currentAnswer, previousAnswers = [], sessionContext } = data;
  
  console.log('Processing answer for user:', userId);
  console.log('Current answer:', currentAnswer);
  console.log('Previous answers count:', previousAnswers.length);

  // Store the current answer
  await supabase
    .from('user_quiz_responses')
    .insert({
      user_id: userId,
      question: `Question ${sessionContext.questionCount}`,
      answer: currentAnswer
    });

  // Build conversation history for AI
  const conversationHistory = previousAnswers.map((qa: any) => 
    `Q: ${qa.question}\nA: ${qa.answer}`
  ).join('\n\n');

  const prompt = `
As an AI career counselor, you've been having a conversation with an Indian student. Here's the conversation so far:

${conversationHistory}

Latest Answer: ${currentAnswer}

Current Phase: ${sessionContext.phase}
Questions Asked: ${sessionContext.questionCount}

Based on this conversation, decide what to do next:

1. If you need more information (fewer than 5-6 questions), generate the next question
2. If you have enough information, provide final career recommendations

For the next question, make it:
- Highly personalized based on their previous answers
- Designed to uncover deeper insights about their interests, skills, and goals
- Relevant to the Indian job market and education system
- Engaging and conversational

Return response as JSON:
{
  "action": "continue_questioning" | "provide_recommendations",
  "question": {
    "id": "q_X",
    "text": "Your next question",
    "type": "text" | "radio",
    "options": ["option1", "option2"] // only if type is radio
  },
  "analysis": {
    "keyInsights": ["insight1", "insight2"],
    "emergingPatterns": ["pattern1", "pattern2"],
    "reasoning": "Why you chose this next question or decided to provide recommendations"
  },
  "sessionContext": {
    "phase": "deep_exploration" | "final_analysis",
    "questionCount": ${sessionContext.questionCount + 1},
    "readyForRecommendations": true | false
  }
}

If providing recommendations instead of continuing questioning, include:
{
  "action": "provide_recommendations",
  "recommendations": [
    {
      "title": "Career Title",
      "matchPercentage": 85,
      "description": "Why this career fits",
      "reasons": ["reason1", "reason2"],
      "skillsRequired": ["skill1", "skill2"],
      "learningPath": {
        "immediate": ["step1", "step2"],
        "shortTerm": ["step3", "step4"],
        "longTerm": ["step5", "step6"]
      },
      "salaryRange": "₹X-Y LPA",
      "industryInsights": "Market insights",
      "nextSteps": ["action1", "action2"]
    }
  ],
  "overallAnalysis": "Student's profile summary",
  "actionPlan": ["immediate_action1", "immediate_action2"]
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
    const content = aiResponse.choices[0].message.content;
    const parsedContent = JSON.parse(content);

    // If AI decided to provide recommendations, store them
    if (parsedContent.action === 'provide_recommendations') {
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
                platform: "AI Recommended",
                link: "#",
                estimatedTime: "4-6 weeks"
              })),
              intermediate: recommendation.learningPath.shortTerm.map((course: string) => ({
                title: course,
                platform: "AI Recommended", 
                link: "#",
                estimatedTime: "8-12 weeks"
              })),
              advanced: recommendation.learningPath.longTerm.map((course: string) => ({
                title: course,
                platform: "AI Recommended",
                link: "#", 
                estimatedTime: "12+ weeks"
              }))
            }
          });
      }

      // Mark session as completed
      await supabase
        .from('user_quiz_sessions')
        .update({ 
          is_completed: true,
          session_completed_at: new Date().toISOString(),
          career_recommendations: parsedContent.recommendations 
        })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);
    }

    return new Response(JSON.stringify(parsedContent), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing answer:', error);
    
    // Fallback decision logic
    const shouldContinue = sessionContext.questionCount < 5;
    
    if (shouldContinue) {
      const fallbackResponse = {
        action: "continue_questioning",
        question: {
          id: `q_${sessionContext.questionCount + 1}`,
          text: "What type of work environment do you think you'd thrive in?",
          type: "radio",
          options: ["Collaborative team environment", "Independent work", "Creative studio", "Fast-paced startup", "Structured corporate setting"]
        },
        analysis: {
          keyInsights: ["Exploring work preferences"],
          emergingPatterns: ["Work environment preferences"],
          reasoning: "Understanding work style preferences"
        },
        sessionContext: {
          phase: "deep_exploration",
          questionCount: sessionContext.questionCount + 1,
          readyForRecommendations: false
        }
      };
      
      return new Response(JSON.stringify(fallbackResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      // Generate basic recommendations
      const fallbackRecommendations = {
        action: "provide_recommendations",
        recommendations: [
          {
            title: "Technology Professional",
            matchPercentage: 75,
            description: "Based on your responses, technology could be a great fit",
            reasons: ["Growing field in India", "Good career prospects"],
            skillsRequired: ["Programming", "Problem-solving"],
            learningPath: {
              immediate: ["Learn programming basics", "Explore different tech domains"],
              shortTerm: ["Build projects", "Gain practical experience"],
              longTerm: ["Specialize in chosen area", "Advance to senior roles"]
            },
            salaryRange: "₹3-12 LPA",
            industryInsights: "Technology sector is booming in India",
            nextSteps: ["Start with online courses", "Join tech communities"]
          }
        ],
        overallAnalysis: "You show potential for multiple career paths",
        actionPlan: ["Explore your interests further", "Gain practical experience"]
      };

      return new Response(JSON.stringify(fallbackRecommendations), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }
}

async function generateDetailedReport(data: any, userId: string) {
  const { careerData, studentResponses = {}, studentName = "Student" } = data;

  const prompt = `
Generate a comprehensive AI-powered career guidance report for ${studentName} based on their quiz responses and selected career path.

Career: ${careerData.title}
Student Profile: ${JSON.stringify(studentResponses)}

Create a detailed report including:
1. Executive summary of the student's profile and career fit
2. Detailed AI analysis of their responses
3. Strengths and areas for improvement
4. Step-by-step learning roadmap with timelines
5. Market outlook and opportunities in India
6. Specific action items for the next 3, 6, and 12 months

Return as JSON:
{
  "executiveSummary": "Brief overview of student profile and career fit",
  "aiAnalysis": {
    "personalityInsights": ["insight1", "insight2"],
    "skillAssessment": ["strength1", "strength2"],
    "careerAlignment": "How well the career aligns with their profile"
  },
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
  "marketOutlook": "Industry trends and opportunities in India",
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
    const content = aiResponse.choices[0].message.content;
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
  } catch (error) {
    console.error('Error generating detailed report:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate detailed report' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
