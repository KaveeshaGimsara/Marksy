import React from 'react';
import { MessageSquare, Github, Heart } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="wave-footer text-white py-12 mt-16">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-lg font-semibold">AL Marks Analyzer</h3>
            <p className="text-white/80 text-sm">Track your Advanced Level progress</p>
          </div>
          
          <div className="flex items-center space-x-6">
            <a 
              href="https://t.me/kaveesha_gimsara" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm">Telegram</span>
            </a>
            <a 
              href="#" 
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
            >
              <Github className="h-4 w-4" />
              <span className="text-sm">GitHub</span>
            </a>
            <div className="flex items-center space-x-1 text-white/80">
              <span className="text-sm">Built with</span>
              <Heart className="h-3 w-3 fill-current" />
              <span className="text-sm">by Kaveesha Gimsara</span>
            </div>
          </div>
        </div>
      </div>
      <div className="py-4 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Marksy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;