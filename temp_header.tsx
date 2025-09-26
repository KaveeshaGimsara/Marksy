import { useState, useMemo } from "react";
import {
  Home,
  BarChart3,
  Trophy,
  User,
  Moon,
  Sun,
  Languages,
  Menu,
  Plus,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import HeartLogo from "@/components/HeartLogo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTimer } from "@/context/TimerContext";

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
  setShowAdmin,
}: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { elapsedSeconds, isRunning, isPaused } = useTimer();

  const formattedTimer = useMemo(() => {
    const hours = Math.floor(elapsedSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((elapsedSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(elapsedSeconds % 60)
      .toString()
      .padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }, [elapsedSeconds]);

  const timerStatusLabel = useMemo(() => {
    if (isRunning) {
      return language === "en" ? "Running" : "ධාවනයයි";
    }
    if (isPaused && elapsedSeconds > 0) {
      return language === "en" ? "Paused" : "විරාම";
    }
    if (elapsedSeconds > 0) {
      return language === "en" ? "Logged" : "සටහන්";
    }
    return language === "en" ? "Timer" : "කාල මාපකය";
  }, [elapsedSeconds, isPaused, isRunning, language]);

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
      icon: Plus, 
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
    { 
      id: "time-management", 
      icon: Clock, 
      label: language === "en" ? "Timer" : "ටයිමර්" 
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm supports-[backdrop-filter]:bg-background/70">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left: Logo + (Mobile) Nav Toggle Group */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center">
              <HeartLogo size={32} withText className="hidden xs:flex hover:scale-[1.02] transition-transform" />
              <HeartLogo size={28} className="xs:hidden" />
              <span className="sr-only">Marksy – {language === "en" ? "Academic Excellence Tracker" : "ශාස්ත්‍රීය විශිෂ්ටතා ට්‍රැකර්"}</span>
            </div>

            {/* Mobile Inline Nav (scrollable) */}
            <nav className="flex md:hidden overflow-x-auto no-scrollbar ml-1" aria-label="Main navigation">
              <div className="flex items-center gap-1 pr-2">
                {navItems.map(item => {
                  const Icon = item.icon; 
                  const isActive = activeSection === item.id;
                  const showRunningDot = item.id === "time-management" && isRunning;
                  return (
                    <div key={item.id} className="relative">
                      <Button
                        key={item.id}
                        variant={isActive ? "default" : "ghost"}
                        size="icon"
                        aria-label={item.label}
                        aria-current={isActive ? "page" : undefined}
                        onClick={() => setActiveSection(item.id)}
                        className={`${isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted/70"} h-10 w-10 flex-shrink-0 transition-colors duration-200`}
                      >
                        <Icon className="h-5 w-5" />
                      </Button>
                      {showRunningDot && (
                        <span className="pointer-events-none absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-red-500 shadow-lg ring-2 ring-background animate-pulse" />
                      )}
                    </div>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Desktop Navigation - Icons Only with Hover Text */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Main navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              const showRunningDot = item.id === "time-management" && isRunning;
              return (
                <div key={item.id} className="relative group">
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="icon"
                    aria-label={item.label}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setActiveSection(item.id)}
                    className={`relative transition-all duration-200 ${
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "hover:bg-primary/10 dark:hover:bg-muted/80 hover:text-primary dark:hover:text-primary"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </Button>
                  {showRunningDot && (
                    <span className="pointer-events-none absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-red-500 shadow-lg ring-2 ring-background animate-pulse" />
                  )}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-background dark:bg-card text-foreground dark:text-foreground text-xs rounded-lg border border-border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-background dark:bg-card rotate-45 border-l border-t border-border"></div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Language Toggle */}
            <div className="relative group">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLanguage}
                aria-label={language === "en" ? "Switch to Sinhala" : "Switch to English"}
                className="hover:bg-primary/10 dark:hover:bg-muted/80 hover:text-primary dark:hover:text-primary transition-all duration-200 h-9 w-9"
              >
                <Languages className="h-4 w-4" />
              </Button>
              <div className="hidden md:block absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-background dark:bg-card text-foreground dark:text-foreground text-xs rounded-lg border border-border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {language === "en" ? "සිංහල" : "English"}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-background dark:bg-card rotate-45 border-l border-t border-border" />
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="relative group">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                aria-label={isDarkMode ? (language === "en" ? "Switch to light mode" : "ආලෝක මාදිලියට") : (language === "en" ? "Switch to dark mode" : "අඳුරු මාදිලියට")}
                className="hover:bg-primary/10 dark:hover:bg-muted/80 hover:text-primary dark:hover:text-primary transition-all duration-200 h-9 w-9"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <div className="hidden md:block absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-background dark:bg-card text-foreground dark:text-foreground text-xs rounded-lg border border-border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {isDarkMode ? (language === "en" ? "Light Mode" : "ආලෝක") : (language === "en" ? "Dark Mode" : "අඳුරු")}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-background dark:bg-card rotate-45 border-l border-t border-border" />
              </div>
            </div>

            {/* Fallback mobile sheet for future extended actions */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden h-9 w-9" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 sm:w-80" aria-label="Mobile navigation drawer">
                <div className="py-4 flex flex-col h-full">
                  <h2 className="text-sm font-semibold mb-4 tracking-wide text-muted-foreground">{language === "en" ? "Navigation" : "යාත්‍රා"}</h2>
                  <nav className="space-y-1 flex-1">
                    {navItems.map(item => {
                      const Icon = item.icon; const isActive = activeSection === item.id;
                      return (
                        <Button
                          key={item.id}
                          variant={isActive ? "default" : "ghost"}
                          onClick={() => { setActiveSection(item.id); setIsMobileMenuOpen(false); }}
                          aria-current={isActive ? "page" : undefined}
                          className="w-full justify-start"
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {item.label}
                        </Button>
                      );
                    })}
                  </nav>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={toggleLanguage} className="text-xs" aria-label="Toggle language">{language === "en" ? "සිංහල" : "English"}</Button>
                    <Button variant="outline" onClick={toggleDarkMode} className="text-xs" aria-label="Toggle theme">{isDarkMode ? (language === "en" ? "Light" : "ආලෝක") : (language === "en" ? "Dark" : "අඳුරු")}</Button>
                  </div>
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