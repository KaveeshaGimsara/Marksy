import React from 'react';
import HomePage from '@/components/HomePage';

/**
 * Standalone Home Page Route
 * This component renders the home page independently without the main app navigation
 * Perfect for showcasing the dashboard as a standalone page
 */
const StandaloneHomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <HomePage />
    </div>
  );
};

export default StandaloneHomePage;