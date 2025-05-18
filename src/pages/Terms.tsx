
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="min-h-screen py-6 bg-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-6 text-blue-900">Terms & Conditions – SahiRaah</h1>
          <p className="text-gray-600 mb-8">Effective Date: 17/05/2025</p>
          
          <p className="mb-6">Welcome to SahiRaah. By using this platform, you agree to the following terms:</p>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-bold text-blue-800 mb-2">Purpose of Use</h2>
              <p>SahiRaah is designed to provide career guidance based on your inputs. All results and suggestions are educational in nature.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-blue-800 mb-2">No Professional Guarantee</h2>
              <p>Career recommendations are AI-generated and informational. We do not guarantee job placement or academic success.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-blue-800 mb-2">User Responsibility</h2>
              <p>You are responsible for your decisions based on guidance provided by SahiRaah. We encourage discussing options with a real counselor or guardian.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-blue-800 mb-2">Data Usage</h2>
              <p>We collect and store your answers and interactions securely in Supabase for improving recommendations. See our <Link to="/privacy" className="text-blue-700 hover:text-blue-900">Privacy Policy</Link> for full details.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-blue-800 mb-2">Content Ownership</h2>
              <p>All platform content (text, graphics, AI logic) is owned by SahiRaah. You may not copy or redistribute without permission.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-blue-800 mb-2">Modification and Updates</h2>
              <p>We may change these terms. Continued use means you agree to any updated terms.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-blue-800 mb-2">Contact</h2>
              <p>For concerns or suggestions, email us at: <a href="mailto:support@sahiraah.in" className="text-blue-700 hover:text-blue-900">support@sahiraah.in</a></p>
            </section>
          </div>
          
          <div className="mt-8 text-center">
            <Link to="/" className="text-blue-700 hover:text-blue-900 font-medium">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
