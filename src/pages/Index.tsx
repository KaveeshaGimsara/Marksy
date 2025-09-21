import { useState, useEffect } from "react";
import { 
  Home, BookOpen, BarChart3, Trophy, User, HelpCircle, Star, 
  Moon, Sun, Languages, Settings 
} from "lucide-react";
import Header from "@/components/Header";
import Homepage from "@/components/Homepage";
import ProfilePage from "@/components/ProfilePage";
import AddMarks from "@/components/AddMarks";
import Dashboard from "@/components/Dashboard";
import SubjectAnalysis from "@/components/SubjectAnalysis";
import AboutPage from "@/components/AboutPage";
import HelpPage from "@/components/HelpPage";
import CreditsPage from "@/components/CreditsPage";
import VersionPage from "@/components/VersionPage";
import Footer from "@/components/Footer";
import BuyMeCoffee from "@/components/BuyMeCoffee";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<"en" | "si">("en");
  const [showAdmin, setShowAdmin] = useState(false);
  const { toast } = useToast();

  // Load theme preference - default to light mode
  useEffect(() => {
    const savedTheme = localStorage.getItem("marksy-theme");
    const savedLanguage = localStorage.getItem("marksy-language");
    
    // Default to light mode - only switch to dark if explicitly saved
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      // Ensure light mode is active by default
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
      if (!savedTheme) {
        localStorage.setItem("marksy-theme", "light");
      }
    }
    
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "si")) {
      setLanguage(savedLanguage as "en" | "si");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("marksy-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("marksy-theme", "light");
    }
    
    toast({
      title: `${newTheme ? "Dark" : "Light"} mode activated`,
      description: "Theme preference saved"
    });
  };

  const toggleLanguage = () => {
    const newLang = language === "en" ? "si" : "en";
    setLanguage(newLang);
    localStorage.setItem("marksy-language", newLang);
    
    toast({
      title: newLang === "en" ? "English activated" : "සිංහල සක්‍රීය කරන ලදී",
      description: newLang === "en" ? "Language switched to English" : "භාෂාව සිංහල වෙත මාරු විය"
    });
  };

  const navigationItems = [
    { id: "home", label: language === "en" ? "Home" : "මුල් පිටුව", icon: Home },
    { id: "marks", label: language === "en" ? "Add Marks" : "ලකුණු එකතු කරන්න", icon: BookOpen },
    { id: "dashboard", label: language === "en" ? "Progress" : "ප්‍රගතිය", icon: BarChart3 },
    { id: "analysis", label: language === "en" ? "Analysis" : "විශ්ලේෂණය", icon: Trophy },
    { id: "about", label: language === "en" ? "About" : "පිළිබඳව", icon: User },
    { id: "help", label: language === "en" ? "Help" : "උදව්", icon: HelpCircle },
    { id: "credits", label: language === "en" ? "Credits" : "ගෞරවය", icon: Star },
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case "home":
        return <Homepage language={language} onNavigate={setActiveSection} />;
      case "profile":
        return <ProfilePage language={language} />;
      case "addmarks":
      case "marks":
        return <AddMarks language={language} />;
      case "dashboard":
        return <Dashboard language={language} />;
      case "analysis":
        return <SubjectAnalysis language={language} />;
      case "about":
        return <AboutPage language={language} />;
      case "help":
        return <HelpPage language={language} />;
      case "credits":
        return <CreditsPage />;
      case "version":
        return <VersionPage language={language} />;
      default:
        return <Homepage language={language} onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Header 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleTheme}
        language={language}
        toggleLanguage={toggleLanguage}
        showAdmin={showAdmin}
        setShowAdmin={setShowAdmin}
      />
      
      <main className="transition-all duration-300">
        <div className="animate-fade-in">
          {renderActiveSection()}
        </div>
      </main>

      <Footer 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        showAdmin={showAdmin}
        setShowAdmin={setShowAdmin}
        language={language} 
      />
    </div>
  );
};

export default Index;