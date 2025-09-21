import { useEffect, useState, useRef } from "react";
import { Star, Heart, Code, Palette, Zap, Play, Pause } from "lucide-react";
import { CreditsPageProps } from "@/types";

const CreditsPage = ({ language }: CreditsPageProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    setIsVisible(true);
    
    const scroll = () => {
      if (isAutoScrolling && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        container.scrollTop += 1;
        
        // Loop back to top when reaching bottom
        if (container.scrollTop >= container.scrollHeight - container.clientHeight) {
          container.scrollTop = 0;
        }
      }
      animationRef.current = requestAnimationFrame(scroll);
    };

    animationRef.current = requestAnimationFrame(scroll);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAutoScrolling]);

  const handleManualScroll = () => {
    setIsAutoScrolling(false);
    setTimeout(() => setIsAutoScrolling(true), 3000); // Resume auto-scroll after 3 seconds
  };

  const credits = [
    {
      title: "MARKSY",
      subtitle: "Academic Progress Tracker",
      type: "main"
    },
    {
      title: "Developed by",
      subtitle: "KAVEESHA GIMSARA",
      type: "developer"
    },
    {
      title: "Development Team",
      type: "section"
    },
    {
      title: "Frontend Technologies",
      items: [
        "React 18",
        "TypeScript",
        "Vite",
        "Tailwind CSS"
      ],
      type: "category"
    },
    {
      title: "UI Framework",
      items: [
        "shadcn/ui",
        "Radix UI",
        "Lucide React",
        "Class Variance Authority"
      ],
      type: "category"
    },
    {
      title: "Data Visualization",
      items: [
        "Chart.js",
        "React Chart.js 2",
        "Recharts"
      ],
      type: "category"
    },
    {
      title: "Build Tools",
      items: [
        "Vite Development Server",
        "TypeScript Compiler",
        "PostCSS",
        "Autoprefixer"
      ],
      type: "category"
    },
    {
      title: "Design Inspiration",
      items: [
        "Sri Lankan Education System",
        "Modern Dashboard Interfaces",
        "Academic Progress Tracking",
        "Student-Centered Design"
      ],
      type: "category"
    },
    {
      title: "Special Thanks",
      items: [
        "A/L Students of Sri Lanka",
        "Open Source Community",
        "Lovable Development Platform",
        "Educational Technology Enthusiasts"
      ],
      type: "category"
    },
    {
      title: "Mission",
      subtitle: "Empowering students with intuitive progress tracking",
      type: "mission"
    },
    {
      title: "© 2024 MARKSY",
      subtitle: "Made with ❤️ for Sri Lankan Students",
      type: "footer"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setIsAutoScrolling(!isAutoScrolling)}
          className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 p-2 rounded-lg transition-all"
        >
          {isAutoScrolling ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
      </div>

      {/* Movie Credits Container */}
      <div 
        ref={scrollContainerRef}
        className="h-screen overflow-hidden relative"
        onWheel={handleManualScroll}
        onMouseMove={handleManualScroll}
      >
        {/* Stars Background */}
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.8 + 0.2
              }}
            />
          ))}
        </div>

        {/* Credits Content */}
        <div className="relative z-10 pt-screen">
          {credits.map((credit, index) => (
            <div 
              key={index} 
              className="text-center py-12 px-8"
              style={{
                transform: `perspective(1000px) rotateX(${Math.sin(index * 0.1) * 2}deg)`,
              }}
            >
              {credit.type === "main" && (
                <div className="space-y-6">
                  <h1 className="text-8xl font-bold tracking-wider bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent animate-pulse">
                    {credit.title}
                  </h1>
                  <p className="text-3xl text-white/80 tracking-wide">
                    {credit.subtitle}
                  </p>
                </div>
              )}

              {credit.type === "developer" && (
                <div className="space-y-4">
                  <h2 className="text-2xl text-white/60 tracking-wider uppercase">
                    {credit.title}
                  </h2>
                  <h3 className="text-5xl font-bold text-white tracking-wide">
                    {credit.subtitle}
                  </h3>
                </div>
              )}

              {credit.type === "section" && (
                <div className="py-8">
                  <h2 className="text-4xl font-bold text-white/90 tracking-wider uppercase">
                    {credit.title}
                  </h2>
                  <div className="w-32 h-0.5 bg-white/50 mx-auto mt-4"></div>
                </div>
              )}

              {credit.type === "category" && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-white/70 tracking-wide uppercase">
                    {credit.title}
                  </h3>
                  <div className="space-y-3">
                    {credit.items?.map((item, itemIndex) => (
                      <p key={itemIndex} className="text-xl text-white/90 tracking-wide">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {credit.type === "mission" && (
                <div className="space-y-6 py-12">
                  <h2 className="text-3xl font-bold text-white/80 tracking-wider uppercase">
                    {credit.title}
                  </h2>
                  <p className="text-2xl text-white/70 tracking-wide max-w-2xl mx-auto leading-relaxed">
                    {credit.subtitle}
                  </p>
                </div>
              )}

              {credit.type === "footer" && (
                <div className="space-y-6 py-16">
                  <h2 className="text-4xl font-bold text-white/90 tracking-wider">
                    {credit.title}
                  </h2>
                  <p className="text-xl text-white/70 tracking-wide">
                    {credit.subtitle}
                  </p>
                  <div className="flex justify-center items-center space-x-2 pt-8">
                    <Heart className="h-6 w-6 fill-current text-red-400 animate-pulse" />
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Add extra space for seamless loop */}
          <div className="h-screen"></div>
        </div>
      </div>
    </div>
  );
};

export default CreditsPage;