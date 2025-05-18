
import { useEffect, useRef } from 'react';

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  style?: React.CSSProperties;
  className?: string;
}

const AdSenseAd: React.FC<AdSenseAdProps> = ({
  adSlot,
  adFormat = 'auto',
  style = { display: 'block', textAlign: 'center' },
  className,
}) => {
  // Using HTMLElement instead of HTMLInsElement which doesn't exist
  const adRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    try {
      if (adRef.current && typeof window !== 'undefined') {
        // Check if AdSense script is loaded
        if (window.adsbygoogle) {
          // Push the ad
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          console.log("AdSense ad pushed");
        } else {
          console.log("AdSense not loaded yet");
        }
      }
    } catch (error) {
      console.error("Error loading AdSense ad:", error);
    }
  }, []);

  return (
    <div className={`adsense-container ${className || ''}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-7107600695656638"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
        ref={adRef}
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
