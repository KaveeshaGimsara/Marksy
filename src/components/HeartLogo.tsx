import React from 'react';

interface HeartLogoProps {
  size?: number;
  withText?: boolean;
  className?: string;
}

const HeartLogo: React.FC<HeartLogoProps> = ({ size = 40, withText = false, className = '' }) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        <defs>
          {/* Vibrant rainbow gradient for the heart */}
          <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#3B82F6', stopOpacity: 1}} /> {/* Blue */}
            <stop offset="20%" style={{stopColor: '#8B5CF6', stopOpacity: 1}} /> {/* Purple */}
            <stop offset="40%" style={{stopColor: '#EC4899', stopOpacity: 1}} /> {/* Pink */}
            <stop offset="60%" style={{stopColor: '#F97316', stopOpacity: 1}} /> {/* Orange */}
            <stop offset="80%" style={{stopColor: '#EAB308', stopOpacity: 1}} /> {/* Yellow */}
            <stop offset="100%" style={{stopColor: '#22C55E', stopOpacity: 1}} /> {/* Green */}
          </linearGradient>
          
          {/* Additional gradient for depth */}
          <radialGradient id="heartGlow" cx="50%" cy="30%" r="70%">
            <stop offset="0%" style={{stopColor: '#FFFFFF', stopOpacity: 0.3}} />
            <stop offset="100%" style={{stopColor: '#FFFFFF', stopOpacity: 0}} />
          </radialGradient>
          
          {/* Shadow filter */}
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.2"/>
          </filter>
        </defs>
        
        {/* Heart shape */}
        <path 
          d="M50 85 C25 65, 10 45, 10 30 C10 20, 18 12, 28 12 C38 12, 50 20, 50 20 C50 20, 62 12, 72 12 C82 12, 90 20, 90 30 C90 45, 75 65, 50 85 Z" 
          fill="url(#heartGradient)"
          filter="url(#shadow)"
        />
        
        {/* Highlight overlay for 3D effect */}
        <path 
          d="M50 85 C25 65, 10 45, 10 30 C10 20, 18 12, 28 12 C38 12, 50 20, 50 20 C50 20, 62 12, 72 12 C82 12, 90 20, 90 30 C90 45, 75 65, 50 85 Z" 
          fill="url(#heartGlow)"
        />
        
        {/* Small sparkle effects */}
        <circle cx="25" cy="25" r="1.5" fill="#FFFFFF" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="75" cy="35" r="1" fill="#FFFFFF" opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.2;0.6" dur="3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="60" cy="20" r="0.8" fill="#FFFFFF" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2.5s" repeatCount="indefinite"/>
        </circle>
      </svg>
      
      {withText && (
        <div className="flex flex-col">
          <span className="font-bold text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
             Marksy
          </span>
          <span className="text-xs text-muted-foreground -mt-1">
            Exam Progress Tracker
          </span>
        </div>
      )}
    </div>
  );
};

export default HeartLogo;