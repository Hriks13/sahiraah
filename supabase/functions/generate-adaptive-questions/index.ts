
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
    const { answers, educationLevel, userName } = await req.json();

    // Create a comprehensive prompt for generating adaptive questions
    const questionPrompt = `You are an expert career counselor specializing in creating personalized assessments for Indian students.

Based on the following student information:
- Name: ${userName}
- Education Level: ${educationLevel}
- Previous Answers: ${JSON.stringify(answers, null, 2)}

Generate 20 highly relevant, adaptive career assessment questions that will help identify:
1. Career interests and passions
2. Analytical and problem-solving abilities
3. Leadership and teamwork preferences
4. Technology adoption and learning agility
5. Communication and interpersonal skills
6. Creative thinking and innovation potential
7. Work environment preferences
8. Long-term career aspirations
9. Skill development interests
10. Industry-specific inclinations

Requirements:
- Questions should be culturally relevant for Indian students
- Include mix of multiple choice (4-5 options) and open-ended questions
- Questions should build upon previous answers to create a coherent assessment flow
- Focus on emerging careers and future job market trends in India
- Include questions about AI, technology, sustainability, healthcare, and other growing sectors

Return JSON format:
{
  "questions": [
    {
      "question": "Question text",
      "type": "radio" or "text",
      "options": ["option1", "option2", "option3", "option4"] (for radio type),
      "placeholder": "hint text" (for text type),
      "category": "category_name"
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
          { role: 'system', content: 'You are an expert career counselor and assessment designer. Create engaging, relevant questions that help identify career paths for Indian students.' },
          { role: 'user', content: questionPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiData = await response.json();
    const result = JSON.parse(aiData.choices[0].message.content);

    // Validate and format questions
    const questions = result.questions.map((q: any, index: number) => ({
      question: q.question || `Assessment question ${index + 1}`,
      type: q.type === 'text' ? 'text' : 'radio',
      options: q.type === 'radio' ? (q.options || [
        "Strongly Agree",
        "Agree", 
        "Neutral",
        "Disagree",
        "Strongly Disagree"
      ]) : undefined,
      placeholder: q.type === 'text' ? (q.placeholder || "Your answer...") : undefined,
      category: q.category || "assessment"
    }));

    return new Response(JSON.stringify({
      success: true,
      questions: questions.slice(0, 20) // Ensure max 20 questions
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating adaptive questions:', error);
    
    // Return fallback questions if AI fails
    const fallbackQuestions = [
      {
        question: "Which emerging technology field interests you most?",
        type: "radio",
        options: [
          "Artificial Intelligence & Machine Learning",
          "Blockchain & Cryptocurrency",
          "Internet of Things (IoT)",
          "Augmented/Virtual Reality",
          "Cybersecurity"
        ],
        category: "technology"
      },
      {
        question: "What type of work environment motivates you most?",
        type: "radio",
        options: [
          "Fast-paced startup environment",
          "Structured corporate setting",
          "Remote/flexible work arrangements",
          "Collaborative team-based work",
          "Independent project work"
        ],
        category: "work_environment"
      },
      {
        question: "Which social impact area would you like to contribute to?",
        type: "radio",
        options: [
          "Education and skill development",
          "Healthcare and medical innovation",
          "Environmental sustainability",
          "Financial inclusion and fintech",
          "Rural development and agriculture"
        ],
        category: "social_impact"
      },
      {
        question: "How do you prefer to learn new skills?",
        type: "radio",
        options: [
          "Hands-on practice and experimentation",
          "Structured courses and certifications",
          "Peer learning and collaboration",
          "Self-directed online learning",
          "Mentorship and guidance"
        ],
        category: "learning_style"
      },
      {
        question: "What motivates you most in your career goals?",
        type: "radio",
        options: [
          "Making a significant impact on society",
          "Achieving financial independence",
          "Continuous learning and growth",
          "Recognition and professional status",
          "Work-life balance and flexibility"
        ],
        category: "career_motivation"
      }
    ];

    return new Response(JSON.stringify({
      success: true,
      questions: fallbackQuestions,
      fallback: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
