import { useEffect, useState, useRef } from "react";
import { Star, Heart } from "lucide-react";

const CreditsPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    setIsVisible(true);
    
    const scroll = () => {
      if (isAutoScrolling && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        container.scrollTop += 0.8; // Slower, smoother scroll
        
        // Loop back to top when reaching bottom with 2 second delay
        if (container.scrollTop >= container.scrollHeight - container.clientHeight) {
          setIsAutoScrolling(false);
          setTimeout(() => {
            container.scrollTop = 0;
            setIsAutoScrolling(true);
          }, 2000); // 2 second pause before restarting
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
    setTimeout(() => setIsAutoScrolling(true), 2000); // Resume auto-scroll after 2 seconds
  };

  const credits = [
    {
      title: "🎓 MARKSY",
      subtitle: "Academic Progress Tracker for Sri Lankan Students",
      type: "main"
    },
    {
      title: "👨‍💻 Developer",
      subtitle: "KAVEESHA GIMSARA",
      type: "developer"
    },
    {
      title: "🔗 APIs & Integrations",
      items: [
        "📊 Chart.js API for Interactive Visualizations",
        "💾 localStorage Web API for Data Persistence",
        "📱 Progressive Web App APIs",
        "🌐 Browser File System API for Export/Import",
        "⚡ Vite HMR API for Development"
      ],
      type: "category"
    },
    {
      title: "🧪 Testing & QA Tools",
      items: [
        "✅ TypeScript Compiler for Type Safety",
        "🔍 ESLint for Code Quality",
        "🎨 Prettier for Code Formatting",
        "🚀 Vite Dev Tools for Performance",
        "📱 Chrome DevTools for Debugging"
      ],
      type: "category"
    },
    {
      title: "🗂️ Version Control",
      items: [
        "📋 GitHub Repository Management",
        "🌿 Git Branching Strategies",
        "📝 Conventional Commits",
        "🔄 Pull Request Workflows"
      ],
      type: "category"
    },
    {
      title: "🚀 Continuous Integration & Delivery",
      items: [
        "⚙️ GitHub Actions for CI/CD",
        "🔧 Automated Build Pipeline",
        "📦 Dependency Updates",
        "🌐 Deployment Automation"
      ],
      type: "category"
    },
    {
      title: "⚡ Performance Optimization",
      items: [
        "🎯 React Lazy Loading",
        "📦 Code Splitting with Vite",
        "🗜️ Asset Compression",
        "💨 Efficient Re-rendering",
        "🔄 LocalStorage Optimization"
      ],
      type: "category"
    },
    {
      title: "🔐 Security & Privacy",
      items: [
        "🛡️ Client-side Data Encryption",
        "🔒 Secure Local Storage",
        "🚫 No External Data Collection",
        "🌐 HTTPS Enforcement",
        "🔑 Input Validation & Sanitization"
      ],
      type: "category"
    },
    {
      title: "📚 Learning Resources",
      items: [
        "🤖 ChatGPT for Code Assistance",
        "🧠 DeepSeek for Problem Solving",
        "👥 GitHub Copilot for Development",
        "📖 React Documentation",
        "🎓 TypeScript Handbook"
      ],
      type: "category"
    },
    {
      title: "🚀 Future Features",
      items: [
        "☁️ Cloud Synchronization",
        "👥 Multi-user Support",
        "📱 Mobile App Development",
        "🤖 AI-powered Study Recommendations",
        "📈 Advanced Analytics Dashboard",
        "🎯 Goal Setting & Achievement System"
      ],
      type: "category"
    },
    {
      title: "💎 Sponsors & Supporters",
      items: [
        "🎓 GeekyEdu - Educational Technology",
        "🏆 IQUP - Academic Excellence Platform",
        "👨‍🏫 Udeesha Abeynayaka - Mentor & Guide",
        "💝 Community Contributors"
      ],
      type: "category"
    },
    {
      title: "🧪 Beta Testers",
      items: [
        "🎓 A/L Students Community",
        "💬 Telegram Group Members",
        "🤝 Anonymous Contributors",
        "📱 Early Adopters & Feedback Providers"
      ],
      type: "category"
    },
    {
      title: "⚖️ Licensing & Legal",
      items: [
        "📜 MIT License - Open Source",
        "🔓 Free for Educational Use",
        "📋 Terms of Service Compliance",
        "🛡️ Privacy Policy Adherence",
        "⚡ Fair Use Guidelines"
      ],
      type: "category"
    },
    {
      title: "🙏 Acknowledgements",
      items: [
        "🌟 Open Source Heroes & Contributors",
        "👨‍🏫 Educational Mentors & Teachers",
        "🤝 React & TypeScript Community",
        "💡 shadcn/ui Component Library",
        "🎨 Tailwind CSS Framework Team"
      ],
      type: "category"
    },
    {
      title: "🎯 Mission",
      subtitle: "🌟 Empowering Sri Lankan Students with Intuitive Progress Tracking 🚀",
      type: "mission"
    },
    {
      title: "© 2025 MARKSY",
      subtitle: "🇱🇰 Made with ❤️ for Sri Lankan Students 🎓",
      type: "footer"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Movie Credits Container */}
      <div 
        ref={scrollContainerRef}
        className="h-screen overflow-hidden relative"
        onWheel={handleManualScroll}
        onMouseMove={handleManualScroll}
      >
        {/* Colorful Stars Background */}
        <div className="absolute inset-0">
          {[...Array(150)].map((_, i) => {
            const colors = ['bg-cyan-400', 'bg-purple-400', 'bg-pink-400', 'bg-yellow-400', 'bg-green-400', 'bg-blue-400'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            return (
              <div
                key={i}
                className={`absolute w-1 h-1 ${randomColor} rounded-full animate-pulse`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  opacity: Math.random() * 0.8 + 0.2
                }}
              />
            );
          })}
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
                  <h1 className="text-8xl font-bold tracking-wider bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                    {credit.title}
                  </h1>
                  <p className="text-3xl text-cyan-200 tracking-wide">
                    {credit.subtitle}
                  </p>
                </div>
              )}

              {credit.type === "developer" && (
                <div className="space-y-4">
                  <h2 className="text-2xl text-yellow-300 tracking-wider uppercase">
                    {credit.title}
                  </h2>
                  <h3 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent tracking-wide">
                    {credit.subtitle}
                  </h3>
                </div>
              )}

              {credit.type === "section" && (
                <div className="py-8">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent tracking-wider uppercase">
                    {credit.title}
                  </h2>
                  <div className="w-32 h-0.5 bg-gradient-to-r from-green-400 to-blue-400 mx-auto mt-4"></div>
                </div>
              )}

              {credit.type === "category" && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent tracking-wide uppercase">
                    {credit.title}
                  </h3>
                  <div className="space-y-3">
                    {credit.items?.map((item, itemIndex) => (
                      <p key={itemIndex} className="text-lg text-blue-200 tracking-wide hover:text-white transition-colors duration-300">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {credit.type === "mission" && (
                <div className="space-y-6 py-12">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent tracking-wider uppercase">
                    {credit.title}
                  </h2>
                  <p className="text-2xl bg-gradient-to-r from-pink-300 to-violet-300 bg-clip-text text-transparent tracking-wide max-w-2xl mx-auto leading-relaxed">
                    {credit.subtitle}
                  </p>
                </div>
              )}

              {credit.type === "footer" && (
                <div className="space-y-6 py-16">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent tracking-wider">
                    {credit.title}
                  </h2>
                  <p className="text-xl bg-gradient-to-r from-red-300 to-pink-300 bg-clip-text text-transparent tracking-wide">
                    {credit.subtitle}
                  </p>
                  <div className="flex justify-center items-center space-x-2 pt-8">
                    <Heart className="h-8 w-8 fill-current text-red-400 animate-pulse" />
                    <Star className="h-6 w-6 fill-current text-yellow-400 animate-pulse" />
                    <Heart className="h-8 w-8 fill-current text-red-400 animate-pulse" />
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