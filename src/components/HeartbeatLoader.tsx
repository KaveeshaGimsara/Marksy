import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
}

export const HeartbeatLoader: React.FC<LoadingScreenProps> = ({ 
  isLoading, 
  onLoadingComplete 
}) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [progress, setProgress] = useState(0);

  const motivationalMessages = [
    "Building your future...",
    "Dreams become reality through effort...",
    "Your success starts here...",
    "Empowering through education..."
  ];

  useEffect(() => {
    if (!isLoading) return;

    // Progress simulation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          if (onLoadingComplete) {
            setTimeout(onLoadingComplete, 500);
          }
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Message rotation
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % motivationalMessages.length);
    }, 1500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [isLoading, onLoadingComplete, motivationalMessages.length]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center z-50">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-3 h-3 bg-purple-500 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-20 left-20 w-2 h-2 bg-pink-500 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-10 right-10 w-5 h-5 bg-yellow-500 rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="text-center relative z-10">
        {/* Heartbeat Heart Logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <svg 
              width="120" 
              height="120" 
              viewBox="0 0 120 120" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="animate-heartbeat filter drop-shadow-2xl"
            >
              <defs>
                <linearGradient id="loadingHeartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#3B82F6', stopOpacity: 1}} />
                  <stop offset="20%" style={{stopColor: '#8B5CF6', stopOpacity: 1}} />
                  <stop offset="40%" style={{stopColor: '#EC4899', stopOpacity: 1}} />
                  <stop offset="60%" style={{stopColor: '#F97316', stopOpacity: 1}} />
                  <stop offset="80%" style={{stopColor: '#EAB308', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: '#22C55E', stopOpacity: 1}} />
                </linearGradient>
                <radialGradient id="loadingHeartGlow" cx="50%" cy="30%" r="70%">
                  <stop offset="0%" style={{stopColor: '#FFFFFF', stopOpacity: 0.4}} />
                  <stop offset="100%" style={{stopColor: '#FFFFFF', stopOpacity: 0}} />
                </radialGradient>
                <filter id="loadingGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Main heart shape */}
              <path 
                d="M60 102 C30 78, 12 54, 12 36 C12 24, 21.6 14.4, 33.6 14.4 C45.6 14.4, 60 24, 60 24 C60 24, 74.4 14.4, 86.4 14.4 C98.4 14.4, 108 24, 108 36 C108 54, 90 78, 60 102 Z" 
                fill="url(#loadingHeartGradient)"
                filter="url(#loadingGlow)"
              />
              
              {/* Highlight overlay */}
              <path 
                d="M60 102 C30 78, 12 54, 12 36 C12 24, 21.6 14.4, 33.6 14.4 C45.6 14.4, 60 24, 60 24 C60 24, 74.4 14.4, 86.4 14.4 C98.4 14.4, 108 24, 108 36 C108 54, 90 78, 60 102 Z" 
                fill="url(#loadingHeartGlow)"
              />
              
              {/* Animated sparkles */}
              <circle 
                cx="30" 
                cy="30" 
                r="2" 
                fill="#FFFFFF" 
                opacity="0.9"
                className="animate-twinkle"
              />
              <circle 
                cx="90" 
                cy="40" 
                r="1.5" 
                fill="#FFFFFF" 
                opacity="0.8"
                className="animate-twinkle delay-500"
              />
              <circle 
                cx="75" 
                cy="25" 
                r="1" 
                fill="#FFFFFF" 
                opacity="0.7"
                className="animate-twinkle delay-1000"
              />
            </svg>

            {/* Pulse circles */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-2 border-blue-300 rounded-full animate-ping"></div>
              <div className="absolute w-40 h-40 border border-purple-200 rounded-full animate-ping delay-300"></div>
            </div>
          </div>
        </div>

        {/* Brand name */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Marksy
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Built by KGX with ❤️
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-6 w-80 mx-auto">
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {Math.round(Math.min(progress, 100))}% Complete
          </p>
        </div>

        {/* Motivational message */}
        <div className="h-16 flex items-center justify-center">
          <p 
            key={currentMessage}
            className="text-lg font-medium text-gray-700 animate-fadeInUp px-4 text-center max-w-md"
          >
            {motivationalMessages[currentMessage]}
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex justify-center space-x-2 mt-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
};

export default HeartbeatLoader;