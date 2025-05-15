
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { BookIcon, GraduationCapIcon, BriefcaseIcon, ArrowRightIcon, RefreshCwIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RecommendationsProps {
  userAnswers: Record<string, string>;
  onRetake: () => void;
}

const CareerRecommendations = ({ userAnswers, onRetake }: RecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<Array<{career: string, reason: string}>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would be an API call to OpenAI or another AI service
    const mockAnalyzeResponses = () => {
      const subjects = userAnswers["What are your favorite subjects in school?"].toLowerCase();
      const problems = userAnswers["What kind of problems do you enjoy solving?"].toLowerCase();
      const workType = userAnswers["What type of work excites you?"].toLowerCase();
      const learningStyle = userAnswers["How do you prefer to learn?"].toLowerCase();
      
      // Simple rule-based logic (would be replaced by AI in production)
      let suggestedCareers = [];
      
      if ((subjects.includes("math") || subjects.includes("physics")) && 
          (problems.includes("logical") || problems.includes("puzzle"))) {
        suggestedCareers.push({
          career: "Software Developer",
          reason: "Your interest in math and logical problem-solving aligns well with programming."
        });
      }
      
      if ((subjects.includes("art") || subjects.includes("design")) && 
          (workType.includes("creative"))) {
        suggestedCareers.push({
          career: "Graphic Designer",
          reason: "Your creative interests and artistic subjects suggest you might enjoy visual design work."
        });
      }
      
      if ((subjects.includes("psychology") || subjects.includes("sociology")) || 
          (workType.includes("helping others"))) {
        suggestedCareers.push({
          career: "Psychologist",
          reason: "Your interest in helping others and understanding human behavior points to counseling roles."
        });
      }
      
      if ((subjects.includes("biology") || subjects.includes("chemistry")) && 
          (workType.includes("helping") || workType.includes("outdoors"))) {
        suggestedCareers.push({
          career: "Healthcare Professional",
          reason: "Your science interests combined with a desire to help others is perfect for healthcare."
        });
      }
      
      if (workType.includes("outdoor") || subjects.includes("environmental")) {
        suggestedCareers.push({
          career: "Environmental Scientist",
          reason: "Your preference for outdoor work and interest in environmental topics align with this field."
        });
      }
      
      if (subjects.includes("english") || subjects.includes("literature")) {
        suggestedCareers.push({
          career: "Content Writer",
          reason: "Your language arts background suggests you might excel in professional writing."
        });
      }

      // If we couldn't match anything specific or need more recommendations
      if (suggestedCareers.length < 3) {
        const defaultOptions = [
          {
            career: "Project Manager",
            reason: "A versatile role that combines organization, communication, and problem-solving skills."
          },
          {
            career: "Digital Marketer",
            reason: "Combines creativity, technology, and strategic thinking for business growth."
          },
          {
            career: "Data Analyst",
            reason: "Uses technical and analytical skills to derive insights from information."
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

    // Simulate API delay
    setTimeout(() => {
      const results = mockAnalyzeResponses();
      setRecommendations(results);
      setIsLoading(false);
      
      // In production with Supabase, we would save these recommendations:
      /*
      const saveRecommendations = async () => {
        for (const rec of results) {
          await supabase
            .from('recommendations')
            .insert({
              user_id: userId,
              career_path: rec.career,
              score: Math.random() * 100, // Some score metric from AI
              generated_at: new Date().toISOString(),
            });
        }
      };
      saveRecommendations();
      */
    }, 1500);
  }, [userAnswers]);

  const getCareerIcon = (career: string) => {
    if (career.includes("Developer") || career.includes("Analyst")) {
      return <BriefcaseIcon className="h-12 w-12 text-blue-700" />;
    } else if (career.includes("Designer") || career.includes("Writer")) {
      return <BookIcon className="h-12 w-12 text-blue-700" />;
    } else {
      return <GraduationCapIcon className="h-12 w-12 text-blue-700" />;
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
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow p-6 mb-6">
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
        <p className="text-blue-700 mb-6">
          Based on your answers, we've identified these career paths that match your interests and strengths:
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {recommendations.map((rec, index) => (
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-blue-900 mb-6">Explore Resources</h2>
        <p className="text-blue-700 mb-6">
          Based on your interests and strengths, here are some career resources:
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-white shadow-md">
            <CardHeader>
              <CardTitle className="text-blue-900">Career Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700">Explore in-depth information about various career paths and industries.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white w-full flex justify-between">
                Browse Guides
                <ArrowRightIcon className="h-4 w-4" />
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
              <Button variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white w-full flex justify-between">
                Discover Courses
                <ArrowRightIcon className="h-4 w-4" />
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
              <Button variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white w-full flex justify-between">
                Coming Soon
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CareerRecommendations;
