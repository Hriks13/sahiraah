import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { BookIcon, GraduationCapIcon, BriefcaseIcon, RefreshCwIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ExploreResources from "@/components/ExploreResources";

interface RecommendationsProps {
  userAnswers: Record<string, string>;
  onRetake: () => void;
}

const CareerRecommendations = ({ userAnswers, onRetake }: RecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<Array<{career: string, reason: string}>>([]);
  const [isLoading, setIsLoading] = useState(true);

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

    // Simulate processing delay
    setTimeout(() => {
      const results = analyzeResponses();
      setRecommendations(results);
      setIsLoading(false);
      
      // In production with Supabase, we would save these recommendations:
      /*
      const saveRecommendations = async () => {
        await supabase
          .from('recommendations')
          .insert({
            user_id: userId,
            career_1: results[0]?.career || "",
            career_2: results[1]?.career || "",
            career_3: results[2]?.career || "",
            generated_at: new Date().toISOString(),
          });
      };
      saveRecommendations();
      */
      console.log("Would save to recommendations table:", {
        user_id: "current-user-id",
        career_1: results[0]?.career || "",
        career_2: results[1]?.career || "",
        career_3: results[2]?.career || "",
        generated_at: new Date().toISOString(),
      });
      
    }, 1500);
  }, [userAnswers]);

  const getCareerIcon = (career: string) => {
    if (career.includes("Engineer") || career.includes("Data") || career.includes("UI/UX")) {
      return <BriefcaseIcon className="h-12 w-12 text-blue-700" />;
    } else if (career.includes("Designer") || career.includes("Creator") || career.includes("Chef")) {
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

      {/* Use the ExploreResources component */}
      <ExploreResources />
    </div>
  );
};

export default CareerRecommendations;
