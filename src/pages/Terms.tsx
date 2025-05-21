
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import AdPlacement from '@/components/AdPlacement';

const Terms = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-background pt-10 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-10">
          <h1 className="text-3xl font-bold text-center mb-8">Terms and Conditions</h1>

          <AdPlacement location="header" />
          
          <div className="prose max-w-none">
            <p className="mb-4">
              Welcome to SahiRaah. By accessing this website, you agree to be bound by these terms and conditions.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using SahiRaah, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with these terms, please do not use this website.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">2. Description of Service</h2>
            <p className="mb-4">
              SahiRaah provides career guidance services for Indian students. The services include but are not limited to career assessment tests, recommendations, educational resources, and related content.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">3. User Accounts</h2>
            <p className="mb-4">
              To access certain features of the website, you may be required to register for an account. You agree to provide accurate information during the registration process and to update such information to keep it accurate. You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">4. User Content</h2>
            <p className="mb-4">
              By submitting content to SahiRaah, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt, publish, translate, and distribute your content. This includes the right to sublicense such rights through multiple tiers of sublicensees. You represent and warrant that you have all the rights necessary to grant us these rights.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">5. Intellectual Property</h2>
            <p className="mb-4">
              All content on SahiRaah, including text, graphics, logos, icons, images, audio clips, digital downloads, and software, is the property of SahiRaah or its content suppliers and is protected by international copyright laws.
            </p>
            
            <AdPlacement location="content" />
            
            <h2 className="text-xl font-semibold mt-6 mb-3">6. Limitation of Liability</h2>
            <p className="mb-4">
              SahiRaah shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of, or inability to access or use, the service or any content provided on or through the service.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">7. Changes to Terms</h2>
            <p className="mb-4">
              SahiRaah reserves the right to modify these terms at any time. Your continued use of the service after such modifications will constitute your acknowledgement and acceptance of the modified terms.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">8. Governing Law</h2>
            <p className="mb-4">
              These terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">9. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about these Terms, please contact us at support@sahiraah.com.
            </p>
          </div>
          
          <AdPlacement location="footer" />
        </div>
      </div>
    </div>
  );
};

export default Terms;
