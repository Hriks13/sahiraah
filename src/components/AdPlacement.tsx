
import React from 'react';
import AdBanner from './AdBanner';
import AdSenseAd from './AdSenseAd';

interface AdPlacementProps {
  location: 'header' | 'sidebar' | 'content' | 'footer';
  className?: string;
  useAdSense?: boolean;
}

const AdPlacement: React.FC<AdPlacementProps> = ({ location, className, useAdSense = false }) => {
  // Determine ad size based on location
  const getAdSize = () => {
    switch (location) {
      case 'header':
      case 'footer':
        return 'leaderboard';
      case 'sidebar':
      case 'content':
        return 'large-rectangle';
      default:
        return 'leaderboard';
    }
  };

  // Get AdSense slot based on location
  const getAdSlot = () => {
    switch (location) {
      case 'header':
        return '1234567890';
      case 'sidebar':
        return '0987654321';
      case 'content':
        return '1122334455';
      case 'footer':
        return '5544332211';
      default:
        return '1234567890';
    }
  };

  // Apply appropriate CSS classes based on location
  const getContainerClasses = () => {
    switch (location) {
      case 'header':
        return 'w-full my-4';
      case 'sidebar':
        return 'w-full my-4';
      case 'content':
        return 'w-full my-6';
      case 'footer':
        return 'w-full my-4';
      default:
        return 'w-full my-4';
    }
  };

  return (
    <div className={`${getContainerClasses()} ${className || ''}`}>
      {useAdSense ? (
        <AdSenseAd 
          adSlot={getAdSlot()} 
          adFormat={getAdSize() === 'leaderboard' ? 'horizontal' : 'rectangle'} 
          className="mx-auto"
        />
      ) : (
        <AdBanner size={getAdSize()} className="mx-auto" />
      )}
    </div>
  );
};

export default AdPlacement;
