import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardListIcon, BrainIcon } from "lucide-react";
import CareerQuiz from "./CareerQuiz";
import GeminiCareerQuiz from "./GeminiCareerQuiz";
import CareerRecommendationsAI from "./CareerRecommendationsAI";
import GeminiCareerReport from "./GeminiCareerReport";

interface Props {
  userId: string;
  onComplete: (sessionId: string) => void;
}

const CareerQuizMenu = ({ userId, onComplete }: Props) => {
  const [view, setView] = useState<"menu" | "quiz" | "ai-quiz" | "gemini-quiz" | "recommendations" | "gemini-report">("menu");
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const handleQuizComplete = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setView("recommendations");
  };

  const handleGeminiQuizComplete = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setView("gemini-report");
  };

  if (view === "quiz") {
    return <CareerQuiz userId={userId} onComplete={handleQuizComplete} />;
  }

  if (view === "ai-quiz") {
    return <CareerQuiz userId={userId} onComplete={handleQuizComplete} />;
  }

  if (view === "gemini-quiz") {
    return <GeminiCareerQuiz onComplete={handleGeminiQuizComplete} onBack={() => setView("menu")} />;
  }

  if (view === "recommendations" && currentSessionId) {
    return <CareerRecommendationsAI sessionId={currentSessionId} onRetake={() => setView("menu")} />;
  }

  if (view === "gemini-report" && currentSessionId) {
    return <GeminiCareerReport sessionId={currentSessionId} onRetake={() => setView("menu")} />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Choose Your Assessment Type</CardTitle>
          <CardDescription>
            Select the career assessment that best fits your preferences
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setView("quiz")}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClipboardListIcon className="mr-2 h-6 w-6 text-blue-600" />
              Traditional Assessment
            </CardTitle>
            <CardDescription>
              Take our comprehensive career assessment with structured questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 25 carefully crafted questions</li>
              <li>• Multiple choice format</li>
              <li>• Comprehensive skill analysis</li>
              <li>• Detailed career roadmap</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setView("ai-quiz")}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BrainIcon className="mr-2 h-6 w-6 text-purple-600" />
              AI-Powered Assessment
            </CardTitle>
            <CardDescription>
              Experience our advanced AI-driven career guidance system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Adaptive questioning system</li>
              <li>• Personalized recommendations</li>
              <li>• Advanced AI analysis</li>
              <li>• Interactive experience</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-green-200 bg-green-50" onClick={() => setView("gemini-quiz")}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BrainIcon className="mr-2 h-6 w-6 text-green-600" />
              Smart Tree Assessment
              <Badge className="ml-2 bg-green-600">NEW</Badge>
            </CardTitle>
            <CardDescription>
              Dynamic tree-based questions that adapt to your interests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Up to 15 branching questions</li>
              <li>• Questions adapt to your answers</li>
              <li>• 5 tailored career matches</li>
              <li>• Free courses by skill level</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CareerQuizMenu;