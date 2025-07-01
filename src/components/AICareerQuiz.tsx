
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
  const [allAnswers, setAllAnswers] = useState<Array<{question: string, answer: string}>>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [studentName, setStudentName] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
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
      // Start with name question
      const nameQuestion: AIQuestion = {
        id: "name",
        question: "What's your name? (This helps me personalize your experience)",
        type: "text"
      };

      setQuestions([nameQuestion]);
      setQuizStarted(true);
      setCurrentQuestion(0);
      setQuestionCount(1);
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

  const generateNextQuestion = async () => {
    setLoading(true);
    try {
      console.log("Generating next question with answers:", allAnswers);
      
      const { data, error } = await supabase.functions.invoke('ai-career-guidance', {
        body: {
          action: 'generate_adaptive_questions',
          data: {
            previousAnswers: allAnswers,
            educationLevel,
            currentQuestionIndex: questionCount
          },
          userId
        }
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw error;
      }

      console.log("AI Response:", data);

      if (data.questions && data.questions.length > 0) {
        setQuestions(prev => [...prev, ...data.questions]);
        setQuestionCount(prev => prev + data.questions.length);
        setIsComplete(data.isComplete || false);
        
        toast({
          title: "AI Generated Question",
          description: data.reasoning || "AI has crafted the next question based on your responses",
        });
      } else {
        // No more questions, proceed to analysis
        setIsComplete(true);
      }
    } catch (error) {
      console.error("Error generating next question:", error);
      toast({
        title: "AI Enhancement",
        description: "Continuing with analysis...",
      });
      setIsComplete(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (value: string) => {
    if (!value.trim()) return;

    const question = questions[currentQuestion];
    const answerRecord = { question: question.question, answer: value };
    
    // Store answer in local state
    setAllAnswers(prev => [...prev, answerRecord]);
    
    // Store answer in database
    try {
      await supabase
        .from('user_quiz_responses')
        .insert({
          user_id: userId,
          question: question.question,
          answer: value
        });

      // Handle special first questions
      if (question.id === "name") {
        setStudentName(value);
      } else if (question.question.toLowerCase().includes("education level")) {
        setEducationLevel(value);
      }

      // Check if this was the last question or if we should generate more
      if (isComplete || allAnswers.length >= 4) {
        // We have enough answers, proceed to analysis
        await analyzeAndComplete([...allAnswers, answerRecord]);
      } else if (currentQuestion < questions.length - 1) {
        // Move to next existing question
        setCurrentQuestion(currentQuestion + 1);
        setCurrentAnswer("");
      } else {
        // Generate next question
        await generateNextQuestion();
        setCurrentQuestion(currentQuestion + 1);
        setCurrentAnswer("");
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

  const analyzeAndComplete = async (finalAnswers: Array<{question: string, answer: string}>) => {
    setLoading(true);
    try {
      toast({
        title: "AI Analysis in Progress",
        description: "Our AI is analyzing your responses to generate personalized recommendations...",
      });

      // Convert answers to the format expected by the backend
      const responsesObject = finalAnswers.reduce((acc, item) => {
        acc[item.question] = item.answer;
        return acc;
      }, {} as Record<string, string>);

      const { data, error } = await supabase.functions.invoke('ai-career-guidance', {
        body: {
          action: 'analyze_responses',
          data: {
            responses: responsesObject,
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
            <h2 className="text-xl text-purple-700 mb-6">Intelligent Questions, Personalized Guidance</h2>
            
            <p className="text-blue-800 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Experience truly adaptive career guidance where our AI asks personalized questions based on your unique responses, 
              leading to highly customized career recommendations for the Indian job market.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/70 p-4 rounded-lg border border-purple-200">
                <SparklesIcon className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="text-blue-800 font-medium">Dynamic AI Questions</p>
                <p className="text-sm text-gray-600">Each question builds on your previous answers</p>
              </div>
              <div className="bg-white/70 p-4 rounded-lg border border-purple-200">
                <LightbulbIcon className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="text-blue-800 font-medium">Intelligent Analysis</p>
                <p className="text-sm text-gray-600">AI understands your unique profile</p>
              </div>
              <div className="bg-white/70 p-4 rounded-lg border border-purple-200">
                <RocketIcon className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="text-blue-800 font-medium">Personalized Results</p>
                <p className="text-sm text-gray-600">Tailored career paths just for you</p>
              </div>
            </div>

            <Button 
              onClick={startAIQuiz}
              size="lg"
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 text-lg shadow-lg"
            >
              {loading ? "Starting AI Discovery..." : "Begin AI Career Discovery"}
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
            <p className="text-purple-700 mb-4">
              {allAnswers.length === 0 ? "Preparing your first question..." : 
               isComplete ? "Analyzing your responses..." : 
               "Crafting your next question..."}
            </p>
            <Progress value={allAnswers.length === 0 ? 10 : isComplete ? 90 : 50} className="w-full max-w-md mx-auto" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const question = questions[currentQuestion];
  if (!question) {
    return (
      <Card className="bg-white shadow-lg border border-purple-100">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold text-blue-900 mb-2">Preparing Your Question...</h3>
            <p className="text-purple-700">Our AI is crafting the perfect question for you.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const progress = Math.min(((allAnswers.length + 1) / Math.max(questionCount + 2, 6)) * 100, 90);

  return (
    <Card className="bg-white shadow-lg border border-purple-100">
      <CardContent className="pt-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-purple-700">
              Question {allAnswers.length + 1} of {Math.max(questionCount + 1, 6)}
            </span>
            <span className="text-sm text-purple-600">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-3 bg-purple-50" />
        </div>

        {studentName && (
          <div className="mb-6 pb-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
            <p className="text-purple-800 font-medium">
              Hi {studentName}! 👋 I'm analyzing your responses to ask the most relevant questions for your career journey.
            </p>
          </div>
        )}
        
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-3 rounded-full mr-3">
              <BrainCogIcon className="h-6 w-6 text-purple-700" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">AI Question</h3>
              <p className="text-sm text-purple-600">Tailored based on your unique profile</p>
            </div>
          </div>
          
          <p className="text-blue-900 text-xl mb-6 font-medium leading-relaxed">{question?.question}</p>

          {question?.type === "text" && (
            <Input
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full text-lg p-4 border-2 border-purple-200 focus:border-purple-500 rounded-lg"
              onKeyPress={(e) => e.key === 'Enter' && currentAnswer.trim() && handleAnswer(currentAnswer)}
            />
          )}

          {question?.type === "textarea" && (
            <Textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full text-lg p-4 border-2 border-purple-200 focus:border-purple-500 rounded-lg min-h-[120px]"
            />
          )}

          {question?.type === "radio" && question.options && (
            <RadioGroup
              value={currentAnswer}
              onValueChange={setCurrentAnswer}
              className="space-y-4"
            >
              {question.options.map((option) => (
                <div key={option} className="flex items-center space-x-3 p-4 rounded-lg hover:bg-purple-50 border border-gray-200 hover:border-purple-300 transition-all cursor-pointer">
                  <RadioGroupItem value={option} id={option} className="text-purple-600" />
                  <Label htmlFor={option} className="text-blue-800 font-medium cursor-pointer flex-1 leading-relaxed">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {allAnswers.length > 0 && (
              <span>{allAnswers.length} response{allAnswers.length > 1 ? 's' : ''} recorded</span>
            )}
          </div>
          <Button 
            onClick={() => handleAnswer(currentAnswer)}
            size="lg"
            disabled={!currentAnswer.trim() || loading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3"
          >
            {isComplete || allAnswers.length >= 4 ? (
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
