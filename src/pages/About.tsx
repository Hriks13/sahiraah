
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-blue-50 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-900">About SahiRaah</h1>
          <div className="max-w-3xl">
            <p className="text-xl text-blue-700 mb-4">
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
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-blue-900">Our Mission</h2>
              <p className="text-lg text-blue-700 mb-4">
                SahiRaah is on a mission to democratize career guidance for Indian students, helping them 
                discover and pursue pathways aligned with their unique abilities and passions.
              </p>
              <p className="text-lg text-blue-700 mb-6">
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
      <div className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">How SahiRaah Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-900">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-blue-800">Answer Questions</h3>
              <p className="text-blue-700">Complete a thoughtful questionnaire about your interests, skills, values, and learning preferences.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-900">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-blue-800">AI Analysis</h3>
              <p className="text-blue-700">Our AI processes your responses to identify patterns and match them with suitable career paths.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-900">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-blue-800">Get Recommendations</h3>
              <p className="text-blue-700">Receive personalized career recommendations, resources, and next steps to explore your optimal paths.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">Our Team</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-xl shadow text-center">
              <div className="w-24 h-24 bg-blue-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold mb-1 text-blue-800">Ananya Sharma</h3>
              <p className="text-blue-700 mb-3">Founder & CEO</p>
              <p className="text-blue-600">Career counselor with 10+ years of experience helping students discover their potential.</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl shadow text-center">
              <div className="w-24 h-24 bg-blue-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold mb-1 text-blue-800">Rajesh Kumar</h3>
              <p className="text-blue-700 mb-3">AI Lead</p>
              <p className="text-blue-600">ML expert passionate about applying AI to solve educational and career guidance challenges.</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl shadow text-center">
              <div className="w-24 h-24 bg-blue-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold mb-1 text-blue-800">Priya Patel</h3>
              <p className="text-blue-700 mb-3">Education Specialist</p>
              <p className="text-blue-600">Former educator focused on bridging the gap between education and career readiness.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
