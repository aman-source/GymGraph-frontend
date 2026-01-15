import { useState, useRef } from 'react';
import { Lock } from 'lucide-react';

/**
 * VideoBadge Component
 * Clean, minimal video badges - earned play fully, locked show teaser
 */

const VideoBadge = ({
  src,
  name,
  earned = false,
  size = 64,
  onClick,
  className = "",
}) => {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoadedData = () => setIsLoaded(true);
  const handleError = () => {
    setHasError(true);
  };

  return (
    <div
      className={`relative ${earned ? 'cursor-pointer' : 'cursor-default'} ${className}`}
      style={{ width: size, height: size }}
      onClick={earned ? onClick : undefined}
      title={earned ? name : `${name} - Locked`}
    >
      {/* Video container */}
      <div
        className={`
          relative rounded-xl overflow-hidden
          ${earned
            ? 'ring-2 ring-[#0066FF] shadow-md'
            : 'ring-1 ring-gray-200/80'
          }
          transition-all duration-200
          ${earned ? 'hover:scale-105 hover:shadow-lg' : ''}
        `}
        style={{ width: size, height: size }}
      >
        {!hasError ? (
          <>
            <video
              ref={videoRef}
              src={src}
              autoPlay
              loop
              muted
              playsInline
              onLoadedData={handleLoadedData}
              onError={handleError}
              className={`
                w-full h-full object-cover
                ${!isLoaded ? 'opacity-0' : 'opacity-100'}
                ${!earned ? 'grayscale opacity-60' : ''}
                transition-opacity duration-300
              `}
            />

            {/* Subtle lock for unearned - small icon bottom right */}
            {!earned && isLoaded && (
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center">
                <Lock className="w-3 h-3 text-white" />
              </div>
            )}
          </>
        ) : (
          <div className={`w-full h-full flex items-center justify-center bg-gray-100 ${!earned ? 'grayscale' : ''}`}>
            <Lock className="w-4 h-4 text-gray-400" />
          </div>
        )}

        {/* Loading shimmer */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
        )}
      </div>

    </div>
  );
};

/**
 * VideoBadgeModal
 * Clean modal to view earned badge
 */
export const VideoBadgeModal = ({
  isOpen,
  onClose,
  badge,  // { src, name, description, earnedAt }
}) => {
  if (!isOpen || !badge) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col items-center p-6 max-w-sm animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Video badge - larger view */}
        <div className="relative mb-6">
          <video
            src={badge.src}
            autoPlay
            loop
            muted
            playsInline
            className="w-40 h-40 rounded-2xl object-cover shadow-2xl"
          />
        </div>

        {/* Badge info */}
        <h2 className="text-xl font-bold text-white mb-2 text-center">{badge.name}</h2>
        <p className="text-gray-400 text-center text-sm mb-4">{badge.description}</p>

        {badge.earnedAt && (
          <p className="text-xs text-gray-500 mb-4">
            Earned {new Date(badge.earnedAt).toLocaleDateString()}
          </p>
        )}

        {/* Close */}
        <button
          onClick={onClose}
          className="px-6 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white font-medium rounded-full transition-colors text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default VideoBadge;
