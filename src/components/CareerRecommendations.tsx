
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { BookIcon, GraduationCapIcon, BriefcaseIcon, RefreshCwIcon, ArrowRightIcon, CheckCircleIcon, TrendingUpIcon, LightbulbIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdBanner from "@/components/AdBanner";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface RecommendationsProps {
  userAnswers: Record<string, string>;
  onRetake: () => void;
}

const CareerRecommendations = ({ userAnswers, onRetake }: RecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<Array<{career: string, reason: string}>>([]);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [areasToImprove, setAreasToImprove] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCareer, setSelectedCareer] = useState<number | null>(null);
  const [careerRoadmaps, setCareerRoadmaps] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("student");
  const [educationLevel, setEducationLevel] = useState<string>("");

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast({
          title: "Authentication required",
          description: "Please log in to view career recommendations",
          variant: "destructive",
        });
        navigate("/login");
      } else {
        setUserId(data.session.user.id);
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

  useEffect(() => {
    // Extract name and education level
    if (userAnswers["What's your name?"]) {
      setUserName(userAnswers["What's your name?"]);
    }
    
    if (userAnswers["What is your current education level?"]) {
      setEducationLevel(userAnswers["What is your current education level?"]);
    }

    // Rule-based career recommendation logic with Indian context focus
    const analyzeResponses = () => {
      // Initialize scoring for different career categories
      const scores: Record<string, number> = {
        technology: 0,
        design: 0,
        data: 0,
        science: 0,
        business: 0,
        healthcare: 0,
        sustainability: 0,
        research: 0,
        creativity: 0
      };
      
      // Parse strengths and improvement areas
      const identifiedStrengths: string[] = [];
      const improvementAreas: string[] = [];
      
      // Analyze subject preferences
      const subjects = (userAnswers["Which subjects do you enjoy the most in school?"] || "").toLowerCase();
      
      if (subjects.includes("math") || subjects.includes("maths") || subjects.includes("mathematics")) {
        scores.technology += 2;
        scores.data += 3;
        scores.science += 1;
        identifiedStrengths.push("Numerical reasoning");
      }
      
      if (subjects.includes("science") || subjects.includes("physics") || subjects.includes("chemistry")) {
        scores.science += 3;
        scores.healthcare += 2;
        scores.research += 2;
        identifiedStrengths.push("Scientific thinking");
      }
      
      if (subjects.includes("biology")) {
        scores.healthcare += 3;
        scores.sustainability += 2;
        scores.research += 1;
      }
      
      if (subjects.includes("computer") || subjects.includes("programming") || subjects.includes("informatics")) {
        scores.technology += 4;
        scores.data += 2;
        identifiedStrengths.push("Technical aptitude");
      }
      
      if (subjects.includes("art") || subjects.includes("design")) {
        scores.design += 3;
        scores.creativity += 3;
        identifiedStrengths.push("Visual creativity");
      }
      
      if (subjects.includes("social") || subjects.includes("economics") || subjects.includes("business")) {
        scores.business += 3;
        scores.sustainability += 1;
      }
      
      // Analyze preferred medium
      const medium = userAnswers["Do you prefer working with numbers, words, or visuals?"] || "";
      
      if (medium.includes("Numbers")) {
        scores.data += 2;
        scores.technology += 1;
        scores.science += 1;
      }
      
      if (medium.includes("Words")) {
        scores.business += 1;
        scores.research += 2;
      }
      
      if (medium.includes("Visuals")) {
        scores.design += 3;
        scores.creativity += 2;
      }
      
      // Analyze problem-solving approach
      const problemSolving = userAnswers["How do you approach solving complex problems?"] || "";
      
      if (problemSolving.includes("Break down")) {
        scores.technology += 2;
        scores.data += 1;
        identifiedStrengths.push("Structured problem-solving");
      }
      
      if (problemSolving.includes("patterns")) {
        scores.data += 3;
        scores.research += 2;
        identifiedStrengths.push("Pattern recognition");
      }
      
      if (problemSolving.includes("creative")) {
        scores.design += 2;
        scores.creativity += 3;
        identifiedStrengths.push("Creative problem-solving");
      }
      
      if (problemSolving.includes("collaborate")) {
        scores.business += 2;
        scores.healthcare += 1;
        identifiedStrengths.push("Collaborative approach");
      }
      
      // Analyze hobbies
      const hobbies = (userAnswers["What activities or hobbies do you enjoy in your free time?"] || "").toLowerCase();
      
      if (hobbies.includes("coding") || hobbies.includes("programming") || hobbies.includes("tech")) {
        scores.technology += 3;
        identifiedStrengths.push("Technical interest");
      }
      
      if (hobbies.includes("reading") || hobbies.includes("writing")) {
        scores.research += 1;
        scores.business += 1;
      }
      
      if (hobbies.includes("art") || hobbies.includes("drawing") || hobbies.includes("design") || 
          hobbies.includes("craft") || hobbies.includes("music")) {
        scores.design += 2;
        scores.creativity += 3;
        identifiedStrengths.push("Creative expression");
      }
      
      if (hobbies.includes("sports") || hobbies.includes("outdoor") || hobbies.includes("adventure")) {
        scores.sustainability += 1;
      }
      
      if (hobbies.includes("experiment") || hobbies.includes("research") || hobbies.includes("explore")) {
        scores.science += 2;
        scores.research += 2;
        identifiedStrengths.push("Curiosity");
      }
      
      // Analyze learning preferences
      const learning = userAnswers["How do you prefer learning new things?"] || "";
      
      if (learning.includes("Visual")) {
        scores.design += 1;
      }
      
      if (learning.includes("Hands-on")) {
        scores.technology += 1;
        scores.healthcare += 1;
        identifiedStrengths.push("Practical learning");
      }
      
      if (learning.includes("Reading")) {
        scores.research += 1;
      }
      
      // Analyze project preferences
      const projects = userAnswers["What kind of projects excite you the most?"] || "";
      
      if (projects.includes("Technology and coding")) {
        scores.technology += 3;
        scores.data += 1;
      }
      
      if (projects.includes("Creative and design")) {
        scores.design += 3;
        scores.creativity += 2;
      }
      
      if (projects.includes("Research and analysis")) {
        scores.research += 3;
        scores.data += 2;
        scores.science += 1;
      }
      
      if (projects.includes("Social and community")) {
        scores.sustainability += 2;
        scores.healthcare += 1;
        scores.business += 1;
      }
      
      // Analyze team role
      const teamRole = userAnswers["When working in a team, what role do you usually take?"] || "";
      
      if (teamRole.includes("Leader")) {
        scores.business += 2;
        identifiedStrengths.push("Leadership");
      }
      
      if (teamRole.includes("Creative")) {
        scores.design += 1;
        scores.creativity += 2;
      }
      
      if (teamRole.includes("Organizer")) {
        scores.business += 1;
        scores.data += 1;
        identifiedStrengths.push("Organizational skills");
      }
      
      if (teamRole.includes("Technical")) {
        scores.technology += 2;
        scores.science += 1;
        identifiedStrengths.push("Technical expertise");
      }
      
      // Analyze tech enthusiasm
      const techAttitude = userAnswers["How do you feel about learning new technologies?"] || "";
      
      if (techAttitude.includes("Very excited")) {
        scores.technology += 3;
        identifiedStrengths.push("Tech enthusiasm");
      } else if (techAttitude.includes("Comfortable")) {
        scores.technology += 2;
      } else if (techAttitude.includes("Hesitant")) {
        improvementAreas.push("Technology adaptability");
      }
      
      // Analyze logical reasoning based on sequence question
      const logicalAnswer = userAnswers["If you had to solve this sequence: 2, 6, 12, 20, ?, what would be the next number?"] || "";
      
      if (logicalAnswer === "30") {
        scores.data += 2;
        scores.technology += 1;
        scores.research += 1;
        identifiedStrengths.push("Logical reasoning");
      } else {
        improvementAreas.push("Mathematical pattern recognition");
      }
      
      // Analyze tech interests if any
      const techInterests = userAnswers["Which specific tech area would you like to explore further?"] || "";
      
      if (techInterests.includes("Web/Mobile")) {
        scores.technology += 3;
      }
      
      if (techInterests.includes("Data Science")) {
        scores.data += 3;
      }
      
      if (techInterests.includes("Cybersecurity")) {
        scores.technology += 2;
      }
      
      if (techInterests.includes("AI/Machine Learning")) {
        scores.technology += 2;
        scores.data += 2;
      }
      
      if (techInterests.includes("Game")) {
        scores.technology += 1;
        scores.design += 1;
        scores.creativity += 1;
      }
      
      if (techInterests.includes("IoT")) {
        scores.technology += 2;
        scores.science += 1;
      }
      
      // Analyze innovation interests
      const innovations = userAnswers["What technological innovations interest you the most?"] || "";
      
      if (innovations.includes("Artificial Intelligence")) {
        scores.technology += 2;
        scores.data += 2;
      }
      
      if (innovations.includes("Renewable Energy")) {
        scores.sustainability += 3;
        scores.science += 1;
      }
      
      if (innovations.includes("Robotics")) {
        scores.technology += 2;
        scores.science += 1;
      }
      
      if (innovations.includes("Healthcare")) {
        scores.healthcare += 3;
        scores.science += 1;
      }
      
      if (innovations.includes("Space")) {
        scores.science += 3;
        scores.research += 2;
      }
      
      // Analyze communication skills
      const communication = userAnswers["How comfortable are you with expressing ideas through writing or speaking?"] || "";
      
      if (communication.includes("Very comfortable")) {
        scores.business += 2;
        identifiedStrengths.push("Communication skills");
      } else if (communication.includes("developing")) {
        improvementAreas.push("Communication skills");
      }
      
      // Analyze growth mindset
      const setbackResponse = userAnswers["When you encounter a setback, how do you typically respond?"] || "";
      
      if (setbackResponse.includes("learning opportunity")) {
        identifiedStrengths.push("Growth mindset");
      } else if (setbackResponse.includes("switch to something else")) {
        improvementAreas.push("Resilience and persistence");
      }
      
      // Analyze strengths from self-assessment
      const selfAssessedStrengths = (userAnswers["What aspects of your studies or hobbies do others often praise you for?"] || "").toLowerCase();
      
      if (selfAssessedStrengths.includes("creativ")) {
        scores.design += 1;
        scores.creativity += 2;
        if (!identifiedStrengths.includes("Creativity")) {
          identifiedStrengths.push("Creativity");
        }
      }
      
      if (selfAssessedStrengths.includes("problem") && selfAssessedStrengths.includes("solv")) {
        scores.technology += 1;
        scores.research += 1;
        if (!identifiedStrengths.includes("Problem-solving")) {
          identifiedStrengths.push("Problem-solving");
        }
      }
      
      if (selfAssessedStrengths.includes("detail")) {
        scores.data += 1;
        scores.healthcare += 1;
        identifiedStrengths.push("Attention to detail");
      }
      
      // Analyze career values
      const careerValues = userAnswers["What kind of career would you find most meaningful?"] || "";
      
      if (careerValues.includes("technical")) {
        scores.technology += 2;
        scores.science += 1;
      }
      
      if (careerValues.includes("innovative")) {
        scores.technology += 1;
        scores.design += 2;
        scores.creativity += 1;
      }
      
      if (careerValues.includes("helping")) {
        scores.healthcare += 2;
        scores.sustainability += 1;
      }
      
      if (careerValues.includes("sustainable")) {
        scores.sustainability += 3;
        scores.science += 1;
      }
      
      if (careerValues.includes("leading")) {
        scores.business += 3;
      }
      
      // Find top scoring categories
      let topCategories = Object.entries(scores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(entry => entry[0]);
      
      // Map categories to specific careers with India-focused considerations
      const careerMappings: Record<string, {career: string, reason: string}[]> = {
        technology: [
          { 
            career: "AI Engineer", 
            reason: "Your analytical skills and interest in technology make you well-suited for developing artificial intelligence solutions, a rapidly growing field in India's tech industry."
          },
          {
            career: "Mobile App Developer",
            reason: "Your creative problem-solving and technical aptitude would be valuable in India's booming mobile app development sector."
          },
          {
            career: "Blockchain Developer",
            reason: "Your logical thinking and interest in emerging technologies align with India's growing blockchain ecosystem."
          }
        ],
        data: [
          {
            career: "Data Scientist",
            reason: "Your strong numerical skills and pattern recognition abilities are perfect for extracting insights from India's rapidly growing data ecosystem."
          },
          {
            career: "Business Intelligence Analyst",
            reason: "Your analytical thinking and problem-solving approach would help Indian businesses make data-driven decisions."
          }
        ],
        design: [
          {
            career: "UX/UI Designer",
            reason: "Your creative skills and visual thinking would help create user-friendly digital experiences for India's diverse population."
          },
          {
            career: "Augmented Reality Designer",
            reason: "Your visual creativity and interest in technology align with India's growing AR/VR industry."
          }
        ],
        science: [
          {
            career: "Biotechnology Researcher",
            reason: "Your scientific thinking and analytical skills could contribute to India's growing biotech industry."
          },
          {
            career: "Robotics Engineer",
            reason: "Your interest in science and problem-solving approach would be valuable in developing automation solutions for Indian industries."
          }
        ],
        business: [
          {
            career: "Product Manager",
            reason: "Your leadership skills and strategic thinking would be valuable in guiding tech product development in India's startup ecosystem."
          },
          {
            career: "Digital Marketing Strategist",
            reason: "Your communication skills and business understanding would help Indian brands grow in the digital space."
          }
        ],
        healthcare: [
          {
            career: "Health Informatics Specialist",
            reason: "Your interest in healthcare combined with technical skills could improve India's health data systems."
          },
          {
            career: "Telemedicine Coordinator",
            reason: "Your healthcare interest and technology comfort would help expand healthcare access across India's diverse geography."
          }
        ],
        sustainability: [
          {
            career: "Renewable Energy Consultant",
            reason: "Your interest in sustainability aligns with India's ambitious renewable energy goals."
          },
          {
            career: "Smart City Planner",
            reason: "Your sustainability focus and problem-solving approach would be valuable for India's smart city initiatives."
          }
        ],
        research: [
          {
            career: "Machine Learning Researcher",
            reason: "Your analytical skills and pattern recognition would help advance AI research in India's growing tech research ecosystem."
          },
          {
            career: "Space Technology Researcher",
            reason: "Your scientific aptitude and curiosity align with India's expanding space program and satellite technology sector."
          }
        ],
        creativity: [
          {
            career: "Digital Content Creator",
            reason: "Your creative skills would be valuable in India's rapidly growing digital media landscape."
          },
          {
            career: "Game Designer",
            reason: "Your creativity and interest in technology align with India's emerging game development industry."
          }
        ]
      };
      
      // Select top 1-2 careers based on highest scoring categories
      let suggestedCareers: {career: string, reason: string}[] = [];
      
      // Ensure we get 1-2 unique careers from top categories
      for (const category of topCategories) {
        if (careerMappings[category] && suggestedCareers.length < 2) {
          // Get the first mapping that isn't already in suggested careers
          const newCareer = careerMappings[category][0];
          if (!suggestedCareers.some(c => c.career === newCareer.career)) {
            suggestedCareers.push(newCareer);
          } else if (careerMappings[category].length > 1) {
            // Try the second option if first was already selected
            const alternateCareer = careerMappings[category][1];
            if (!suggestedCareers.some(c => c.career === alternateCareer.career)) {
              suggestedCareers.push(alternateCareer);
            }
          }
        }
        
        // Break if we have enough careers
        if (suggestedCareers.length >= 2) {
          break;
        }
      }
      
      // Set strengths and improvement areas
      setStrengths(identifiedStrengths);
      setAreasToImprove(improvementAreas);
      
      return suggestedCareers;
    };

    // Define roadmaps for each career with Indian context
    const defineRoadmaps = (careers: Array<{career: string, reason: string}>) => {
      return careers.map(item => {
        let roadmap = {
          beginner: { 
            skills: [],
            courses: []
          },
          intermediate: {
            skills: [],
            courses: []
          },
          advanced: {
            skills: [],
            courses: []
          },
          timeline: {}
        };

        switch (item.career) {
          case "AI Engineer":
            roadmap = {
              beginner: {
                skills: ["Python Programming", "Mathematics Basics", "Data Structures"],
                courses: [
                  { title: "Python for Everybody", link: "https://www.coursera.org/specializations/python", platform: "Coursera" },
                  { title: "Mathematics for Machine Learning", link: "https://nptel.ac.in/courses/106/105/106105151/", platform: "NPTEL" },
                  { title: "Data Structures and Algorithms", link: "https://www.youtube.com/playlist?list=PLqM7alHXFySEQDk2MDfbwEdjd2svVJH9p", platform: "YouTube" }
                ]
              },
              intermediate: {
                skills: ["Machine Learning Basics", "Deep Learning Fundamentals", "Neural Networks"],
                courses: [
                  { title: "Machine Learning", link: "https://nptel.ac.in/courses/106/105/106105152/", platform: "NPTEL" },
                  { title: "Deep Learning Specialization", link: "https://www.youtube.com/playlist?list=PLkDaE6sCZn6Ec-XTbcX1uRg2_u4xOEky0", platform: "YouTube (Andrew Ng)" },
                  { title: "TensorFlow in Practice", link: "https://www.coursera.org/professional-certificates/tensorflow-in-practice", platform: "Coursera" }
                ]
              },
              advanced: {
                skills: ["Natural Language Processing", "Computer Vision", "Reinforcement Learning"],
                courses: [
                  { title: "NLP Specialization", link: "https://www.coursera.org/specializations/natural-language-processing", platform: "Coursera" },
                  { title: "Computer Vision", link: "https://nptel.ac.in/courses/106/105/106105216/", platform: "NPTEL" },
                  { title: "Reinforcement Learning", link: "https://www.youtube.com/playlist?list=PLqYmG7hTraZBKeNJ-JE_eyJHZ7XgBoAyb", platform: "YouTube" }
                ]
              },
              timeline: {
                beginner: "3-4 months",
                intermediate: "5-6 months",
                advanced: "6+ months"
              }
            };
            break;
          
          case "Data Scientist":
            roadmap = {
              beginner: {
                skills: ["Python Basics", "Statistics", "Data Visualization"],
                courses: [
                  { title: "Python for Data Science", link: "https://nptel.ac.in/courses/106/105/106105152/", platform: "NPTEL" },
                  { title: "Statistics for Data Science", link: "https://www.youtube.com/playlist?list=PLEYFrRJGDV6bCv_n0T9yztQcrFbIvw_Rm", platform: "YouTube" },
                  { title: "Data Visualization with Python", link: "https://www.coursera.org/learn/python-for-data-visualization", platform: "Coursera" }
                ]
              },
              intermediate: {
                skills: ["Machine Learning", "SQL & Database", "Feature Engineering"],
                courses: [
                  { title: "Machine Learning by Andrew Ng", link: "https://www.coursera.org/learn/machine-learning", platform: "Coursera" },
                  { title: "Database Management", link: "https://nptel.ac.in/courses/106/105/106105175/", platform: "NPTEL" },
                  { title: "Feature Engineering", link: "https://www.youtube.com/playlist?list=PLEYFrRJGDV6bCv_n0T9yztQcrFbIvw_Rm", platform: "YouTube" }
                ]
              },
              advanced: {
                skills: ["Deep Learning", "Big Data Tools", "MLOps"],
                courses: [
                  { title: "Deep Learning Specialization", link: "https://www.coursera.org/specializations/deep-learning", platform: "Coursera" },
                  { title: "Big Data Analytics", link: "https://nptel.ac.in/courses/106/105/106105182/", platform: "NPTEL" },
                  { title: "MLOps Specialization", link: "https://www.coursera.org/specializations/mlops-machine-learning-duke", platform: "Coursera" }
                ]
              },
              timeline: {
                beginner: "3 months",
                intermediate: "6 months",
                advanced: "8+ months"
              }
            };
            break;

          case "UX/UI Designer":
            roadmap = {
              beginner: {
                skills: ["Design Fundamentals", "Color Theory", "Typography", "Figma Basics"],
                courses: [
                  { title: "UI/UX Design Foundations", link: "https://www.youtube.com/playlist?list=PLpQQipWcxwt9U9RdAcbzPoQ6UpnIIRYgF", platform: "YouTube" },
                  { title: "Learn Figma", link: "https://www.youtube.com/watch?v=jk1T0CdLxwU", platform: "YouTube" },
                  { title: "Design Principles", link: "https://www.coursera.org/learn/design-principles", platform: "Coursera" }
                ]
              },
              intermediate: {
                skills: ["User Research", "Wireframing", "Prototyping", "Usability Testing"],
                courses: [
                  { title: "User Experience Research", link: "https://www.coursera.org/learn/user-research", platform: "Coursera" },
                  { title: "Interactive Design", link: "https://www.youtube.com/watch?v=4dWg0qPv4Ro", platform: "YouTube" },
                  { title: "Prototyping", link: "https://www.youtube.com/watch?v=MwidSAlbEB8", platform: "YouTube" }
                ]
              },
              advanced: {
                skills: ["Design Systems", "Motion Design", "Accessibility", "Mobile Design"],
                courses: [
                  { title: "Design Systems", link: "https://www.youtube.com/watch?v=lw0STFRrPZI", platform: "YouTube" },
                  { title: "UI Animation", link: "https://www.youtube.com/watch?v=S4H_wSi_GZY", platform: "YouTube" },
                  { title: "Accessibility in Design", link: "https://www.coursera.org/learn/accessibility", platform: "Coursera" }
                ]
              },
              timeline: {
                beginner: "2-3 months",
                intermediate: "3-4 months",
                advanced: "4-6 months"
              }
            };
            break;
          
          case "Mobile App Developer":
            roadmap = {
              beginner: {
                skills: ["Programming Basics", "UI/UX Fundamentals", "Mobile Platform Basics"],
                courses: [
                  { title: "Programming Fundamentals", link: "https://www.youtube.com/playlist?list=PLqYmG7hTraZBKeNJ-JE_eyJHZ7XgBoAyb", platform: "YouTube" },
                  { title: "UI/UX for Mobile", link: "https://www.youtube.com/watch?v=H8AvEUYAqd0", platform: "YouTube" },
                  { title: "Android Development for Beginners", link: "https://www.youtube.com/playlist?list=PLUcsbZa0qzu3Mri2tL1FzZy-5SX75UJfb", platform: "YouTube" }
                ]
              },
              intermediate: {
                skills: ["React Native/Flutter", "API Integration", "State Management"],
                courses: [
                  { title: "React Native Tutorial", link: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9ixPU-QkScoRBVxtPPzVjrQ", platform: "YouTube" },
                  { title: "Flutter Development", link: "https://www.youtube.com/playlist?list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG", platform: "YouTube" },
                  { title: "REST API Basics", link: "https://www.youtube.com/watch?v=lsMQRaeKNDk", platform: "YouTube" }
                ]
              },
              advanced: {
                skills: ["Performance Optimization", "Native Device Features", "App Publishing"],
                courses: [
                  { title: "Advanced React Native", link: "https://www.coursera.org/learn/react-native-advanced", platform: "Coursera" },
                  { title: "Mobile App Architecture", link: "https://www.youtube.com/watch?v=WGcJ3gz_WAs", platform: "YouTube" },
                  { title: "App Store Optimization", link: "https://www.youtube.com/watch?v=wFW8JzFR3_8", platform: "YouTube" }
                ]
              },
              timeline: {
                beginner: "2-3 months",
                intermediate: "3-5 months",
                advanced: "4-6 months"
              }
            };
            break;

          case "Blockchain Developer":
            roadmap = {
              beginner: {
                skills: ["Programming Basics", "Web Development", "Blockchain Fundamentals"],
                courses: [
                  { title: "JavaScript Essentials", link: "https://www.youtube.com/playlist?list=PLillGF-RfqbbnEGy3ROiLWk7JMCuSyQtX", platform: "YouTube" },
                  { title: "Web Development Basics", link: "https://www.freecodecamp.org/learn/responsive-web-design/", platform: "freeCodeCamp" },
                  { title: "Blockchain Basics", link: "https://www.nptel.ac.in/courses/106/105/106105184/", platform: "NPTEL" }
                ]
              },
              intermediate: {
                skills: ["Solidity", "Smart Contracts", "Ethereum Development"],
                courses: [
                  { title: "Solidity Tutorial", link: "https://www.youtube.com/playlist?list=PLbbtODcOYIoE0D6fschNU4rqtGFRpk3ea", platform: "YouTube" },
                  { title: "Smart Contract Development", link: "https://www.youtube.com/playlist?list=PLby-jGmUU_0J0cMLdUoJCSFUeOGKLGL5j", platform: "YouTube" },
                  { title: "Ethereum Development", link: "https://www.coursera.org/learn/blockchain-basics", platform: "Coursera" }
                ]
              },
              advanced: {
                skills: ["DApp Development", "Security Best Practices", "Layer 2 Solutions"],
                courses: [
                  { title: "Decentralized Application Development", link: "https://www.youtube.com/playlist?list=PLS5SEs8ZftgXlCGXNfzKdq7nGBcIaVOdN", platform: "YouTube" },
                  { title: "Blockchain Security", link: "https://www.coursera.org/learn/blockchain-security", platform: "Coursera" },
                  { title: "Advanced Blockchain Concepts", link: "https://www.nptel.ac.in/courses/106/105/106105235/", platform: "NPTEL" }
                ]
              },
              timeline: {
                beginner: "3 months",
                intermediate: "4-6 months",
                advanced: "6-8 months"
              }
            };
            break;
          
          case "Digital Content Creator":
            roadmap = {
              beginner: {
                skills: ["Digital Media Basics", "Content Planning", "Basic Photography/Videography"],
                courses: [
                  { title: "Digital Media Fundamentals", link: "https://www.youtube.com/playlist?list=PLpQQipWcxwt9U9RdAcbzPoQ6UpnIIRYgF", platform: "YouTube" },
                  { title: "Content Strategy", link: "https://www.coursera.org/learn/content-strategy", platform: "Coursera" },
                  { title: "Smartphone Photography", link: "https://www.youtube.com/watch?v=AywYZ-rOU9I", platform: "YouTube" }
                ]
              },
              intermediate: {
                skills: ["Video Editing", "Graphic Design", "Social Media Strategy"],
                courses: [
                  { title: "Video Editing Basics", link: "https://www.youtube.com/playlist?list=PLV0ZcSTi6tB4l7_1JN8BR0kwhiqUFU4UT", platform: "YouTube" },
                  { title: "Canva Design Course", link: "https://www.youtube.com/watch?v=un50Bs4Cz1s", platform: "YouTube" },
                  { title: "Social Media Marketing", link: "https://www.coursera.org/specializations/social-media-marketing", platform: "Coursera" }
                ]
              },
              advanced: {
                skills: ["Brand Development", "Monetization Strategies", "Advanced Production"],
                courses: [
                  { title: "Personal Branding", link: "https://www.coursera.org/learn/personal-branding", platform: "Coursera" },
                  { title: "Content Monetization", link: "https://www.youtube.com/watch?v=VVJ8tj3g9OA", platform: "YouTube" },
                  { title: "Advanced Video Production", link: "https://www.youtube.com/playlist?list=PLpQQipWcxwt9UWlEpi4_LfgHFMovgzLzy", platform: "YouTube" }
                ]
              },
              timeline: {
                beginner: "1-2 months",
                intermediate: "2-4 months",
                advanced: "4-6 months"
              }
            };
            break;

          // Add more career roadmaps as needed
          default:
            roadmap = {
              beginner: {
                skills: ["Foundational Skills", "Basic Knowledge", "Entry-level Tools"],
                courses: [
                  { title: "Introduction to the Field", link: "https://www.coursera.org/", platform: "Coursera" },
                  { title: "Basic Concepts", link: "https://www.youtube.com/", platform: "YouTube" },
                  { title: "Practical Skills", link: "https://nptel.ac.in/", platform: "NPTEL" }
                ]
              },
              intermediate: {
                skills: ["Advanced Concepts", "Specialized Tools", "Professional Skills"],
                courses: [
                  { title: "Professional Development", link: "https://www.coursera.org/", platform: "Coursera" },
                  { title: "Industry Standards", link: "https://www.youtube.com/", platform: "YouTube" },
                  { title: "Technical Skills", link: "https://nptel.ac.in/", platform: "NPTEL" }
                ]
              },
              advanced: {
                skills: ["Expert Knowledge", "Leadership", "Innovation"],
                courses: [
                  { title: "Advanced Techniques", link: "https://www.coursera.org/", platform: "Coursera" },
                  { title: "Specialized Knowledge", link: "https://www.youtube.com/", platform: "YouTube" },
                  { title: "Industry Leadership", link: "https://nptel.ac.in/", platform: "NPTEL" }
                ]
              },
              timeline: {
                beginner: "2-3 months",
                intermediate: "3-6 months",
                advanced: "6+ months"
              }
            };
        }

        return {
          ...item,
          roadmap
        };
      });
    };

    // Simulate processing delay and save to database
    const processResponses = async () => {
      try {
        const results = analyzeResponses();
        const roadmaps = defineRoadmaps(results);
        
        setRecommendations(results);
        setCareerRoadmaps(roadmaps);
        
        // Save recommendations to Supabase
        if (userId) {
          for (const result of results) {
            await supabase.from('user_career_history').insert({
              user_id: userId,
              career: result.career,
              reason: result.reason,
              is_selected: false
            });
          }
        }
      } catch (error) {
        console.error("Error processing responses:", error);
        toast({
          title: "Error generating recommendations",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    setTimeout(processResponses, 1500);
  }, [userAnswers, userId, toast]);

  const getCareerIcon = (career: string) => {
    if (career.includes("Engineer") || career.includes("Developer") || career.includes("Tech")) {
      return <BriefcaseIcon className="h-12 w-12 text-blue-700" />;
    } else if (career.includes("Designer") || career.includes("Creator") || career.includes("UX")) {
      return <BookIcon className="h-12 w-12 text-blue-700" />;
    } else if (career.includes("Data") || career.includes("Analytics")) {
      return <TrendingUpIcon className="h-12 w-12 text-blue-700" />;
    } else {
      return <GraduationCapIcon className="h-12 w-12 text-blue-700" />;
    }
  };

  const handleStartJourney = async (index: number) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to save your career selection",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    try {
      setSelectedCareer(index);
      
      // Update all career history entries to not selected
      await supabase
        .from('user_career_history')
        .update({ is_selected: false })
        .eq('user_id', userId);
      
      // Get the ID of the career to select
      const { data } = await supabase
        .from('user_career_history')
        .select('id')
        .eq('user_id', userId)
        .eq('career', recommendations[index].career)
        .order('timestamp', { ascending: false })
        .limit(1);
      
      if (data && data.length > 0) {
        // Update this career to be selected
        await supabase
          .from('user_career_history')
          .update({ is_selected: true })
          .eq('id', data[0].id);
      }
      
      toast({
        title: "Career path selected!",
        description: `You've started your journey towards becoming a ${recommendations[index].career}.`,
      });
    } catch (error) {
      console.error("Error selecting career path:", error);
      toast({
        title: "Error",
        description: "Failed to select career path. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-12 h-12 border-4 border-blue-700 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-blue-900 text-lg">Analyzing your responses...</p>
        <p className="text-blue-700">Our AI is creating your personalized career guidance report</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Career Discovery Report Header */}
      <Card className="bg-white rounded-xl shadow p-6">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold text-blue-900">SahiRaah Career Discovery Report</CardTitle>
              <CardDescription className="text-blue-700">
                Personalized career guidance for {userName}
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={onRetake}
              className="border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white flex items-center gap-2"
            >
              <RefreshCwIcon className="h-4 w-4" /> Retake Assessment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Student Profile Summary */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Your Profile Summary</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-2" /> Your Strengths
                </h4>
                <ul className="space-y-2">
                  {strengths.map((strength, idx) => (
                    <li key={idx} className="text-blue-700 flex items-start">
                      <span className="text-yellow-500 mr-2">•</span> {strength}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                  <LightbulbIcon className="h-4 w-4 mr-2" /> Growth Areas
                </h4>
                <ul className="space-y-2">
                  {areasToImprove.length > 0 ? areasToImprove.map((area, idx) => (
                    <li key={idx} className="text-blue-700 flex items-start">
                      <span className="text-yellow-500 mr-2">•</span> {area}
                    </li>
                  )) : (
                    <li className="text-blue-700">Continue building on your existing strengths!</li>
                  )}
                </ul>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Education Level</h4>
                <p className="text-blue-700">{educationLevel || "Not specified"}</p>
                <h4 className="font-medium text-blue-800 mt-4 mb-2">Learning Style</h4>
                <p className="text-blue-700">{userAnswers["How do you prefer learning new things?"] || "Varied"}</p>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-blue-900 mb-4">Your Recommended Future-Proof Careers</h3>
          <p className="text-blue-700 mb-6">
            Based on your assessment, these career paths are well-aligned with your skills,
            interests, and India's growing opportunities:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {careerRoadmaps.map((rec, index) => (
              <Card key={index} className="bg-white shadow-md hover:shadow-lg transition-all">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                      {getCareerIcon(rec.career)}
                    </div>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      Future-Proof Career
                    </Badge>
                  </div>
                  <CardTitle className="text-blue-900">{rec.career}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-700 mb-4">{rec.reason}</p>
                  <div className="mb-4">
                    <h4 className="font-medium text-blue-800 mb-2">Key Skills Needed:</h4>
                    <div className="flex flex-wrap gap-2">
                      {rec.roadmap.beginner.skills.slice(0, 3).map((skill: string, idx: number) => (
                        <Badge key={idx} className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {selectedCareer === index ? (
                    <div className="mt-3 text-sm text-green-600 font-medium flex items-center">
                      <CheckCircleIcon className="h-4 w-4 mr-1" /> Journey Started
                    </div>
                  ) : (
                    <Button 
                      onClick={() => handleStartJourney(index)} 
                      className="w-full mt-3 bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-medium"
                    >
                      Start Your Career Journey <ArrowRightIcon className="ml-1 h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ad Banner */}
      <AdBanner size="leaderboard" className="bg-white" />

      {/* Learning Roadmap for Selected Career */}
      {selectedCareer !== null && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            Your Learning Roadmap: {recommendations[selectedCareer].career}
          </h2>
          <p className="text-blue-700 mb-6">
            Follow this personalized roadmap to build the skills needed for a career as a {recommendations[selectedCareer].career}.
            All resources listed are freely available online from Indian and global platforms.
          </p>
          
          <Tabs defaultValue="beginner" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-6">
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
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Timeline: {careerRoadmaps[selectedCareer].roadmap.timeline.beginner}</h3>
                  <p className="text-blue-700">Start with these fundamental skills and resources to build your foundation.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Key Skills to Learn:</h3>
                  <div className="flex flex-wrap gap-2">
                    {careerRoadmaps[selectedCareer].roadmap.beginner.skills.map((skill: string, idx: number) => (
                      <Badge key={idx} className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-blue-900 mb-3">Free Learning Resources:</h3>
                  <div className="space-y-3">
                    {careerRoadmaps[selectedCareer].roadmap.beginner.courses.map((course: any, idx: number) => (
                      <Card key={idx} className="bg-white border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-blue-900">{course.title}</h4>
                              <p className="text-sm text-blue-700">Platform: {course.platform}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white"
                              asChild
                            >
                              <a href={course.link} target="_blank" rel="noopener noreferrer">
                                Learn Now
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Intermediate Content */}
            <TabsContent value="intermediate">
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Timeline: {careerRoadmaps[selectedCareer].roadmap.timeline.intermediate}</h3>
                  <p className="text-blue-700">Build upon your foundation with these intermediate skills and resources.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Key Skills to Learn:</h3>
                  <div className="flex flex-wrap gap-2">
                    {careerRoadmaps[selectedCareer].roadmap.intermediate.skills.map((skill: string, idx: number) => (
                      <Badge key={idx} className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-blue-900 mb-3">Free Learning Resources:</h3>
                  <div className="space-y-3">
                    {careerRoadmaps[selectedCareer].roadmap.intermediate.courses.map((course: any, idx: number) => (
                      <Card key={idx} className="bg-white border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-blue-900">{course.title}</h4>
                              <p className="text-sm text-blue-700">Platform: {course.platform}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white"
                              asChild
                            >
                              <a href={course.link} target="_blank" rel="noopener noreferrer">
                                Learn Now
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Advanced Content */}
            <TabsContent value="advanced">
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Timeline: {careerRoadmaps[selectedCareer].roadmap.timeline.advanced}</h3>
                  <p className="text-blue-700">Master advanced concepts to become an expert in your field.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Key Skills to Learn:</h3>
                  <div className="flex flex-wrap gap-2">
                    {careerRoadmaps[selectedCareer].roadmap.advanced.skills.map((skill: string, idx: number) => (
                      <Badge key={idx} className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-blue-900 mb-3">Free Learning Resources:</h3>
                  <div className="space-y-3">
                    {careerRoadmaps[selectedCareer].roadmap.advanced.courses.map((course: any, idx: number) => (
                      <Card key={idx} className="bg-white border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-blue-900">{course.title}</h4>
                              <p className="text-sm text-blue-700">Platform: {course.platform}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white"
                              asChild
                            >
                              <a href={course.link} target="_blank" rel="noopener noreferrer">
                                Learn Now
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Your Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div className="bg-yellow-500 h-2.5 rounded-full w-[10%]"></div>
            </div>
            <p className="text-sm text-blue-700">Just started - 10% complete</p>
            <p className="text-sm text-blue-700 mt-2">
              Remember: Your career journey is unique! Keep learning, exploring, and growing.
            </p>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
              <LightbulbIcon className="h-5 w-5 text-yellow-600 mr-2" /> Motivational Note
            </h3>
            <p className="text-blue-800">
              {userName}, you've taken an important first step toward your future career! Remember that 
              success comes through consistent effort and continuous learning. Each skill you develop brings 
              you closer to your goals. India's digital economy is growing rapidly, creating many 
              opportunities in these future-proof careers. Stay curious, keep learning, and believe in your potential!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerRecommendations;
