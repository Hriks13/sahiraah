
-- Add columns to store complete roadmap data in user_career_history table
ALTER TABLE public.user_career_history 
ADD COLUMN roadmap_summary TEXT,
ADD COLUMN courses JSONB,
ADD COLUMN tags TEXT[],
ADD COLUMN links_clicked BOOLEAN DEFAULT false;

-- Update the existing table to support the new data structure
-- The courses JSONB will store the structure like:
-- {
--   "beginner": [{"title": "Course Name", "link": "URL", "platform": "Platform"}],
--   "intermediate": [{"title": "Course Name", "link": "URL", "platform": "Platform"}],
--   "advanced": [{"title": "Course Name", "link": "URL", "platform": "Platform"}]
-- }

-- Add an index on the courses JSONB column for better query performance
CREATE INDEX IF NOT EXISTS idx_user_career_history_courses ON public.user_career_history USING GIN (courses);

-- Add an index on tags array for better search performance
CREATE INDEX IF NOT EXISTS idx_user_career_history_tags ON public.user_career_history USING GIN (tags);
