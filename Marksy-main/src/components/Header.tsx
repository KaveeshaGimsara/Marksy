import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import HamburgerMenu from './HamburgerMenu';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface HeaderProps {
  navigationItems: NavigationItem[];
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Header = ({ navigationItems, activeSection, onSectionChange }: HeaderProps) => {
  const [expandedButtons, setExpandedButtons] = useState<Set<string>>(new Set());
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang } = useLanguage();

  const toggleButtonExpansion = (itemId: string) => {
    setExpandedButtons(prev => {
      const newSet = new Set<string>();
      if (!prev.has(itemId)) {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  return (
    <header className="sticky top-0 z-40 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.25),transparent_60%),radial-gradient(circle_at_80%_30%,hsl(var(--secondary)/0.25),transparent_55%),linear-gradient(to_right,hsl(var(--background)),hsl(var(--background)))] backdrop-blur-md border-b border-border/30 shadow-xl">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18">
          {/* Logo - Updated with new design */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-shrink-0">
            <div className="p-1.5 sm:p-2 bg-gradient-to-r from-primary to-secondary rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <img 
                src="/logo.svg" 
                alt="Marksy Logo" 
                className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gradient truncate">
                Marksy
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block lg:block truncate">
                Academic Excellence Tracker
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              const isExpanded = expandedButtons.has(item.id);
              
              return (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => {
                      onSectionChange(item.id);
                      toggleButtonExpansion(item.id);
                    }}
                    className={`group flex items-center justify-center space-x-2 h-12 transition-all duration-500 hover:scale-105 ${
                      isActive 
                        ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg' 
                        : 'text-foreground hover:bg-primary/10 hover:text-primary border border-border/30'
                    } backdrop-blur-sm ${
                      isExpanded 
                        ? 'px-4 rounded-xl' 
                        : 'w-12 rounded-full'
                    }`}
                    title={item.label}
                  >
                    <div className="flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`font-medium transition-all duration-300 overflow-hidden whitespace-nowrap ${
                      isExpanded ? 'w-auto opacity-100 ml-2' : 'w-0 opacity-0'
                    }`}>
                      {item.label}
                    </span>
                  </button>
                </div>
              );
            })}
            
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'si' : 'en')}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 text-foreground hover:bg-primary/10 hover:text-primary border border-border/30 backdrop-blur-sm font-semibold"
              title={lang === 'en' ? 'Switch to Sinhala' : 'Switch to English'}
            >
              {lang === 'en' ? 'සිං' : 'EN'}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 text-foreground hover:bg-primary/10 hover:text-primary border border-border/30 backdrop-blur-sm"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <div className="flex items-center justify-center">
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </div>
            </button>
          </nav>

          {/* Mobile Navigation Icons - Improved layout */}
          <nav className="hidden md:flex lg:hidden items-center space-x-1">
            {navigationItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${
                    isActive 
                      ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg' 
                      : 'text-foreground hover:bg-primary/10 hover:text-primary border border-border/30'
                  } backdrop-blur-sm`}
                  title={item.label}
                >
                  <div className="flex items-center justify-center">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                </button>
              );
            })}
            
            {/* Language Switcher for Tablet */}
            <button
              onClick={() => setLang(lang === 'en' ? 'si' : 'en')}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 text-foreground hover:bg-primary/10 hover:text-primary border border-border/30 backdrop-blur-sm font-semibold"
              title={lang === 'en' ? 'සිංහලට මාරුවන්න' : 'Switch to English'}
            >
              {lang === 'en' ? 'සිං' : 'EN'}
            </button>
          </nav>

          {/* Hamburger Menu for Small Screens - Improved mobile layout */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 text-foreground hover:bg-primary/10 hover:text-primary border border-border/30 backdrop-blur-sm"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <div className="flex items-center justify-center">
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </div>
            </button>
            
            <HamburgerMenu 
              navigationItems={navigationItems}
              activeSection={activeSection}
              onSectionChange={onSectionChange}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;