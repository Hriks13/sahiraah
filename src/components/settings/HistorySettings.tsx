
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookIcon, HistoryIcon, ArrowRightIcon } from "lucide-react";
import { CareerResult } from "@/types/user";

interface HistorySettingsProps {
  userId?: string;
}

export const HistorySettings = ({ userId }: HistorySettingsProps) => {
  const [careerHistory, setCareerHistory] = useState<CareerResult[]>([]);

  useEffect(() => {
    // Load career history from local storage for the specific user
    if (userId) {
      const historyStr = localStorage.getItem(`sahiraah_career_history_${userId}`);
      if (historyStr) {
        try {
          const historyData = JSON.parse(historyStr);
          setCareerHistory(historyData);
        } catch (error) {
          console.error("Error parsing career history data:", error);
        }
      }
    }
  }, [userId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Career Path History</CardTitle>
        <CardDescription>
          Review your previous career quiz results and recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {careerHistory.length > 0 ? (
          <div className="space-y-4">
            {careerHistory.map((result, index) => (
              <div key={index} className="border rounded-md p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <BookIcon className="h-5 w-5 text-blue-700" />
                  <Badge className="bg-blue-100 text-blue-800">
                    {result.career}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <HistoryIcon className="h-4 w-4" />
                    <span>{new Date(result.timestamp).toLocaleString()}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2"
                    asChild
                  >
                    <a href="/dashboard">
                      View Details <ArrowRightIcon className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
                {result.reason && (
                  <p className="text-sm text-gray-600 mt-2">{result.reason}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <HistoryIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No previous quiz results found.</p>
            <p className="text-sm text-gray-400">Take the career quiz to see your results here.</p>
            <Button className="mt-4" asChild>
              <a href="/dashboard">Take Career Quiz</a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
