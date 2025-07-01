
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
  text: string;
  type: 'radio' | 'text' | 'textarea';
  options?: string[];
}

interface SessionContext {
  phase: string;
  questionCount: number;
  readyForRecommendations: boolean;
}

const AICareerQuiz = ({ userId, onComplete }: AIQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState<AIQuestion | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [allAnswers, setAllAnswers] = useState<Array<{question: string, answer: string}>>([]);
  const [sessionContext, setSessionContext] = useState<SessionContext>({
    phase: "initial_discovery",
    questionCount: 0,
    readyForRecommendations: false
  });
  const [loading, setLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
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

  const startAISession = async () => {
    setLoading(true);
    try {
      console.log("Starting AI session...");
      
      const { data, error } = await supabase.functions.invoke('ai-career-guidance', {
        body: {
          action: 'start_ai_session',
          data: {},
          userId
        }
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw error;
      }

      console.log("AI Session Response:", data);

      if (data.question) {
        setCurrentQuestion(data.question);
        setSessionContext(data.sessionContext);
        setQuizStarted(true);
        
        toast({
          title: "AI Session Started!",
          description: "Our AI has crafted your first personalized question",
        });
      }
    } catch (error) {
      console.error("Error starting AI session:", error);
      toast({
        title: "Error",
        description: "Failed to start the AI session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (value: string) => {
    if (!value.trim() || !currentQuestion) return;

    setLoading(true);
    try {
      const answerRecord = { question: currentQuestion.text, answer: value };
      const updatedAnswers = [...allAnswers, answerRecord];
      setAllAnswers(updatedAnswers);

      console.log("Processing answer:", value);
      console.log("Current session context:", sessionContext);

      const { data, error } = await supabase.functions.invoke('ai-career-guidance', {
        body: {
          action: 'process_answer_and_continue',
          data: {
            currentAnswer: value,
            previousAnswers: updatedAnswers,
            sessionContext
          },
          userId
        }
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw error;
      }

      console.log("AI Response:", data);

      if (data.action === 'continue_questioning') {
        // AI wants to ask another question
        setCurrentQuestion(data.question);
        setSessionContext(data.sessionContext);
        setAiAnalysis(data.analysis);
        setCurrentAnswer("");
        
        toast({
          title: "AI Analysis Complete",
          description: data.analysis.reasoning,
        });
      } else if (data.action === 'provide_recommendations') {
        // AI has enough information and provided recommendations
        toast({
          title: "AI Analysis Complete!",
          description: "Our AI has generated your personalized career recommendations",
          duration: 5000,
        });
        
        onComplete(data);
      }
    } catch (error) {
      console.error("Error processing answer:", error);
      toast({
        title: "Error",
        description: "Failed to process your answer. Please try again.",
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
            <h2 className="text-xl text-purple-700 mb-6">Completely AI-Driven Career Guidance</h2>
            
            <p className="text-blue-800 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Experience the future of career guidance where our AI generates personalized questions, 
              analyzes your responses in real-time, and provides comprehensive career recommendations 
              tailored specifically for the Indian job market.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/70 p-4 rounded-lg border border-purple-200">
                <SparklesIcon className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="text-blue-800 font-medium">AI-Generated Questions</p>
                <p className="text-sm text-gray-600">Every question is crafted by AI based on your responses</p>
              </div>
              <div className="bg-white/70 p-4 rounded-lg border border-purple-200">
                <LightbulbIcon className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="text-blue-800 font-medium">Real-Time Analysis</p>
                <p className="text-sm text-gray-600">AI analyzes each answer to understand your profile</p>
              </div>
              <div className="bg-white/70 p-4 rounded-lg border border-purple-200">
                <RocketIcon className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="text-blue-800 font-medium">Intelligent Recommendations</p>
                <p className="text-sm text-gray-600">AI-driven career paths with detailed guidance</p>
              </div>
            </div>

            <Button 
              onClick={startAISession}
              size="lg"
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 text-lg shadow-lg"
            >
              {loading ? "Initializing AI..." : "Start AI Career Discovery"}
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
              {allAnswers.length === 0 ? "AI is generating your first question..." : 
               "AI is analyzing your response and crafting the next question..."}
            </p>
            <Progress value={allAnswers.length === 0 ? 20 : 60} className="w-full max-w-md mx-auto" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentQuestion) {
    return (
      <Card className="bg-white shadow-lg border border-purple-100">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold text-blue-900 mb-2">AI is thinking...</h3>
            <p className="text-purple-700">Our AI is processing your responses.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const progress = Math.min(((allAnswers.length + 1) / 6) * 100, 90);

  return (
    <Card className="bg-white shadow-lg border border-purple-100">
      <CardContent className="pt-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-purple-700">
              AI Question {allAnswers.length + 1}
            </span>
            <span className="text-sm text-purple-600">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-3 bg-purple-50" />
        </div>

        {aiAnalysis && (
          <div className="mb-6 pb-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-2">AI Insights</h4>
            <p className="text-purple-800 text-sm mb-2">{aiAnalysis.reasoning}</p>
            {aiAnalysis.keyInsights && aiAnalysis.keyInsights.length > 0 && (
              <div className="text-xs text-purple-700">
                <strong>Key Insights:</strong> {aiAnalysis.keyInsights.join(', ')}
              </div>
            )}
          </div>
        )}
        
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-3 rounded-full mr-3">
              <BrainCogIcon className="h-6 w-6 text-purple-700" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">AI-Generated Question</h3>
              <p className="text-sm text-purple-600">Phase: {sessionContext.phase.replace('_', ' ')}</p>
            </div>
          </div>
          
          <p className="text-blue-900 text-xl mb-6 font-medium leading-relaxed">{currentQuestion.text}</p>

          {currentQuestion.type === "text" && (
            <Input
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full text-lg p-4 border-2 border-purple-200 focus:border-purple-500 rounded-lg"
              onKeyPress={(e) => e.key === 'Enter' && currentAnswer.trim() && handleAnswer(currentAnswer)}
            />
          )}

          {currentQuestion.type === "textarea" && (
            <Textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full text-lg p-4 border-2 border-purple-200 focus:border-purple-500 rounded-lg min-h-[120px]"
            />
          )}

          {currentQuestion.type === "radio" && currentQuestion.options && (
            <RadioGroup
              value={currentAnswer}
              onValueChange={setCurrentAnswer}
              className="space-y-4"
            >
              {currentQuestion.options.map((option) => (
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
              <span>{allAnswers.length} response{allAnswers.length > 1 ? 's' : ''} analyzed by AI</span>
            )}
          </div>
          <Button 
            onClick={() => handleAnswer(currentAnswer)}
            size="lg"
            disabled={!currentAnswer.trim() || loading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3"
          >
            Continue AI Analysis <SparklesIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AICareerQuiz;
