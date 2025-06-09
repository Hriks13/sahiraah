
-- Create table to store available courses
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  career_path TEXT NOT NULL,
  skills TEXT[] NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table to store user course progress
CREATE TABLE public.user_course_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES public.courses(id),
  completed BOOLEAN NOT NULL DEFAULT false,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Create table to store user's recommended learning paths
CREATE TABLE public.user_learning_paths (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  career_path TEXT NOT NULL,
  course_id UUID NOT NULL REFERENCES public.courses(id),
  recommended_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(user_id, career_path, course_id)
);

-- Enable RLS on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_learning_paths ENABLE ROW LEVEL SECURITY;

-- RLS policies for courses (public read)
CREATE POLICY "Anyone can view courses" ON public.courses FOR SELECT USING (true);

-- RLS policies for user_course_progress
CREATE POLICY "Users can view their own progress" ON public.user_course_progress 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.user_course_progress 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON public.user_course_progress 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for user_learning_paths
CREATE POLICY "Users can view their own learning paths" ON public.user_learning_paths 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own learning paths" ON public.user_learning_paths 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own learning paths" ON public.user_learning_paths 
  FOR UPDATE USING (auth.uid() = user_id);

-- Insert sample courses for different career paths
INSERT INTO public.courses (title, description, duration, level, career_path, skills, order_index) VALUES
-- Software Developer courses
('Programming Fundamentals', 'Learn the basics of programming logic, variables, and control structures.', '4 weeks', 'Beginner', 'Software Developer', ARRAY['Programming Logic', 'Problem Solving', 'Debugging'], 1),
('Web Development Basics', 'Introduction to HTML, CSS, and JavaScript for web development.', '6 weeks', 'Beginner', 'Software Developer', ARRAY['HTML', 'CSS', 'JavaScript', 'DOM Manipulation'], 2),
('Database Management', 'Learn SQL, database design, and data modeling concepts.', '5 weeks', 'Intermediate', 'Software Developer', ARRAY['SQL', 'Database Design', 'Data Modeling', 'MySQL'], 3),
('React Development', 'Build modern web applications using React framework.', '8 weeks', 'Intermediate', 'Software Developer', ARRAY['React', 'Component Architecture', 'State Management', 'Hooks'], 4),
('Software Architecture & Design Patterns', 'Master software architecture principles and common design patterns.', '6 weeks', 'Advanced', 'Software Developer', ARRAY['Software Architecture', 'Design Patterns', 'System Design', 'Scalability'], 5),
('Cloud Computing & DevOps', 'Learn cloud platforms, containerization, and deployment strategies.', '7 weeks', 'Advanced', 'Software Developer', ARRAY['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'DevOps'], 6),

-- Data Scientist courses
('Statistics Fundamentals', 'Essential statistical concepts for data analysis.', '5 weeks', 'Beginner', 'Data Scientist', ARRAY['Statistics', 'Probability', 'Hypothesis Testing', 'Data Analysis'], 1),
('Python for Data Science', 'Learn Python programming specifically for data science applications.', '6 weeks', 'Beginner', 'Data Scientist', ARRAY['Python', 'Pandas', 'NumPy', 'Data Manipulation'], 2),
('Data Visualization', 'Create compelling visualizations using modern tools and techniques.', '4 weeks', 'Intermediate', 'Data Scientist', ARRAY['Matplotlib', 'Seaborn', 'Tableau', 'Data Storytelling'], 3),
('Machine Learning Fundamentals', 'Introduction to supervised and unsupervised learning algorithms.', '8 weeks', 'Intermediate', 'Data Scientist', ARRAY['Scikit-learn', 'Regression', 'Classification', 'Clustering'], 4),
('Deep Learning & Neural Networks', 'Advanced machine learning with neural networks and deep learning.', '10 weeks', 'Advanced', 'Data Scientist', ARRAY['TensorFlow', 'PyTorch', 'Neural Networks', 'Deep Learning'], 5),
('Big Data Analytics', 'Handle and analyze large-scale datasets using modern tools.', '8 weeks', 'Advanced', 'Data Scientist', ARRAY['Spark', 'Hadoop', 'Big Data', 'Distributed Computing'], 6),

-- UX Designer courses
('Design Principles & Theory', 'Fundamental design principles, color theory, and typography.', '3 weeks', 'Beginner', 'UX Designer', ARRAY['Design Theory', 'Color Theory', 'Typography', 'Visual Hierarchy'], 1),
('User Research Methods', 'Learn how to conduct user interviews, surveys, and usability testing.', '4 weeks', 'Beginner', 'UX Designer', ARRAY['User Research', 'Interviews', 'Surveys', 'Usability Testing'], 2),
('Wireframing & Prototyping', 'Create wireframes and interactive prototypes using design tools.', '5 weeks', 'Intermediate', 'UX Designer', ARRAY['Wireframing', 'Prototyping', 'Figma', 'Adobe XD'], 3),
('UI Design & Visual Design', 'Master visual design principles and create stunning user interfaces.', '6 weeks', 'Intermediate', 'UX Designer', ARRAY['UI Design', 'Visual Design', 'Design Systems', 'Component Libraries'], 4),
('Advanced UX Strategy', 'Strategic UX planning, business alignment, and product strategy.', '7 weeks', 'Advanced', 'UX Designer', ARRAY['UX Strategy', 'Product Strategy', 'Business Analysis', 'Stakeholder Management'], 5),
('Design Leadership & Portfolio', 'Build a professional portfolio and develop design leadership skills.', '4 weeks', 'Advanced', 'UX Designer', ARRAY['Portfolio Development', 'Design Leadership', 'Presentation Skills', 'Career Development'], 6);
