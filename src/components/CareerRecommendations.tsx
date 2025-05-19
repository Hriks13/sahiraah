import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { BookIcon, GraduationCapIcon, BriefcaseIcon, RefreshCwIcon, ArrowRightIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdBanner from "@/components/AdBanner";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface RecommendationsProps {
  userAnswers: Record<string, string>;
  onRetake: () => void;
}

const CareerRecommendations = ({ userAnswers, onRetake }: RecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<Array<{career: string, reason: string}>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCareer, setSelectedCareer] = useState<number | null>(null);
  const [careerRoadmaps, setCareerRoadmaps] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

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
    // Rule-based career recommendation logic
    const analyzeResponses = () => {
      const subjects = userAnswers["What are your favorite school subjects?"].toLowerCase();
      const hobbies = userAnswers["What activities or hobbies do you enjoy most?"].toLowerCase();
      const learningStyle = userAnswers["How do you prefer learning new things?"].toLowerCase();
      const workStyle = userAnswers["Do you like working alone or in a team?"].toLowerCase();
      
      let suggestedCareers = [];
      
      // Apply the rule-based logic as specified
      if (subjects.includes("math") || subjects.includes("physics")) {
        suggestedCareers.push({
          career: "Software Engineer",
          reason: "Your interest in math and physics suggests you might excel in logical problem-solving roles."
        });
        
        suggestedCareers.push({
          career: "Data Scientist",
          reason: "Your mathematical aptitude aligns well with data analysis and statistical modeling."
        });
      }
      
      if (subjects.includes("biology")) {
        suggestedCareers.push({
          career: "Doctor",
          reason: "Your interest in biology forms the foundation for medical studies."
        });
        
        suggestedCareers.push({
          career: "Medical Researcher",
          reason: "Your biology background could translate well to scientific research."
        });
      }
      
      if (hobbies.includes("drawing") || hobbies.includes("design") || hobbies.includes("editing")) {
        suggestedCareers.push({
          career: "Graphic Designer",
          reason: "Your creative hobbies suggest you might enjoy visual design work."
        });
        
        suggestedCareers.push({
          career: "UI/UX Designer",
          reason: "Your design interests pair well with creating user-friendly digital experiences."
        });
      }
      
      if (learningStyle.includes("hands-on")) {
        suggestedCareers.push({
          career: "Engineer",
          reason: "Your hands-on learning style is ideal for practical engineering roles."
        });
        
        suggestedCareers.push({
          career: "Chef",
          reason: "Your preference for hands-on learning aligns with culinary arts."
        });
      }
      
      if (workStyle.includes("team")) {
        suggestedCareers.push({
          career: "Marketing Manager",
          reason: "Your team-oriented approach fits well in collaborative marketing environments."
        });
        
        suggestedCareers.push({
          career: "Teacher",
          reason: "Your preference for teamwork translates well to educational settings."
        });
      }

      // If we couldn't match anything specific or need more recommendations
      if (suggestedCareers.length < 3) {
        const defaultOptions = [
          {
            career: "Project Manager",
            reason: "A versatile role that combines organization, communication, and problem-solving."
          },
          {
            career: "Digital Marketer",
            reason: "Combines creativity, technology, and strategic thinking for business growth."
          },
          {
            career: "Data Analyst",
            reason: "Uses technical and analytical skills to derive insights from information."
          },
          {
            career: "Content Creator",
            reason: "Harnesses creativity and communication skills to produce engaging content."
          }
        ];
        
        while (suggestedCareers.length < 3) {
          const randomIndex = Math.floor(Math.random() * defaultOptions.length);
          const option = defaultOptions[randomIndex];
          if (!suggestedCareers.some(career => career.career === option.career)) {
            suggestedCareers.push(option);
          }
        }
      }
      
      // Limit to top 3
      return suggestedCareers.slice(0, 3);
    };

    // Define roadmaps for each career
    const defineRoadmaps = (careers: Array<{career: string, reason: string}>) => {
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
          case "Software Engineer":
            roadmap = {
              beginner: {
                skills: ["HTML/CSS", "JavaScript Basics", "Programming Logic"],
                courses: [
                  { title: "Web Development Bootcamp", link: "https://www.freecodecamp.org/learn/responsive-web-design/", platform: "freeCodeCamp" },
                  { title: "Introduction to Computer Science", link: "https://www.edx.org/course/cs50s-introduction-to-computer-science", platform: "edX" },
                  { title: "JavaScript Basics", link: "https://www.youtube.com/playlist?list=PLillGF-RfqbbnEGy3ROiLWk7JMCuSyQtX", platform: "YouTube" }
                ]
              },
              intermediate: {
                skills: ["React/Angular/Vue", "Node.js", "Databases", "API Design"],
                courses: [
                  { title: "Full Stack Development", link: "https://fullstackopen.com/en/", platform: "Full Stack Open" },
                  { title: "Data Structures & Algorithms", link: "https://nptel.ac.in/courses/106/105/106105217/", platform: "NPTEL" },
                  { title: "Backend Development", link: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9jsz4LDYc6kv84pOe2XajXq", platform: "YouTube" }
                ]
              },
              advanced: {
                skills: ["System Design", "Cloud Services", "DevOps", "Software Architecture"],
                courses: [
                  { title: "Advanced React Patterns", link: "https://epicreact.dev/", platform: "Epic React" },
                  { title: "Cloud Computing", link: "https://nptel.ac.in/courses/106/105/106105217/", platform: "NPTEL" },
                  { title: "System Design", link: "https://www.youtube.com/watch?v=SqcXvc3ZmRU", platform: "YouTube" }
                ]
              },
              timeline: {
                beginner: "2-3 months",
                intermediate: "4-6 months",
                advanced: "6+ months"
              }
            };
            break;
          
          case "Data Scientist":
            roadmap = {
              beginner: {
                skills: ["Python Basics", "Statistics", "Data Manipulation"],
                courses: [
                  { title: "Python for Everybody", link: "https://www.coursera.org/specializations/python", platform: "Coursera" },
                  { title: "Statistics and Probability", link: "https://www.khanacademy.org/math/statistics-probability", platform: "Khan Academy" },
                  { title: "Data Analysis with Python", link: "https://www.freecodecamp.org/learn/data-analysis-with-python/", platform: "freeCodeCamp" }
                ]
              },
              intermediate: {
                skills: ["Machine Learning Basics", "Data Visualization", "SQL"],
                courses: [
                  { title: "Machine Learning", link: "https://www.coursera.org/learn/machine-learning", platform: "Coursera" },
                  { title: "Data Visualization", link: "https://www.youtube.com/playlist?list=PL998lXKj66MpNd0_XkEXwzTGPxY2jYM2d", platform: "YouTube" },
                  { title: "SQL for Data Science", link: "https://www.coursera.org/learn/sql-for-data-science", platform: "Coursera" }
                ]
              },
              advanced: {
                skills: ["Deep Learning", "Big Data Tools", "NLP", "Computer Vision"],
                courses: [
                  { title: "Deep Learning Specialization", link: "https://www.coursera.org/specializations/deep-learning", platform: "Coursera" },
                  { title: "Natural Language Processing", link: "https://nptel.ac.in/courses/106/106/106106212/", platform: "NPTEL" },
                  { title: "Big Data Analytics", link: "https://www.edx.org/professional-certificate/uc-san-diegox-big-data-specialization", platform: "edX" }
                ]
              },
              timeline: {
                beginner: "3 months",
                intermediate: "4-6 months",
                advanced: "8+ months"
              }
            };
            break;

          case "UI/UX Designer":
            roadmap = {
              beginner: {
                skills: ["Design Fundamentals", "Color Theory", "Typography", "Sketch/Figma Basics"],
                courses: [
                  { title: "UI/UX Design Fundamentals", link: "https://www.coursera.org/specializations/ui-ux-design", platform: "Coursera" },
                  { title: "Design Basics", link: "https://www.youtube.com/playlist?list=PLpQQipWcxwt8NQ6b9Hh7PL3G33g0-m9Ag", platform: "YouTube" },
                  { title: "Learn Figma", link: "https://www.youtube.com/watch?v=FTFaQWZBqQ8", platform: "YouTube" }
                ]
              },
              intermediate: {
                skills: ["User Research", "Wireframing", "Prototyping", "Usability Testing"],
                courses: [
                  { title: "User Experience Research", link: "https://www.coursera.org/learn/user-research", platform: "Coursera" },
                  { title: "Interactive Design", link: "https://www.youtube.com/playlist?list=PLpQQipWcxwt9a8A8JnUc9JpB-B7aCYUJ-", platform: "YouTube" },
                  { title: "Prototyping", link: "https://www.coursera.org/learn/prototyping-design", platform: "Coursera" }
                ]
              },
              advanced: {
                skills: ["Design Systems", "Motion Design", "Accessibility", "Mobile Design"],
                courses: [
                  { title: "Design Systems", link: "https://www.youtube.com/watch?v=41XYGFMkfzU", platform: "YouTube" },
                  { title: "Advanced UI Motion", link: "https://www.youtube.com/watch?v=Wz-tio3pUBg", platform: "YouTube" },
                  { title: "Accessibility in Design", link: "https://www.coursera.org/learn/accessibility", platform: "Coursera" }
                ]
              },
              timeline: {
                beginner: "2 months",
                intermediate: "3-4 months",
                advanced: "5+ months"
              }
            };
            break;

          // Add more career roadmaps as needed...
          default:
            roadmap = {
              beginner: {
                skills: ["Foundational Skills", "Basic Knowledge", "Entry-level Tools"],
                courses: [
                  { title: "Introduction to the Field", link: "https://www.coursera.org/", platform: "Coursera" },
                  { title: "Basic Concepts", link: "https://www.youtube.com/", platform: "YouTube" },
                  { title: "Practical Skills", link: "https://www.freecodecamp.org/", platform: "freeCodeCamp" }
                ]
              },
              intermediate: {
                skills: ["Advanced Concepts", "Specialized Tools", "Professional Skills"],
                courses: [
                  { title: "Professional Development", link: "https://www.coursera.org/", platform: "Coursera" },
                  { title: "Industry Standards", link: "https://www.edx.org/", platform: "edX" },
                  { title: "Technical Skills", link: "https://www.nptel.ac.in/", platform: "NPTEL" }
                ]
              },
              advanced: {
                skills: ["Expert Knowledge", "Leadership", "Innovation"],
                courses: [
                  { title: "Advanced Techniques", link: "https://www.coursera.org/", platform: "Coursera" },
                  { title: "Specialized Knowledge", link: "https://www.edx.org/", platform: "edX" },
                  { title: "Industry Leadership", link: "https://www.nptel.ac.in/", platform: "NPTEL" }
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
    
    setTimeout(processResponses, 1500);
  }, [userAnswers, userId, toast]);

  const getCareerIcon = (career: string) => {
    if (career.includes("Engineer") || career.includes("Data") || career.includes("UI/UX")) {
      return <BriefcaseIcon className="h-12 w-12 text-blue-700" />;
    } else if (career.includes("Designer") || career.includes("Creator") || career.includes("Chef")) {
      return <BookIcon className="h-12 w-12 text-blue-700" />;
    } else {
      return <GraduationCapIcon className="h-12 w-12 text-blue-700" />;
    }
  };

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
      <div className="text-center py-12">
        <div className="animate-spin w-12 h-12 border-4 border-blue-700 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-blue-900 text-lg">Analyzing your responses...</p>
        <p className="text-blue-700">Our AI is finding the best career matches for you</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-900">Your Career Recommendations</h2>
          <Button 
            variant="outline" 
            onClick={onRetake}
            className="border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white flex items-center gap-2"
          >
            <RefreshCwIcon className="h-4 w-4" /> Retake Quiz
          </Button>
        </div>
        <p className="text-blue-700 mb-4">
          Based on your answers, we've identified these career paths that match your interests and strengths:
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {careerRoadmaps.map((rec, index) => (
            <Card key={index} className="bg-white shadow-md hover:shadow-lg transition-all">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                    {getCareerIcon(rec.career)}
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Match #{index + 1}
                  </Badge>
                </div>
                <CardTitle className="text-blue-900">{rec.career}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700">{rec.reason}</p>
                {selectedCareer === index ? (
                  <div className="mt-3 text-sm text-green-600 font-medium">Journey Started ✓</div>
                ) : (
                  <Button 
                    onClick={() => handleStartJourney(index)} 
                    className="w-full mt-3 bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-medium"
                  >
                    Start Your Journey <ArrowRightIcon className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Ad Banner */}
      <AdBanner size="leaderboard" className="bg-white" />

      {/* Learning Roadmap for Selected Career */}
      {selectedCareer !== null && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            Your Learning Roadmap: {recommendations[selectedCareer].career}
          </h2>
          <p className="text-blue-700 mb-6">
            Follow this personalized roadmap to build the skills needed for a career as a {recommendations[selectedCareer].career}.
            All resources listed are freely available online.
          </p>
          
          <Tabs defaultValue="beginner" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-6">
              <TabsTrigger value="beginner" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
                Beginner
              </TabsTrigger>
              <TabsTrigger value="intermediate" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
                Intermediate
              </TabsTrigger>
              <TabsTrigger value="advanced" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
                Advanced
              </TabsTrigger>
            </TabsList>
            
            {/* Beginner Content */}
            <TabsContent value="beginner">
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Timeline: {careerRoadmaps[selectedCareer].roadmap.timeline.beginner}</h3>
                  <p className="text-blue-700">Start with these fundamental skills and resources to build your foundation.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Key Skills to Learn:</h3>
                  <div className="flex flex-wrap gap-2">
                    {careerRoadmaps[selectedCareer].roadmap.beginner.skills.map((skill: string, idx: number) => (
                      <Badge key={idx} className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-blue-900 mb-3">Free Learning Resources:</h3>
                  <div className="space-y-3">
                    {careerRoadmaps[selectedCareer].roadmap.beginner.courses.map((course: any, idx: number) => (
                      <Card key={idx} className="bg-white border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-blue-900">{course.title}</h4>
                              <p className="text-sm text-blue-700">Platform: {course.platform}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white"
                              asChild
                            >
                              <a href={course.link} target="_blank" rel="noopener noreferrer">
                                Learn Now
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
            
            {/* Intermediate Content */}
            <TabsContent value="intermediate">
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Timeline: {careerRoadmaps[selectedCareer].roadmap.timeline.intermediate}</h3>
                  <p className="text-blue-700">Build upon your foundation with these intermediate skills and resources.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Key Skills to Learn:</h3>
                  <div className="flex flex-wrap gap-2">
                    {careerRoadmaps[selectedCareer].roadmap.intermediate.skills.map((skill: string, idx: number) => (
                      <Badge key={idx} className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-blue-900 mb-3">Free Learning Resources:</h3>
                  <div className="space-y-3">
                    {careerRoadmaps[selectedCareer].roadmap.intermediate.courses.map((course: any, idx: number) => (
                      <Card key={idx} className="bg-white border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-blue-900">{course.title}</h4>
                              <p className="text-sm text-blue-700">Platform: {course.platform}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white"
                              asChild
                            >
                              <a href={course.link} target="_blank" rel="noopener noreferrer">
                                Learn Now
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
            
            {/* Advanced Content */}
            <TabsContent value="advanced">
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Timeline: {careerRoadmaps[selectedCareer].roadmap.timeline.advanced}</h3>
                  <p className="text-blue-700">Master advanced concepts to become an expert in your field.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Key Skills to Learn:</h3>
                  <div className="flex flex-wrap gap-2">
                    {careerRoadmaps[selectedCareer].roadmap.advanced.skills.map((skill: string, idx: number) => (
                      <Badge key={idx} className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-blue-900 mb-3">Free Learning Resources:</h3>
                  <div className="space-y-3">
                    {careerRoadmaps[selectedCareer].roadmap.advanced.courses.map((course: any, idx: number) => (
                      <Card key={idx} className="bg-white border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-blue-900">{course.title}</h4>
                              <p className="text-sm text-blue-700">Platform: {course.platform}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white"
                              asChild
                            >
                              <a href={course.link} target="_blank" rel="noopener noreferrer">
                                Learn Now
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
          </Tabs>
          
          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Your Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div className="bg-yellow-500 h-2.5 rounded-full w-[10%]"></div>
            </div>
            <p className="text-sm text-blue-700">Just started - 10% complete</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerRecommendations;
