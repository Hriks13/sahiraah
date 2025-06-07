
import React from 'react';
import AdSenseAd from './AdSenseAd';

interface AdBannerProps {
  size: 'leaderboard' | 'large-rectangle' | 'sidebar';
  className?: string;
  educationalCategory?: 'courses' | 'career' | 'skills' | 'general';
  sticky?: boolean;
}

const AdBanner: React.FC<AdBannerProps> = ({ 
  size, 
  className, 
  educationalCategory = 'career',
  sticky = false
}) => {
  // Enhanced ad configurations with better CTR positions
  const getAdConfig = () => {
    switch (size) {
      case 'leaderboard':
        return {
          maxWidth: '728px',
          height: '90px',
          adSlot: '1234567890',
          adFormat: 'horizontal' as const
        };
      case 'large-rectangle':
        return {
          maxWidth: '300px',
          height: '250px',
          adSlot: '0987654321',
          adFormat: 'rectangle' as const
        };
      case 'sidebar':
        return {
          maxWidth: '160px',
          height: '600px',
          adSlot: '1122334455',
          adFormat: 'auto' as const
        };
      default:
        return {
          maxWidth: '300px',
          height: '250px',
          adSlot: '0987654321',
          adFormat: 'rectangle' as const
        };
    }
  };

  const adConfig = getAdConfig();

  const fallbackContent = {
    courses: {
      title: "📚 Featured Educational Courses",
      description: "Discover top-rated online courses and certifications"
    },
    career: {
      title: "🚀 Career Development Resources",
      description: "Professional growth opportunities and career guidance"
    },
    skills: {
      title: "💪 Skill Building Programs",
      description: "Essential skills for your professional development"
    },
    general: {
      title: "🎯 Educational Resources",
      description: "Learning opportunities for career advancement"
    }
  };

  const content = fallbackContent[educationalCategory];
  
  return (
    <div className={`relative w-full flex justify-center my-4 ${className}`}>
      <div 
        className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm overflow-hidden"
        style={{ 
          width: '100%', 
          maxWidth: adConfig.maxWidth, 
          minHeight: adConfig.height 
        }}
      >
        {/* Educational Badge */}
        <div className="absolute top-2 left-2 z-20">
          <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
            Educational Content
          </span>
        </div>

        {/* AdSense Ad - Always visible */}
        <AdSenseAd
          adSlot={adConfig.adSlot}
          adFormat={adConfig.adFormat}
          educationalCategory={educationalCategory}
          style={{ display: 'block', width: '100%', height: '100%' }}
          sticky={sticky}
        />
        
        {/* Fallback Educational Content - Only shows if ad fails to load */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 peer-empty:opacity-100 transition-opacity duration-300">
          <div className="text-center p-4">
            <h4 className="text-sm font-bold text-blue-900 mb-1">{content.title}</h4>
            <p className="text-xs text-blue-700 leading-tight">{content.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
