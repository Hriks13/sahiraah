
import React from 'react';

interface AdBannerProps {
  size: 'leaderboard' | 'large-rectangle'; // 728x90 or 300x250
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ size, className }) => {
  // Set dimensions based on ad size
  const dimensions = size === 'leaderboard' 
    ? { maxWidth: '728px', height: '90px' } 
    : { maxWidth: '300px', height: '250px' };
  
  return (
    <div className={`relative w-full flex justify-center my-4 ${className}`}>
      <div 
        className="bg-blue-50 border border-blue-100 rounded-md flex items-center justify-center overflow-hidden"
        style={{ 
          width: '100%', 
          maxWidth: dimensions.maxWidth, 
          height: dimensions.height 
        }}
      >
        <div className="text-center">
          <span className="text-xs font-bold text-blue-300 uppercase tracking-wide mb-1 block">Advertisement</span>
          <p className="text-blue-400">Ad Space</p>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
