import { Coffee } from "lucide-react";
import React from "react";

interface SupportButtonProps {
  className?: string;
  variant?: "default" | "subtle";
}

/**
 * Reusable Buy Me a Coffee support button.
 */
const SupportButton: React.FC<SupportButtonProps> = ({ className = "", variant = "default" }) => {
  const base = "group inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-background";
  const styles = variant === "subtle"
    ? "bg-gradient-to-r from-amber-400/90 via-orange-400/90 to-yellow-400/90 text-zinc-900 shadow hover:shadow-md focus:ring-amber-500"
    : "bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white shadow hover:shadow-lg focus:ring-amber-500";
  return (
    <a
  href="https://buymeacoffee.com/geekyedu"
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${styles} ${className}`}
      aria-label="Support project via Buy Me a Coffee"
    >
      <Coffee className="h-4 w-4 drop-shadow-sm group-hover:scale-110 transition-transform" />
      <span>Support This Project</span>
      <span className="ml-1 text-xs bg-white/20 dark:bg-white/10 px-2 py-0.5 rounded-full">Buy Me a Coffee</span>
    </a>
  );
};

export default SupportButton;
