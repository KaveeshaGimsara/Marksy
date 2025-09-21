import { useState } from "react";
import { 
  Home, BookOpen, BarChart3, Trophy, User, 
  Moon, Sun, Languages, Settings, Menu, X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  language: "en" | "si";
  toggleLanguage: () => void;
  showAdmin: boolean;
  setShowAdmin: (show: boolean) => void;
}

const Header = ({ 
  activeSection, 
  setActiveSection, 
  isDarkMode, 
  toggleDarkMode, 
  language, 
  toggleLanguage,
  showAdmin,
  setShowAdmin
}: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { 
      id: "home", 
      icon: Home, 
      label: language === "en" ? "Home" : "මුල් පිටුව" 
    },
    { 
      id: "profile", 
      icon: User, 
      label: language === "en" ? "Profile" : "පැතිකඩ" 
    },
    { 
      id: "marks", 
      icon: BookOpen, 
      label: language === "en" ? "Marks" : "ලකුණු" 
    },
    { 
      id: "dashboard", 
      icon: BarChart3, 
      label: language === "en" ? "Dashboard" : "උපකරණ පුවරුව" 
    },
    { 
      id: "analysis", 
      icon: Trophy, 
      label: language === "en" ? "Analysis" : "විශ්ලේෂණය" 
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-academic rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="h-6 w-6 bg-white rounded flex items-center justify-center">
                <span className="text-primary font-bold text-sm">M</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gradient animate-fade-in">
                Marksy
              </h1>
              <p className="text-xs text-muted-foreground">
                {language === "en" ? "Academic Excellence Tracker" : "ශාස්ත්‍රීය විශිෂ්ටතා ට්‍රැකර්"}
              </p>
            </div>
          </div>

          {/* Desktop Navigation - Icons Only with Hover Text */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <div key={item.id} className="relative group">
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setActiveSection(item.id)}
                    className={`relative ${
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "hover:bg-muted/80"
                    } transition-all duration-200`}
                  >
                    <Icon className="h-5 w-5" />
                  </Button>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md border shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-popover rotate-45 border-l border-t"></div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <div className="relative group">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="hover:bg-muted/80 transition-all duration-200"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4 text-warning" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md border shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {isDarkMode ? (language === "en" ? "Light Mode" : "ආලෝක මාදිලිය") : (language === "en" ? "Dark Mode" : "අඳුරු මාදිලිය")}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-popover rotate-45 border-l border-t"></div>
              </div>
            </div>

            {/* Language Toggle */}
            <div className="relative group">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLanguage}
                className="hover:bg-muted/80 transition-all duration-200"
              >
                <Languages className="h-4 w-4" />
              </Button>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md border shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {language === "en" ? "සිංහල" : "English"}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-popover rotate-45 border-l border-t"></div>
              </div>
            </div>


            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="py-4">
                  <h2 className="text-lg font-semibold mb-4">Navigation</h2>
                  <nav className="space-y-2">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeSection === item.id;
                      
                      return (
                        <Button
                          key={item.id}
                          variant={isActive ? "default" : "ghost"}
                          onClick={() => {
                            setActiveSection(item.id);
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full justify-start"
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {item.label}
                        </Button>
                      );
                    })}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;