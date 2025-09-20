import { useState, useEffect } from "react";
import { BookOpen, BarChart3, Trophy, User, HelpCircle, UserCircle, Award, Home } from "lucide-react";
import Header from "@/components/Header";
import HomePage from "@/components/HomePage";
import AddMarks from "@/components/AddMarks";
import Dashboard from "@/components/Dashboard";
import SubjectAnalysis from "@/components/SubjectAnalysis";
import AboutPage from "@/components/AboutPage";
import HelpPage from "@/components/HelpPage";
import ProfilePage from "@/components/ProfilePage";
import CreditsPage from "@/components/CreditsPage";
import Footer from "@/components/Footer";
import LoadingAnimation from "@/components/LoadingAnimationNew";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const navigationItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "addMarks", label: "Add Marks", icon: BookOpen },
    { id: "dashboard", label: "Progress Dashboard", icon: BarChart3 },
    { id: "analysis", label: "Subject Analysis", icon: Trophy },
    { id: "profile", label: "Profile", icon: UserCircle },
    { id: "about", label: "About", icon: User },
    { id: "help", label: "Help", icon: HelpCircle },
    { id: "credits", label: "Credits", icon: Award },
  ];

  useEffect(() => {
    // Simulate loading time and show loading animation
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setShowContent(true), 300);
    }, 3000); // Show loading for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  const renderActiveSection = () => {
    switch (activeSection) {
      case "home":
        return <HomePage />;
      case "addMarks":
        return <AddMarks />;
      case "dashboard":
        return <Dashboard />;
      case "analysis":
        return <SubjectAnalysis />;
      case "profile":
        return <ProfilePage />;
      case "about":
        return <AboutPage />;
      case "help":
        return <HelpPage />;
      case "credits":
        return <CreditsPage />;
      default:
        return <AddMarks />;
    }
  };

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 transition-opacity duration-500 main-container ${showContent ? 'opacity-100' : 'opacity-0'}`}>
      <Header 
        navigationItems={navigationItems}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 pb-20 sm:pb-8 custom-scrollbar">
        <div className="animate-fade-in">
          {renderActiveSection()}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;