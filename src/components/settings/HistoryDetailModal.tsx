
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookIcon, BrainIcon, ClockIcon, MapPinIcon, PlayIcon, CheckCircleIcon, StarIcon, ExternalLinkIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface Course {
  id: string;
  title: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  completed: boolean;
  description: string;
  skills: string[];
  order_index: number;
}

interface CourseLink {
  title: string;
  link: string;
  platform: string;
}

interface CoursesData {
  beginner?: CourseLink[];
  intermediate?: CourseLink[];
  advanced?: CourseLink[];
}

interface HistoryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    career: string;
    reason?: string;
    timestamp: string;
    isSelected?: boolean;
    type?: 'career' | 'course';
    roadmap_summary?: string;
    courses?: CoursesData;
    tags?: string[];
    links_clicked?: boolean;
  };
}

export const HistoryDetailModal = ({ isOpen, onClose, item }: HistoryDetailModalProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && item.career) {
      fetchCoursesAndProgress();
    }
  }, [isOpen, item.career]);

  const fetchCoursesAndProgress = async () => {
    try {
      setLoading(true);
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session?.user.id) {
        console.log("No user session found");
        return;
      }

      const userId = session.session.user.id;

      // Fetch user's quiz responses
      const { data: quizData, error: quizError } = await supabase
        .from('user_quiz_responses')
        .select('question, answer')
        .eq('user_id', userId);

      if (quizError) {
        console.error("Error fetching quiz data:", quizError);
      }

      // Convert quiz responses to a lookup object
      const answers: Record<string, string> = {};
      quizData?.forEach(response => {
        answers[response.question] = response.answer;
      });
      setUserAnswers(answers);

      // Fetch courses for this career path
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('career_path', item.career)
        .order('order_index', { ascending: true });

      if (coursesError) {
        console.error("Error fetching courses:", coursesError);
        toast({
          title: "Error loading courses",
          description: "Could not load course data from database.",
          variant: "destructive",
        });
        return;
      }

      // Fetch user's progress for these courses
      const courseIds = coursesData?.map(course => course.id) || [];
      let userProgress: any[] = [];
      
      if (courseIds.length > 0) {
        const { data: progressData, error: progressError } = await supabase
          .from('user_course_progress')
          .select('course_id, completed, started_at, completed_at')
          .eq('user_id', userId)
          .in('course_id', courseIds);

        if (progressError) {
          console.error("Error fetching user progress:", progressError);
        } else {
          userProgress = progressData || [];
        }
      }

      // Combine courses with user progress
      const coursesWithProgress: Course[] = (coursesData || []).map(course => {
        const progress = userProgress.find(p => p.course_id === course.id);
        const educationLevel = answers["What is your current education level?"] || "Undergraduate";
        const isAdvancedUser = educationLevel === "Graduate";
        
        return {
          id: course.id,
          title: course.title,
          duration: course.duration,
          level: course.level as 'Beginner' | 'Intermediate' | 'Advanced',
          completed: progress?.completed || (course.level === 'Beginner' && isAdvancedUser),
          description: course.description,
          skills: course.skills || [],
          order_index: course.order_index
        };
      });

      setCourses(coursesWithProgress);

    } catch (error) {
      console.error("Error fetching course data:", error);
      toast({
        title: "Error loading course data",
        description: "Could not load personalized course recommendations.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartCourse = async (course: Course) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user.id) return;

      const userId = session.session.user.id;

      if (course.completed) {
        toast({
          title: "Course Already Completed",
          description: `You have already completed ${course.title}!`,
        });
        return;
      }

      // Update or insert user progress
      const { error } = await supabase
        .from('user_course_progress')
        .upsert({
          user_id: userId,
          course_id: course.id,
          started_at: new Date().toISOString(),
          completed: false
        });

      if (error) {
        console.error("Error starting course:", error);
        toast({
          title: "Error",
          description: "Could not start the course. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Course Started!",
        description: `You've started ${course.title}. Good luck with your learning!`,
      });

      // Refresh the course data
      fetchCoursesAndProgress();

    } catch (error) {
      console.error("Error starting course:", error);
      toast({
        title: "Error",
        description: "Could not start the course. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExternalLinkClick = async (link: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user.id) return;

      // Update links_clicked status in the career history
      await supabase
        .from('user_career_history')
        .update({ links_clicked: true })
        .eq('user_id', session.session.user.id)
        .eq('career', item.career)
        .eq('timestamp', item.timestamp);

      // Open link in new tab
      window.open(link, '_blank');
    } catch (error) {
      console.error("Error tracking link click:", error);
      // Still open the link even if tracking fails
      window.open(link, '_blank');
    }
  };

  const getCareerDetails = (career: string) => {
    const careerDetails = {
      "Software Developer": {
        description: "Design, develop, and maintain software applications and systems using modern programming languages and frameworks.",
        averageSalary: "₹4,00,000 - ₹25,00,000 per year",
        jobOutlook: "Excellent (22% growth expected)",
        education: "Bachelor's degree in Computer Science or related field",
        workEnvironment: "Office, remote work, or hybrid environments",
      },
      "Data Scientist": {
        description: "Analyze complex data to help organizations make informed decisions using statistical methods and machine learning.",
        averageSalary: "₹6,00,000 - ₹30,00,000 per year", 
        jobOutlook: "Excellent (35% growth expected)",
        education: "Bachelor's or Master's in Data Science, Statistics, or related field",
        workEnvironment: "Corporate offices, research institutions, or remote",
      },
      "UX Designer": {
        description: "Design user-friendly interfaces and improve user experience through research and iterative design processes.",
        averageSalary: "₹3,50,000 - ₹20,00,000 per year",
        jobOutlook: "Good (13% growth expected)",
        education: "Bachelor's degree in Design, HCI, Psychology, or related field",
        workEnvironment: "Design studios, tech companies, agencies, or freelance",
      }
    };
    
    return careerDetails[career as keyof typeof careerDetails] || {
      description: "Details not available for this career path.",
      averageSalary: "Contact career counselor for details",
      jobOutlook: "Contact career counselor for details", 
      education: "Contact career counselor for details",
      workEnvironment: "Contact career counselor for details",
    };
  };

  const details = getCareerDetails(item.career);
  const completedCourses = courses.filter(course => course.completed).length;
  const totalCourses = courses.length;
  const progressPercentage = totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getNextCourse = () => {
    return courses.find(course => !course.completed);
  };

  const renderExternalCourses = () => {
    if (!item.courses) return null;

    const { beginner = [], intermediate = [], advanced = [] } = item.courses;
    const allCourses = [...beginner, ...intermediate, ...advanced];

    if (allCourses.length === 0) return null;

    return (
      <div>
        <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
          <ExternalLinkIcon className="h-5 w-5" />
          Recommended External Courses
        </h3>
        <div className="space-y-4">
          {beginner.length > 0 && (
            <div>
              <h4 className="font-medium text-green-700 mb-2">Beginner Level</h4>
              <div className="space-y-2">
                {beginner.map((course, index) => (
                  <Card key={index} className="border-l-4 border-l-green-500 bg-green-50">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-blue-900">{course.title}</h5>
                          <p className="text-sm text-blue-600">Platform: {course.platform}</p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleExternalLinkClick(course.link)}
                          className="text-blue-700 border-blue-300"
                        >
                          View Course
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {intermediate.length > 0 && (
            <div>
              <h4 className="font-medium text-yellow-700 mb-2">Intermediate Level</h4>
              <div className="space-y-2">
                {intermediate.map((course, index) => (
                  <Card key={index} className="border-l-4 border-l-yellow-500 bg-yellow-50">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-blue-900">{course.title}</h5>
                          <p className="text-sm text-blue-600">Platform: {course.platform}</p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleExternalLinkClick(course.link)}
                          className="text-blue-700 border-blue-300"
                        >
                          View Course
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {advanced.length > 0 && (
            <div>
              <h4 className="font-medium text-red-700 mb-2">Advanced Level</h4>
              <div className="space-y-2">
                {advanced.map((course, index) => (
                  <Card key={index} className="border-l-4 border-l-red-500 bg-red-50">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-blue-900">{course.title}</h5>
                          <p className="text-sm text-blue-600">Platform: {course.platform}</p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleExternalLinkClick(course.link)}
                          className="text-blue-700 border-blue-300"
                        >
                          View Course
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-700 border-t-transparent rounded-full"></div>
            <span className="ml-3 text-blue-700">Loading your personalized learning path...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <DialogTitle className="text-xl font-bold text-blue-900 flex items-center gap-2">
              <BrainIcon className="h-6 w-6" />
              {item.career}
            </DialogTitle>
            <div className="flex flex-wrap gap-2">
              {item.isSelected && (
                <Badge className="bg-green-100 text-green-800">Current Selection</Badge>
              )}
              {item.links_clicked && (
                <Badge className="bg-blue-100 text-blue-800">Links Explored</Badge>
              )}
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Career Path
              </Badge>
            </div>
          </div>
          <DialogDescription className="text-blue-700 flex items-center gap-2">
            <ClockIcon className="h-4 w-4" />
            Recommended on {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Career Tags</h3>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Roadmap Summary */}
          {item.roadmap_summary && (
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Learning Roadmap Summary</h3>
              <div className="bg-gradient-to-r from-blue-50 to-yellow-50 p-4 rounded-md">
                <p className="text-blue-700">{item.roadmap_summary}</p>
              </div>
            </div>
          )}

          {/* External Courses */}
          {renderExternalCourses()}

          {/* Learning Progress */}
          <Card className="bg-gradient-to-r from-blue-50 to-yellow-50">
            <CardHeader>
              <CardTitle className="text-lg text-blue-800">Your Learning Progress</CardTitle>
              <CardDescription>
                Personalized based on your quiz responses and background
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Completed: {completedCourses}/{totalCourses} courses</span>
                  <span className="text-blue-700">{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
                <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                  <div className="bg-white/70 p-2 rounded">
                    <div className="text-sm font-medium text-green-700">Beginner</div>
                    <div className="text-xs text-green-600">
                      {courses.filter(c => c.level === 'Beginner').length} courses
                    </div>
                  </div>
                  <div className="bg-white/70 p-2 rounded">
                    <div className="text-sm font-medium text-yellow-700">Intermediate</div>
                    <div className="text-xs text-yellow-600">
                      {courses.filter(c => c.level === 'Intermediate').length} courses
                    </div>
                  </div>
                  <div className="bg-white/70 p-2 rounded">
                    <div className="text-sm font-medium text-red-700">Advanced</div>
                    <div className="text-xs text-red-600">
                      {courses.filter(c => c.level === 'Advanced').length} courses
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personalized Learning Path */}
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <BookIcon className="h-5 w-5" />
              Your Personalized Learning Path
            </h3>
            {courses.length > 0 ? (
              <div className="space-y-3">
                {courses.map((course, index) => (
                  <Card key={course.id} className={`border-l-4 ${course.completed ? 'border-l-green-500 bg-green-50' : 'border-l-blue-500'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {course.completed ? (
                            <CheckCircleIcon className="h-6 w-6 text-green-600 mt-1" />
                          ) : (
                            <PlayIcon className="h-6 w-6 text-blue-600 mt-1" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-blue-900">{course.title}</h4>
                              <Badge className={`text-xs ${getLevelColor(course.level)}`}>
                                {course.level}
                              </Badge>
                            </div>
                            <p className="text-sm text-blue-800 mb-2">{course.description}</p>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {course.skills.map((skill, skillIndex) => (
                                <Badge key={skillIndex} variant="outline" className="text-xs bg-white">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-xs text-blue-600">Duration: {course.duration}</p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant={course.completed ? "outline" : "default"}
                          className={course.completed ? "text-green-700 border-green-300" : "bg-blue-600 hover:bg-blue-700"}
                          onClick={() => handleStartCourse(course)}
                        >
                          {course.completed ? "Completed" : "Start Course"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <BookIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No courses available for this career path.</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Career Overview */}
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Career Overview</h3>
            <p className="text-blue-700">{details.description}</p>
          </div>

          {item.reason && (
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Why This Career Was Recommended</h3>
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-blue-700">{item.reason}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="font-semibold text-blue-800 mb-2">Average Salary (India)</h4>
              <p className="text-blue-700">{details.averageSalary}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="font-semibold text-blue-800 mb-2">Job Outlook</h4>
              <p className="text-blue-700">{details.jobOutlook}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white border border-blue-200 p-4 rounded-md">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <BookIcon className="h-4 w-4" />
                Education Requirements
              </h4>
              <p className="text-blue-700">{details.education}</p>
            </div>
            <div className="bg-white border border-blue-200 p-4 rounded-md">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <MapPinIcon className="h-4 w-4" />
                Work Environment
              </h4>
              <p className="text-blue-700">{details.workEnvironment}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Close
            </Button>
            <Button 
              className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold w-full sm:w-auto"
              onClick={() => {
                const nextCourse = getNextCourse();
                if (nextCourse) {
                  handleStartCourse(nextCourse);
                } else {
                  toast({
                    title: "Congratulations!",
                    description: "You've completed all courses in this learning path!",
                  });
                }
              }}
            >
              {getNextCourse() ? `Continue with ${getNextCourse()?.level} Level` : "All Courses Complete!"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
