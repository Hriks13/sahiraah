
interface SkillScore {
  skill: string;
  score: number;
  description: string;
}

interface CareerReportData {
  studentName: string;
  career: string;
  description: string;
  matchPercentage: number;
  strengths: string[];
  weaknesses: string[];
  skillScores: SkillScore[];
  roadmap: {
    beginner: { 
      title: string;
      duration: string;
      resources: { title: string; link: string; platform: string; estimatedTime: string }[] 
    };
    intermediate: { 
      title: string;
      duration: string;
      resources: { title: string; link: string; platform: string; estimatedTime: string }[] 
    };
    advanced: { 
      title: string;
      duration: string;
      resources: { title: string; link: string; platform: string; estimatedTime: string }[] 
    };
  };
  totalEstimatedTime: string;
  salaryRange: string;
  futureOutlook: string;
  generatedAt: string;
}

export const generateCareerReport = (
  userAnswers: Record<string, string>,
  careerRecommendation: any,
  studentName: string
): CareerReportData => {
  // Analyze user responses to generate skill scores
  const skillScores = analyzeSkillsFromAnswers(userAnswers);
  
  // Generate strengths and weaknesses based on skill scores and answers
  const { strengths, weaknesses } = analyzeStrengthsAndWeaknesses(userAnswers, skillScores);
  
  // Enhanced roadmap with estimated times
  const roadmap = enhanceRoadmapWithTimes(careerRecommendation.roadmap);
  
  return {
    studentName,
    career: careerRecommendation.title,
    description: careerRecommendation.description,
    matchPercentage: careerRecommendation.matchPercentage,
    strengths,
    weaknesses,
    skillScores,
    roadmap,
    totalEstimatedTime: calculateTotalTime(roadmap),
    salaryRange: careerRecommendation.salaryRange,
    futureOutlook: careerRecommendation.futureOutlook,
    generatedAt: new Date().toISOString()
  };
};

const analyzeSkillsFromAnswers = (userAnswers: Record<string, string>): SkillScore[] => {
  const answers = Object.values(userAnswers).join(' ').toLowerCase();
  
  // Base skill analysis
  const skills: SkillScore[] = [
    {
      skill: "Logical Thinking",
      score: 0,
      description: "Ability to reason systematically and solve complex problems"
    },
    {
      skill: "Analytical Skills",
      score: 0,
      description: "Breaking down complex information and finding patterns"
    },
    {
      skill: "Creativity",
      score: 0,
      description: "Innovative thinking and generating original ideas"
    },
    {
      skill: "Communication",
      score: 0,
      description: "Expressing ideas clearly and working with others"
    },
    {
      skill: "Technical Aptitude",
      score: 0,
      description: "Understanding and working with technology effectively"
    }
  ];

  // Logical Thinking scoring
  if (answers.includes("break down") || answers.includes("systematic") || answers.includes("step")) {
    skills[0].score += 3;
  }
  if (answers.includes("problem") || answers.includes("solve") || answers.includes("analysis")) {
    skills[0].score += 2;
  }
  if (answers.includes("structured") || answers.includes("organized")) {
    skills[0].score += 2;
  }

  // Analytical Skills scoring
  if (answers.includes("data") || answers.includes("pattern") || answers.includes("research")) {
    skills[1].score += 3;
  }
  if (answers.includes("analyze") || answers.includes("investigate") || answers.includes("study")) {
    skills[1].score += 2;
  }
  if (answers.includes("details") || answers.includes("information")) {
    skills[1].score += 2;
  }

  // Creativity scoring
  if (answers.includes("creative") || answers.includes("design") || answers.includes("art")) {
    skills[2].score += 3;
  }
  if (answers.includes("innovative") || answers.includes("original") || answers.includes("unique")) {
    skills[2].score += 2;
  }
  if (answers.includes("imagine") || answers.includes("brainstorm")) {
    skills[2].score += 2;
  }

  // Communication scoring
  if (answers.includes("team") || answers.includes("collaborate") || answers.includes("group")) {
    skills[3].score += 3;
  }
  if (answers.includes("help") || answers.includes("teach") || answers.includes("explain")) {
    skills[3].score += 2;
  }
  if (answers.includes("presentation") || answers.includes("speaking")) {
    skills[3].score += 2;
  }

  // Technical Aptitude scoring
  if (answers.includes("technology") || answers.includes("coding") || answers.includes("computer")) {
    skills[4].score += 3;
  }
  if (answers.includes("software") || answers.includes("app") || answers.includes("digital")) {
    skills[4].score += 2;
  }
  if (answers.includes("learn") || answers.includes("adapt")) {
    skills[4].score += 1;
  }

  // Normalize scores to 1-10 scale and add base scores
  return skills.map(skill => ({
    ...skill,
    score: Math.min(10, Math.max(4, skill.score + 4)) // Base score of 4, max 10
  }));
};

