
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookIcon, BrainIcon, ClockIcon, MapPinIcon } from "lucide-react";

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
        workEnvironment: "Office or remote work environments"
      },
      "Data Scientist": {
        description: "Analyze complex data to help organizations make informed decisions.",
        skills: ["Python/R", "Statistics", "Machine Learning", "Data Visualization"],
        averageSalary: "$80,000 - $150,000",
        jobOutlook: "Excellent (35% growth expected)",
        education: "Bachelor's or Master's in Data Science, Statistics, or related field",
        workEnvironment: "Corporate offices, research institutions, or remote"
      },
      "UX Designer": {
        description: "Design user-friendly interfaces and improve user experience.",
        skills: ["Design Thinking", "Prototyping", "User Research", "Wireframing"],
        averageSalary: "$60,000 - $100,000",
        jobOutlook: "Good (13% growth expected)",
        education: "Bachelor's degree in Design, HCI, or related field",
        workEnvironment: "Design studios, tech companies, or freelance"
      }
    };
    
    return careerDetails[career as keyof typeof careerDetails] || {
      description: "Details not available for this career path.",
      skills: [],
      averageSalary: "Contact career counselor for details",
      jobOutlook: "Contact career counselor for details",
      education: "Contact career counselor for details",
      workEnvironment: "Contact career counselor for details"
    };
  };

  const details = getCareerDetails(item.career);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle className="text-xl font-bold text-blue-900 flex items-center gap-2">
              <BrainIcon className="h-6 w-6" />
              {item.career}
            </DialogTitle>
            <div className="flex gap-2">
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

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button 
              className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold"
              asChild
            >
              <a href="/dashboard">Explore Learning Path</a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
