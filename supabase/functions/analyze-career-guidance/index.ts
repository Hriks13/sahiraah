
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId, userId, answers, studentName, educationLevel } = await req.json();
    
    const supabase = createClient(supabaseUrl!, supabaseKey!);

    // Create comprehensive analysis prompt for Indian students
    const analysisPrompt = `You are an expert career counselor specializing in guidance for Indian students. 

Analyze the following student profile and quiz responses:
- Name: ${studentName}
- Education Level: ${educationLevel}
- Quiz Responses: ${JSON.stringify(answers, null, 2)}

Provide a comprehensive career analysis with:

1. STRENGTHS (3-5 key strengths based on responses)
2. AREAS FOR IMPROVEMENT (2-3 areas to develop)
3. TOP 5 CAREER RECOMMENDATIONS specifically suitable for Indian students with:
   - Career title
   - Why it matches their profile
   - Growth potential in India
   - Salary range in INR
   - Key skills needed
   - Educational pathway required

4. SKILL DEVELOPMENT ROADMAP for top career choice

Focus on:
- Current Indian job market trends
- Emerging technologies and opportunities
- Practical, actionable advice
- Clear learning pathways

Return response in JSON format:
{
  "strengths": ["strength1", "strength2", ...],
  "areasForImprovement": ["area1", "area2", ...],
  "careerRecommendations": [
    {
      "title": "Career Title",
      "description": "Why this matches",
      "growthPotential": "Growth prospects",
      "salaryRange": "INR range",
      "keySkills": ["skill1", "skill2", ...],
      "educationPath": "Education requirements",
      "matchScore": 95
    }
  ],
  "skillRoadmap": {
    "immediate": ["Skills to learn now"],
    "shortTerm": ["Skills for next 6 months"],
    "longTerm": ["Skills for career advancement"]
  }
}`;

    // Get AI analysis
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert career counselor for Indian students. Provide accurate, practical career guidance.' },
          { role: 'user', content: analysisPrompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    const aiData = await response.json();
    const analysis = JSON.parse(aiData.choices[0].message.content);

    // Update quiz session with analysis results
    const { error: sessionError } = await supabase
      .from('user_quiz_sessions')
      .update({
        session_completed_at: new Date().toISOString(),
        is_completed: true,
        student_name: studentName,
        education_level: educationLevel,
        strengths: analysis.strengths,
        weaknesses: analysis.areasForImprovement,
        career_recommendations: analysis.careerRecommendations
      })
      .eq('id', sessionId);

    if (sessionError) throw sessionError;

    // Store career recommendations in history
    for (const career of analysis.careerRecommendations.slice(0, 3)) {
      await supabase
        .from('user_career_history')
        .insert({
          user_id: userId,
          session_id: sessionId,
          career: career.title,
          reason: career.description,
          strengths: analysis.strengths,
          weaknesses: analysis.areasForImprovement,
          improvement_areas: analysis.areasForImprovement,
          report_data: {
            salary_range: career.salaryRange,
            growth_potential: career.growthPotential,
            key_skills: career.keySkills,
            education_path: career.educationPath,
            match_score: career.matchScore
          }
        });
    }

    return new Response(JSON.stringify({
      success: true,
      analysis: analysis,
      sessionId: sessionId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in career analysis:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
