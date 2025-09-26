import { forwardRef, useMemo } from "react";
import { Clock } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useTimer } from "@/context/TimerContext";
import { cn } from "@/lib/utils";

interface TimerStatusButtonProps extends ButtonProps {
  label?: string;
  expandOnHover?: boolean;
}

const TimerStatusButton = forwardRef<HTMLButtonElement, TimerStatusButtonProps>(
  ({ label, className, expandOnHover = true, ...props }, ref) => {
    const { isRunning, isPaused, elapsedSeconds } = useTimer();

    const { formattedTimer, statusLabel } = useMemo(() => {
      const hours = Math.floor(elapsedSeconds / 3600)
        .toString()
        .padStart(2, "0");
      const minutes = Math.floor((elapsedSeconds % 3600) / 60)
        .toString()
        .padStart(2, "0");
      const seconds = Math.floor(elapsedSeconds % 60)
        .toString()
        .padStart(2, "0");

      let label = "Timer";
      if (isRunning) {
        label = "Running";
      } else if (isPaused && elapsedSeconds > 0) {
        label = "Paused";
      } else if (elapsedSeconds > 0) {
        label = "Logged";
      }

      return {
        formattedTimer: `${hours}:${minutes}:${seconds}`,
        statusLabel: label,
      };
    }, [elapsedSeconds, isPaused, isRunning]);

    const showDot = isRunning;

    return (
      <Button
        ref={ref}
        {...props}
        className={cn(
          "items-center gap-2 transition-all group relative overflow-hidden pl-2 pr-3",
          expandOnHover
            ? "max-w-full"
            : "",
          "flex",
          className
        )}
      >
        {showDot && (
          <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
        )}
        <Clock className="h-4 w-4" />
        <div
          className={cn(
            "flex flex-col overflow-hidden transition-all duration-300 ease-out",
            expandOnHover
              ? "max-w-0 opacity-0 group-hover:max-w-[140px] group-hover:opacity-100 group-hover:ml-2 group-focus-visible:max-w-[140px] group-focus-visible:opacity-100 group-focus-visible:ml-2"
              : "ml-2"
          )}
        >
          <span className="font-mono text-xs sm:text-sm leading-tight">
            {formattedTimer}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {statusLabel}
          </span>
        </div>
        {label && (
          <span className="ml-2 font-semibold text-xs sm:text-sm whitespace-nowrap">
            {label}
          </span>
        )}
      </Button>
    );
  }
);

TimerStatusButton.displayName = "TimerStatusButton";

export default TimerStatusButton;
