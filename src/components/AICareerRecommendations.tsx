
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { SparklesIcon, BrainCogIcon, FileTextIcon, TrendingUpIcon, RocketIcon, CheckCircleIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AIRecommendationsProps {
  recommendations: any;
  userId: string;
  onRetake: () => void;
}

const AICareerRecommendations = ({ recommendations, userId, onRetake }: AIRecommendationsProps) => {
  const [selectedCareer, setSelectedCareer] = useState<any>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [savedCareers, setSavedCareers] = useState<Set<string>>(new Set());

  const handleGenerateDetailedReport = async (career: any) => {
    setGeneratingReport(true);
    try {
      toast({
        title: "Generating AI Report",
        description: "Creating your personalized career guidance report...",
      });

      // Get user's quiz responses for report generation
      const { data: responses } = await supabase
        .from('user_quiz_responses')
        .select('question, answer')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      const studentResponses = responses?.reduce((acc, response) => {
        acc[response.question] = response.answer;
        return acc;
      }, {} as Record<string, string>) || {};

      const { data, error } = await supabase.functions.invoke('ai-career-guidance', {
        body: {
          action: 'generate_career_report',
          data: {
            careerData: career,
            studentResponses,
            studentName: studentResponses["What's your name?"] || "Student"
          },
          userId
        }
      });

      if (error) throw error;

      setReportData(data);
      setSelectedCareer(career);
      
      toast({
        title: "Report Generated!",
        description: "Your AI-powered career report is ready for review.",
        duration: 5000,
      });
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Report Generation Failed",
        description: "Unable to generate detailed report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleSaveCareer = async (career: any) => {
    try {
      // Update the career as selected in the database
      await supabase
        .from('user_career_history')
        .update({ is_selected: true })
        .eq('user_id', userId)
        .eq('career', career.title);

      setSavedCareers(prev => new Set([...prev, career.title]));
      
      toast({
        title: "Career Path Saved!",
        description: `${career.title} has been saved to your profile.`,
      });
    } catch (error) {
      console.error("Error saving career:", error);
      toast({
        title: "Save Failed",
        description: "Unable to save career path. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (reportData && selectedCareer) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-blue-900 flex items-center">
              <FileTextIcon className="h-8 w-8 text-purple-600 mr-3" />
              AI Career Report: {selectedCareer.title}
            </h2>
            <p className="text-purple-700 mt-2">Comprehensive AI-generated career guidance</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setReportData(null);
              setSelectedCareer(null);
            }}
            className="border-purple-600 text-purple-700"
          >
            Back to Recommendations
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Executive Summary */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-900 flex items-center">
                <SparklesIcon className="h-5 w-5 mr-2" />
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-800 leading-relaxed">{reportData.executiveSummary}</p>
            </CardContent>
          </Card>

          {/* Match Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center">
                <TrendingUpIcon className="h-5 w-5 mr-2" />
                Career Match Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-800 font-medium">Match Score</span>
                  <span className="text-2xl font-bold text-green-600">{reportData.matchAnalysis.score}%</span>
                </div>
                <Progress value={reportData.matchAnalysis.score} className="h-3" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">Your Strengths</h4>
                  <ul className="space-y-1">
                    {reportData.matchAnalysis.strengths.map((strength: string, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-green-800">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">Areas for Development</h4>
                  <ul className="space-y-1">
                    {reportData.matchAnalysis.improvements.map((improvement: string, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <TrendingUpIcon className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-blue-800">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Roadmap */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center">
                <RocketIcon className="h-5 w-5 mr-2" />
                AI-Curated Learning Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="phase1" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="phase1">Phase 1</TabsTrigger>
                  <TabsTrigger value="phase2">Phase 2</TabsTrigger>
                  <TabsTrigger value="phase3">Phase 3</TabsTrigger>
                </TabsList>
                {Object.entries(reportData.learningRoadmap).map(([phase, data]: [string, any]) => (
                  <TabsContent key={phase} value={phase}>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-purple-900">{data.title}</h3>
                      
                      <div>
                        <h4 className="font-medium text-blue-800 mb-2">Skills to Develop:</h4>
                        <div className="flex flex-wrap gap-2">
                          {data.skills.map((skill: string, idx: number) => (
                            <Badge key={idx} className="bg-purple-100 text-purple-800">{skill}</Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-blue-800 mb-2">Recommended Resources:</h4>
                        <ul className="space-y-2">
                          {data.resources.map((resource: string, idx: number) => (
                            <li key={idx} className="flex items-center">
                              <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                              <span className="text-blue-700">{resource}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Market Outlook */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-900">Market Outlook & Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800 leading-relaxed">{reportData.marketOutlook}</p>
            </CardContent>
          </Card>

          {/* Action Plan */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-900 flex items-center">
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Your Personalized Action Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="3months" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="3months">Next 3 Months</TabsTrigger>
                  <TabsTrigger value="6months">Next 6 Months</TabsTrigger>
                  <TabsTrigger value="12months">Next 12 Months</TabsTrigger>
                </TabsList>
                <TabsContent value="3months">
                  <ul className="space-y-2">
                    {reportData.actionPlan.next3Months.map((action: string, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                        <span className="text-green-800">{action}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="6months">
                  <ul className="space-y-2">
                    {reportData.actionPlan.next6Months.map((action: string, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                        <span className="text-green-800">{action}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="12months">
                  <ul className="space-y-2">
                    {reportData.actionPlan.next12Months.map((action: string, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                        <span className="text-green-800">{action}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <BrainCogIcon className="h-8 w-8 text-purple-600 mr-2" />
          <h2 className="text-3xl font-bold text-blue-900">AI-Powered Career Recommendations</h2>
        </div>
        <p className="text-purple-700 text-lg max-w-2xl mx-auto">
          Our AI has analyzed your unique profile and generated personalized career paths with detailed insights.
        </p>
      </div>

      <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <h3 className="font-semibold text-purple-900 mb-2">AI Analysis Summary</h3>
        <p className="text-purple-800">{recommendations.overallAnalysis}</p>
      </div>

      <div className="grid gap-6">
        {recommendations.recommendations.map((career: any, index: number) => (
          <Card key={index} className="bg-white shadow-lg border border-purple-100 hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-blue-900 flex items-center">
                    <SparklesIcon className="h-5 w-5 text-purple-600 mr-2" />
                    {career.title}
                  </CardTitle>
                  <div className="flex items-center mt-2">
                    <Badge className="bg-green-100 text-green-800 mr-2">
                      {career.matchPercentage}% AI Match
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-800">
                      {career.salaryRange}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGenerateDetailedReport(career)}
                    disabled={generatingReport}
                    className="border-purple-600 text-purple-700 hover:bg-purple-600 hover:text-white"
                  >
                    <FileTextIcon className="h-4 w-4 mr-1" />
                    {generatingReport ? "Generating..." : "AI Report"}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleSaveCareer(career)}
                    disabled={savedCareers.has(career.title)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {savedCareers.has(career.title) ? (
                      <>
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Saved
                      </>
                    ) : (
                      "Save Path"
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-blue-700 mb-4 text-base">
                {career.description}
              </CardDescription>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-purple-900 mb-2">AI Analysis - Why This Matches You:</h4>
                  <ul className="space-y-1">
                    {career.reasons.map((reason: string, idx: number) => (
                      <li key={idx} className="flex items-start text-blue-800">
                        <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Skills to Develop:</h4>
                    <div className="flex flex-wrap gap-1">
                      {career.skillsRequired.slice(0, 4).map((skill: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Next Steps:</h4>
                    <div className="space-y-1">
                      {career.nextSteps.slice(0, 2).map((step: string, idx: number) => (
                        <p key={idx} className="text-sm text-blue-700">• {step}</p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-1">Industry Insights:</h4>
                  <p className="text-blue-800 text-sm">{career.industryInsights}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8">
        <Button
          variant="outline"
          onClick={onRetake}
          className="border-purple-600 text-purple-700 hover:bg-purple-600 hover:text-white"
        >
          <RocketIcon className="h-4 w-4 mr-2" />
          Take Assessment Again
        </Button>
      </div>
    </div>
  );
};

export default AICareerRecommendations;
