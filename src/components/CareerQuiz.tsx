
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookIcon, CodeIcon, UserIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface QuizProps {
  userId: string;
  onComplete: (answers: Record<string, string>) => void;
}

const CareerQuiz = ({ userId, onComplete }: QuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, string>>({
    "What are your favorite school subjects?": "",
    "What activities or hobbies do you enjoy most?": "",
    "How do you prefer learning new things?": "",
    "Do you like working alone or in a team?": "",
    "Name a job you've imagined doing, even if just once.": "",
  });

  // Verify authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast({
          title: "Authentication required",
          description: "Please log in to take the career quiz",
          variant: "destructive",
        });
        navigate("/login");
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

  const questions = [
    {
      question: "What are your favorite school subjects?",
      type: "text",
      placeholder: "E.g., Mathematics, Physics, Literature, Arts...",
      icon: <BookIcon className="h-5 w-5 text-blue-700" />,
    },
    {
      question: "What activities or hobbies do you enjoy most?",
      type: "text",
      placeholder: "E.g., Drawing, Sports, Programming, Reading...",
      icon: <UserIcon className="h-5 w-5 text-blue-700" />,
    },
    {
      question: "How do you prefer learning new things?",
      type: "radio",
      options: ["Visual learning", "Hands-on experience", "Reading books", "Watching videos"],
      icon: <BookIcon className="h-5 w-5 text-blue-700" />,
    },
    {
      question: "Do you like working alone or in a team?",
      type: "radio",
      options: ["Alone", "In a team", "Both, depending on the task", "Not sure"],
      icon: <UserIcon className="h-5 w-5 text-blue-700" />,
    },
    {
      question: "Name a job you've imagined doing, even if just once.",
      type: "textarea",
      placeholder: "Tell us about a job you've thought about doing...",
      icon: <CodeIcon className="h-5 w-5 text-blue-700" />,
    },
  ];

  const handleInputChange = (value: string) => {
    const questionText = questions[currentQuestion].question;
    setAnswers({ ...answers, [questionText]: value });
  };

  const handleNext = async () => {
    const questionText = questions[currentQuestion].question;
    
    if (!answers[questionText]) {
      toast({
        title: "Please answer the question",
        description: "We need your input to provide accurate recommendations.",
        variant: "destructive",
      });
      return;
    }

    // Store the answer in Supabase
    try {
      const { error } = await supabase
        .from('user_quiz_responses')
        .insert({
          user_id: userId,
          question: questionText,
          answer: answers[questionText]
        });
      
      if (error) {
        console.error("Error storing quiz response:", error);
        toast({
          title: "Something went wrong",
          description: "Could not save your answer. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Quiz completed
        onComplete(answers);
      }
    } catch (error) {
      console.error("Error storing answer:", error);
      toast({
        title: "Something went wrong",
        description: "Could not save your answer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const question = questions[currentQuestion];

  return (
    <Card className="bg-white shadow-md">
      <CardContent className="pt-6">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            {question.icon}
            <h3 className="text-lg font-semibold text-blue-900 ml-2">
              Question {currentQuestion + 1} of {questions.length}
            </h3>
          </div>
          <p className="text-blue-900 text-xl mb-6">{question.question}</p>

          {question.type === "text" && (
            <Input
              value={answers[question.question] || ""}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={question.placeholder}
              className="w-full"
            />
          )}

          {question.type === "textarea" && (
            <Textarea
              value={answers[question.question] || ""}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={question.placeholder}
              className="w-full"
            />
          )}

          {question.type === "radio" && (
            <RadioGroup
              value={answers[question.question] || ""}
              onValueChange={(value) => handleInputChange(value)}
              className="space-y-3"
            >
              {question.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option} className="text-blue-800">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleNext} 
            className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold"
          >
            {currentQuestion < questions.length - 1 ? (
              "Next Question"
            ) : (
              <span className="flex items-center">
                Complete
              </span>
            )}
          </Button>
        </div>

        <div className="mt-4 flex justify-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-yellow-500 h-2.5 rounded-full"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerQuiz;
