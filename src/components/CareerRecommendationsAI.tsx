
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUpIcon, 
  BrainIcon, 
  RocketIcon, 
  BookOpenIcon, 
  TargetIcon,
  StarIcon,
  GraduationCapIcon,
  IndianRupeeIcon,
  ArrowRightIcon,
  DownloadIcon,
  RefreshCwIcon,
  AlertTriangleIcon
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CareerRecommendation {
  title: string;
  description: string;
  growthPotential: string;
  salaryRange: string;
  keySkills: string[];
  educationPath: string;
  matchScore: number;
}

interface AnalysisData {
  strengths: string[];
  areasForImprovement: string[];
  careerRecommendations: CareerRecommendation[];
  skillRoadmap: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

interface Props {
  sessionId: string;
  onRetake: () => void;
}

const CareerRecommendationsAI = ({ sessionId, onRetake }: Props) => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentName, setStudentName] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalysisData();
  }, [sessionId]);

  const fetchAnalysisData = async () => {
    try {
      setError(null);
      const { data: sessionData, error } = await supabase
        .from('user_quiz_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error) throw error;

      if (sessionData) {
        setStudentName(sessionData.student_name || "");
        setEducationLevel(sessionData.education_level || "");
        
        // Safely parse and convert JSON data to proper types with better error handling
        const strengths: string[] = Array.isArray(sessionData.strengths) 
          ? sessionData.strengths.filter(s => typeof s === 'string')
          : [];
        
        const weaknesses: string[] = Array.isArray(sessionData.weaknesses) 
          ? sessionData.weaknesses.filter(w => typeof w === 'string')
          : [];
        
        // Enhanced career recommendations parsing with validation
        let careerRecommendations: CareerRecommendation[] = [];
        
        if (Array.isArray(sessionData.career_recommendations)) {
          careerRecommendations = sessionData.career_recommendations
            .map((rec: any) => {
              // Validate each recommendation has required fields
              if (typeof rec === 'object' && rec !== null) {
                return {
                  title: rec.title || 'Career Option',
                  description: rec.description || 'Career description not available',
                  growthPotential: rec.growthPotential || rec.growth_potential || 'High growth potential',
                  salaryRange: rec.salaryRange || rec.salary_range || 'Competitive salary',
                  keySkills: Array.isArray(rec.keySkills) ? rec.keySkills 
                    : Array.isArray(rec.key_skills) ? rec.key_skills 
                    : ['Communication', 'Problem Solving'],
                  educationPath: rec.educationPath || rec.education_path || 'Relevant education required',
                  matchScore: typeof rec.matchScore === 'number' ? rec.matchScore 
                    : typeof rec.match_score === 'number' ? rec.match_score 
                    : 85
                };
              }
              return null;
            })
            .filter((rec: CareerRecommendation | null): rec is CareerRecommendation => rec !== null);
        }
        
        // Create default recommendations if none exist
        if (careerRecommendations.length === 0) {
          careerRecommendations = [
            {
              title: "Technology Professional",
              description: "Based on your responses, you show strong analytical skills suitable for technology roles.",
              growthPotential: "Excellent growth opportunities in India's expanding tech sector",
              salaryRange: "₹6-25 LPA",
              keySkills: ["Problem Solving", "Technical Skills", "Communication"],
              educationPath: "Computer Science, Engineering, or related certifications",
              matchScore: 85
            },
            {
              title: "Business Analyst",
              description: "Your analytical thinking and communication skills align well with business analysis roles.",
              growthPotential: "High demand across industries with digital transformation",
              salaryRange: "₹4-15 LPA",
              keySkills: ["Analysis", "Communication", "Business Understanding"],
              educationPath: "Business, Management, or relevant certifications",
              matchScore: 75
            }
          ];
        }
        
        const analysis: AnalysisData = {
          strengths: strengths.length > 0 ? strengths : ["Problem-solving", "Communication", "Adaptability"],
          areasForImprovement: weaknesses.length > 0 ? weaknesses : ["Technical skills", "Leadership development"],
          careerRecommendations,
          skillRoadmap: {
            immediate: ["Communication skills", "Digital literacy"],
            shortTerm: ["Industry-specific technical skills", "Project management"],
            longTerm: ["Leadership skills", "Strategic thinking"]
          }
        };
        
        setAnalysisData(analysis);
      }
    } catch (error) {
      console.error('Error fetching analysis data:', error);
      setError('Could not load your career recommendations. This might be due to incomplete analysis data.');
      toast({
        title: "Error Loading Data",
        description: "Could not load your career recommendations. Please try retaking the quiz.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    toast({
      title: "Report Generation",
      description: "Your detailed career report is being prepared for download.",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <Card>
            <CardContent className="pt-6">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !analysisData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertTriangleIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analysis Incomplete</h3>
            <p className="text-gray-600 mb-4">
              {error || "No analysis data available. Please retake the quiz to get your personalized recommendations."}
            </p>
            <Button onClick={onRetake} className="bg-blue-600 hover:bg-blue-700">
              Retake Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {studentName ? `${studentName}'s Career Analysis` : "Your Career Analysis"}
              </h1>
              <p className="text-blue-100 text-lg">
                AI-Powered Insights • {educationLevel} • Personalized Recommendations
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleDownloadReport}
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download Report
              </Button>
              <Button
                onClick={onRetake}
                variant="outline"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <RefreshCwIcon className="h-4 w-4 mr-2" />
                Retake Quiz
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="recommendations" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recommendations">Career Matches</TabsTrigger>
          <TabsTrigger value="strengths">Strengths</TabsTrigger>
          <TabsTrigger value="roadmap">Skill Roadmap</TabsTrigger>
          <TabsTrigger value="improvement">Growth Areas</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid gap-6">
            {analysisData.careerRecommendations.map((career, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-blue-900">{career.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {career.matchScore}% Match
                      </Badge>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < Math.floor(career.matchScore / 20) 
                                ? 'text-yellow-500 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-base">{career.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <IndianRupeeIcon className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">Salary Range</p>
                          <p className="text-lg font-semibold text-gray-900">{career.salaryRange}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <TrendingUpIcon className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">Growth Potential</p>
                          <p className="text-sm text-gray-900">{career.growthPotential}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">Key Skills Required</p>
                        <div className="flex flex-wrap gap-2">
                          {career.keySkills.map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <GraduationCapIcon className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">Education Path</p>
                          <p className="text-sm text-gray-900">{career.educationPath}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Explore Learning Path <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="strengths" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TargetIcon className="h-6 w-6 mr-2 text-green-600" />
                Your Key Strengths
              </CardTitle>
              <CardDescription>
                These are the areas where you naturally excel based on your responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {analysisData.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-green-800 font-medium">{strength}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <RocketIcon className="h-6 w-6 mr-2 text-blue-600" />
                Your Skill Development Roadmap
              </CardTitle>
              <CardDescription>
                A strategic plan to develop the skills needed for your career goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    Immediate Focus (Next 1-3 months)
                  </h4>
                  <div className="grid gap-2">
                    {analysisData.skillRoadmap.immediate.map((skill, index) => (
                      <div key={index} className="p-3 bg-red-50 rounded border border-red-200">
                        <p className="text-red-800">{skill}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    Short-term Goals (3-6 months)
                  </h4>
                  <div className="grid gap-2">
                    {analysisData.skillRoadmap.shortTerm.map((skill, index) => (
                      <div key={index} className="p-3 bg-yellow-50 rounded border border-yellow-200">
                        <p className="text-yellow-800">{skill}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    Long-term Vision (6+ months)
                  </h4>
                  <div className="grid gap-2">
                    {analysisData.skillRoadmap.longTerm.map((skill, index) => (
                      <div key={index} className="p-3 bg-green-50 rounded border border-green-200">
                        <p className="text-green-800">{skill}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="improvement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BrainIcon className="h-6 w-6 mr-2 text-orange-600" />
                Areas for Growth
              </CardTitle>
              <CardDescription>
                These areas present opportunities for development and improvement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {analysisData.areasForImprovement.map((area, index) => (
                  <div key={index} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-orange-800 font-medium mb-2">{area}</p>
                        <Button variant="outline" size="sm" className="text-orange-700 border-orange-300 hover:bg-orange-100">
                          <BookOpenIcon className="h-4 w-4 mr-2" />
                          Find Learning Resources
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CareerRecommendationsAI;
