import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { BookIcon, CodeIcon, UserIcon, BrainCogIcon, LightbulbIcon, GraduationCapIcon, RocketIcon, SparklesIcon, TrendingUpIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface QuizProps {
  userId: string;
  onComplete: (answers: Record<string, string>) => void;
}

const CareerQuiz = ({ userId, onComplete }: QuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(-1); // Start at -1 for intro screen
  const [userName, setUserName] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [questionCount, setQuestionCount] = useState(12);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [introStep, setIntroStep] = useState(0);
  const [skillInterests, setSkillInterests] = useState<string[]>([]);

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

  // Enhanced base questions with better categorization - UPDATED for student segment
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
    },
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

  // Enhanced adaptive questions based on responses
  const getAdaptiveQuestions = () => {
    const adaptiveQuestions = [];
    
    // Technology interest branch
    if (answers["How excited are you about learning cutting-edge technologies?"]?.includes("Extremely excited") ||
        answers["How excited are you about learning cutting-edge technologies?"]?.includes("Very interested")) {
      adaptiveQuestions.push({
        question: "Which emerging technology area interests you most?",
        type: "radio",
        options: [
          "Artificial Intelligence & Machine Learning",
          "Blockchain & Web3 Technologies",
          "Internet of Things (IoT) & Smart Devices",
          "Cybersecurity & Ethical Hacking",
          "Augmented/Virtual Reality",
          "Quantum Computing"
        ],
        icon: <RocketIcon className="h-5 w-5 text-blue-700" />,
        category: "tech-specialization",
      });
    }

    // Creative interest branch
    if (answers["What kind of projects excite you the most?"]?.includes("Creative") ||
        answers["What type of activities energize you the most?"]?.includes("Creating")) {
      adaptiveQuestions.push({
        question: "What type of creative work appeals to you most?",
        type: "radio",
        options: [
          "Digital design and user experiences",
          "Content creation and storytelling",
          "Visual arts and graphic design",
          "Music and audio production",
          "Video and multimedia production",
          "Game design and interactive media"
        ],
        icon: <SparklesIcon className="h-5 w-5 text-blue-700" />,
        category: "creative-specialization",
      });
    }

    // Leadership interest branch
    if (answers["When working in a team, what role do you naturally take?"]?.includes("strategic leader") ||
        answers["What type of activities energize you the most?"]?.includes("Leading")) {
      adaptiveQuestions.push({
        question: "What type of leadership role interests you most?",
        type: "radio",
        options: [
          "Tech startup founder or entrepreneur",
          "Project manager coordinating teams",
          "Product manager driving innovation",
          "Team lead in engineering/development",
          "Business strategist and consultant",
          "Social impact leader"
        ],
        icon: <TrendingUpIcon className="h-5 w-5 text-blue-700" />,
        category: "leadership-style",
      });
    }

    // Analytical thinking branch
    if (answers["What type of activities energize you the most?"]?.includes("Analyzing data") ||
        answers["How do you approach solving complex problems?"]?.includes("patterns")) {
      adaptiveQuestions.push({
        question: "What type of data analysis interests you most?",
        type: "radio",
        options: [
          "Business intelligence and market analysis",
          "Scientific research and experimentation",
          "Financial modeling and risk analysis",
          "Social media and behavioral analytics",
          "Healthcare and medical data analysis",
          "Environmental and sustainability metrics"
        ],
        icon: <BrainCogIcon className="h-5 w-5 text-blue-700" />,
        category: "analytical-focus",
      });
    }

    return adaptiveQuestions;
  };

  const getAllQuestions = () => {
    const adaptive = getAdaptiveQuestions();
    return [...baseQuestions, ...adaptive];
  };

  const questions = getAllQuestions();

  const handleInputChange = (value: string) => {
    if (currentQuestion === 0) {
      setUserName(value);
    }
    
    const questionText = questions[currentQuestion].question;
    setAnswers({ ...answers, [questionText]: value });
    
    // Dynamic question count adjustment based on engagement
    if (currentQuestion === 5) {
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

      // Record education level
      if (currentQuestion === 1) {
        setEducationLevel(answers[questionText]);
      }

      // Dynamic question count adjustment based on engagement patterns
      if (currentQuestion === 7) {
        const uniqueResponses = new Set(Object.values(answers)).size;
        if (uniqueResponses >= 6) {
          setQuestionCount(Math.min(questionCount + 3, questions.length)); 
        } else {
          setQuestionCount(Math.max(questionCount - 1, 8));
        }
      }

      if (currentQuestion < Math.min(questionCount, questions.length) - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
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

  const startQuiz = () => {
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

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questionCount) * 100;
  
  return (
    <Card className="bg-white shadow-lg border border-blue-100">
      <CardContent className="pt-6">
        {/* Enhanced progress indicator */}
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
                {question.category === "tech-specialization" && "Tech Focus"}
                {question.category === "creative-specialization" && "Creative Focus"}
                {question.category === "leadership-style" && "Leadership Style"}
                {question.category === "analytical-focus" && "Analytics Focus"}
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

          {question.type === "textarea" && (
            <Textarea
              value={answers[question.question] || ""}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={question.placeholder}
              className="w-full text-lg p-4 border-2 border-blue-200 focus:border-blue-500 rounded-lg min-h-[120px]"
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
