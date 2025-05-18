
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AdSenseAd from "@/components/AdSenseAd";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-blue-50 min-h-[70vh] flex items-center">
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1470')" }}
        />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900">
              Find Your Right Path with SahiRaah
            </h1>
            <p className="text-xl md:text-2xl text-blue-700 mb-8">
              AI-powered career guidance tailored to your interests and learning style
            </p>
            <Link to="/about">
              <Button className="text-lg px-8 py-6 bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold rounded-xl shadow-lg">
                Start Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Ad placement after hero section */}
      <div className="container mx-auto px-4 py-4">
        <AdSenseAd adSlot="1234567890" />
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">How SahiRaah Guides You</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-xl shadow">
              <div className="text-yellow-500 text-4xl font-bold mb-2">01</div>
              <h3 className="text-xl font-bold mb-2 text-blue-800">Discover Your Strengths</h3>
              <p className="text-blue-700">Answer questions about your interests, skills, and learning style.</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl shadow">
              <div className="text-yellow-500 text-4xl font-bold mb-2">02</div>
              <h3 className="text-xl font-bold mb-2 text-blue-800">AI Analysis</h3>
              <p className="text-blue-700">Our AI analyzes your responses to match you with suitable career paths.</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl shadow">
              <div className="text-yellow-500 text-4xl font-bold mb-2">03</div>
              <h3 className="text-xl font-bold mb-2 text-blue-800">Explore Careers</h3>
              <p className="text-blue-700">Get personalized career recommendations and resources to explore them further.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials (Placeholder) */}
      <div className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">Student Success Stories</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow">
              <p className="italic text-blue-700 mb-4">"SahiRaah helped me discover my passion for digital design when I was considering engineering because everyone else was. Now I'm pursuing a career I truly love."</p>
              <p className="font-bold text-blue-900">- Priya, Delhi</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow">
              <p className="italic text-blue-700 mb-4">"I was stuck between medicine and research. SahiRaah showed me career paths I didn't even know existed, and now I'm studying bioinformatics!"</p>
              <p className="font-bold text-blue-900">- Rahul, Mumbai</p>
            </div>
          </div>
          
          {/* Ad placement after testimonials */}
          <div className="mt-8">
            <AdSenseAd adSlot="1234567890" />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Path?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of students who have discovered careers that match their true potential with SahiRaah.</p>
          <Link to="/login">
            <Button className="text-lg px-8 py-6 bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold rounded-xl shadow-lg">
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
