
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
import { BookIcon, BrainIcon, ClockIcon, MapPinIcon, PlayIcon, CheckCircleIcon, StarIcon } from "lucide-react";
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
  };
}

export const HistoryDetailModal = ({ isOpen, onClose, item }: HistoryDetailModalProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && item.career) {
      fetchUserQuizData();
    }
  }, [isOpen, item.career]);

  const fetchUserQuizData = async () => {
    try {
      setLoading(true);
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session?.user.id) return;

      // Fetch user's quiz responses to understand their background
      const { data: quizData, error } = await supabase
        .from('user_quiz_responses')
        .select('question, answer')
        .eq('user_id', session.session.user.id);

      if (error) {
        console.error("Error fetching quiz data:", error);
        return;
      }

      // Convert quiz responses to a lookup object
      const answers: Record<string, string> = {};
      quizData?.forEach(response => {
        answers[response.question] = response.answer;
      });
      setUserAnswers(answers);

      // Generate personalized courses based on career and user background
      const personalizedCourses = generateCoursesForCareer(item.career, answers);
      setCourses(personalizedCourses);

    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({
        title: "Error loading course data",
        description: "Could not load personalized course recommendations.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateCoursesForCareer = (career: string, answers: Record<string, string>): Course[] => {
    const educationLevel = answers["What is your current education level?"] || "Undergraduate";
    const techInterest = answers["How excited are you about learning cutting-edge technologies?"] || "";
    const projectInterest = answers["What kind of projects excite you the most?"] || "";
    
    // Determine starting level based on education and experience
    const isAdvancedUser = educationLevel === "Graduate" || 
                          techInterest.includes("Extremely excited") ||
                          projectInterest.includes("Technology");

    const careerCourses: Record<string, Course[]> = {
      "Software Developer": [
        {
          id: "sd-1",
          title: "Programming Fundamentals",
          duration: "4 weeks",
          level: "Beginner",
          completed: isAdvancedUser,
          description: "Learn the basics of programming logic, variables, and control structures.",
          skills: ["Programming Logic", "Problem Solving", "Debugging"]
        },
        {
          id: "sd-2",
          title: "Web Development Basics",
          duration: "6 weeks", 
          level: "Beginner",
          completed: false,
          description: "Introduction to HTML, CSS, and JavaScript for web development.",
          skills: ["HTML", "CSS", "JavaScript", "DOM Manipulation"]
        },
        {
          id: "sd-3",
          title: "Database Management",
          duration: "5 weeks",
          level: "Intermediate",
          completed: false,
          description: "Learn SQL, database design, and data modeling concepts.",
          skills: ["SQL", "Database Design", "Data Modeling", "MySQL"]
        },
        {
          id: "sd-4",
          title: "React Development",
          duration: "8 weeks",
          level: "Intermediate",
          completed: false,
          description: "Build modern web applications using React framework.",
          skills: ["React", "Component Architecture", "State Management", "Hooks"]
        },
        {
          id: "sd-5",
          title: "Software Architecture & Design Patterns",
          duration: "6 weeks",
          level: "Advanced",
          completed: false,
          description: "Master software architecture principles and common design patterns.",
          skills: ["Software Architecture", "Design Patterns", "System Design", "Scalability"]
        },
        {
          id: "sd-6",
          title: "Cloud Computing & DevOps",
          duration: "7 weeks",
          level: "Advanced",
          completed: false,
          description: "Learn cloud platforms, containerization, and deployment strategies.",
          skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "DevOps"]
        }
      ],
      "Data Scientist": [
        {
          id: "ds-1",
          title: "Statistics Fundamentals",
          duration: "5 weeks",
          level: "Beginner",
          completed: educationLevel === "Graduate",
          description: "Essential statistical concepts for data analysis.",
          skills: ["Statistics", "Probability", "Hypothesis Testing", "Data Analysis"]
        },
        {
          id: "ds-2",
          title: "Python for Data Science",
          duration: "6 weeks",
          level: "Beginner",
          completed: false,
          description: "Learn Python programming specifically for data science applications.",
          skills: ["Python", "Pandas", "NumPy", "Data Manipulation"]
        },
        {
          id: "ds-3",
          title: "Data Visualization",
          duration: "4 weeks",
          level: "Intermediate",
          completed: false,
          description: "Create compelling visualizations using modern tools and techniques.",
          skills: ["Matplotlib", "Seaborn", "Tableau", "Data Storytelling"]
        },
        {
          id: "ds-4",
          title: "Machine Learning Fundamentals",
          duration: "8 weeks",
          level: "Intermediate",
          completed: false,
          description: "Introduction to supervised and unsupervised learning algorithms.",
          skills: ["Scikit-learn", "Regression", "Classification", "Clustering"]
        },
        {
          id: "ds-5",
          title: "Deep Learning & Neural Networks",
          duration: "10 weeks",
          level: "Advanced",
          completed: false,
          description: "Advanced machine learning with neural networks and deep learning.",
          skills: ["TensorFlow", "PyTorch", "Neural Networks", "Deep Learning"]
        },
        {
          id: "ds-6",
          title: "Big Data Analytics",
          duration: "8 weeks",
          level: "Advanced",
          completed: false,
          description: "Handle and analyze large-scale datasets using modern tools.",
          skills: ["Spark", "Hadoop", "Big Data", "Distributed Computing"]
        }
      ],
      "UX Designer": [
        {
          id: "ux-1",
          title: "Design Principles & Theory",
          duration: "3 weeks",
          level: "Beginner",
          completed: projectInterest.includes("Creative"),
          description: "Fundamental design principles, color theory, and typography.",
          skills: ["Design Theory", "Color Theory", "Typography", "Visual Hierarchy"]
        },
        {
          id: "ux-2",
          title: "User Research Methods",
          duration: "4 weeks",
          level: "Beginner",
          completed: false,
          description: "Learn how to conduct user interviews, surveys, and usability testing.",
          skills: ["User Research", "Interviews", "Surveys", "Usability Testing"]
        },
        {
          id: "ux-3",
          title: "Wireframing & Prototyping",
          duration: "5 weeks",
          level: "Intermediate",
          completed: false,
          description: "Create wireframes and interactive prototypes using design tools.",
          skills: ["Wireframing", "Prototyping", "Figma", "Adobe XD"]
        },
        {
          id: "ux-4",
          title: "UI Design & Visual Design",
          duration: "6 weeks",
          level: "Intermediate",
          completed: false,
          description: "Master visual design principles and create stunning user interfaces.",
          skills: ["UI Design", "Visual Design", "Design Systems", "Component Libraries"]
        },
        {
          id: "ux-5",
          title: "Advanced UX Strategy",
          duration: "7 weeks",
          level: "Advanced",
          completed: false,
          description: "Strategic UX planning, business alignment, and product strategy.",
          skills: ["UX Strategy", "Product Strategy", "Business Analysis", "Stakeholder Management"]
        },
        {
          id: "ux-6",
          title: "Design Leadership & Portfolio",
          duration: "4 weeks",
          level: "Advanced",
          completed: false,
          description: "Build a professional portfolio and develop design leadership skills.",
          skills: ["Portfolio Development", "Design Leadership", "Presentation Skills", "Career Development"]
        }
      ]
    };

    return careerCourses[career as keyof typeof careerCourses] || [];
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
                      >
                        {course.completed ? "Completed" : "Start Course"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
                  toast({
                    title: "Starting Next Course",
                    description: `Beginning: ${nextCourse.title} (${nextCourse.level} level)`,
                  });
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
