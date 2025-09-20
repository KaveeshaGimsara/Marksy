import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Coffee, DollarSign, Gift, RefreshCw, Play, Pause } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CreditsPage = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const creditsRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const focusedIndexRef = useRef<number | null>(null);
  const [isPaused, setIsPaused] = useState(true); // Start paused to allow delay
  const [isManualScroll, setIsManualScroll] = useState(false);
  const [activeSection, setActiveSection] = useState("credits");
  
  // Initial animation delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPaused(false);
    }, 500); // 0.5 second delay before auto-scrolling starts
    
    return () => clearTimeout(timer);
  }, []);
  
  // Animation control functions
  const restartAnimation = () => {
    // Reset offset and resume
    offsetRef.current = 0;
    if (scrollWrapperRef.current) {
      scrollWrapperRef.current.style.transform = `translateY(0px)`;
    }
    setIsPaused(false);
    
    // Reset scroll position if in manual mode
    if (isManualScroll && creditsRef.current) {
      creditsRef.current.scrollTop = 0;
    }
  };
  
  const togglePause = () => {
    setIsPaused(p => !p);
  };
  
  const toggleScrollMode = () => {
    setIsManualScroll(prev => !prev);
    // Reset position when switching modes
    if (scrollWrapperRef.current) {
      offsetRef.current = 0;
      scrollWrapperRef.current.style.transform = `translateY(0px)`;
    }
    if (creditsRef.current) {
      creditsRef.current.scrollTop = 0;
    }
  };
  
  // Space bar control
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        togglePause();
        e.preventDefault();
      }
    };
    
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isPaused]);
  
  // Seamless scrolling loop with focus detection
  useEffect(() => {
    // Skip animation if in manual scroll mode
    if (isManualScroll) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    const speed = 0.35; // pixels per frame (~21px/s @60fps)

    const step = () => {
      if (!scrollWrapperRef.current || !blockRef.current) return;
      if (!isPaused) {
        offsetRef.current -= speed;
        const blockHeight = blockRef.current.offsetHeight;
        // If we've scrolled an entire block, wrap seamlessly
        if (offsetRef.current <= -blockHeight) {
          offsetRef.current += blockHeight; // wrap
        }
        scrollWrapperRef.current.style.transform = `translateY(${offsetRef.current}px)`;
        // Center focus logic
        const viewport = creditsRef.current;
        if (viewport) {
          const viewRect = viewport.getBoundingClientRect();
            const centerY = viewRect.top + viewRect.height / 2;
            const sections = viewport.querySelectorAll<HTMLElement>('.credits-section');
            let closest: {idx:number;dist:number} | null = null;
            sections.forEach((sec, idx) => {
              const r = sec.getBoundingClientRect();
              const secCenter = r.top + r.height/2;
              const dist = Math.abs(secCenter - centerY);
              if (!closest || dist < closest.dist) closest = { idx, dist };
            });
            if (closest && closest.idx !== focusedIndexRef.current) {
              // update classes
              sections.forEach((sec, idx) => {
                if (idx === closest!.idx) sec.classList.add('focus'); else sec.classList.remove('focus');
              });
              focusedIndexRef.current = closest.idx;
            }
        }
      }
      animFrameRef.current = requestAnimationFrame(step);
    };
    animFrameRef.current = requestAnimationFrame(step);
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, [isPaused]);
  
  // Handle section change (for header navigation)
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    // You could add navigation here if needed
  };
  
  const isDark = theme === 'dark';
  
  // Define credits sections once to reuse in both original and duplicate blocks
  const creditsSections = [
    { title: '🎬 Directed By', body: (<p className='text-sm md:text-base'>Kaveesha Gimsara (KGX)</p>) },
    { title: '📽️ Produced By', body: (<p className='text-sm md:text-base'>Marksy Development Team</p>) },
    { title: '🏢 Executive Producer', body: (<p className='text-sm md:text-base'>Educational Excellence Initiative</p>) },
    { title: '✨ UI/UX Design', body: (<p className='text-sm md:text-base'>Lovable Design Studio</p>) },
    { title: '🤖 AI Support', body: (<div className='space-y-1 text-sm md:text-base'><p>GitHub Copilot</p><p>DeepSeek</p><p>ChatGPT</p></div>) },
    { title: '✅ Quality Assurance', body: (<div className='space-y-1 text-sm md:text-base'><p>🧪 Lead Tester: KGX</p><p>🔍 Testing Team: Beta Users & Community</p></div>) },
    { title: '📚 Languages Used', body: (<div className='space-y-1 text-sm md:text-base'><p>English - Primary language of instruction</p><p>Sinhala - Local language support</p></div>) },
    { title: '🛠️ Technology Stack', body: (<div className='space-y-1 text-sm md:text-base'><p>☁️ Hosted On: Vercel</p><p>⚛️ Built With: React.js & TypeScript</p><p>🎀 Styled With: Tailwind CSS</p><p>📤 Deployed Via: GitHub Actions</p><p>💎 Designed In: VS Code</p></div>) },
    { title: '🤝 Partners', body: (<div className='space-y-1 text-sm md:text-base'><p>Udeesha Abeynayaka</p><p>IQUP Team</p><p>GeekyEdu Team</p></div>) },
    { title: '❤️ Made with love', body: (<div className='space-y-1 text-sm md:text-base'><p>For Educational Excellence</p><p>Thank you for using Marksy</p><p>© {new Date().getFullYear()} Marksy. All rights reserved.</p></div>) }
  ];
  
  // Function to render a credits section
  const renderCreditsSection = (sec: typeof creditsSections[0], idx: number, isOriginal = true) => (
    <section key={idx} className={`credits-section group ${isOriginal ? '' : 'duplicate'}`}>
      <h2 className="text-2xl md:text-3xl font-extrabold mb-3 tracking-wide bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
        <span className="inline-block">{sec.title}</span>
      </h2>
      <div className="prose-sm md:prose-base prose-headings:m-0 max-w-none font-semibold leading-relaxed">
        <div className={`${isDark ? 'text-slate-200' : 'text-slate-700'} space-y-1 md:space-y-1.5`}>
          {sec.body}
        </div>
      </div>
      <div className="h-px w-1/2 mx-auto mt-6 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-60 group-hover:via-secondary/60 transition-colors" />
    </section>
  );

  // Ensure changes are applied by modifying something visible
  useEffect(() => {
    // Force re-render and ensure changes are applied
    const forceUpdate = setTimeout(() => {
      if (scrollWrapperRef.current) {
        // Reset position to ensure changes are visible
        offsetRef.current = 0;
        scrollWrapperRef.current.style.transform = 'translateY(0px)';
        
        // Then start animation after a brief delay
        setTimeout(() => {
          setIsPaused(false);
        }, 500);
      }
    }, 100);
    
    return () => clearTimeout(forceUpdate);
  }, []);
  
  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-slate-900' : 'bg-blue-50'}`}>
      {/* Add a key to force re-render */}
      <main key="credits-main-content" className="flex-grow container mx-auto px-4 py-4">
      <Card className={`shadow-xl mb-6 ${isDark ? 'border-slate-700 bg-slate-800/80' : 'border-blue-200 bg-white/90'} backdrop-blur-md`}>
        <CardContent className="p-6">
        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          <button
          onClick={restartAnimation}
          className={`flex items-center gap-2 px-4 py-2 rounded-md border ${
            isDark 
            ? 'border-blue-700 bg-blue-900/20 hover:bg-blue-800/30 text-blue-200' 
            : 'border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700'
          } transition-colors`}
          >
          <RefreshCw className="h-4 w-4" />
          {t("credits.restart")}
          </button>
          
          <button
          onClick={togglePause}
          className={`flex items-center gap-2 px-4 py-2 rounded-md border ${
            isPaused
            ? isDark ? 'border-green-700 bg-green-900/20 hover:bg-green-800/30 text-green-200' 
                     : 'border-green-300 bg-green-50 hover:bg-green-100 text-green-700'
            : isDark ? 'border-purple-700 bg-purple-900/20 hover:bg-purple-800/30 text-purple-200' 
                     : 'border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-700'
          } transition-colors`}
          >
          {isPaused ? (
            <>
            <Play className="h-4 w-4" />
            {t("credits.resume")}
            </>
          ) : (
            <>
            <Pause className="h-4 w-4" />
            {t("credits.pause")}
            </>
          )}
          </button>
        </div>
        
  {/* Animated scrolling credits container with both auto and manual scroll */}
  <div 
    ref={creditsRef} 
    className={`relative h-[60vh] rounded-2xl shadow-inner ${
      isDark ? 'bg-slate-900/70 border-slate-700/60' : 'bg-white/80 border-blue-300/60'
    } border overflow-y-auto scrollbar-hide`}
  >
          {/* Floating math / symbolic background */}
          <div className="absolute inset-0 pointer-events-none select-none">
            {['×','+','−','÷','=','%','<','>','{','}','∑','∫','π','≠','≈','∏','√','∞','∆'].map((symbol,i)=>(
              <div
                key={i}
                className={`absolute font-bold ${isDark ? 'text-indigo-500/15' : 'text-blue-700/15'}`}
                style={{
                  left: `${Math.random()*95}%`,
                  top: `${Math.random()*95}%`,
                  fontSize: `${Math.random()*24+18}px`,
                  animation: `float ${Math.random()*15+12}s ease-in-out infinite`,
                  animationDelay: `${Math.random()*3}s`,
                  opacity: Math.random()*0.25+0.05
                }}
              >{symbol}</div>
            ))}
          </div>
          {/* Scroll layer */}
          <div
            ref={scrollWrapperRef}
            className="absolute w-full left-0 px-6 md:px-10 will-change-transform"
            style={{ transform: 'translateY(0px)' }}
          >
            {/* First block of credits */}
            <div ref={blockRef} className="space-y-14 max-w-3xl mx-auto text-center pb-20">
              {creditsSections.map((sec, i) => renderCreditsSection(sec, i))}
            </div>
            
            {/* Duplicate block with complete content for seamless looping */}
            <div aria-hidden="true" className="space-y-14 max-w-3xl mx-auto text-center pb-20">
              {creditsSections.map((sec, i) => renderCreditsSection(sec, i, false))}
            </div>
          </div>
        </div>
        </CardContent>
      </Card>
      
      {/* Support section */}
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold mb-4 text-gradient bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">{t("credits.supportUs")}</h3>
        <div className="flex justify-center gap-4 flex-wrap">
        {/* All support options currently route to BuyMeACoffee profile */}
        <Card
          onClick={() => window.open('https://buymeacoffee.com/geekyedu', '_blank', 'noopener,noreferrer')}
          className={`${isDark ? 'bg-slate-800/70 border-slate-700' : 'bg-white border-blue-200'} hover:border-yellow-500 transition-colors cursor-pointer`}
          title="Support via BuyMeACoffee (PayPal)"
        >
          <CardContent className="p-4 text-center">
            <DollarSign className={`h-6 w-6 ${isDark ? 'text-yellow-400' : 'text-yellow-500'} mx-auto mb-2`} />
            <p className={`text-sm font-medium ${isDark ? 'text-yellow-100' : 'text-yellow-700'}`}>PayPal</p>
          </CardContent>
        </Card>

        <Card
          onClick={() => window.open('https://buymeacoffee.com/geekyedu', '_blank', 'noopener,noreferrer')}
          className={`${isDark ? 'bg-slate-800/70 border-slate-700' : 'bg-white border-blue-200'} hover:border-purple-500 transition-colors cursor-pointer`}
          title="Buy Me A Coffee"
        >
          <CardContent className="p-4 text-center">
            <Coffee className={`h-6 w-6 ${isDark ? 'text-purple-400' : 'text-purple-500'} mx-auto mb-2`} />
            <p className={`text-sm font-medium ${isDark ? 'text-purple-100' : 'text-purple-700'}`}>{t("credits.buyMeACoffee")}</p>
          </CardContent>
        </Card>

        <Card
          onClick={() => window.open('https://buymeacoffee.com/geekyedu', '_blank', 'noopener,noreferrer')}
          className={`${isDark ? 'bg-slate-800/70 border-slate-700' : 'bg-white border-blue-200'} hover:border-pink-500 transition-colors cursor-pointer`}
          title="Donate (BuyMeACoffee)"
        >
          <CardContent className="p-4 text-center">
            <Gift className={`h-6 w-6 ${isDark ? 'text-pink-400' : 'text-pink-500'} mx-auto mb-2`} />
            <p className={`text-sm font-medium ${isDark ? 'text-pink-100' : 'text-pink-700'}`}>{t("credits.donate")}</p>
          </CardContent>
        </Card>
        </div>
      </div>
      </main>
      
      
      {/* Animation styles */}
      <style>{`
      /* Removed keyframe scroll; using rAF translate loop */
      
      @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        25% { transform: translateY(-15px) rotate(2deg); }
        50% { transform: translateY(0px) rotate(0deg); }
        75% { transform: translateY(15px) rotate(-2deg); }
      }
      
  .credits-section { opacity: 1; transition: transform .8s ease, filter .8s ease, opacity .6s ease; }
  .credits-section.focus { transform: scale(1.06); filter: brightness(1.15); }
      
      /* Initial fade removed for instant display */
      
      /* Subtle glow effect for elements */
      .credits-section h2 { letter-spacing: 0.5px; }
      
      .credits-section {
        max-width: 700px;
        margin-left: auto;
        margin-right: auto;
      }
      
      /* Make animation feel more cinematic */
      /* Removed staggered delay for faster initial visibility */
      
      /* Hide scrollbar but keep functionality */
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      
      .scrollbar-hide {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
      }
      
      /* Make duplicate sections transparent to screen readers but visible */
      .credits-section.duplicate {
        aria-hidden: true;
      }
      `}</style>
      {/* Animated footer middle info box */}
      <div className="w-full flex justify-center mb-8 mt-2">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-xl blur opacity-40 group-hover:opacity-70 transition" />
          <div className={`relative px-8 py-4 rounded-xl border ${isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white/90 border-slate-200'} flex flex-col items-center gap-1 animate-pulse-slow`}>
            <p className="text-xs tracking-wider uppercase text-muted-foreground">Version</p>
            <p className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">1.0.0</p>
            <p className="text-sm font-medium mt-1 cursor-pointer hover:underline" onClick={() => window.open('https://marksy.edu', '_blank')}>marksy.edu</p>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes pulse-slow { 0%,100% { opacity: 1 } 50% { opacity: .6 } }
        .animate-pulse-slow { animation: pulse-slow 5s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default CreditsPage;
