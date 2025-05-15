
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CareerGuides = () => {
  const guides = [
    {
      title: "Technology Careers",
      content: "Explore careers in software development, data science, cybersecurity, and more."
    },
    {
      title: "Healthcare Professions",
      content: "Learn about careers in medicine, nursing, therapy, and healthcare administration."
    },
    {
      title: "Business & Finance",
      content: "Discover opportunities in marketing, finance, entrepreneurship, and management."
    },
    {
      title: "Creative Industries",
      content: "Explore careers in design, media, writing, and the arts."
    },
    {
      title: "Education & Research",
      content: "Learn about careers in teaching, research, and academic administration."
    },
  ];

  return (
    <div className="min-h-screen bg-[#f0f6ff] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#1d3557] mb-2">Career Guides</h1>
        <p className="text-[#1d3557] mb-8">
          Explore comprehensive guides to various career paths and industries
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide, index) => (
            <Card key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="text-[#1d3557]">{guide.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#1d3557]">{guide.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerGuides;
