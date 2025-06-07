
import { useEffect, useRef } from 'react';

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  style?: React.CSSProperties;
  className?: string;
  educationalCategory?: 'courses' | 'career' | 'skills' | 'general';
  sticky?: boolean;
}

const AdSenseAd: React.FC<AdSenseAdProps> = ({
  adSlot,
  adFormat = 'auto',
  style = { display: 'block', textAlign: 'center' },
  className,
  educationalCategory = 'general',
  sticky = false,
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    try {
      if (adRef.current && typeof window !== 'undefined') {
        // Check if AdSense script is loaded
        if (window.adsbygoogle) {
          // Push the ad with educational targeting and enhanced parameters
          (window.adsbygoogle = window.adsbygoogle || []).push({
            // Enhanced educational targeting parameters
            google_ad_channel: `education,career,${educationalCategory},students`,
            google_ad_region: 'educational_content',
            google_safe: 'high', // Ensure family-safe content
            google_content_recommendation: 'education',
            google_hints: 'education,learning,courses,career,skills'
          });
          console.log(`Educational AdSense ad pushed for category: ${educationalCategory}`);
        } else {
          console.log("AdSense not loaded yet");
        }
      }
    } catch (error) {
      console.error("Error loading AdSense ad:", error);
    }
  }, [educationalCategory]);

  const getCategoryKeywords = (category: string) => {
    const keywords = {
      courses: 'online courses, education, learning, certification, training, exam prep',
      career: 'career development, job opportunities, professional growth, career guidance',
      skills: 'skill development, training, professional skills, competency building',
      general: 'education, learning, career, development, student resources'
    };
    return keywords[category as keyof typeof keywords] || keywords.general;
  };

  const containerClass = sticky 
    ? `adsense-container sticky top-4 z-10 ${className || ''}` 
    : `adsense-container ${className || ''}`;

  return (
    <div className={containerClass} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-7107600695656638"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
        data-ad-channel={`education,career,${educationalCategory},students`}
        data-page-url={typeof window !== 'undefined' ? window.location.href : ''}
        data-ad-keywords={getCategoryKeywords(educationalCategory)}
        data-ad-test="off"
        data-adbreak-test="on"
        data-ad-frequency-hint="30s"
      />
    </div>
  );
};

// Add global type for window adsbygoogle
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default AdSenseAd;
