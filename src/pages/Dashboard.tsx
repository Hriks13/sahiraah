
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BookOpenIcon, TrendingUpIcon, SparklesIcon, BrainCogIcon, RocketIcon, UserIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import CareerQuiz from "@/components/CareerQuiz";
import AICareerQuiz from "@/components/AICareerQuiz";
import CareerRecommendations from "@/components/CareerRecommendations";
import AICareerRecommendations from "@/components/AICareerRecommendations";
import ExploreResources from "@/components/ExploreResources";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showAIQuiz, setShowAIQuiz] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [aiRecommendations, setAIRecommendations] = useState<any>(null);
  const [completedCourses, setCompletedCourses] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setUser(session.user);
      
      // Check course progress
      const { data: progress } = await supabase
        .from('user_course_progress')
        .select('completed')
        .eq('user_id', session.user.id);
      
      const { data: courses } = await supabase
        .from('courses')
        .select('id');
      
      if (progress && courses) {
        setCompletedCourses(progress.filter(p => p.completed).length);
        setTotalCourses(courses.length);
      }
    };

    getUser();
  }, [navigate]);

  const handleQuizComplete = (answers: Record<string, string>) => {
    setUserAnswers(answers);
    setQuizComplete(true);
    setShowQuiz(false);
    
    toast({
      title: "Quiz Completed!",
      description: "Great job! Your personalized career recommendations are ready.",
    });
  };

  const handleAIQuizComplete = (recommendations: any) => {
    setAIRecommendations(recommendations);
    setShowAIQuiz(false);
    
    toast({
      title: "AI Analysis Complete!",
      description: "Your AI-powered career recommendations are ready for review.",
    });
  };

  const handleRetakeQuiz = () => {
    setQuizComplete(false);
    setUserAnswers({});
    setAIRecommendations(null);
    setShowQuiz(false);
    setShowAIQuiz(false);
  };

  if (showQuiz) {
    return <CareerQuiz userId={user?.id} onComplete={handleQuizComplete} />;
  }

  if (showAIQuiz) {
    return <AICareerQuiz userId={user?.id} onComplete={handleAIQuizComplete} />;
  }

  if (quizComplete && userAnswers && Object.keys(userAnswers).length > 0) {
    return <CareerRecommendations userAnswers={userAnswers} onRetake={handleRetakeQuiz} />;
  }

  if (aiRecommendations) {
    return <AICareerRecommendations 
      recommendations={aiRecommendations} 
      userId={user?.id}
      onRetake={handleRetakeQuiz} 
    />;
  }

  const progressPercentage = totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-2 flex items-center">
          <UserIcon className="h-8 w-8 mr-3 text-yellow-500" />
          Welcome to SahiRaah Dashboard
        </h1>
        <p className="text-blue-700 text-lg">Your personalized career guidance platform</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center">
              <TrendingUpIcon className="h-5 w-5 mr-2" />
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-blue-700">Courses Completed</span>
                <span className="text-blue-900 font-medium">{completedCourses}/{totalCourses}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-blue-600">{Math.round(progressPercentage)}% Complete</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-orange-900 flex items-center">
              <SparklesIcon className="h-5 w-5 mr-2" />
              Career Discovery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-800 text-sm mb-3">Take our assessment to discover your ideal career path</p>
            <Button 
              onClick={() => setShowQuiz(true)}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-blue-900"
            >
              Start Assessment
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-900 flex items-center">
              <BrainCogIcon className="h-5 w-5 mr-2" />
              AI-Powered Quiz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-800 text-sm mb-3">Experience next-gen career guidance with adaptive AI</p>
            <Button 
              onClick={() => setShowAIQuiz(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <SparklesIcon className="h-4 w-4 mr-1" />
              Start AI Quiz
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="ai-features">AI Features</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-900">Quick Start Guide</CardTitle>
                <CardDescription>Get started with your career journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                    <span className="text-blue-800">Take the Career Assessment</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                    <span className="text-blue-800">Explore Recommended Paths</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                    <span className="text-blue-800">Start Learning Journey</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-900">Recent Activity</CardTitle>
                <CardDescription>Your latest interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No recent activity</p>
                  <p className="text-sm text-gray-500">Start exploring to see your progress here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses">
          <ExploreResources />
        </TabsContent>

        <TabsContent value="resources">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-900">Career Resources</CardTitle>
                <CardDescription>Essential tools and guides for your career journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="p-4 border rounded-lg hover:bg-blue-50 transition-colors">
                    <h3 className="font-semibold text-blue-900 mb-2">Resume Builder</h3>
                    <p className="text-blue-700 text-sm">Create professional resumes tailored to your target roles</p>
                  </div>
                  <div className="p-4 border rounded-lg hover:bg-blue-50 transition-colors">
                    <h3 className="font-semibold text-blue-900 mb-2">Interview Prep</h3>
                    <p className="text-blue-700 text-sm">Practice common interview questions and scenarios</p>
                  </div>
                  <div className="p-4 border rounded-lg hover:bg-blue-50 transition-colors">
                    <h3 className="font-semibold text-blue-900 mb-2">Skill Assessments</h3>
                    <p className="text-blue-700 text-sm">Evaluate your current skill levels and identify gaps</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-features">
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-900 flex items-center">
                  <BrainCogIcon className="h-6 w-6 mr-2" />
                  AI-Powered Features
                </CardTitle>
                <CardDescription>Experience the future of career guidance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 bg-white rounded-lg border border-purple-200">
                    <div className="flex items-center mb-3">
                      <SparklesIcon className="h-5 w-5 text-purple-600 mr-2" />
                      <h3 className="font-semibold text-purple-900">Adaptive Questioning</h3>
                    </div>
                    <p className="text-purple-700 text-sm mb-3">
                      Our AI generates personalized questions based on your responses, providing deeper insights into your preferences and potential.
                    </p>
                    <Button 
                      onClick={() => setShowAIQuiz(true)}
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Try AI Quiz
                    </Button>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-purple-200">
                    <div className="flex items-center mb-3">
                      <RocketIcon className="h-5 w-5 text-blue-600 mr-2" />
                      <h3 className="font-semibold text-blue-900">Smart Recommendations</h3>
                    </div>
                    <p className="text-blue-700 text-sm mb-3">
                      Get AI-generated career paths with detailed analysis, learning roadmaps, and actionable next steps.
                    </p>
                    <Button 
                      onClick={() => setShowAIQuiz(true)}
                      size="sm" 
                      variant="outline"
                      className="border-blue-600 text-blue-700"
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-900">AI vs Standard Assessment</CardTitle>
                <CardDescription>Choose the right assessment for your needs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                      <BookOpenIcon className="h-5 w-5 mr-2" />
                      Standard Assessment  
                    </h3>
                    <ul className="text-sm text-blue-700 space-y-1 mb-3">
                      <li>• Fixed set of questions</li>
                      <li>• Quick completion</li>
                      <li>• Basic recommendations</li>
                      <li>• Good for initial exploration</li>
                    </ul>
                    <Button 
                      onClick={() => setShowQuiz(true)}
                      size="sm"
                      variant="outline"
                      className="border-blue-600 text-blue-700"
                    >
                      Start Standard Quiz
                    </Button>
                  </div>

                  <div className="p-4 border-2 border-purple-300 rounded-lg bg-purple-50">
                    <h3 className="font-semibold text-purple-900 mb-2 flex items-center">
                      <BrainCogIcon className="h-5 w-5 mr-2" />
                      AI-Powered Assessment
                    </h3>
                    <ul className="text-sm text-purple-700 space-y-1 mb-3">
                      <li>• Adaptive questioning</li>
                      <li>• Personalized analysis</li>
                      <li>• Detailed AI reports</li>
                      <li>• Advanced insights</li>
                    </ul>
                    <Button 
                      onClick={() => setShowAIQuiz(true)}
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <SparklesIcon className="h-4 w-4 mr-1" />
                      Start AI Quiz
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
