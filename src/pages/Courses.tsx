
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Courses = () => {
  const courses = [
    {
      title: "Introduction to Web Development",
      description: "Learn HTML, CSS, and JavaScript basics",
      level: "Beginner",
      duration: "8 weeks"
    },
    {
      title: "Data Science Fundamentals",
      description: "Master statistics, Python, and data visualization",
      level: "Intermediate",
      duration: "12 weeks"
    },
    {
      title: "Graphic Design Essentials",
      description: "Learn design principles and industry-standard tools",
      level: "Beginner",
      duration: "6 weeks"
    },
    {
      title: "Business Management & Leadership",
      description: "Develop essential management and leadership skills",
      level: "Intermediate",
      duration: "10 weeks"
    },
    {
      title: "Healthcare Administration",
      description: "Learn about healthcare systems and administration",
      level: "Advanced",
      duration: "14 weeks"
    },
  ];

  return (
    <div className="min-h-screen bg-[#f0f6ff] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#1d3557] mb-2">Skill Development Courses</h1>
        <p className="text-[#1d3557] mb-8">
          Find courses and resources to build skills for your desired career path
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <Card key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle className="text-[#1d3557]">{course.title}</CardTitle>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {course.level}
                  </Badge>
                </div>
                <CardDescription>Duration: {course.duration}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-[#1d3557]">{course.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
