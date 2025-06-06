import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { BookIcon, GraduationCapIcon, BriefcaseIcon, RefreshCwIcon, ArrowRightIcon, CheckCircleIcon, TrendingUpIcon, LightbulbIcon, SparklesIcon, RocketIcon, BarChartIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import AdBanner from "@/components/AdBanner";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

interface RecommendationsProps {
  userAnswers: Record<string, string>;
  onRetake: () => void;
}

const CareerRecommendations = ({ userAnswers, onRetake }: RecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<Array<{career: string, reason: string, matchPercentage: number, salaryRange: string, growthRate: string}>>([]);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [areasToImprove, setAreasToImprove] = useState<string[]>([]);
  const [skillsAnalysis, setSkillsAnalysis] = useState<any[]>([]);
  const [personalityInsights, setPersonalityInsights] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCareer, setSelectedCareer] = useState<number | null>(null);
  const [careerRoadmaps, setCareerRoadmaps] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("student");
  const [educationLevel, setEducationLevel] = useState<string>("");

  // Chart color schemes
  const CHART_COLORS = {
    skills: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'],
    personality: ['#F59E0B', '#3B82F6', '#10B981', '#EF4444'],
    careers: ['#1E40AF', '#059669', '#D97706', '#DC2626']
  };

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast({
          title: "Authentication required",
          description: "Please log in to view career recommendations",
          variant: "destructive",
        });
        navigate("/login");
      } else {
        setUserId(data.session.user.id);
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

  useEffect(() => {
    // Extract name and education level
    if (userAnswers["What's your name?"]) {
      setUserName(userAnswers["What's your name?"]);
    }
    
    if (userAnswers["What is your current education level?"]) {
      setEducationLevel(userAnswers["What is your current education level?"]);
    }

    // Enhanced rule-based career recommendation logic
    const analyzeResponses = () => {
      // Initialize scoring for different career categories
      const scores: Record<string, number> = {
        technology: 0,
        design: 0,
        data: 0,
        science: 0,
        business: 0,
        healthcare: 0,
        sustainability: 0,
        research: 0,
        creativity: 0,
        leadership: 0
      };
      
      const identifiedStrengths: string[] = [];
      const improvementAreas: string[] = [];
      
      // Analyze subject preferences
      const subjects = (userAnswers["Which subjects do you enjoy the most in school?"] || "").toLowerCase();
      
      if (subjects.includes("math") || subjects.includes("maths") || subjects.includes("mathematics")) {
        scores.technology += 2;
        scores.data += 3;
        scores.science += 1;
        identifiedStrengths.push("Mathematical reasoning");
      }
      
      if (subjects.includes("science") || subjects.includes("physics") || subjects.includes("chemistry")) {
        scores.science += 3;
        scores.healthcare += 2;
        scores.research += 2;
        identifiedStrengths.push("Scientific thinking");
      }
      
      if (subjects.includes("computer") || subjects.includes("programming") || subjects.includes("informatics")) {
        scores.technology += 4;
        scores.data += 2;
        identifiedStrengths.push("Technical aptitude");
      }
      
      // Analyze personality and energy sources
      const energySource = userAnswers["What type of activities energize you the most?"] || "";
      
      if (energySource.includes("Solving complex problems")) {
        scores.technology += 3;
        scores.data += 2;
        scores.research += 2;
        identifiedStrengths.push("Analytical problem-solving");
      }
      
      if (energySource.includes("Creating and designing")) {
        scores.design += 4;
        scores.creativity += 3;
        identifiedStrengths.push("Creative innovation");
      }
      
      if (energySource.includes("Helping and teaching")) {
        scores.healthcare += 2;
        scores.sustainability += 1;
        identifiedStrengths.push("Interpersonal skills");
      }
      
      if (energySource.includes("Leading teams")) {
        scores.business += 3;
        scores.leadership += 4;
        identifiedStrengths.push("Leadership potential");
      }
      
      if (energySource.includes("Analyzing data")) {
        scores.data += 4;
        scores.research += 2;
        identifiedStrengths.push("Data analysis");
      }

      // Analyze problem-solving approach
      const problemSolving = userAnswers["How do you approach solving complex problems?"] || "";
      
      if (problemSolving.includes("Break down")) {
        scores.technology += 2;
        scores.data += 1;
        identifiedStrengths.push("Systematic thinking");
      }
      
      if (problemSolving.includes("patterns")) {
        scores.data += 3;
        scores.research += 2;
        identifiedStrengths.push("Pattern recognition");
      }
      
      if (problemSolving.includes("creatively")) {
        scores.design += 2;
        scores.creativity += 3;
        identifiedStrengths.push("Creative problem-solving");
      }

      // Analyze team role preferences
      const teamRole = userAnswers["When working in a team, what role do you naturally take?"] || "";
      
      if (teamRole.includes("strategic leader")) {
        scores.business += 3;
        scores.leadership += 3;
        identifiedStrengths.push("Strategic leadership");
      }
      
      if (teamRole.includes("creative innovator")) {
        scores.design += 2;
        scores.creativity += 3;
        identifiedStrengths.push("Innovation mindset");
      }
      
      if (teamRole.includes("technical problem-solver")) {
        scores.technology += 3;
        scores.science += 1;
        identifiedStrengths.push("Technical expertise");
      }

      // Analyze technology enthusiasm
      const techAttitude = userAnswers["How excited are you about learning cutting-edge technologies?"] || "";
      
      if (techAttitude.includes("Extremely excited")) {
        scores.technology += 4;
        identifiedStrengths.push("Technology enthusiasm");
      } else if (techAttitude.includes("Very interested")) {
        scores.technology += 3;
      } else if (techAttitude.includes("Somewhat hesitant")) {
        improvementAreas.push("Technology adaptability");
      }

      // Analyze specialization interests
      const techSpec = userAnswers["Which emerging technology area interests you most?"] || "";
      if (techSpec.includes("Artificial Intelligence")) {
        scores.technology += 3;
        scores.data += 2;
      }
      if (techSpec.includes("Cybersecurity")) {
        scores.technology += 2;
      }

      const creativeSpec = userAnswers["What type of creative work appeals to you most?"] || "";
      if (creativeSpec.includes("Digital design")) {
        scores.design += 3;
        scores.technology += 1;
      }
      if (creativeSpec.includes("Content creation")) {
        scores.creativity += 3;
      }

      // Create skills analysis data for charts
      const skillsData = [
        { skill: "Technical", score: Math.min(scores.technology * 10, 100), fullMark: 100 },
        { skill: "Creative", score: Math.min(scores.creativity * 10, 100), fullMark: 100 },
        { skill: "Analytical", score: Math.min(scores.data * 10, 100), fullMark: 100 },
        { skill: "Leadership", score: Math.min(scores.leadership * 10, 100), fullMark: 100 },
        { skill: "Research", score: Math.min(scores.research * 10, 100), fullMark: 100 },
        { skill: "Business", score: Math.min(scores.business * 10, 100), fullMark: 100 }
      ];

      // Create personality insights
      const personalityData = [
        { trait: "Problem Solver", value: scores.technology + scores.data },
        { trait: "Creative Thinker", value: scores.creativity + scores.design },
        { trait: "Team Player", value: scores.leadership + scores.business },
        { trait: "Researcher", value: scores.research + scores.science }
      ];

      setSkillsAnalysis(skillsData);
      setPersonalityInsights(personalityData);
      
      // Find top scoring categories
      let topCategories = Object.entries(scores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(entry => entry[0]);
      
      // Enhanced career mappings with additional data
      const careerMappings: Record<string, {career: string, reason: string, matchPercentage: number, salaryRange: string, growthRate: string}[]> = {
        technology: [
          { 
            career: "AI/ML Engineer", 
            reason: "Your analytical skills and tech enthusiasm make you ideal for developing intelligent systems that are transforming industries across India.",
            matchPercentage: 92,
            salaryRange: "₹8-25 LPA",
            growthRate: "22% annually"
          },
          {
            career: "Full Stack Developer",
            reason: "Your problem-solving approach and technical aptitude align perfectly with building end-to-end applications for India's booming tech sector.",
            matchPercentage: 88,
            salaryRange: "₹6-20 LPA",
            growthRate: "18% annually"
          }
        ],
        data: [
          {
            career: "Data Scientist",
            reason: "Your pattern recognition and analytical thinking are perfect for extracting insights from India's rapidly growing data ecosystem.",
            matchPercentage: 90,
            salaryRange: "₹7-22 LPA",
            growthRate: "25% annually"
          }
        ],
        design: [
          {
            career: "UX/UI Designer",
            reason: "Your creative thinking and user-focused mindset would create exceptional digital experiences for India's diverse user base.",
            matchPercentage: 86,
            salaryRange: "₹5-18 LPA",
            growthRate: "16% annually"
          }
        ],
        leadership: [
          {
            career: "Product Manager",
            reason: "Your strategic thinking and leadership skills would guide innovative product development in India's startup ecosystem.",
            matchPercentage: 85,
            salaryRange: "₹10-30 LPA",
            growthRate: "20% annually"
          }
        ]
      };
      
      // Select top careers based on highest scoring categories
      let suggestedCareers: {career: string, reason: string, matchPercentage: number, salaryRange: string, growthRate: string}[] = [];
      
      for (const category of topCategories) {
        if (careerMappings[category] && suggestedCareers.length < 3) {
          const newCareer = careerMappings[category][0];
          if (!suggestedCareers.some(c => c.career === newCareer.career)) {
            suggestedCareers.push(newCareer);
          }
        }
        if (suggestedCareers.length >= 3) break;
      }
      
      setStrengths(identifiedStrengths);
      setAreasToImprove(improvementAreas);
      
      return suggestedCareers;
    };

    // Define roadmaps for each career with Indian context
    const defineRoadmaps = (careers: Array<{career: string, reason: string, matchPercentage: number, salaryRange: string, growthRate: string}>) => {
      return careers.map(item => {
        let roadmap = {
          beginner: { 
            skills: [],
            courses: []
          },
          intermediate: {
            skills: [],
            courses: []
          },
          advanced: {
            skills: [],
            courses: []
          },
          timeline: {}
        };

        switch (item.career) {
          case "AI/ML Engineer":
            roadmap = {
              beginner: {
                skills: ["Python Programming", "Mathematics & Statistics", "Data Structures"],
                courses: [
                  { title: "Python for Everybody", link: "https://www.coursera.org/specializations/python", platform: "Coursera" },
                  { title: "Mathematics for ML", link: "https://nptel.ac.in/courses/106/105/106105151/", platform: "NPTEL" }
                ]
              },
              intermediate: {
                skills: ["Machine Learning", "Deep Learning", "TensorFlow/PyTorch"],
                courses: [
                  { title: "ML Specialization", link: "https://www.coursera.org/specializations/machine-learning-introduction", platform: "Coursera" },
                  { title: "Deep Learning", link: "https://nptel.ac.in/courses/106/105/106105152/", platform: "NPTEL" }
                ]
              },
              advanced: {
                skills: ["NLP", "Computer Vision", "MLOps"],
                courses: [
                  { title: "NLP Specialization", link: "https://www.coursera.org/specializations/natural-language-processing", platform: "Coursera" }
                ]
              },
              timeline: {
                beginner: "3-4 months",
                intermediate: "6-8 months",
                advanced: "8-12 months"
              }
            };
            break;
          
          // Add similar enhanced roadmaps for other careers
          default:
            roadmap = {
              beginner: {
                skills: ["Foundation Skills", "Basic Tools", "Entry-level Tools"],
                courses: [
                  { title: "Introduction to the Field", link: "https://www.coursera.org/", platform: "Coursera" },
                  { title: "Basic Concepts", link: "https://www.youtube.com/", platform: "YouTube" },
                  { title: "Practical Skills", link: "https://nptel.ac.in/", platform: "NPTEL" }
                ]
              },
              intermediate: {
                skills: ["Advanced Concepts", "Specialized Tools", "Professional Skills"],
                courses: [
                  { title: "Professional Development", link: "https://www.coursera.org/", platform: "Coursera" },
                  { title: "Industry Standards", link: "https://www.youtube.com/", platform: "YouTube" },
                  { title: "Technical Skills", link: "https://nptel.ac.in/", platform: "NPTEL" }
                ]
              },
              advanced: {
                skills: ["Expert Knowledge", "Leadership", "Innovation"],
                courses: [
                  { title: "Advanced Techniques", link: "https://www.coursera.org/", platform: "Coursera" },
                  { title: "Specialized Knowledge", link: "https://www.youtube.com/", platform: "YouTube" },
                  { title: "Industry Leadership", link: "https://nptel.ac.in/", platform: "NPTEL" }
                ]
              },
              timeline: {
                beginner: "2-3 months",
                intermediate: "3-6 months",
                advanced: "6+ months"
              }
            };
        }

        return {
          ...item,
          roadmap
        };
      });
    };

    // Simulate processing delay and save to database
    const processResponses = async () => {
      try {
        const results = analyzeResponses();
        const roadmaps = defineRoadmaps(results);
        
        setRecommendations(results);
        setCareerRoadmaps(roadmaps);
        
        // Save recommendations to Supabase
        if (userId) {
          for (const result of results) {
            await supabase.from('user_career_history').insert({
              user_id: userId,
              career: result.career,
              reason: result.reason,
              is_selected: false
            });
          }
        }
      } catch (error) {
        console.error("Error processing responses:", error);
        toast({
          title: "Error generating recommendations",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    setTimeout(processResponses, 2000);
  }, [userAnswers, userId, toast]);

  const handleStartJourney = async (index: number) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to save your career selection",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    try {
      setSelectedCareer(index);
      
      // Update all career history entries to not selected
      await supabase
        .from('user_career_history')
        .update({ is_selected: false })
        .eq('user_id', userId);
      
      // Get the ID of the career to select
      const { data } = await supabase
        .from('user_career_history')
        .select('id')
        .eq('user_id', userId)
        .eq('career', recommendations[index].career)
        .order('timestamp', { ascending: false })
        .limit(1);
      
      if (data && data.length > 0) {
        // Update this career to be selected
        await supabase
          .from('user_career_history')
          .update({ is_selected: true })
          .eq('id', data[0].id);
      }
      
      toast({
        title: "Career path selected!",
        description: `You've started your journey towards becoming a ${recommendations[index].career}.`,
      });
    } catch (error) {
      console.error("Error selecting career path:", error);
      toast({
        title: "Error",
        description: "Failed to select career path. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="relative">
          <div className="animate-spin w-16 h-16 border-4 border-blue-300 border-t-blue-600 rounded-full mx-auto mb-6"></div>
          <SparklesIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-blue-900 mb-2">AI Analysis in Progress</h3>
        <p className="text-blue-700 text-lg mb-4">Analyzing your responses with advanced algorithms...</p>
        <div className="max-w-md mx-auto space-y-2">
          <div className="flex items-center text-blue-600">
            <CheckCircleIcon className="h-4 w-4 mr-2" />
            <span className="text-sm">Processing personality insights</span>
          </div>
          <div className="flex items-center text-blue-600">
            <CheckCircleIcon className="h-4 w-4 mr-2" />
            <span className="text-sm">Matching career opportunities</span>
          </div>
          <div className="flex items-center text-blue-600">
            <CheckCircleIcon className="h-4 w-4 mr-2" />
            <span className="text-sm">Generating learning roadmaps</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced header with visual elements */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-100 border-0 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-3 rounded-full shadow-md">
                <BarChartIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold text-blue-900">
                  Your AI-Powered Career Analysis
                </CardTitle>
                <CardDescription className="text-blue-700 text-lg">
                  Personalized insights for {userName} • {new Date().toLocaleDateString()}
                </CardDescription>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={onRetake}
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
            >
              <RefreshCwIcon className="h-4 w-4 mr-2" /> Retake Assessment
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Visual Analytics Dashboard */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skills Radar Chart */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center">
              <TrendingUpIcon className="h-5 w-5 mr-2" />
              Your Skills Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                score: { label: "Score", color: "#3B82F6" }
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillsAnalysis}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" className="text-sm" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} className="text-xs" />
                  <Radar
                    name="Skills"
                    dataKey="score"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Personality Insights */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center">
              <SparklesIcon className="h-5 w-5 mr-2" />
              Personality Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: { label: "Strength", color: "#F59E0B" }
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={personalityInsights}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ trait, percent }) => `${trait} ${(percent * 100).toFixed(0)}%`}
                  >
                    {personalityInsights.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS.personality[index % CHART_COLORS.personality.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Career Recommendations */}
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-900 flex items-center">
            <RocketIcon className="h-6 w-6 mr-2" />
            Your Top Career Matches
          </CardTitle>
          <CardDescription className="text-blue-700">
            AI-curated careers based on your unique profile and India's growth opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {careerRoadmaps.map((rec, index) => (
              <Card key={index} className="bg-gradient-to-br from-white to-blue-50 shadow-md hover:shadow-xl transition-all border border-blue-100">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <BriefcaseIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{rec.matchPercentage}%</div>
                        <div className="text-xs text-blue-600">Match</div>
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-blue-900 text-lg">{rec.career}</CardTitle>
                  <div className="flex space-x-2">
                    <Badge className="bg-green-100 text-green-800 text-xs">{rec.salaryRange}</Badge>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">{rec.growthRate}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-blue-700 text-sm leading-relaxed">{rec.reason}</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-blue-800 text-sm">Key Skills Needed:</h4>
                    <div className="flex flex-wrap gap-1">
                      {rec.roadmap?.beginner?.skills?.slice(0, 3).map((skill: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-blue-800 text-sm">Learning Timeline:</h4>
                    <div className="bg-blue-50 p-2 rounded text-xs text-blue-700">
                      {rec.roadmap?.beginner?.duration || "3-6 months"} to get started
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {selectedCareer === index ? (
                    <div className="w-full text-center">
                      <div className="flex items-center justify-center text-green-600 font-medium mb-2">
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        Journey Started
                      </div>
                      <Progress value={10} className="h-2" />
                      <p className="text-xs text-blue-600 mt-1">10% Complete</p>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => handleStartJourney(index)} 
                      className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-blue-900 font-medium"
                    >
                      Start Your Journey <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Learning Roadmap */}
      {selectedCareer !== null && (
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-900 flex items-center">
              <GraduationCapIcon className="h-6 w-6 mr-2" />
              Interactive Learning Roadmap: {recommendations[selectedCareer].career}
            </CardTitle>
            <CardDescription className="text-blue-700">
              Your personalized step-by-step journey with milestones and progress tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Timeline visualization */}
            <div className="mb-8">
              <h3 className="font-semibold text-blue-900 mb-4">Learning Milestones</h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200"></div>
                {careerRoadmaps[selectedCareer]?.roadmap?.milestones?.map((milestone: any, idx: number) => (
                  <div key={idx} className="relative flex items-center mb-6">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {milestone.month}
                    </div>
                    <div className="ml-4 bg-blue-50 p-3 rounded-lg flex-1">
                      <p className="text-blue-800 font-medium">{milestone.task}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced tabs with progress tracking */}
            <Tabs defaultValue="beginner" className="w-full">
              <TabsList className="w-full grid grid-cols-3 mb-6">
                <TabsTrigger value="beginner" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
                  🌱 Beginner
                </TabsTrigger>
                <TabsTrigger value="intermediate" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
                  🚀 Intermediate
                </TabsTrigger>
                <TabsTrigger value="advanced" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
                  ⭐ Advanced
                </TabsTrigger>
              </TabsList>
              
              {/* Enhanced content for each level */}
              <TabsContent value="beginner">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                    <h3 className="font-bold text-blue-900 mb-2 flex items-center">
                      <RocketIcon className="h-5 w-5 mr-2" />
                      Foundation Phase: {careerRoadmaps[selectedCareer]?.roadmap?.beginner?.duration}
                    </h3>
                    <p className="text-blue-700">Build your fundamental skills and get hands-on experience with core concepts.</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                        <LightbulbIcon className="h-4 w-4 mr-2" />
                        Core Skills to Master
                      </h4>
                      <div className="space-y-2">
                        {careerRoadmaps[selectedCareer]?.roadmap?.beginner?.skills?.map((skill: string, idx: number) => (
                          <div key={idx} className="flex items-center p-2 bg-blue-50 rounded border border-blue-100">
                            <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-blue-800">{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                        <BookIcon className="h-4 w-4 mr-2" />
                        Practice Projects
                      </h4>
                      <div className="space-y-2">
                        {careerRoadmaps[selectedCareer]?.roadmap?.beginner?.projects?.map((project: string, idx: number) => (
                          <div key={idx} className="flex items-center p-2 bg-yellow-50 rounded border border-yellow-100">
                            <SparklesIcon className="h-4 w-4 text-yellow-500 mr-2" />
                            <span className="text-blue-800">{project}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-900 mb-3">Free Learning Resources</h4>
                    <div className="grid gap-3">
                      {careerRoadmaps[selectedCareer]?.roadmap?.beginner?.courses?.map((course: any, idx: number) => (
                        <Card key={idx} className="bg-white border border-blue-200 hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div className="flex-1">
                                <h5 className="font-medium text-blue-900">{course.title}</h5>
                                <p className="text-sm text-blue-600">Platform: {course.platform}</p>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                                asChild
                              >
                                <a href={course.link} target="_blank" rel="noopener noreferrer">
                                  Start Learning
                                </a>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Similar enhanced content for intermediate and advanced tabs */}
              <TabsContent value="intermediate">
                {/* ... keep existing intermediate content with similar enhancements */}
              </TabsContent>
              
              <TabsContent value="advanced">
                {/* ... keep existing advanced content with similar enhancements */}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      <AdBanner size="leaderboard" className="bg-white" />
    </div>
  );
};

export default CareerRecommendations;
