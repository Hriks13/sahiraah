
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { BrainCogIcon, SparklesIcon, RocketIcon, LightbulbIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface AIQuizProps {
  userId: string;
  onComplete: (recommendations: any) => void;
}

interface AIQuestion {
  id: string;
  question: string;
  type: 'radio' | 'text' | 'textarea';
  options?: string[];
}

const AICareerQuiz = ({ userId, onComplete }: AIQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const [questions, setQuestions] = useState<AIQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [studentName, setStudentName] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast({
          title: "Authentication required",
          description: "Please log in to take the AI-powered career assessment",
          variant: "destructive",
        });
        navigate("/login");
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

  const startAIQuiz = async () => {
    setLoading(true);
    try {
      // Start with basic questions
      const initialQuestions: AIQuestion[] = [
        {
          id: "name",
          question: "What's your name?",
          type: "text"
        },
        {
          id: "education",
          question: "What is your current education level?",
          type: "radio",
          options: ["10th Standard", "PU/11th-12th", "Diploma", "Graduate", "Post-Graduate"]
        }
      ];

      setQuestions(initialQuestions);
      setQuizStarted(true);
      setCurrentQuestion(0);
    } catch (error) {
      console.error("Error starting AI quiz:", error);
      toast({
        title: "Error",
        description: "Failed to start the AI quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateNextQuestions = async () => {
    setLoading(true);
    try {
      const previousAnswers = Object.entries(answers).map(([question, answer]) => ({
        question,
        answer
      }));

      const { data, error } = await supabase.functions.invoke('ai-career-guidance', {
        body: {
          action: 'generate_adaptive_questions',
          data: {
            previousAnswers,
            educationLevel,
            currentQuestionIndex: currentQuestion
          },
          userId
        }
      });

      if (error) throw error;

      if (data.questions && data.questions.length > 0) {
        setQuestions(prev => [...prev, ...data.questions]);
        setTotalQuestions(prev => prev + data.questions.length);
        console.log("AI Generated Questions:", data.reasoning);
      }
    } catch (error) {
      console.error("Error generating adaptive questions:", error);
      toast({
        title: "AI Enhancement",
        description: "Continuing with standard questions...",
      });
      
      // Fallback to standard questions
      const fallbackQuestions: AIQuestion[] = [
        {
          id: "interests",
          question: "Which subjects do you enjoy the most?",
          type: "text"
        },
        {
          id: "activities",
          question: "What type of activities energize you?",
          type: "radio",
          options: ["Problem-solving", "Creative work", "Helping others", "Leading teams", "Analyzing data"]
        }
      ];
      
      setQuestions(prev => [...prev, ...fallbackQuestions]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (value: string) => {
    const question = questions[currentQuestion];
    const newAnswers = { ...answers, [question.question]: value };
    setAnswers(newAnswers);

    // Store answer in database
    try {
      await supabase
        .from('user_quiz_responses')
        .insert({
          user_id: userId,
          question: question.question,
          answer: value
        });

      // Set name and education level from first two questions
      if (question.id === "name") {
        setStudentName(value);
      } else if (question.id === "education") {
        setEducationLevel(value);
      }

      // Generate more questions after getting basic info
      if (currentQuestion === 1 && questions.length < 5) {
        await generateNextQuestions();
      }

      // Move to next question or complete quiz
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else if (currentQuestion >= 4) { // Minimum 5 questions before analysis
        await analyzeAndComplete(newAnswers);
      } else {
        await generateNextQuestions();
        setCurrentQuestion(currentQuestion + 1);
      }
    } catch (error) {
      console.error("Error storing answer:", error);
      toast({
        title: "Error",
        description: "Failed to save your answer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const analyzeAndComplete = async (allAnswers: Record<string, string>) => {
    setLoading(true);
    try {
      toast({
        title: "AI Analysis in Progress",
        description: "Our AI is analyzing your responses to generate personalized recommendations...",
      });

      const { data, error } = await supabase.functions.invoke('ai-career-guidance', {
        body: {
          action: 'analyze_responses',
          data: {
            responses: allAnswers,
            educationLevel,
            studentName
          },
          userId
        }
      });

      if (error) throw error;

      onComplete(data);
    } catch (error) {
      console.error("Error analyzing responses:", error);
      toast({
        title: "Analysis Error",
        description: "Failed to analyze responses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!quizStarted) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 to-blue-100 shadow-xl border-0">
        <CardContent className="pt-8 pb-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <BrainCogIcon className="h-16 w-16 text-purple-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-blue-900 mb-2">AI-Powered Career Discovery</h1>
            <h2 className="text-xl text-purple-700 mb-6">Personalized Intelligence for Your Future</h2>
            
            <p className="text-blue-800 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Experience next-generation career guidance with our AI that adapts questions based on your responses, 
              providing truly personalized recommendations tailored to the Indian job market.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/70 p-4 rounded-lg border border-purple-200">
                <SparklesIcon className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="text-blue-800 font-medium">Adaptive AI Questions</p>
                <p className="text-sm text-gray-600">Questions evolve based on your answers</p>
              </div>
              <div className="bg-white/70 p-4 rounded-lg border border-purple-200">
                <LightbulbIcon className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="text-blue-800 font-medium">Smart Analysis</p>
                <p className="text-sm text-gray-600">AI-powered career matching</p>
              </div>
              <div className="bg-white/70 p-4 rounded-lg border border-purple-200">
                <RocketIcon className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="text-blue-800 font-medium">Actionable Insights</p>
                <p className="text-sm text-gray-600">Detailed reports and roadmaps</p>
              </div>
            </div>

            <Button 
              onClick={startAIQuiz}
              size="lg"
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 text-lg shadow-lg"
            >
              {loading ? "Starting AI Quiz..." : "Begin AI-Powered Assessment"}
              <SparklesIcon className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="bg-white shadow-lg border border-purple-100">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-blue-900 mb-2">AI Processing...</h3>
            <p className="text-purple-700 mb-4">Our AI is personalizing your experience</p>
            <Progress value={75} className="w-full max-w-md mx-auto" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / Math.max(totalQuestions, questions.length)) * 100;

  return (
    <Card className="bg-white shadow-lg border border-purple-100">
      <CardContent className="pt-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-purple-700">
              Question {currentQuestion + 1} of {Math.max(totalQuestions, questions.length)}
            </span>
            <span className="text-sm text-purple-600">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-3 bg-purple-50" />
        </div>

        {studentName && (
          <div className="mb-6 pb-4 border-b border-gray-200 bg-purple-50 p-4 rounded-lg">
            <p className="text-purple-800 font-medium">
              Hi {studentName}! Our AI is adapting questions based on your unique profile.
            </p>
          </div>
        )}
        
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-2 rounded-full mr-3">
              <BrainCogIcon className="h-5 w-5 text-purple-700" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">AI-Generated Question</h3>
            </div>
          </div>
          
          <p className="text-blue-900 text-xl mb-6 font-medium">{question?.question}</p>

          {question?.type === "text" && (
            <Input
              value={answers[question.question] || ""}
              onChange={(e) => setAnswers(prev => ({ ...prev, [question.question]: e.target.value }))}
              placeholder="Type your answer here..."
              className="w-full text-lg p-4 border-2 border-purple-200 focus:border-purple-500 rounded-lg"
            />
          )}

          {question?.type === "textarea" && (
            <Textarea
              value={answers[question.question] || ""}
              onChange={(e) => setAnswers(prev => ({ ...prev, [question.question]: e.target.value }))}
              placeholder="Share your thoughts..."
              className="w-full text-lg p-4 border-2 border-purple-200 focus:border-purple-500 rounded-lg min-h-[120px]"
            />
          )}

          {question?.type === "radio" && question.options && (
            <RadioGroup
              value={answers[question.question] || ""}
              onValueChange={(value) => setAnswers(prev => ({ ...prev, [question.question]: value }))}
              className="space-y-4"
            >
              {question.options.map((option) => (
                <div key={option} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-50 border border-gray-200 hover:border-purple-300 transition-all">
                  <RadioGroupItem value={option} id={option} className="text-purple-600" />
                  <Label htmlFor={option} className="text-blue-800 font-medium cursor-pointer flex-1">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={() => handleAnswer(answers[question?.question] || "")}
            size="lg"
            disabled={!answers[question?.question] || loading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3"
          >
            {currentQuestion >= questions.length - 1 && currentQuestion >= 4 ? (
              <>Generate AI Recommendations <SparklesIcon className="ml-2 h-4 w-4" /></>
            ) : (
              <>Continue <RocketIcon className="ml-2 h-4 w-4" /></>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AICareerQuiz;
