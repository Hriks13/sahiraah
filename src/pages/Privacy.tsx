
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import AdPlacement from '@/components/AdPlacement';

const Privacy = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-background pt-10 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-10">
          <h1 className="text-3xl font-bold text-center mb-8">Privacy Policy</h1>

          <AdPlacement location="header" />
          
          <div className="prose max-w-none">
            <p className="mb-4">
              At SahiRaah, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Information We Collect</h2>
            <p className="mb-4">
              We may collect personal information that you voluntarily provide to us when you register with the website, express an interest in obtaining information about us or our products and services, or otherwise contact us. This information may include:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Personal identifiers (name, email address)</li>
              <li>Education information</li>
              <li>Employment history</li>
              <li>Career preferences and interests</li>
              <li>Assessment responses</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">2. How We Use Your Information</h2>
            <p className="mb-4">
              We use the information we collect in various ways, including to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide, operate, and maintain our website</li>
              <li>Improve, personalize, and expand our website</li>
              <li>Understand and analyze how you use our website</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Communicate with you to provide updates and other information</li>
              <li>Generate personalized career recommendations</li>
              <li>For compliance purposes, including enforcing our Terms of Service</li>
            </ul>
            
            <AdPlacement location="content" />
            
            <h2 className="text-xl font-semibold mt-6 mb-3">3. Information Sharing</h2>
            <p className="mb-4">
              We may share information we have collected in certain situations. Your information may be disclosed as follows:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>By Law or to Protect Rights: If required by law or to protect the rights, property, and safety of SahiRaah, our users, or others.</li>
              <li>Third-Party Service Providers: We may share your information with third parties that perform services for us or on our behalf.</li>
              <li>Marketing Communications: With your consent, we may share your information with third parties for marketing purposes.</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">4. Security of Your Information</h2>
            <p className="mb-4">
              We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that no security measures are perfect or impenetrable.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">5. User Rights</h2>
            <p className="mb-4">
              You have the right to access, update, or delete the information we have on you. You can:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Request to access the personal information we hold about you</li>
              <li>Request that we update or correct any personal information</li>
              <li>Request that we delete your account and personal information</li>
              <li>Opt-out of marketing communications</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">6. Cookies</h2>
            <p className="mb-4">
              We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">7. Changes to This Privacy Policy</h2>
            <p className="mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">8. Contact Us</h2>
            <p className="mb-4">
              If you have questions or concerns about this Privacy Policy, please contact us at privacy@sahiraah.com.
            </p>
          </div>
          
          <AdPlacement location="footer" />
        </div>
      </div>
    </div>
  );
};

export default Privacy;
