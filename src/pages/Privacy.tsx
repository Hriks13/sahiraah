
import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <div className="min-h-screen py-6 bg-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-6 text-blue-900">Privacy Policy – SahiRaah</h1>
          <p className="text-gray-600 mb-8">Effective Date: 17/05/2025</p>
          
          <p className="mb-6">We take your privacy seriously. Here's how your data is handled:</p>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-bold text-blue-800 mb-2">What We Collect</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Your quiz answers</li>
                <li>Email or login info (if you create an account)</li>
                <li>Basic interaction data (to improve recommendations)</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-blue-800 mb-2">Why We Collect It</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>To give personalized career suggestions</li>
                <li>To improve the platform's AI accuracy</li>
                <li>To provide support if needed</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-blue-800 mb-2">Data Storage</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>All data is securely stored using Supabase cloud services.</li>
                <li>We do not sell or share your data with advertisers or third parties.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-blue-800 mb-2">Cookies</h2>
              <p>We may use minimal cookies for improving performance and remembering your session.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-blue-800 mb-2">Data Access</h2>
              <p>You may request your data or ask for deletion by contacting <a href="mailto:support@sahiraah.in" className="text-blue-700 hover:text-blue-900">support@sahiraah.in</a>.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-blue-800 mb-2">Children Under 13</h2>
              <p>SahiRaah is intended for users aged 13 and above. Parental guidance is advised for younger users.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-blue-800 mb-2">Security</h2>
              <p>We follow industry-standard measures to protect your information.</p>
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

export default Privacy;
