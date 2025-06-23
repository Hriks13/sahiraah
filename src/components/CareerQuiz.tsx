
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { BookIcon, CodeIcon, UserIcon, BrainCogIcon, LightbulbIcon, GraduationCapIcon, RocketIcon, SparklesIcon, TrendingUpIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface QuizQuestion {
  question: string;
  type: "text" | "radio";
  options?: string[];
  placeholder?: string;
  icon: React.ReactNode;
  category: string;
}

interface QuizProps {
  userId: string;
  onComplete: (sessionId: string) => void;
}

const CareerQuiz = ({ userId, onComplete }: QuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const [userName, setUserName] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [questionCount, setQuestionCount] = useState(25);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [introStep, setIntroStep] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

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

  // Base foundation questions
  const baseQuestions: QuizQuestion[] = [
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
      options: ["10th Standard", "PU/11th-12th", "Diploma", "Graduate", "Post Graduate"],
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
      question: "What type of activities energize you the most?",
      type: "radio",
      options: [
        "Solving complex problems and puzzles",
        "Creating and designing new things", 
        "Helping and teaching others",
        "Leading teams and projects",
        "Analyzing data and finding patterns"
      ],
      icon: <BrainCogIcon className="h-5 w-5 text-blue-700" />,
      category: "personality",
    },
    {
      question: "How do you approach solving complex problems?",
      type: "radio",
      options: [
        "Break down into smaller, manageable parts",
        "Look for patterns and connections",
        "Think creatively and outside the box",
        "Research and gather information first",
        "Collaborate with others for ideas"
      ],
      icon: <LightbulbIcon className="h-5 w-5 text-blue-700" />,
      category: "analytical",
    }
  ];

  // Generate AI-powered questions based on user responses
  const generateAdaptiveQuestions = async (userAnswers: Record<string, string>) => {
    setLoadingQuestions(true);
    try {
      const response = await fetch('/functions/v1/generate-adaptive-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          answers: userAnswers,
          educationLevel,
          userName
        })
      });

      if (!response.ok) throw new Error('Failed to generate questions');
      
      const result = await response.json();
      return result.questions || [];
    } catch (error) {
      console.error('Error generating adaptive questions:', error);
      toast({
        title: "Using default questions",
        description: "Unable to generate personalized questions. Using standard assessment.",
      });
      return getDefaultAdaptiveQuestions();
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Fallback adaptive questions
  const getDefaultAdaptiveQuestions = (): QuizQuestion[] => {
    const defaultQuestions: QuizQuestion[] = [
      {
        question: "What activities or hobbies do you enjoy in your free time?",
        type: "text",
        placeholder: "E.g., Coding, Reading, Sports, Art, Music...",
        icon: <UserIcon className="h-5 w-5 text-blue-700" />,
        category: "interests",
      },
      {
        question: "In which environment do you learn and work best?",
        type: "radio",
        options: [
          "Quiet, focused individual work",
          "Collaborative team environment", 
          "Dynamic, fast-paced setting",
          "Structured, organized environment",
          "Flexible, creative workspace"
        ],
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
          "Social impact and community projects",
          "Business and entrepreneurial projects"
        ],
        icon: <CodeIcon className="h-5 w-5 text-blue-700" />,
        category: "interests",
      },
      {
        question: "When working in a team, what role do you naturally take?",
        type: "radio",
        options: [
          "The strategic leader who guides direction",
          "The creative innovator with new ideas", 
          "The detail-oriented organizer",
          "The supportive collaborator",
          "The technical problem-solver"
        ],
        icon: <UserIcon className="h-5 w-5 text-blue-700" />,
        category: "skills",
      },
      {
        question: "How excited are you about learning cutting-edge technologies?",
        type: "radio",
        options: [
          "Extremely excited - I love being on the cutting edge",
          "Very interested - I adapt quickly to new tech",
          "Moderately interested - I'll learn what's needed",
          "Somewhat hesitant - I prefer proven technologies",
          "Not very interested - I focus on other skills"
        ],
        icon: <CodeIcon className="h-5 w-5 text-blue-700" />,
        category: "mindset",
      }
    ];

    // Add more questions to reach 25 total
    for (let i = 6; i < 25; i++) {
      defaultQuestions.push({
        question: `Additional assessment question ${i - 4}: What motivates you most in your learning journey?`,
        type: "radio",
        options: [
          "Achieving mastery and expertise",
          "Making a positive impact on others",
          "Financial success and stability",
          "Creative expression and innovation",
          "Recognition and acknowledgment"
        ],
        icon: <TrendingUpIcon className="h-5 w-5 text-blue-700" />,
        category: "motivation",
      });
    }

    return defaultQuestions;
  };

  // Initialize questions when quiz starts
  useEffect(() => {
    if (quizStarted && questions.length === 0) {
      const initQuestions = async () => {
        const adaptive = await generateAdaptiveQuestions(answers);
        const allQuestions = [...baseQuestions, ...adaptive];
        setQuestions(allQuestions.slice(0, 25)); // Ensure exactly 25 questions
        setQuestionCount(Math.min(25, allQuestions.length));
      };
      initQuestions();
    }
  }, [quizStarted, answers]);

  const createQuizSession = async () => {
    try {
      const { data, error } = await supabase
        .from('user_quiz_sessions')
        .insert({
          user_id: userId,
          total_questions: questionCount,
        })
        .select()
        .single();

      if (error) throw error;
      setSessionId(data.id);
      return data.id;
    } catch (error) {
      console.error('Error creating quiz session:', error);
      toast({
        title: "Error",
        description: "Could not start quiz session. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleInputChange = (value: string) => {
    if (currentQuestion === 0) {
      setUserName(value);
    }
    
    const questionText = questions[currentQuestion]?.question || "";
    setAnswers({ ...answers, [questionText]: value });
  };

  const handleNext = async () => {
    const questionText = questions[currentQuestion]?.question || "";
    
    if (!answers[questionText]) {
      toast({
        title: "Please answer the question",
        description: "We need your input to provide accurate career recommendations.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create session on first question if not already created
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        currentSessionId = await createQuizSession();
      }

      // Store individual answer
      const { error } = await supabase
        .from('user_quiz_answers')
        .insert({
          session_id: currentSessionId,
          user_id: userId,
          question_number: currentQuestion + 1,
          question_category: questions[currentQuestion]?.category || "general",
          question_text: questionText,
          answer_text: answers[questionText]
        });
      
      if (error) throw error;

      // Record education level
      if (currentQuestion === 1) {
        setEducationLevel(answers[questionText]);
      }

      if (currentQuestion < Math.min(questionCount, questions.length) - 1) {
        setCurrentQuestion(currentQuestion + 1);
        
        // Generate more questions dynamically if needed
        if (currentQuestion === 4 && questions.length < 25) {
          const additionalQuestions = await generateAdaptiveQuestions(answers);
          const updatedQuestions = [...questions, ...additionalQuestions];
          setQuestions(updatedQuestions.slice(0, 25));
          setQuestionCount(Math.min(25, updatedQuestions.length));
        }
      } else {
        // Quiz completed - trigger AI analysis
        await completeQuiz(currentSessionId);
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

  const completeQuiz = async (sessionId: string) => {
    setProcessing(true);
    
    try {
      const response = await fetch('/functions/v1/analyze-career-guidance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          sessionId,
          userId,
          answers,
          studentName: userName,
          educationLevel
        })
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Analysis Complete!",
          description: "Your personalized career recommendations are ready."
        });
        onComplete(sessionId);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error completing quiz:', error);
      toast({
        title: "Analysis Error",
        description: "There was an issue analyzing your responses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const startQuiz = async () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
  };

  const nextIntroStep = () => {
    if (introStep < 2) {
      setIntroStep(introStep + 1);
    } else {
      startQuiz();
    }
  };

  // Enhanced introduction flow
  if (!quizStarted) {
    const introContent = [
      {
        title: "Welcome to SahiRaah",
        subtitle: "AI-Powered Career Discovery Platform",
        content: "Discover your perfect career path with our intelligent assessment system designed specifically for Indian students.",
        icon: <RocketIcon className="h-16 w-16 text-yellow-500" />,
        highlights: ["Personalized AI Analysis", "Future-Ready Careers", "Industry-Specific Roadmaps"]
      },
      {
        title: "How Our Assessment Works",
        subtitle: "Smart, Adaptive & Personalized",
        content: "Our AI adapts questions based on your responses, ensuring we understand your unique strengths and interests.",
        icon: <BrainCogIcon className="h-16 w-16 text-blue-500" />,
        highlights: ["Dynamic Question Flow", "Real-time Analysis", "Behavioral Insights"]
      },
      {
        title: "What You'll Receive",
        subtitle: "Comprehensive Career Guidance",
        content: "Get detailed career recommendations, visual progress tracking, and step-by-step learning roadmaps.",
        icon: <SparklesIcon className="h-16 w-16 text-green-500" />,
        highlights: ["Career Matches", "Skill Roadmaps", "Learning Resources"]
      }
    ];

    const currentIntro = introContent[introStep];

    return (
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 shadow-xl border-0">
        <CardContent className="pt-8 pb-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              {currentIntro.icon}
            </div>
            
            <h1 className="text-3xl font-bold text-blue-900 mb-2">{currentIntro.title}</h1>
            <h2 className="text-xl text-blue-700 mb-6">{currentIntro.subtitle}</h2>
            
            <p className="text-blue-800 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              {currentIntro.content}
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {currentIntro.highlights.map((highlight, idx) => (
                <div key={idx} className="bg-white/70 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  </div>
                  <p className="text-blue-800 font-medium">{highlight}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center space-x-2 mb-6">
              {introContent.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full ${
                    idx === introStep ? 'bg-yellow-500' : 'bg-blue-300'
                  }`}
                />
              ))}
            </div>

            <Button 
              onClick={nextIntroStep}
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-blue-900 font-semibold px-8 py-3 text-lg shadow-lg"
            >
              {introStep < 2 ? "Continue" : "Start Your Journey"} 
              <RocketIcon className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (processing) {
    return (
      <Card className="bg-white shadow-lg border border-blue-100">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-blue-900 mb-2">Analyzing Your Responses</h3>
            <p className="text-blue-700">Our AI is creating your personalized career recommendations...</p>
            <div className="mt-6">
              <Progress value={100} className="h-2 bg-blue-50" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loadingQuestions || questions.length === 0) {
    return (
      <Card className="bg-white shadow-lg border border-blue-100">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-blue-900 mb-2">Preparing Your Assessment</h3>
            <p className="text-blue-700">Our AI is creating personalized questions just for you...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questionCount) * 100;
  
  return (
    <Card className="bg-white shadow-lg border border-blue-100">
      <CardContent className="pt-6">
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-blue-700">
              Question {currentQuestion + 1} of {questionCount}
            </span>
            <span className="text-sm text-blue-600">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-3 bg-blue-50" />
        </div>

        {userName && (
          <div className="mb-6 pb-4 border-b border-gray-200 bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800 font-medium">
              {currentQuestion <= 2
                ? `Hi ${userName}! Let's understand your background and interests.` 
                : `Great progress, ${userName}! Let's explore your career potential...`}
            </p>
          </div>
        )}
        
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              {question.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">
                {question.category === "personal" && "About You"}
                {question.category === "interests" && "Your Interests"}
                {question.category === "skills" && "Your Skills"}
                {question.category === "analytical" && "Problem Solving"}
                {question.category === "learning" && "Learning Style"}
                {question.category === "mindset" && "Your Mindset"}
                {question.category === "personality" && "Personality"}
                {question.category === "motivation" && "Your Motivation"}
                {question.category === "general" && "Assessment"}
              </h3>
            </div>
          </div>
          
          <p className="text-blue-900 text-xl mb-6 font-medium">{question.question}</p>

          {question.type === "text" && (
            <Input
              value={answers[question.question] || ""}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={question.placeholder}
              className="w-full text-lg p-4 border-2 border-blue-200 focus:border-blue-500 rounded-lg"
            />
          )}

          {question.type === "radio" && (
            <RadioGroup
              value={answers[question.question] || ""}
              onValueChange={(value) => handleInputChange(value)}
              className="space-y-4"
            >
              {question.options?.map((option) => (
                <div key={option} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition-all">
                  <RadioGroupItem value={option} id={option} className="text-blue-600" />
                  <Label htmlFor={option} className="text-blue-800 font-medium cursor-pointer flex-1">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleNext} 
            size="lg"
            disabled={processing || loadingQuestions}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-blue-900 font-semibold px-8 py-3"
          >
            {currentQuestion < Math.min(questionCount, questions.length) - 1 ? (
              <>Next Question <RocketIcon className="ml-2 h-4 w-4" /></>
            ) : (
              <>Get My Results <SparklesIcon className="ml-2 h-4 w-4" /></>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerQuiz;
