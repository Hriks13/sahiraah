
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-blue-50 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900">About SahiRaah</h1>
          <div className="max-w-3xl">
            <p className="text-xl text-blue-700 mb-3">
              In India, many students default to doctor or engineering careers without proper guidance, 
              often leading to career dissatisfaction and poor matches with their natural talents.
            </p>
            <p className="text-xl text-blue-700">
              SahiRaah helps students discover careers that truly match their interests and strengths.
            </p>
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4 text-blue-900">Our Mission</h2>
              <p className="text-lg text-blue-700 mb-3">
                SahiRaah is on a mission to democratize career guidance for Indian students, helping them 
                discover and pursue pathways aligned with their unique abilities and passions.
              </p>
              <p className="text-lg text-blue-700 mb-4">
                We believe that every student deserves personalized guidance that goes beyond traditional 
                expectations, cultural pressures, or limited exposure to career options.
              </p>
              <Link to="/login">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold">
                  Join SahiRaah Today
                </Button>
              </Link>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1470" 
                alt="Students exploring different career paths" 
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-10 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-blue-900">How SahiRaah Works</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl shadow text-center">
              <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-blue-900">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-blue-800">Answer Questions</h3>
              <p className="text-blue-700">Complete a thoughtful questionnaire about your interests, skills, values, and learning preferences.</p>
            </div>
            
            <div className="bg-white p-5 rounded-xl shadow text-center">
              <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-blue-900">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-blue-800">AI Analysis</h3>
              <p className="text-blue-700">Our AI processes your responses to identify patterns and match them with suitable career paths.</p>
            </div>
            
            <div className="bg-white p-5 rounded-xl shadow text-center">
              <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-blue-900">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-blue-800">Get Recommendations</h3>
              <p className="text-blue-700">Receive personalized career recommendations, resources, and next steps to explore your optimal paths.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-blue-900">Our Team</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-5 rounded-xl shadow text-center">
              <div className="mx-auto mb-3 w-24 h-24 rounded-full overflow-hidden border-4 border-blue-200">
                <Avatar className="w-full h-full">
                  <AvatarImage src="/lovable-uploads/6b9157fa-c88d-488f-99b9-9f5fb09bc314.png" alt="Hrithik MP" className="object-cover" />
                  <AvatarFallback>HM</AvatarFallback>
                </Avatar>
              </div>
              <h3 className="text-xl font-bold mb-1 text-blue-800">Hrithik MP</h3>
              <p className="text-blue-700">Founder & CEO</p>
            </div>
            
            <div className="bg-blue-50 p-5 rounded-xl shadow text-center">
              <div className="mx-auto mb-3 w-24 h-24 rounded-full overflow-hidden border-4 border-blue-200">
                <Avatar className="w-full h-full">
                  <AvatarImage src="/lovable-uploads/36906fe3-2a3f-466d-8e86-53460799efd2.png" alt="Nithish Kumar B" className="object-cover" />
                  <AvatarFallback>NK</AvatarFallback>
                </Avatar>
              </div>
              <h3 className="text-xl font-bold mb-1 text-blue-800">Nithish Kumar B</h3>
              <p className="text-blue-700">AI Lead</p>
            </div>
            
            <div className="bg-blue-50 p-5 rounded-xl shadow text-center">
              <div className="mx-auto mb-3 w-24 h-24 rounded-full overflow-hidden border-4 border-blue-200">
                <Avatar className="w-full h-full">
                  <AvatarImage src="/lovable-uploads/1bd2fd26-59a7-4638-ab11-3b70e09e14a6.png" alt="H Adithya Rao" className="object-cover" />
                  <AvatarFallback>AR</AvatarFallback>
                </Avatar>
              </div>
              <h3 className="text-xl font-bold mb-1 text-blue-800">H Adithya Rao</h3>
              <p className="text-blue-700">Education Specialist</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
