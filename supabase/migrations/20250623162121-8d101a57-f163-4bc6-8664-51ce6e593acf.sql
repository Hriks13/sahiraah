
-- Store detailed quiz responses with question categories
CREATE TABLE IF NOT EXISTS user_quiz_sessions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    session_started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    session_completed_at TIMESTAMP WITH TIME ZONE,
    current_question_index INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 25,
    is_completed BOOLEAN DEFAULT false,
    education_level TEXT,
    student_name TEXT,
    strengths JSONB,
    weaknesses JSONB,
    career_recommendations JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Store individual question-answer pairs with categories
CREATE TABLE IF NOT EXISTS user_quiz_answers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES user_quiz_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    question_number INTEGER NOT NULL,
    question_category TEXT NOT NULL, -- 'logical', 'analytical', 'reasoning', 'skill_interest'
    question_text TEXT NOT NULL,
    answer_text TEXT NOT NULL,
    ai_context JSONB, -- Store any AI-generated context for branching
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enhanced career history with detailed course recommendations
ALTER TABLE user_career_history 
ADD COLUMN IF NOT EXISTS session_id UUID REFERENCES user_quiz_sessions(id),
ADD COLUMN IF NOT EXISTS strengths JSONB,
ADD COLUMN IF NOT EXISTS weaknesses JSONB,
ADD COLUMN IF NOT EXISTS improvement_areas JSONB,
ADD COLUMN IF NOT EXISTS report_data JSONB;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_user_id ON user_quiz_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_session_id ON user_quiz_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_user_id ON user_quiz_answers(user_id);

-- Enable Row Level Security
ALTER TABLE user_quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_answers ENABLE ROW LEVEL SECURITY;

-- RLS policies for quiz sessions
CREATE POLICY "Users can view their own quiz sessions" 
    ON user_quiz_sessions FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quiz sessions" 
    ON user_quiz_sessions FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quiz sessions" 
    ON user_quiz_sessions FOR UPDATE 
    USING (auth.uid() = user_id);

-- RLS policies for quiz answers
CREATE POLICY "Users can view their own quiz answers" 
    ON user_quiz_answers FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quiz answers" 
    ON user_quiz_answers FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quiz answers" 
    ON user_quiz_answers FOR UPDATE 
    USING (auth.uid() = user_id);
