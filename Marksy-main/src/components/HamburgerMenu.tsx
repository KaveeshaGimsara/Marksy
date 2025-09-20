import { useState, useEffect, useCallback } from 'react';
import { Menu, X } from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface HamburgerMenuProps {
  navigationItems: NavigationItem[];
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const HamburgerMenu = ({ navigationItems, activeSection, onSectionChange }: HamburgerMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Define the close menu function using useCallback for stability
  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Define the open menu function
  const openMenu = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Toggle menu function
  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Handle section change and close menu
  const handleSectionChange = useCallback((section: string) => {
    onSectionChange(section);
    closeMenu();
  }, [onSectionChange, closeMenu]);

  // Close menu when escape key is pressed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
    };

    window.addEventListener('keydown', handleEscape);
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeMenu]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Prevent unwanted touch gestures from opening menu
  useEffect(() => {
    const preventSwipeGestures = (e: TouchEvent) => {
      // Prevent default browser swipe-to-navigate behavior
      if (e.touches.length > 1) return;
      
      const touch = e.touches[0];
      const startX = touch.clientX;
      
      // If touch starts from very edge (within 20px), prevent default
      if (startX < 20) {
        e.preventDefault();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      preventSwipeGestures(e);
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent pull-to-refresh and edge swipes when menu is closed
      if (!isOpen && e.touches.length === 1) {
        const touch = e.touches[0];
        if (touch.clientX < 50) {
          e.preventDefault();
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isOpen]);

  return (
    <div className="relative lg:hidden">
      {/* Hamburger Button with proper theme colors */}
      <button
        onClick={toggleMenu}
        className="p-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation"
        aria-label="Toggle navigation menu"
        style={{ touchAction: 'manipulation' }}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Mobile Menu Overlay with proper backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" 
          onClick={closeMenu}
          aria-hidden="true"
          style={{ touchAction: 'none' }}
        />
      )}

      {/* Mobile Menu with theme-aware background */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-card border-l border-border shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ touchAction: 'pan-y' }}
      >
        {/* Menu Header with theme colors */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-card/95 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-primary to-secondary rounded-lg">
              <svg className="h-6 w-6 text-primary-foreground" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-foreground">Marksy</h2>
          </div>
          <button
            onClick={closeMenu}
            className="p-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items with theme colors */}
        <div className="p-4 space-y-2 bg-card overflow-y-auto flex-1">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <div className={`p-2 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary-foreground/20' 
                    : 'bg-muted group-hover:bg-primary/20'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer with theme colors */}
        <div className="p-6 border-t border-border bg-card/95 backdrop-blur-sm">
          <p className="text-center text-muted-foreground text-sm">
            Academic Excellence Tracker
          </p>
        </div>
      </div>
    </div>
  );
};

export default HamburgerMenu;