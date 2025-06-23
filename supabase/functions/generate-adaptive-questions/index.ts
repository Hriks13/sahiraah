
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { answers, educationLevel, userName, currentQuestionNumber } = await req.json();
    
    console.log('Generating questions for:', { userName, educationLevel, currentQuestionNumber, answersCount: Object.keys(answers || {}).length });

    // Create context from previous answers
    const answerContext = Object.entries(answers || {}).map(([question, answer]) => 
      `Q: ${question}\nA: ${answer}`
    ).join('\n\n');

    // Create a more sophisticated prompt based on current progress
    const questionPrompt = `You are an expert career counselor creating adaptive questions for Indian students.

STUDENT PROFILE:
- Name: ${userName || 'Student'}
- Education Level: ${educationLevel || 'Not specified'}
- Current Question Number: ${currentQuestionNumber || 'Initial'}

PREVIOUS RESPONSES:
${answerContext || 'No previous responses yet'}

TASK: Generate 15 highly personalized questions that adapt to this student's responses. These questions should:

1. Build upon their previous answers to create deeper insights
2. Be culturally relevant for Indian students and job market
3. Focus on emerging careers (AI, sustainability, healthcare tech, fintech, etc.)
4. Mix different question types to maintain engagement
5. Progressively reveal personality traits, skills, and interests

QUESTION CATEGORIES TO INCLUDE:
- Career interests based on previous responses
- Problem-solving approach and analytical thinking
- Technology adoption and digital literacy
- Leadership and teamwork preferences
- Learning style and skill development interests
- Work environment and culture preferences
- Innovation and creativity potential
- Communication and interpersonal skills
- Long-term career aspirations
- Industry-specific inclinations

IMPORTANT: 
- Questions should feel conversational and personalized
- Reference their education level appropriately
- Include practical scenarios they might relate to
- Focus on future-oriented career paths in India's growing economy

Return exactly this JSON format:
{
  "questions": [
    {
      "question": "Question text that builds on their responses",
      "type": "radio" or "text",
      "options": ["option1", "option2", "option3", "option4", "option5"] (for radio type only),
      "placeholder": "hint text" (for text type only),
      "category": "category_name",
      "reasoning": "Why this question is relevant based on their profile"
    }
  ]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert career counselor and psychologist specializing in career assessment for Indian students. You create questions that reveal deep insights about personality, skills, interests, and career potential. Always respond with valid JSON.' 
          },
          { role: 'user', content: questionPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.8,
        max_tokens: 4000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const aiData = await response.json();
    console.log('OpenAI response received, processing questions...');
    
    let result;
    try {
      result = JSON.parse(aiData.choices[0].message.content);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      throw new Error('Invalid JSON response from AI');
    }

    // Enhanced question validation and formatting
    const questions = (result.questions || []).map((q: any, index: number) => {
      const questionData = {
        question: q.question || `Assessment question ${index + 1}`,
        type: q.type === 'text' ? 'text' : 'radio',
        category: q.category || "assessment",
        reasoning: q.reasoning || "General assessment"
      };

      if (questionData.type === 'radio') {
        questionData.options = Array.isArray(q.options) && q.options.length >= 3 
          ? q.options.slice(0, 5) // Max 5 options
          : [
              "Strongly Agree",
              "Agree", 
              "Neutral",
              "Disagree",
              "Strongly Disagree"
            ];
      } else {
        questionData.placeholder = q.placeholder || "Please share your thoughts...";
      }

      return questionData;
    }).slice(0, 15); // Ensure max 15 questions

    console.log(`Generated ${questions.length} personalized questions`);

    return new Response(JSON.stringify({
      success: true,
      questions: questions,
      metadata: {
        generated_at: new Date().toISOString(),
        user_context: {
          name: userName,
          education: educationLevel,
          previous_answers: Object.keys(answers || {}).length
        }
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating adaptive questions:', error);
    
    // Enhanced fallback questions that are more personalized
    const personalizedFallback = [
      {
        question: `Hi ${userName || 'there'}! What subjects or topics make you lose track of time when you're learning about them?`,
        type: "text",
        placeholder: "e.g., Coding, design, business strategies, psychology...",
        category: "interests"
      },
      {
        question: "When you imagine your ideal workday 5 years from now, what does it look like?",
        type: "text",
        placeholder: "Describe your perfect work environment and activities...",
        category: "career_vision"
      },
      {
        question: "Which emerging technology field excites you most for future career opportunities?",
        type: "radio",
        options: [
          "Artificial Intelligence & Machine Learning",
          "Sustainable Technology & Green Energy",
          "Biotechnology & Health Innovation",
          "Fintech & Digital Finance",
          "Space Technology & Exploration"
        ],
        category: "technology"
      },
      {
        question: "What motivates you more in your career aspirations?",
        type: "radio",
        options: [
          "Making a significant impact on society",
          "Building financial independence and security",
          "Continuous learning and personal growth",
          "Recognition and professional achievement",
          "Work-life balance and flexibility"
        ],
        category: "motivation"
      },
      {
        question: "How do you typically approach complex challenges or problems?",
        type: "radio",
        options: [
          "Break them down into smaller, manageable steps",
          "Research extensively before taking action",
          "Brainstorm creative and innovative solutions",
          "Collaborate with others to find solutions",
          "Trust my intuition and take quick action"
        ],
        category: "problem_solving"
      },
      {
        question: "What type of impact would you like your career to have on India's development?",
        type: "radio",
        options: [
          "Advancing technology and digital transformation",
          "Improving healthcare and life quality",
          "Promoting education and skill development",
          "Driving economic growth and entrepreneurship",
          "Addressing environmental and sustainability challenges"
        ],
        category: "social_impact"
      },
      {
        question: "Which work environment energizes you the most?",
        type: "radio",
        options: [
          "Dynamic startup with rapid growth and change",
          "Established corporate with structured processes",
          "Remote/hybrid with maximum flexibility",
          "Collaborative team-based environment",
          "Independent consultant or freelancer setup"
        ],
        category: "work_environment"
      },
      {
        question: "What's your preferred way to develop new skills and knowledge?",
        type: "radio",
        options: [
          "Hands-on projects and real-world application",
          "Structured courses and certification programs",
          "Learning from mentors and experienced professionals",
          "Self-directed research and online resources",
          "Peer learning and collaborative study groups"
        ],
        category: "learning_style"
      }
    ];

    return new Response(JSON.stringify({
      success: true,
      questions: personalizedFallback,
      fallback: true,
      error_message: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
