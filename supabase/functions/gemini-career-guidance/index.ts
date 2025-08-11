import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, answers, currentQuestionCount, userName, educationLevel } = await req.json();
    
    console.log('Gemini Career Guidance:', { action, currentQuestionCount, answersCount: answers?.length });

    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    if (action === 'generate_question') {
      return await generateNextQuestion(answers, currentQuestionCount, userName, educationLevel);
    } else if (action === 'generate_report') {
      return await generateCareerReport(answers, userName, educationLevel);
    }

    throw new Error('Invalid action');
  } catch (error) {
    console.error('Error in gemini-career-guidance:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateNextQuestion(answers: any[], currentQuestionCount: number, userName: string, educationLevel: string) {
  const maxQuestions = 15;
  
  if (currentQuestionCount >= maxQuestions) {
    return new Response(JSON.stringify({
      success: true,
      isComplete: true,
      message: "Assessment complete! Generating your career recommendations..."
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Build context from previous answers
  const answerContext = answers.map((a, i) => 
    `Q${i + 1}: ${a.question}\nAnswer: ${a.answer}`
  ).join('\n\n');

  const questionPrompt = `You are an expert career counselor for Indian students. Generate the next question in a dynamic tree-based career assessment.

STUDENT PROFILE:
- Name: ${userName}
- Education Level: ${educationLevel}
- Current Question: ${currentQuestionCount + 1} of ${maxQuestions}

PREVIOUS RESPONSES:
${answerContext || 'No previous responses yet'}

TASK: Generate the next question that branches naturally from their previous answers. The question should:

1. Build upon their previous responses to dive deeper into their interests
2. Be culturally relevant for Indian students and career market
3. Focus on emerging careers and modern opportunities
4. Use a dynamic tree approach - if they showed interest in a subject, branch into specific areas
5. Be engaging and help reveal personality traits, skills, and interests

EXAMPLE BRANCHING LOGIC:
- If they mentioned "Hindi" → Ask about Poetry, Literature, Teaching, or Journalism
- If they mentioned "Technology" → Ask about Software, Data Science, AI, or Cybersecurity
- If they mentioned "Business" → Ask about Finance, Marketing, Consulting, or Entrepreneurship

Return EXACTLY this JSON format:
{
  "question": "The specific question text that builds on their previous responses",
  "type": "radio",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"],
  "category": "category_name",
  "reasoning": "Why this question follows from their previous answers"
}

Generate a question that feels like a natural continuation of the conversation.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: questionPrompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Clean up the response to extract JSON
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from response');
    }

    const questionData = JSON.parse(jsonMatch[0]);
    
    // Validate the response
    if (!questionData.question || !questionData.options || !Array.isArray(questionData.options)) {
      throw new Error('Invalid question format from AI');
    }

    return new Response(JSON.stringify({
      success: true,
      isComplete: false,
      question: questionData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating question:', error);
    
    // Fallback question based on question count
    const fallbackQuestion = getFallbackQuestion(currentQuestionCount, answers);
    
    return new Response(JSON.stringify({
      success: true,
      isComplete: false,
      question: fallbackQuestion,
      fallback: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function generateCareerReport(answers: any[], userName: string, educationLevel: string) {
  const answerContext = answers.map((a, i) => 
    `Q${i + 1}: ${a.question}\nAnswer: ${a.answer}`
  ).join('\n\n');

  const reportPrompt = `You are an expert career counselor analyzing a student's assessment responses. Generate a comprehensive career analysis.

STUDENT PROFILE:
- Name: ${userName}
- Education Level: ${educationLevel}
- Total Questions Answered: ${answers.length}

RESPONSES:
${answerContext}

TASK: Analyze the responses and provide exactly 5 career recommendations with detailed analysis.

Return EXACTLY this JSON format:
{
  "strengths": ["Strength 1", "Strength 2", "Strength 3", "Strength 4"],
  "areasForImprovement": ["Area 1", "Area 2", "Area 3"],
  "careerRecommendations": [
    {
      "title": "Career Title",
      "description": "Detailed description explaining why this career matches their profile",
      "matchScore": 95,
      "growthPotential": "Specific growth opportunities in India",
      "salaryRange": "₹X-Y LPA",
      "keySkills": ["Skill 1", "Skill 2", "Skill 3"],
      "educationPath": "Specific education recommendations",
      "freeResources": {
        "beginner": [
          {"title": "Course Name", "url": "https://example.com", "platform": "Platform Name", "duration": "X weeks"}
        ],
        "intermediate": [
          {"title": "Course Name", "url": "https://example.com", "platform": "Platform Name", "duration": "X weeks"}
        ],
        "advanced": [
          {"title": "Course Name", "url": "https://example.com", "platform": "Platform Name", "duration": "X weeks"}
        ]
      }
    }
  ],
  "personalityInsights": "Detailed personality analysis based on responses",
  "recommendedNextSteps": ["Step 1", "Step 2", "Step 3"]
}

Focus on careers relevant to India's job market and include only freely accessible courses.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: reportPrompt }]
        }],
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 4000,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Clean up the response to extract JSON
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from response');
    }

    const reportData = JSON.parse(jsonMatch[0]);
    
    return new Response(JSON.stringify({
      success: true,
      analysis: reportData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating report:', error);
    
    // Fallback analysis
    const fallbackAnalysis = {
      strengths: ["Problem-solving", "Communication", "Adaptability", "Learning agility"],
      areasForImprovement: ["Technical skills", "Leadership development", "Industry knowledge"],
      careerRecommendations: [
        {
          title: "Software Developer",
          description: "Based on your responses, you show strong logical thinking and problem-solving abilities suitable for software development.",
          matchScore: 88,
          growthPotential: "Excellent growth in India's expanding tech sector",
          salaryRange: "₹6-25 LPA",
          keySkills: ["Programming", "Problem Solving", "Logical Thinking"],
          educationPath: "Computer Science, Engineering, or coding bootcamps",
          freeResources: {
            beginner: [
              {"title": "HTML & CSS Basics", "url": "https://www.freecodecamp.org/learn/responsive-web-design/", "platform": "FreeCodeCamp", "duration": "4 weeks"}
            ],
            intermediate: [
              {"title": "JavaScript Complete Course", "url": "https://www.youtube.com/watch?v=hdI2bqOjy3c", "platform": "YouTube", "duration": "8 weeks"}
            ],
            advanced: [
              {"title": "React.js Tutorial", "url": "https://www.youtube.com/watch?v=bMknfKXIFA8", "platform": "YouTube", "duration": "12 weeks"}
            ]
          }
        }
      ],
      personalityInsights: "You demonstrate strong analytical thinking and a systematic approach to problem-solving.",
      recommendedNextSteps: ["Start with basic programming courses", "Build a portfolio of projects", "Network with industry professionals"]
    };
    
    return new Response(JSON.stringify({
      success: true,
      analysis: fallbackAnalysis,
      fallback: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

function getFallbackQuestion(questionCount: number, answers: any[]) {
  const fallbackQuestions = [
    {
      question: "What type of subjects interest you the most?",
      type: "radio",
      options: ["Science & Technology", "Arts & Literature", "Business & Commerce", "Social Sciences", "Creative Arts"],
      category: "interests",
      reasoning: "Understanding core subject interests helps identify career paths."
    },
    {
      question: "How do you prefer to work on projects?",
      type: "radio",
      options: ["Independently with minimal supervision", "In small collaborative teams", "Leading large teams", "Following structured guidelines", "Mixing different approaches"],
      category: "work_style",
      reasoning: "Work style preferences indicate suitable career environments."
    },
    {
      question: "What motivates you most in your career goals?",
      type: "radio",
      options: ["Making a positive impact on society", "Financial independence and security", "Continuous learning and growth", "Recognition and achievement", "Work-life balance and flexibility"],
      category: "motivation",
      reasoning: "Understanding motivations helps align career choices with personal values."
    },
    {
      question: "Which emerging technology field excites you most?",
      type: "radio",
      options: ["Artificial Intelligence & Machine Learning", "Sustainable Technology & Green Energy", "Healthcare & Biotechnology", "Financial Technology (FinTech)", "Space Technology & Research"],
      category: "technology",
      reasoning: "Interest in emerging technologies guides future career opportunities."
    },
    {
      question: "How do you handle challenging situations?",
      type: "radio",
      options: ["Analyze thoroughly before acting", "Take quick decisive action", "Seek advice from mentors", "Collaborate with others for solutions", "Trust my intuition and experience"],
      category: "problem_solving",
      reasoning: "Problem-solving approach reveals leadership and decision-making style."
    }
  ];

  return fallbackQuestions[questionCount % fallbackQuestions.length];
}