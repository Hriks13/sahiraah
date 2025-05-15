
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PencilIcon, FileTextIcon, CheckIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface QuizProps {
  userId: string;
  onComplete: (answers: Record<string, string>) => void;
}

const CareerQuiz = ({ userId, onComplete }: QuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { toast } = useToast();
  const [answers, setAnswers] = useState<Record<string, string>>({
    "What are your favorite subjects in school?": "",
    "What kind of problems do you enjoy solving?": "",
    "What type of work excites you?": "",
    "How do you prefer to learn?": "",
    "Which careers have you ever thought about, even briefly?": "",
  });

  const questions = [
    {
      question: "What are your favorite subjects in school?",
      type: "text",
      placeholder: "E.g., Mathematics, Physics, Literature, Arts...",
      icon: <FileTextIcon className="h-5 w-5 text-blue-700" />,
    },
    {
      question: "What kind of problems do you enjoy solving?",
      type: "text",
      placeholder: "E.g., Logical puzzles, Creative challenges, People problems...",
      icon: <PencilIcon className="h-5 w-5 text-blue-700" />,
    },
    {
      question: "What type of work excites you?",
      type: "radio",
      options: ["Working outdoors", "Computer-based work", "Helping others", "Creative work"],
      icon: <FileTextIcon className="h-5 w-5 text-blue-700" />,
    },
    {
      question: "How do you prefer to learn?",
      type: "radio",
      options: ["Visual learning", "Hands-on experience", "Reading books", "Watching videos"],
      icon: <FileTextIcon className="h-5 w-5 text-blue-700" />,
    },
    {
      question: "Which careers have you ever thought about, even briefly?",
      type: "textarea",
      placeholder: "List any careers you've considered, even briefly...",
      icon: <PencilIcon className="h-5 w-5 text-blue-700" />,
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

    // Store the answer in "database" (would be Supabase in real implementation)
    try {
      // Mock storing in Supabase
      console.log("Storing answer:", {
        user_id: userId,
        question: questionText,
        answer: answers[questionText],
        timestamp: new Date().toISOString(),
      });

      // In a real implementation with Supabase:
      /*
      await supabase
        .from('responses')
        .insert({
          user_id: userId,
          question: questionText,
          answer: answers[questionText],
          timestamp: new Date().toISOString(),
        });
      */

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
                Complete <CheckIcon className="ml-1 h-4 w-4" />
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
