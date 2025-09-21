import { useState } from "react";
import versionsData from "@/versioning/versions.json";
import { HelpCircle, Star, Settings, Heart, ExternalLink, Code, Coffee } from "lucide-react";
import HeartLogo from "@/components/HeartLogo";
import BuyMeCoffee from "@/components/BuyMeCoffee";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FooterProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  showAdmin: boolean;
  setShowAdmin: (show: boolean) => void;
  language: "en" | "si";
}

const Footer = ({ activeSection, setActiveSection, showAdmin, setShowAdmin, language }: FooterProps) => {
  const [showAdDialog, setShowAdDialog] = useState(false);

  const currentVersion = (versionsData as any[])[0]?.version || "v0.0.0";

  return (
    <footer className="relative border-t bg-card/50 backdrop-blur-sm mt-auto">
      {/* Animated Wave Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-8 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path 
              d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z" 
              fill="currentColor"
              className="text-primary animate-pulse"
            />
          </svg>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left side - Branding */}
          <div className="flex items-center space-x-3">
            <HeartLogo size={32} withText />
          </div>

          {/* Center - Quick Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveSection("about")}
              className={`text-xs transition-colors ${
                activeSection === "about" ? "bg-primary/20 text-primary" : "hover:bg-primary/10"
              }`}
            >
              About
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveSection("license")}
              className={`text-xs transition-colors ${
                activeSection === "license" ? "bg-primary/20 text-primary" : "hover:bg-primary/10"
              }`}
            >
              <Code className="h-3 w-3 mr-1" />
              {language === 'en' ? 'License' : 'බලපත්‍රය'}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveSection("help")}
              className={`text-xs transition-colors ${
                activeSection === "help" ? "bg-primary/20 text-primary" : "hover:bg-primary/10"
              }`}
            >
              <HelpCircle className="h-3 w-3 mr-1" />
              Help
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveSection("credits")}
              className="flex items-center space-x-1 hover:bg-primary/10 transition-colors"
            >
              <Star className="h-4 w-4" />
              <span className="text-xs">{language === "en" ? "Credits" : "කෘතිත්ව"}</span>
            </Button>

            {/* Buy Me Coffee Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 hover:bg-orange-50 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:bg-orange-900/30 dark:hover:text-orange-300 transition-colors"
                >
                  <Coffee className="h-4 w-4" />
                  <span className="text-xs">{language === "en" ? "Support" : "සහාය"}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Coffee className="h-5 w-5 text-orange-600" />
                    Support Our Mission
                  </DialogTitle>
                  <DialogDescription>
                    Help us keep this tool free and improve it for A/L students
                  </DialogDescription>
                </DialogHeader>
                <BuyMeCoffee variant="inline" />
              </DialogContent>
            </Dialog>
          </div>

          {/* Right side - Version & Copyright */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveSection("version")}
              className="text-xs text-muted-foreground hover:bg-primary/10 transition-colors"
            >
              <span className="bg-primary/10 px-2 py-1 rounded font-mono hover:bg-primary/20 transition-colors">{currentVersion}</span>
            </Button>
            
            <div className="text-xs text-muted-foreground">
              <span>© 2025</span>
              <Heart className="h-3 w-3 fill-current text-red-500 inline mx-1" />
              <span>{language === "en" ? "Made for Sri Lankan Students" : "ශ්‍රී ලාංකික සිසුන් සඳහා නිර්මිත"}</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;