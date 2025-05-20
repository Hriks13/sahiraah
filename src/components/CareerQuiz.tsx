
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookIcon, CodeIcon, UserIcon, BrainCogIcon, LightbulbIcon, GraduationCapIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface QuizProps {
  userId: string;
  onComplete: (answers: Record<string, string>) => void;
}

const CareerQuiz = ({ userId, onComplete }: QuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userName, setUserName] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [questionCount, setQuestionCount] = useState(12); // Dynamic question count
  const { toast } = useToast();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizStarted, setQuizStarted] = useState(false);

  // Verify authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast({
          title: "Authentication required",
          description: "Please log in to take the career guidance assessment",
          variant: "destructive",
        });
        navigate("/login");
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

  // Basic questions for all students
  const baseQuestions = [
    {
      question: "What's your name?",
      type: "text",
      placeholder: "Your name",
      icon: <UserIcon className="h-5 w-5 text-blue-700" />,
      category: "personal",
    },
    {
      question: "What is your current education level?",
      type: "radio",
      options: ["10th Standard", "PU/11th-12th", "Diploma"],
      icon: <GraduationCapIcon className="h-5 w-5 text-blue-700" />,
      category: "personal",
    },
    {
      question: "Which subjects do you enjoy the most in school?",
      type: "text",
      placeholder: "E.g., Mathematics, Science, Computer Science, Arts...",
      icon: <BookIcon className="h-5 w-5 text-blue-700" />,
      category: "interests",
    },
    {
      question: "Do you prefer working with numbers, words, or visuals?",
      type: "radio",
      options: ["Numbers", "Words", "Visuals", "A mix of these"],
      icon: <BrainCogIcon className="h-5 w-5 text-blue-700" />,
      category: "skills",
    },
    {
      question: "How do you approach solving complex problems?",
      type: "radio",
      options: [
        "Break down into smaller parts",
        "Search for patterns",
        "Use creative thinking",
        "Ask for help and collaborate"
      ],
      icon: <LightbulbIcon className="h-5 w-5 text-blue-700" />,
      category: "analytical",
    },
    {
      question: "What activities or hobbies do you enjoy in your free time?",
      type: "text",
      placeholder: "E.g., Coding, Reading, Sports, Art, Music...",
      icon: <UserIcon className="h-5 w-5 text-blue-700" />,
      category: "interests",
    },
    {
      question: "How do you prefer learning new things?",
      type: "radio",
      options: ["Visual learning", "Hands-on experience", "Reading books", "Watching videos/tutorials"],
      icon: <BookIcon className="h-5 w-5 text-blue-700" />,
      category: "learning",
    },
    {
      question: "What kind of projects excite you the most?",
      type: "radio",
      options: [
        "Technology and coding projects",
        "Creative and design projects",
        "Research and analysis projects", 
        "Social and community projects"
      ],
      icon: <CodeIcon className="h-5 w-5 text-blue-700" />,
      category: "interests",
    },
    {
      question: "When working in a team, what role do you usually take?",
      type: "radio",
      options: ["Leader", "Creative thinker", "Organizer/planner", "Support person", "Technical expert"],
      icon: <UserIcon className="h-5 w-5 text-blue-700" />,
      category: "skills",
    },
    {
      question: "How do you feel about learning new technologies?",
      type: "radio",
      options: [
        "Very excited - I love trying new tech",
        "Comfortable - I can adapt quickly",
        "Neutral - I'll learn if needed",
        "Hesitant - I prefer familiar technologies"
      ],
      icon: <CodeIcon className="h-5 w-5 text-blue-700" />,
      category: "mindset",
    },
    {
      question: "If you had to solve this sequence: 2, 6, 12, 20, ?, what would be the next number?",
      type: "radio",
      options: ["30", "28", "32", "36"],
      icon: <BrainCogIcon className="h-5 w-5 text-blue-700" />,
      category: "logical",
      correctAnswer: "30",
    },
    {
      question: "If a project isn't going as planned, what's your typical response?",
      type: "radio",
      options: [
        "Try different approaches until something works",
        "Research more to understand the problem better",
        "Ask for help from others",
        "Take a break and come back with fresh perspective"
      ],
      icon: <LightbulbIcon className="h-5 w-5 text-blue-700" />,
      category: "problem-solving",
    },
    {
      question: "What technological innovations interest you the most?",
      type: "radio",
      options: [
        "Artificial Intelligence & Machine Learning",
        "Renewable Energy & Sustainability",
        "Robotics & Automation",
        "Healthcare & Biotechnology",
        "Space Exploration & Astronomy"
      ],
      icon: <CodeIcon className="h-5 w-5 text-blue-700" />,
      category: "interests",
    },
    {
      question: "How comfortable are you with expressing ideas through writing or speaking?",
      type: "radio",
      options: [
        "Very comfortable with both",
        "Strong in writing, less in speaking",
        "Strong in speaking, less in writing",
        "Still developing both skills"
      ],
      icon: <UserIcon className="h-5 w-5 text-blue-700" />,
      category: "communication",
    },
    {
      question: "When you encounter a setback, how do you typically respond?",
      type: "radio",
      options: [
        "See it as a learning opportunity",
        "Feel discouraged but try again",
        "Seek advice on how to improve",
        "Prefer to switch to something else"
      ],
      icon: <LightbulbIcon className="h-5 w-5 text-blue-700" />,
      category: "mindset",
    },
    {
      question: "What aspects of your studies or hobbies do others often praise you for?",
      type: "text",
      placeholder: "E.g., Creativity, Problem-solving, Attention to detail...",
      icon: <UserIcon className="h-5 w-5 text-blue-700" />,
      category: "strengths",
    },
    {
      question: "What kind of career would you find most meaningful?",
      type: "radio",
      options: [
        "Solving technical challenges",
        "Creating innovative products",
        "Helping and teaching others",
        "Building sustainable solutions",
        "Leading important projects"
      ],
      icon: <BrainCogIcon className="h-5 w-5 text-blue-700" />,
      category: "values",
    },
    {
      question: "Have you already explored or tried any specific career areas?",
      type: "text",
      placeholder: "Any internships, courses, or personal projects...",
      icon: <BookIcon className="h-5 w-5 text-blue-700" />,
      category: "experience",
    }
  ];
  
  // Advanced logical/analytical questions that might be added based on student responses
  const advancedQuestions = [
    {
      question: "What would you do if you identified a more efficient way to complete a group task?",
      type: "radio",
      options: [
        "Immediately suggest the improvement to everyone",
        "Test it privately first to confirm it works",
        "Discuss it one-on-one with the team leader",
        "Implement it in your portion and demonstrate the benefits"
      ],
      icon: <LightbulbIcon className="h-5 w-5 text-blue-700" />,
      category: "problem-solving",
    },
    {
      question: "If you could design an app to solve a problem, what would it do?",
      type: "textarea",
      placeholder: "Describe your app idea and what problem it would solve...",
      icon: <CodeIcon className="h-5 w-5 text-blue-700" />,
      category: "creative",
    },
    {
      question: "Which of these coding activities interests you most?",
      type: "radio",
      options: [
        "Creating websites or mobile apps",
        "Analyzing data to find patterns",
        "Building AI systems that can learn",
        "Securing systems against hackers",
        "None - I'm not interested in coding"
      ],
      icon: <CodeIcon className="h-5 w-5 text-blue-700" />,
      category: "tech-interests",
    },
  ];

  // Dynamically determine questions based on previous answers
  const getQuestions = () => {
    // Start with base questions
    let questionSet = [...baseQuestions];
    
    // Add advanced questions based on education level and previous answers
    if (answers["What is your current education level?"] === "PU/11th-12th" || 
        answers["What is your current education level?"] === "Diploma") {
      questionSet = [...questionSet, ...advancedQuestions];
    }
    
    // If they show interest in technology, add more tech questions
    if (answers["How do you feel about learning new technologies?"] === "Very excited - I love trying new tech") {
      questionSet.push({
        question: "Which specific tech area would you like to explore further?",
        type: "radio",
        options: [
          "Web/Mobile Development",
          "Data Science & Analytics",
          "Cybersecurity",
          "AI/Machine Learning",
          "Game Development",
          "IoT & Embedded Systems"
        ],
        icon: <CodeIcon className="h-5 w-5 text-blue-700" />,
        category: "tech-specifics",
      });
    }

    return questionSet;
  };
  
  const questions = getQuestions();

  const handleInputChange = (value: string) => {
    if (!quizStarted && currentQuestion === 0) {
      setUserName(value);
    }
    
    const questionText = questions[currentQuestion].question;
    setAnswers({ ...answers, [questionText]: value });
    
    // Adjust question count based on engagement
    if (currentQuestion === 5) {
      // If detailed answers to open-ended questions, increase question count
      if (value.length > 50) {
        setQuestionCount(Math.min(questionCount + 2, questions.length));
      }
    }
  };

  const handleNext = async () => {
    const questionText = questions[currentQuestion].question;
    
    if (!answers[questionText]) {
      toast({
        title: "Please answer the question",
        description: "We need your input to provide accurate career recommendations.",
        variant: "destructive",
      });
      return;
    }

    // Record the first two answers specially
    if (currentQuestion === 0) {
      setUserName(answers[questionText]);
    } else if (currentQuestion === 1) {
      setEducationLevel(answers[questionText]);
    }

    // Store the answer in Supabase
    try {
      const { error } = await supabase
        .from('user_quiz_responses')
        .insert({
          user_id: userId,
          question: questionText,
          answer: answers[questionText]
        });
      
      if (error) {
        console.error("Error storing quiz response:", error);
        toast({
          title: "Something went wrong",
          description: "Could not save your answer. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // If this isn't the welcome screen and quiz hasn't started yet
      if (currentQuestion === 1 && !quizStarted) {
        setQuizStarted(true);
      }

      // Dynamic question count adjustment based on engagement
      if (currentQuestion === 7) {
        // Based on pattern of answers, adjust remaining questions
        let uniqueResponses = new Set(Object.values(answers)).size;
        // If varied responses (engaged user), add more questions
        if (uniqueResponses >= 5) {
          setQuestionCount(Math.min(questionCount + 3, questions.length)); 
        } else {
          setQuestionCount(Math.max(questionCount - 2, 8)); // Minimum 8 questions
        }
      }

      if (currentQuestion < Math.min(questionCount, questions.length) - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Quiz completed
        onComplete(answers);
      }
    } catch (error) {
      console.error("Error storing answer:", error);
      toast({
        title: "Something went wrong",
        description: "Could not save your answer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const question = questions[currentQuestion];
  
  // Welcome screen
  if (currentQuestion === 0 && !quizStarted) {
    return (
      <Card className="bg-white shadow-md">
        <CardContent className="pt-6">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Welcome to SahiRaah Career Guidance</h2>
            <p className="text-blue-700 mb-4">
              This personalized assessment will help you discover future-proof career paths aligned with your skills,
              interests, and learning potential.
            </p>
            <div className="flex items-center justify-center mb-6">
              <BookIcon className="h-12 w-12 text-yellow-500 mr-2" />
            </div>
            <p className="text-blue-900 text-xl mb-6">Let's start with your name:</p>

            <Input
              value={answers[question.question] || ""}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Enter your name"
              className="w-full max-w-md mx-auto mb-6"
            />

            <Button 
              onClick={handleNext} 
              className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold px-8"
            >
              Start Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-md">
      <CardContent className="pt-6">
        {userName && (
          <div className="mb-4 pb-4 border-b border-gray-200">
            <p className="text-blue-800">
              {currentQuestion === 1 
                ? `Hi ${userName}! Let's understand your background better.` 
                : `${userName}, let's continue your career discovery journey...`}
            </p>
          </div>
        )}
        
        <div className="mb-6">
          <div className="flex items-center mb-4">
            {question.icon}
            <h3 className="text-lg font-semibold text-blue-900 ml-2">
              Question {currentQuestion + 1} of {questionCount}
            </h3>
          </div>
          <p className="text-blue-900 text-xl mb-6">{question.question}</p>

          {question.type === "text" && (
            <Input
              value={answers[question.question] || ""}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={question.placeholder}
              className="w-full"
            />
          )}

          {question.type === "textarea" && (
            <Textarea
              value={answers[question.question] || ""}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={question.placeholder}
              className="w-full"
            />
          )}

          {question.type === "radio" && (
            <RadioGroup
              value={answers[question.question] || ""}
              onValueChange={(value) => handleInputChange(value)}
              className="space-y-3"
            >
              {question.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option} className="text-blue-800">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleNext} 
            className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold"
          >
            {currentQuestion < Math.min(questionCount, questions.length) - 1 ? (
              "Next Question"
            ) : (
              <span className="flex items-center">
                Complete
              </span>
            )}
          </Button>
        </div>

        <div className="mt-4 flex justify-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-yellow-500 h-2.5 rounded-full"
              style={{ width: `${((currentQuestion + 1) / questionCount) * 100}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerQuiz;
