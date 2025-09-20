import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  className?: string;
  size?: 'sm' | 'default';
}

const STORAGE_KEY = 'theme';

const ThemeToggle: React.FC<Props> = ({ className = '', size = 'default' }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as 'light' | 'dark') ||
      'dark'; // default dark
    apply(saved);
  }, []);

  const apply = (mode: 'light' | 'dark') => {
    setTheme(mode);
    localStorage.setItem(STORAGE_KEY, mode);
    const root = document.documentElement;
    root.classList.remove(mode === 'light' ? 'dark' : 'light');
    root.classList.add(mode);
  };

  const toggle = () => apply(theme === 'light' ? 'dark' : 'light');

  return (
    <Button
      type="button"
      variant="outline"
      size={size}
      onClick={toggle}
      className={`gap-2 ${className}`}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      <span className="hidden sm:inline text-xs">{theme === 'light' ? 'Dark' : 'Light'}</span>
    </Button>
  );
};

export default ThemeToggle;

// NOTE: Ensure you import the light theme vars once (e.g. in src/index.css):
// @import '../light-theme.css';