const analyzeStrengthsAndWeaknesses = (
  userAnswers: Record<string, string>,
  skillScores: SkillScore[]
): { strengths: string[]; weaknesses: string[] } => {
  const answers = Object.values(userAnswers).join(' ').toLowerCase();
  
  // Find top 3 skills as strengths
  const sortedSkills = [...skillScores].sort((a, b) => b.score - a.score);
  const topSkills = sortedSkills.slice(0, 3);
  const bottomSkills = sortedSkills.slice(-2);

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  // Generate strengths based on top skills and answers
  topSkills.forEach(skill => {
    if (skill.skill === "Logical Thinking" && skill.score >= 7) {
      strengths.push("Strong problem-solving and systematic thinking abilities");
    } else if (skill.skill === "Analytical Skills" && skill.score >= 7) {
      strengths.push("Excellent at breaking down complex information and finding patterns");
    } else if (skill.skill === "Creativity" && skill.score >= 7) {
      strengths.push("Creative mindset with ability to generate innovative solutions");
    } else if (skill.skill === "Communication" && skill.score >= 7) {
      strengths.push("Strong collaborative and communication skills");
    } else if (skill.skill === "Technical Aptitude" && skill.score >= 7) {
      strengths.push("Quick learner with good technical understanding");
    }
  });

  // Add specific strengths based on answers
  if (answers.includes("leadership") || answers.includes("lead")) {
    strengths.push("Natural leadership qualities and initiative");
  }
  if (answers.includes("detail") || answers.includes("careful")) {
    strengths.push("Attention to detail and thoroughness");
  }

  // Generate growth areas (avoiding negative language)
  bottomSkills.forEach(skill => {
    if (skill.skill === "Communication" && skill.score < 6) {
      weaknesses.push("Developing stronger presentation and interpersonal skills");
    } else if (skill.skill === "Technical Aptitude" && skill.score < 6) {
      weaknesses.push("Building confidence with new technologies and tools");
    } else if (skill.skill === "Analytical Skills" && skill.score < 6) {
      weaknesses.push("Strengthening data analysis and research methods");
    } else if (skill.skill === "Creativity" && skill.score < 6) {
      weaknesses.push("Exploring more creative approaches to problem-solving");
    } else if (skill.skill === "Logical Thinking" && skill.score < 6) {
      weaknesses.push("Enhancing structured thinking and planning skills");
    }
  });

  // Add general growth areas
  if (!answers.includes("experience") && !answers.includes("practical")) {
    weaknesses.push("Gaining more hands-on experience through projects");
  }
  if (!answers.includes("time") && !answers.includes("manage")) {
    weaknesses.push("Developing better time management and organization skills");
  }

  return {
    strengths: strengths.slice(0, 4),
    weaknesses: weaknesses.slice(0, 3)
  };
};

const enhanceRoadmapWithTimes = (originalRoadmap: any) => {
  return {
    beginner: {
      title: "Foundation Building Phase",
      duration: "2-4 months",
      resources: originalRoadmap.beginner.resources.map((resource: any) => ({
        ...resource,
        estimatedTime: generateEstimatedTime("beginner", resource.title)
      }))
    },
    intermediate: {
      title: "Practical Application Phase",
      duration: "4-8 months",
      resources: originalRoadmap.intermediate.resources.map((resource: any) => ({
        ...resource,
        estimatedTime: generateEstimatedTime("intermediate", resource.title)
      }))
    },
    advanced: {
      title: "Mastery & Specialization Phase",
      duration: "8-12 months",
      resources: originalRoadmap.advanced.resources.map((resource: any) => ({
        ...resource,
        estimatedTime: generateEstimatedTime("advanced", resource.title)
      }))
    }
  };
};

const generateEstimatedTime = (level: string, title: string): string => {
  const baseTimes = {
    beginner: ["2-4 weeks", "3-6 weeks", "4-8 weeks"],
    intermediate: ["6-10 weeks", "8-12 weeks", "10-16 weeks"],
    advanced: ["12-20 weeks", "16-24 weeks", "20-32 weeks"]
  };

  const times = baseTimes[level as keyof typeof baseTimes];
  
  // Assign time based on content type
  if (title.toLowerCase().includes("fundamental") || title.toLowerCase().includes("introduction")) {
    return times[0];
  } else if (title.toLowerCase().includes("advanced") || title.toLowerCase().includes("master")) {
    return times[2];
  } else {
    return times[1];
  }
};

const calculateTotalTime = (roadmap: any): string => {
  const beginnerMonths = 3; // Average of 2-4 months
  const intermediateMonths = 6; // Average of 4-8 months
  const advancedMonths = 10; // Average of 8-12 months
  
  const totalMonths = beginnerMonths + intermediateMonths + advancedMonths;
  const years = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;
  
  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
  } else {
    return `${totalMonths} months`;
  }
};
