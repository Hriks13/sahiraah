
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CareerQuiz from "@/components/CareerQuiz";
import CareerRecommendations from "@/components/CareerRecommendations";
import ExploreResources from "@/components/ExploreResources";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  name: string;
  email: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    // Check if user is logged in with Supabase
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error fetching session:", error.message);
          navigate("/login");
          return;
        }
        
        if (!data.session) {
          navigate("/login");
          return;
        }
        
        // Fetch user profile
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
        
        setUser({
          id: data.session.user.id,
          name: profileData?.name || data.session.user.user_metadata?.full_name || data.session.user.email?.split('@')[0] || 'User',
          email: data.session.user.email || ''
        });

        // Insert profile if it doesn't exist
        if (!profileData) {
          await supabase.from('user_profiles').insert({
            id: data.session.user.id,
            name: data.session.user.user_metadata?.full_name || data.session.user.email?.split('@')[0] || 'User',
            email: data.session.user.email || ''
          });
        }
      } catch (error) {
        console.error("Error in session handling:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (event === 'SIGNED_IN' && currentSession) {
          setUser({
            id: currentSession.user.id,
            name: currentSession.user.user_metadata?.full_name || currentSession.user.email?.split('@')[0] || 'User',
            email: currentSession.user.email || ''
          });
        } else if (event === 'SIGNED_OUT') {
          navigate('/login');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    toast({
      title: "Quiz Started",
      description: "Career Discovery Quiz Started! Answer the questions to get personalized career recommendations."
    });
  };

  const handleQuizComplete = (answers: Record<string, string>) => {
    setUserAnswers(answers);
    setQuizCompleted(true);
    toast({
      title: "Quiz Completed",
      description: "We're analyzing your answers to find the best career matches."
    });
  };

  const handleRetakeQuiz = () => {
    setQuizStarted(true);
    setQuizCompleted(false);
    setUserAnswers({});
    toast({
      title: "Quiz Restarted",
      description: "Let's explore again! Take the quiz again to discover more career paths."
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-blue-900 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f6ff] py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            Welcome, {user?.name || "Student"}!
          </h1>
          <p className="text-blue-700 text-lg">
            Let's discover the career path that's perfectly aligned with your interests and strengths.
          </p>
        </div>

        {/* Quiz Section */}
        {quizCompleted ? (
          <CareerRecommendations userAnswers={userAnswers} onRetake={handleRetakeQuiz} />
        ) : quizStarted ? (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">Career Discovery AI</h2>
            <CareerQuiz userId={user?.id || 'guest'} onComplete={handleQuizComplete} />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Career Journey Card */}
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-blue-900">Begin Your Career Discovery</CardTitle>
                <CardDescription>Take our comprehensive assessment to get AI-powered recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4 mb-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-900 font-bold mr-3">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-900">Take the Career Quiz</h4>
                      <p className="text-sm text-blue-700">Answer questions about your interests and strengths</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-900 font-bold mr-3">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-900">Get AI Analysis</h4>
                      <p className="text-sm text-blue-700">Our algorithm processes your responses</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-900 font-bold mr-3">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-900">Explore Recommendations</h4>
                      <p className="text-sm text-blue-700">Review personalized career paths</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold w-full"
                  onClick={handleStartQuiz}
                >
                  Take Career Quiz
                </Button>
              </CardFooter>
            </Card>

            {/* Recommendations Preview Card */}
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-blue-900">Your Career Recommendations</CardTitle>
                <CardDescription>Based on your profile and responses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-900 text-xl">🔎</span>
                  </div>
                  <h4 className="text-lg font-medium text-blue-900 mb-2">No Recommendations Yet</h4>
                  <p className="text-blue-700 mb-4">
                    Take the career quiz to get personalized career path recommendations
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white w-full"
                  onClick={handleStartQuiz}
                >
                  Start Discovery Journey
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Always show Explore Resources section */}
        <ExploreResources />
      </div>
    </div>
  );
};

export default Dashboard;
