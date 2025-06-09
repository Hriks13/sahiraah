
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookIcon, BrainIcon, ClockIcon, MapPinIcon, PlayIcon, CheckCircleIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

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
  const getCareerDetails = (career: string) => {
    // Mock career data - in a real app this would come from your database
    const careerDetails = {
      "Software Developer": {
        description: "Design, develop, and maintain software applications and systems.",
        skills: ["Programming", "Problem-solving", "Software Architecture", "Database Design"],
        averageSalary: "$70,000 - $120,000",
        jobOutlook: "Excellent (22% growth expected)",
        education: "Bachelor's degree in Computer Science or related field",
        workEnvironment: "Office or remote work environments",
        learningPath: [
          { title: "Programming Fundamentals", duration: "4 weeks", completed: true },
          { title: "Web Development Basics", duration: "6 weeks", completed: true },
          { title: "Database Management", duration: "3 weeks", completed: false },
          { title: "Software Architecture", duration: "5 weeks", completed: false },
          { title: "Advanced Programming", duration: "8 weeks", completed: false }
        ]
      },
      "Data Scientist": {
        description: "Analyze complex data to help organizations make informed decisions.",
        skills: ["Python/R", "Statistics", "Machine Learning", "Data Visualization"],
        averageSalary: "$80,000 - $150,000",
        jobOutlook: "Excellent (35% growth expected)",
        education: "Bachelor's or Master's in Data Science, Statistics, or related field",
        workEnvironment: "Corporate offices, research institutions, or remote",
        learningPath: [
          { title: "Statistics Fundamentals", duration: "5 weeks", completed: true },
          { title: "Python for Data Science", duration: "6 weeks", completed: false },
          { title: "Machine Learning Basics", duration: "8 weeks", completed: false },
          { title: "Data Visualization", duration: "4 weeks", completed: false },
          { title: "Advanced Analytics", duration: "10 weeks", completed: false }
        ]
      },
      "UX Designer": {
        description: "Design user-friendly interfaces and improve user experience.",
        skills: ["Design Thinking", "Prototyping", "User Research", "Wireframing"],
        averageSalary: "$60,000 - $100,000",
        jobOutlook: "Good (13% growth expected)",
        education: "Bachelor's degree in Design, HCI, or related field",
        workEnvironment: "Design studios, tech companies, or freelance",
        learningPath: [
          { title: "Design Principles", duration: "3 weeks", completed: true },
          { title: "User Research Methods", duration: "4 weeks", completed: false },
          { title: "Prototyping Tools", duration: "5 weeks", completed: false },
          { title: "UI/UX Design", duration: "6 weeks", completed: false },
          { title: "Portfolio Development", duration: "4 weeks", completed: false }
        ]
      }
    };
    
    return careerDetails[career as keyof typeof careerDetails] || {
      description: "Details not available for this career path.",
      skills: [],
      averageSalary: "Contact career counselor for details",
      jobOutlook: "Contact career counselor for details",
      education: "Contact career counselor for details",
      workEnvironment: "Contact career counselor for details",
      learningPath: []
    };
  };

  const details = getCareerDetails(item.career);
  const completedCourses = details.learningPath?.filter(course => course.completed).length || 0;
  const totalCourses = details.learningPath?.length || 0;
  const progressPercentage = totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0;

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
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Completed: {completedCourses}/{totalCourses} courses</span>
                  <span className="text-blue-700">{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Learning Path */}
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <BookIcon className="h-5 w-5" />
              Your Learning Path
            </h3>
            <div className="space-y-3">
              {details.learningPath?.map((course, index) => (
                <Card key={index} className={`border-l-4 ${course.completed ? 'border-l-green-500 bg-green-50' : 'border-l-blue-500'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {course.completed ? (
                          <CheckCircleIcon className="h-6 w-6 text-green-600" />
                        ) : (
                          <PlayIcon className="h-6 w-6 text-blue-600" />
                        )}
                        <div>
                          <h4 className="font-medium text-blue-900">{course.title}</h4>
                          <p className="text-sm text-blue-600">Duration: {course.duration}</p>
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
              )) || (
                <p className="text-blue-700 text-center py-4">No learning path available for this career.</p>
              )}
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
              <h4 className="font-semibold text-blue-800 mb-2">Average Salary</h4>
              <p className="text-blue-700">{details.averageSalary}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="font-semibold text-blue-800 mb-2">Job Outlook</h4>
              <p className="text-blue-700">{details.jobOutlook}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {details.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="bg-white text-blue-700 border-blue-200">
                  {skill}
                </Badge>
              ))}
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
                // Instead of redirecting to dashboard, show next course or continue learning
                const nextCourse = details.learningPath?.find(course => !course.completed);
                if (nextCourse) {
                  alert(`Starting: ${nextCourse.title}`);
                } else {
                  alert("All courses completed! Congratulations!");
                }
              }}
            >
              Continue Learning
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
