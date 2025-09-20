import { useEffect, useState } from 'react';
import './LoadingAnimation.css';

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
    <div className={`loading-overlay ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="loading-container">
        {/* Main container for the books */}
        <div className="books-container">
          {/* Book K */}
          <div className="book-wrapper">
            <div className="book book-1">
              <div className="book-spine"></div>
              <div className="book-letter">K</div>
            </div>
          </div>
          
          {/* Book G */}
          <div className="book-wrapper">
            <div className="book book-2">
              <div className="book-spine"></div>
              <div className="book-letter">G</div>
            </div>
          </div>
          
          {/* Book X */}
          <div className="book-wrapper">
            <div className="book book-3">
              <div className="book-spine"></div>
              <div className="book-letter">X</div>
            </div>
          </div>
        </div>
        
        {/* Marksy text below */}
        <div className="loading-text">
          <h1 className="main-title">Marksy</h1>
          <p className="sub-title">Loading your academic journey...</p>
        </div>
        
        {/* Loading dots */}
        <div className="loading-dots">
          <div className="dot"></div>
          <div className="dot dot-2"></div>
          <div className="dot dot-3"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;