
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookIcon, HistoryIcon, ArrowRightIcon } from "lucide-react";
import { CareerResult } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/toast/use-toast";

interface HistorySettingsProps {
  userId?: string;
}

export const HistorySettings = ({ userId }: HistorySettingsProps) => {
  const [careerHistory, setCareerHistory] = useState<CareerResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCareerHistory = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch career history from Supabase specifically for this user
        const { data, error } = await supabase
          .from('user_career_history')
          .select('*')
          .eq('user_id', userId)
          .order('timestamp', { ascending: false });
        
        if (error) {
          console.error("Error fetching career history:", error);
          toast({
            title: "Error loading history",
            description: "Could not load your career history. Please try again later.",
            variant: "destructive",
          });
          return;
        }
        
        if (data) {
          // Transform to match our CareerResult type
          const formattedHistory = data.map(item => ({
            career: item.career,
            reason: item.reason || '',
            timestamp: item.timestamp,
            isSelected: item.is_selected
          }));
          
          setCareerHistory(formattedHistory);
        }
      } catch (error) {
        console.error("Error in career history fetch:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCareerHistory();
  }, [userId]);

  if (!userId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Career Path History</CardTitle>
          <CardDescription>
            Please sign in to view your career history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <HistoryIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Sign in to access your history</p>
            <Button className="mt-4" asChild>
              <a href="/login">Sign In</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Career Path History</CardTitle>
        <CardDescription>
          Review your previous career quiz results and recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin h-8 w-8 border-4 border-blue-700 border-t-transparent rounded-full"></div>
          </div>
        ) : careerHistory.length > 0 ? (
          <div className="space-y-4">
            {careerHistory.map((result, index) => (
              <div key={index} className="border rounded-md p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <BookIcon className="h-5 w-5 text-blue-700" />
                  <Badge className="bg-blue-100 text-blue-800">
                    {result.career}
                  </Badge>
                  {result.isSelected && (
                    <Badge className="bg-green-100 text-green-800">Current Selection</Badge>
                  )}
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
