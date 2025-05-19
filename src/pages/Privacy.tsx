
import { Link } from "react-router-dom";
import AdSenseAd from "@/components/AdSenseAd";

const Privacy = () => {
  return (
    <div className="min-h-screen py-6 bg-blue-50">
      <div className="container mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-md p-5 md:p-6">
          <h1 className="text-3xl font-bold mb-4 text-blue-900">Privacy Policy – SahiRaah</h1>
          <p className="text-gray-600 mb-4">Effective Date: 17/05/2025</p>
          
          <AdSenseAd adSlot="1234567890" className="mb-4" />
          
          <p className="mb-4">We take your privacy seriously. Here's how your data is handled:</p>
          
          <div className="space-y-4">
            <section>
              <h2 className="text-xl font-bold text-blue-800 mb-1">What We Collect</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Your quiz answers</li>
                <li>Email or login info (if you create an account)</li>
                <li>Basic interaction data (to improve recommendations)</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-blue-800 mb-1">Why We Collect It</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>To give personalized career suggestions</li>
                <li>To improve the platform's AI accuracy</li>
                <li>To provide support if needed</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-blue-800 mb-1">Data Storage</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>All data is securely stored using Supabase cloud services.</li>
                <li>We do not sell or share your data with advertisers or third parties.</li>
              </ul>
            </section>
            
            <AdSenseAd adSlot="1234567890" className="my-4" />
            
            <section>
              <h2 className="text-xl font-bold text-blue-800 mb-1">Cookies</h2>
              <p>We may use minimal cookies for improving performance and remembering your session.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-blue-800 mb-1">Data Access</h2>
              <p>You may request your data or ask for deletion by contacting <a href="mailto:support@sahiraah.in" className="text-blue-700 hover:text-blue-900">support@sahiraah.in</a>.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-blue-800 mb-1">Children Under 13</h2>
              <p>SahiRaah is intended for users aged 13 and above. Parental guidance is advised for younger users.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-blue-800 mb-1">Security</h2>
              <p>We follow industry-standard measures to protect your information.</p>
            </section>
          </div>
          
          <div className="mt-6 text-center">
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
