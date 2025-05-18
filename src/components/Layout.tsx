
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import AdSenseAd from './AdSenseAd';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <div className="container mx-auto px-4 mb-4">
        <AdSenseAd adSlot="1234567890" />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
