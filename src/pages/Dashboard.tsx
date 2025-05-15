import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CareerQuiz from "@/components/CareerQuiz";
import CareerRecommendations from "@/components/CareerRecommendations";
import { toast } from "@/components/ui/use-toast";

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
    // Check if user is logged in
    const userStr = localStorage.getItem("sahiraah_user");
    if (!userStr) {
      navigate("/login");
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    toast("Career Discovery Quiz Started! Answer the questions to get personalized career recommendations.");
  };

  const handleQuizComplete = (answers: Record<string, string>) => {
    setUserAnswers(answers);
    setQuizCompleted(true);
    toast("Quiz Completed! We're analyzing your answers to find the best career matches.");
  };

  const handleRetakeQuiz = () => {
    setQuizStarted(true);
    setQuizCompleted(false);
    setUserAnswers({});
    toast("Let's Explore Again! Take the quiz again to discover more career paths.");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-blue-900 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 py-8">
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
            <h2 className="text-2xl font-bold text-blue-900 mb-6">Career Discovery Quiz</h2>
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

        {/* Additional Resources Section - Only show when not in quiz */}
        {!quizStarted && !quizCompleted && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">Explore Resources</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-white shadow-md">
                <CardHeader>
                  <CardTitle className="text-blue-900">Career Guides</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-700">Explore in-depth information about various career paths and industries.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white w-full">
                    Browse Guides
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-white shadow-md">
                <CardHeader>
                  <CardTitle className="text-blue-900">Skill Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-700">Find courses and resources to build skills for your desired career path.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white w-full">
                    Discover Courses
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-white shadow-md">
                <CardHeader>
                  <CardTitle className="text-blue-900">Expert Connect</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-700">Connect with mentors and professionals in your field of interest.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white w-full">
                    Coming Soon
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
