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
    <footer className="relative border-t bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/40 mt-auto">
      {/* Wave background removed on very small screens for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
        <div className="absolute bottom-0 left-0 w-full h-8 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z" fill="currentColor" className="text-primary animate-pulse" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-center lg:items-start justify-between">
          {/* Branding + Version */}
          <div className="flex flex-col items-center lg:items-start gap-2 text-center lg:text-left">
            <HeartLogo size={30} withText />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveSection("version")}
              className="text-xs text-muted-foreground hover:bg-primary/10 transition-colors"
            >
              <span className="bg-primary/10 px-2 py-1 rounded font-mono hover:bg-primary/20 transition-colors">{currentVersion}</span>
            </Button>
          </div>

            {/* Quick Links */}
          <nav className="flex flex-wrap justify-center gap-2 text-xs" aria-label="Footer">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveSection("about")}
              className={`text-xs px-2 h-7 ${activeSection === "about" ? "bg-primary/20 text-primary" : "hover:bg-primary/10"}`}
            >
              {language === 'en' ? 'About' : 'ගැන'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveSection("license")}
              className={`text-xs px-2 h-7 ${activeSection === "license" ? "bg-primary/20 text-primary" : "hover:bg-primary/10"}`}
            >
              <Code className="h-3 w-3 mr-1" />
              {language === 'en' ? 'License' : 'බලපත්‍රය'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveSection("help")}
              className={`text-xs px-2 h-7 ${activeSection === "help" ? "bg-primary/20 text-primary" : "hover:bg-primary/10"}`}
            >
              <HelpCircle className="h-3 w-3 mr-1" />
              {language === 'en' ? 'Help' : 'උදව්'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveSection("credits")}
              className={`text-xs px-2 h-7 ${activeSection === "credits" ? "bg-primary/20 text-primary" : "hover:bg-primary/10"}`}
            >
              <Star className="h-3 w-3 mr-1" />
              {language === "en" ? "Credits" : "කෘති"}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs px-2 h-7 hover:bg-orange-50 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:bg-orange-900/30 dark:hover:text-orange-300"
                >
                  <Coffee className="h-3 w-3 mr-1" />
                  {language === 'en' ? 'Support' : 'සහාය'}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Coffee className="h-5 w-5 text-orange-600" />
                    {language === 'en' ? 'Support Our Mission' : 'අපගේ මෙහෙයවීම සඳහා සහාය වන්න'}
                  </DialogTitle>
                  <DialogDescription>
                    {language === 'en' ? 'Help us keep this tool free and improve it for A/L students' : 'A/L සිසුන් සඳහා මෙය නොමිලේ තබාගැනීමට සහ වැඩිදියුණු කිරීමට අපට உதවන්න'}
                  </DialogDescription>
                </DialogHeader>
                <BuyMeCoffee variant="inline" />
              </DialogContent>
            </Dialog>
          </nav>

          {/* Copyright */}
          <div className="flex flex-col items-center lg:items-end gap-1 text-center lg:text-right text-xs text-muted-foreground">
            <div>
              © 2025 <Heart className="h-3 w-3 inline mx-1 text-red-500" /> {language === "en" ? "Made for Sri Lankan Students" : "ශ්‍රී ලාංකික සිසුන් සඳහා"}
            </div>
            <div className="opacity-70 tracking-wide">
              {language === 'en' ? 'Optimized mobile experience' : 'ජංගමයට දියුණු කල මෙහෙයුම'}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;