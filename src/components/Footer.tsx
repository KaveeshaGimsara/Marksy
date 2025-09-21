import { useState } from "react";
import { HelpCircle, Star, Settings, Heart, ExternalLink } from "lucide-react";
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
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-academic rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Marksy</h3>
                <p className="text-xs text-muted-foreground">
                  {language === "en" ? "Academic Progress Tracker" : "අධ්‍යාපනික ප්‍රගති ට්‍රැකර්"}
                </p>
              </div>
            </div>
          </div>

          {/* Center - Quick Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveSection("about")}
              className="flex items-center space-x-1 hover:bg-primary/10 transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
              <span className="text-xs">{language === "en" ? "About" : "පිළිබඳ"}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveSection("help")}
              className="flex items-center space-x-1 hover:bg-primary/10 transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
              <span className="text-xs">{language === "en" ? "Help" : "උදව්"}</span>
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
          </div>

          {/* Right side - Version & Copyright */}
          <div className="flex items-center space-x-3">
            <div className="text-xs text-muted-foreground animate-pulse">
              <span className="bg-primary/10 px-2 py-1 rounded">v1.0.0</span>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <span>© 2024 Made with</span>
              <Heart className="h-3 w-3 fill-current text-red-500 inline mx-1" />
              <span>by Kaveesha</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;