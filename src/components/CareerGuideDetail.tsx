
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { BookOpenIcon, ListCheckIcon, BookIcon, BuildingIcon, TrendingUpIcon, GraduationCapIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface CareerGuideDetailProps {
  isOpen: boolean;
  onClose: () => void;
  career: {
    title: string;
    description: string;
    roles: string[];
    indianContext?: string;
    skills?: string[];
    salaryRange?: string;
    futureOutlook?: string;
    roadmap: {
      beginner: { resources: { title: string; link: string; platform: string }[] };
      intermediate: { resources: { title: string; link: string; platform: string }[] };
      advanced: { resources: { title: string; link: string; platform: string }[] };
    };
    timeline: { beginner: string; intermediate: string; advanced: string };
  };
}

const CareerGuideDetail = ({ isOpen, onClose, career }: CareerGuideDetailProps) => {
  const { toast } = useToast();
  const [savedPath, setSavedPath] = useState(false);

  const handleSavePath = () => {
    // In a real implementation, this would save to the user's account
    toast({
      title: "Career path saved!",
      description: `The ${career.title} path has been added to your dashboard.`,
    });
    setSavedPath(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-900">{career.title}</DialogTitle>
          <DialogDescription className="text-blue-700">
            {career.description}
          </DialogDescription>
        </DialogHeader>

        <div className="mb-6">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-md font-semibold text-blue-800 mb-2">Popular Roles</h3>
              <div className="flex flex-wrap gap-2">
                {career.roles.map((role, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {role}
                  </span>
                ))}
              </div>
            </div>
            
            {career.salaryRange && (
              <div>
                <h3 className="text-md font-semibold text-blue-800 mb-2">Salary Range in India</h3>
                <div className="flex items-center">
                  <TrendingUpIcon className="h-4 w-4 text-blue-700 mr-2" />
                  <span className="text-blue-700">{career.salaryRange}</span>
                </div>
              </div>
            )}
          </div>
          
          {career.indianContext && (
            <Card className="bg-blue-50 mb-4">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <BuildingIcon className="h-5 w-5 text-blue-700 mt-0.5 mr-2" />
                  <div>
                    <h3 className="text-md font-semibold text-blue-800 mb-1">Indian Market Context</h3>
                    <p className="text-blue-700">{career.indianContext}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {career.futureOutlook && (
            <Card className="bg-yellow-50 mb-4">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <GraduationCapIcon className="h-5 w-5 text-yellow-700 mt-0.5 mr-2" />
                  <div>
                    <h3 className="text-md font-semibold text-blue-800 mb-1">Future Outlook</h3>
                    <p className="text-blue-700">{career.futureOutlook}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {career.skills && (
            <div className="mb-4">
              <h3 className="text-md font-semibold text-blue-800 mb-2">Key Skills Required</h3>
              <div className="flex flex-wrap gap-2">
                {career.skills.map((skill, idx) => (
                  <Badge key={idx} className="bg-blue-100 text-blue-800">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <Tabs defaultValue="beginner" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-4">
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
            <div className="space-y-4">
              <div className="flex items-center text-blue-900 mb-2">
                <BookIcon className="h-5 w-5 mr-2" />
                <span className="font-medium">Estimated Time: {career.timeline.beginner}</span>
              </div>
              
              <h3 className="font-medium text-blue-900">Recommended Free Resources:</h3>
              <div className="space-y-3">
                {career.roadmap.beginner.resources.map((resource, idx) => (
                  <Card key={idx} className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-blue-900">{resource.title}</h4>
                          <p className="text-sm text-blue-700">Platform: {resource.platform}</p>
                        </div>
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white"
                              asChild
                            >
                              <a href={resource.link} target="_blank" rel="noopener noreferrer">
                                Access Resource
                              </a>
                            </Button>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <div className="flex justify-between space-x-4">
                              <div className="space-y-1">
                                <h4 className="text-sm font-semibold">{resource.title}</h4>
                                <p className="text-sm">
                                  This free resource on {resource.platform} will help you build your foundational knowledge.
                                </p>
                              </div>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          
          {/* Intermediate Content */}
          <TabsContent value="intermediate">
            <div className="space-y-4">
              <div className="flex items-center text-blue-900 mb-2">
                <BookIcon className="h-5 w-5 mr-2" />
                <span className="font-medium">Estimated Time: {career.timeline.intermediate}</span>
              </div>
              
              <h3 className="font-medium text-blue-900">Recommended Free Resources:</h3>
              <div className="space-y-3">
                {career.roadmap.intermediate.resources.map((resource, idx) => (
                  <Card key={idx} className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-blue-900">{resource.title}</h4>
                          <p className="text-sm text-blue-700">Platform: {resource.platform}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white"
                          asChild
                        >
                          <a href={resource.link} target="_blank" rel="noopener noreferrer">
                            Access Resource
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          
          {/* Advanced Content */}
          <TabsContent value="advanced">
            <div className="space-y-4">
              <div className="flex items-center text-blue-900 mb-2">
                <BookIcon className="h-5 w-5 mr-2" />
                <span className="font-medium">Estimated Time: {career.timeline.advanced}</span>
              </div>
              
              <h3 className="font-medium text-blue-900">Recommended Free Resources:</h3>
              <div className="space-y-3">
                {career.roadmap.advanced.resources.map((resource, idx) => (
                  <Card key={idx} className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-blue-900">{resource.title}</h4>
                          <p className="text-sm text-blue-700">Platform: {resource.platform}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white"
                          asChild
                        >
                          <a href={resource.link} target="_blank" rel="noopener noreferrer">
                            Access Resource
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-6">
          <Button 
            onClick={handleSavePath}
            disabled={savedPath}
            className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold"
          >
            {savedPath ? "Path Saved" : "Save This Path"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CareerGuideDetail;
