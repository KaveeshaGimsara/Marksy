import { useEffect, useState } from 'react';

interface LoadingAnimationProps {
  onComplete?: () => void;
}

const LoadingAnimation = ({ onComplete }: LoadingAnimationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        setTimeout(onComplete, 500);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <>
      <style>{`
        .book-container {
          perspective: 1000px;
        }
        
        .book {
          width: 60px;
          height: 80px;
          position: relative;
          transform-style: preserve-3d;
          transform-origin: left center;
          border-radius: 4px 8px 8px 4px;
          box-shadow: 
            0 0 20px rgba(79, 70, 229, 0.3),
            inset 0 0 20px rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          will-change: transform;
        }
        
        .book-1 {
          animation: bookAnimation1 2s ease-in-out infinite;
          height: 75px;
        }
        
        .book-2 {
          animation: bookAnimation2 2s ease-in-out infinite 0.3s;
          height: 85px;
        }
        
        .book-3 {
          animation: bookAnimation3 2s ease-in-out infinite 0.6s;
          height: 70px;
        }
        
        .book-spine {
          position: absolute;
          left: 0;
          top: 0;
          width: 8px;
          height: 100%;
          border-radius: 4px 0 0 4px;
        }
        
        .book-letter {
          color: white;
          font-size: 24px;
          font-weight: bold;
          z-index: 10;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
          font-family: 'Arial', sans-serif;
        }
        
        @keyframes bookAnimation1 {
          0%, 100% {
            transform: scale(1) rotateY(0deg);
          }
          50% {
            transform: scale(1.15) rotateY(-5deg);
          }
        }
        
        @keyframes bookAnimation2 {
          0%, 100% {
            transform: scale(1) rotateY(0deg);
          }
          50% {
            transform: scale(1.2) rotateY(5deg);
          }
        }
        
        @keyframes bookAnimation3 {
          0%, 100% {
            transform: scale(1) rotateY(0deg);
          }
          50% {
            transform: scale(1.1) rotateY(-3deg);
          }
        }
        
        @keyframes fade-in-loading {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-loading {
          animation: fade-in-loading 1s ease-out 0.5s both;
        }
        
        .animate-fade-in-delay-loading {
          animation: fade-in-loading 1s ease-out 0.8s both;
        }
        
        .loading-dot {
          width: 8px;
          height: 8px;
          background: linear-gradient(45deg, #60a5fa, #a78bfa);
          border-radius: 50%;
          animation: dotPulse 1.5s ease-in-out infinite;
          will-change: transform, opacity;
        }
        
        @keyframes dotPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
      `}</style>
      
      <div className={`fixed inset-0 z-50 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="relative">
          {/* Main container for the books */}
          <div className="flex items-end space-x-4">
            {/* Book K */}
            <div className="book-container">
              <div className="book book-1 bg-gradient-to-r from-blue-500 to-indigo-600">
                <div className="book-spine bg-gradient-to-b from-blue-600 to-indigo-700"></div>
                <div className="book-letter">K</div>
              </div>
            </div>
            
            {/* Book G */}
            <div className="book-container">
              <div className="book book-2 bg-gradient-to-r from-purple-500 to-violet-600">
                <div className="book-spine bg-gradient-to-b from-purple-600 to-violet-700"></div>
                <div className="book-letter">G</div>
              </div>
            </div>
            
            {/* Book X */}
            <div className="book-container">
              <div className="book book-3 bg-gradient-to-r from-indigo-500 to-blue-600">
                <div className="book-spine bg-gradient-to-b from-indigo-600 to-blue-700"></div>
                <div className="book-letter">X</div>
              </div>
            </div>
          </div>
          
          {/* Marksy text below */}
          <div className="text-center mt-8">
            <h1 className="text-4xl font-bold text-white animate-fade-in-loading">Marksy</h1>
            <p className="text-blue-200 text-lg mt-2 animate-fade-in-delay-loading">Loading your academic journey...</p>
          </div>
          
          {/* Loading dots */}
          <div className="flex justify-center mt-6 space-x-1">
            <div className="loading-dot"></div>
            <div className="loading-dot" style={{ animationDelay: '0.2s' }}></div>
            <div className="loading-dot" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadingAnimation;