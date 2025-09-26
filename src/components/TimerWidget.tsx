import { useState, useEffect } from "react";
import { Play, Pause, Square, Clock, Target, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTimer } from "@/context/TimerContext";

interface TimerSession {
  id: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  tag: string;
  description?: string;
  date: string; // YYYY-MM-DD format
}

interface TimerWidgetProps {
  language: "en" | "si";
  onNavigate?: (section: string) => void;
}

interface CircularTimerProps {
  time: number;
  isRunning: boolean;
  size?: number;
}

const TimerWidget = ({ language, onNavigate }: TimerWidgetProps) => {
  const { toast } = useToast();
  const {
    isRunning,
    isPaused,
    elapsedSeconds,
    currentTag,
    currentNotes,
    startNewSession,
    resumeSession,
    pauseSession,
    stopSession,
    resetSession,
    setTag,
    setNotes,
  } = useTimer();
  const [showTagDialog, setShowTagDialog] = useState(false);
  const [customTag, setCustomTag] = useState("");
  const [dailyGoal, setDailyGoal] = useState(4 * 60 * 60); // 4 hours in seconds
  const [todayStats, setTodayStats] = useState({
    totalTime: 0,
    sessionCount: 0,
    averageSession: 0
  });
  const [timerTheme, setTimerTheme] = useState<'digital' | 'circular'>('digital');

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("marksy-timer-theme");
    if (savedTheme === 'circular' || savedTheme === 'digital') {
      setTimerTheme(savedTheme);
    }
  }, []);

  // Circular Timer Component
  const CircularTimer = ({ time, isRunning, size = 200 }: CircularTimerProps) => {
    const radius = (size - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(time / (60 * 60), 1); // Max 1 hour for full circle
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress * circumference);

    return (
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg 
          width={size} 
          height={size} 
          className="transform -rotate-90 transition-all duration-1000"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-muted-foreground/20"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#timerGradient)"
            strokeWidth="6"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out drop-shadow-lg"
            style={{
              filter: isRunning ? 'drop-shadow(0 0 8px currentColor)' : 'none'
            }}
          />
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className="text-blue-400" stopColor="currentColor" />
              <stop offset="50%" className="text-purple-500" stopColor="currentColor" />
              <stop offset="100%" className="text-pink-500" stopColor="currentColor" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Time display in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`font-mono font-bold ${size > 150 ? 'text-3xl' : 'text-xl'} bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse`}>
              {formatTime(time)}
            </div>
            {isRunning && (
              <div className="text-xs text-muted-foreground mt-1 animate-bounce">
                {language === "en" ? "Recording..." : "පටිගත කරමින්..."}
              </div>
            )}
          </div>
        </div>
        
        {/* Floating particles when running */}
        {isRunning && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-2 left-4 w-1 h-1 bg-blue-400 rounded-full animate-ping" />
            <div className="absolute top-8 right-6 w-1 h-1 bg-purple-400 rounded-full animate-ping animation-delay-500" />
            <div className="absolute bottom-8 left-8 w-1 h-1 bg-pink-400 rounded-full animate-ping animation-delay-1000" />
            <div className="absolute bottom-4 right-4 w-1 h-1 bg-cyan-400 rounded-full animate-ping animation-delay-1500" />
          </div>
        )}
      </div>
    );
  };

  const predefinedTags = [
    "Study", "Work", "Research", "Reading", "Writing", "Break", 
    "Exercise", "Project", "Review", "Practice", "Meeting", "Other"
  ];

  const content = {
    en: {
      timer: "Study Timer",
      start: "Start",
      pause: "Pause",
      resume: "Resume",
      stop: "Stop",
      reset: "Reset",
      addTag: "Add Tag",
      notes: "Notes",
      dailyGoal: "Daily Goal",
      todayTotal: "Today's Total",
      sessions: "Sessions",
      average: "Average",
      progress: "Progress"
    },
    si: {
      timer: "අධ්‍යයන කාල මාපකය",
      start: "ආරම්භ කරන්න",
      pause: "විරාමය",
    resume: "නැවත ආරම්භ කරන්න",
      stop: "නවත්වන්න", 
      reset: "යළි සකසන්න",
      addTag: "ටැගය එක් කරන්න",
      notes: "සටහන්",
      dailyGoal: "දෛනික ඉලක්කය",
      todayTotal: "අද මුළු කාලය",
      sessions: "සැසි",
      average: "සාමාන්‍ය",
      progress: "ප්‍රගතිය"
    }
  };

  const currentContent = content[language];

  // Load saved data on mount
  useEffect(() => {
    loadTodayStats();
    loadDailyGoal();

    // Listen for cross-tab updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'marksy-daily-goal') {
        loadDailyGoal();
      }
      if (e.key === 'timerSessions') {
        loadTodayStats();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const loadTodayStats = () => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const sessions = getStoredSessions().filter(s => s.date === today);
    
    const totalTime = sessions.reduce((sum, session) => sum + session.duration, 0);
    const sessionCount = sessions.length;
    const averageSession = sessionCount > 0 ? Math.floor(totalTime / sessionCount) : 0;

    setTodayStats({ totalTime, sessionCount, averageSession });
  };

  const loadDailyGoal = () => {
    const saved = localStorage.getItem('marksy-daily-goal');
    if (saved) {
      setDailyGoal(parseInt(saved));
    }
  };

  const getStoredSessions = (): TimerSession[] => {
    const stored = localStorage.getItem('timerSessions');
    if (stored) {
      try {
        const sessions = JSON.parse(stored);
        return sessions.map((session: any) => ({
          ...session,
          startTime: new Date(session.startTime),
          endTime: new Date(session.endTime)
        }));
      } catch (error) {
        console.error('Error parsing stored sessions:', error);
        return [];
      }
    }
    return [];
  };

  const saveSession = (session: TimerSession) => {
    const sessions = getStoredSessions();
    sessions.push(session);
    localStorage.setItem('timerSessions', JSON.stringify(sessions));
    loadTodayStats();
  };

  const handleStart = () => {
    if (isPaused) {
      const result = resumeSession();
      if (!result.ok) return;
      toast({
        title: language === 'en' ? "Timer Resumed" : "කාල මාපකය නැවත ආරම්භ විය",
        description: language === 'en' ? `Continuing: ${currentTag}` : `දැන් සටහන්: ${currentTag}`
      });
      return;
    }

    const result = startNewSession();
    if (!result.ok) {
      toast({
        title: language === 'en' ? "Timer already running" : "කාල මාපකය දැනට පවතී",
        description: language === 'en' ? "Stop the current session before starting a new one." : "නව සැසියක් ආරම්භ කිරීමට පෙර වර්තමාන සැසිය නවත්වන්න."
      });
      return;
    }

    toast({
      title: language === 'en' ? "Timer Started" : "කාල මාපකය ආරම්භ විය",
      description: language === 'en' ? `Tracking: ${currentTag}` : `ලුහුබැඳීම: ${currentTag}`
    });
  };

  const handlePause = () => {
    const result = pauseSession();
    if (!result.ok) return;
    toast({
      title: language === 'en' ? "Timer Paused" : "කාල මාපකය විරාම කළා",
      description: formatTime(elapsedSeconds)
    });
  };

  const handleStop = () => {
    const tagSnapshot = currentTag;
    const notesSnapshot = currentNotes;
    const result = stopSession();

    if (result.ok && result.durationSeconds > 0) {
      const startTimestamp = result.sessionStartTime ?? Date.now() - result.durationSeconds * 1000;
      const startDate = new Date(startTimestamp);
      const endDate = new Date(startTimestamp + result.durationSeconds * 1000);

      saveSession({
        id: Date.now().toString(),
        startTime: startDate,
        endTime: endDate,
        duration: result.durationSeconds,
        tag: tagSnapshot,
        description: notesSnapshot,
        date: startDate.toISOString().split('T')[0],
      });

      toast({
        title: language === 'en' ? "Session Saved" : "සැසිය සුරක්ෂිත කළා",
        description: `${formatTime(result.durationSeconds)} - ${tagSnapshot}`
      });
    }

  };

  const handleReset = () => {
    resetSession();
  };

  const handleAddCustomTag = () => {
    if (customTag.trim()) {
      setTag(customTag.trim());
      setCustomTag("");
      setShowTagDialog(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = Math.min((todayStats.totalTime / dailyGoal) * 100, 100);

  const time = elapsedSeconds;

  return (
    <Card className="academic-card bg-gradient-to-br from-background via-background to-primary/5 border-2 border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold">
            {currentContent.timer}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Switch */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
            <Button
              size="sm"
              variant={timerTheme === 'digital' ? 'default' : 'ghost'}
              onClick={() => {
                setTimerTheme('digital');
                localStorage.setItem('marksy-timer-theme', 'digital');
              }}
              className="text-xs"
            >
              {language === "en" ? "Digital" : "ඩිජිටල්"}
            </Button>
            <Button
              size="sm"
              variant={timerTheme === 'circular' ? 'default' : 'ghost'}
              onClick={() => {
                setTimerTheme('circular');
                localStorage.setItem('marksy-timer-theme', 'circular');
              }}
              className="text-xs"
            >
              {language === "en" ? "Circular" : "වෘත්තාකාර"}
            </Button>
          </div>
        </div>

        {/* Timer Display */}
        <div className="text-center">
          {timerTheme === 'digital' ? (
            <div className="relative">
              <div className={`text-6xl font-mono font-bold mb-4 tracking-wider transition-all duration-300 ${
                isRunning 
                  ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg' 
                  : 'text-primary'
              }`}>
                {formatTime(time)}
              </div>
              
              {/* Status indicator */}
              {isRunning && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Badge variant="secondary" className="text-xs animate-pulse bg-green-500/10 text-green-600 border-green-500/20">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                    {language === "en" ? "Recording" : "පටිගත කරමින්"}
                  </Badge>
                </div>
              )}
              
              {/* Subtle particles when running - improved for readability */}
              {isRunning && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute top-4 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-bounce opacity-30" />
                  <div className="absolute top-8 right-1/4 w-0.5 h-0.5 bg-purple-400 rounded-full animate-ping opacity-40" style={{animationDelay:'300ms'}} />
                  <div className="absolute bottom-8 left-1/3 w-1 h-1 bg-pink-400 rounded-full animate-pulse opacity-35" style={{animationDelay:'600ms'}} />
                  <div className="absolute bottom-4 right-1/3 w-0.5 h-0.5 bg-cyan-400 rounded-full animate-bounce opacity-30" style={{animationDelay:'900ms'}} />
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center mb-4">
              <CircularTimer time={time} isRunning={isRunning} size={220} />
            </div>
          )}
          
          {/* Timer Controls */}
          <div className="flex justify-center gap-3 mb-4">
            {!isRunning ? (
              <Button 
                onClick={handleStart} 
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Play className="h-4 w-4 mr-2" />
                {currentContent.start}
              </Button>
            ) : (
              <>
                {!isPaused ? (
                  <Button 
                    onClick={handlePause} 
                    className="bg-orange-500/90 text-white shadow-md hover:bg-orange-500 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-orange-400/70 focus-visible:ring-offset-2 transition-all duration-300 transform hover:scale-105 dark:bg-orange-500"
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    {currentContent.pause}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleStart} 
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {currentContent.resume}
                  </Button>
                )}
                <Button 
                  onClick={handleStop} 
                  className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Square className="h-4 w-4 mr-2" />
                  {currentContent.stop}
                </Button>
              </>
            )}
            <Button 
              onClick={handleReset} 
              variant="outline"
              className="border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105"
            >
              {currentContent.reset}
            </Button>
          </div>

          {/* Current Tag */}
          <div className="flex justify-center items-center gap-2 mb-4">
            <Badge variant="secondary" className="text-sm">{currentTag}</Badge>
            <Select value={currentTag} onValueChange={setTag}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {predefinedTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Dialog open={showTagDialog} onOpenChange={setShowTagDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{currentContent.addTag}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Custom Tag</Label>
                    <Input 
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      placeholder="Enter custom tag..."
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTag()}
                    />
                  </div>
                  <Button onClick={handleAddCustomTag} className="w-full">
                    Add Tag
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Notes */}
          <Input
            placeholder={`${currentContent.notes}...`}
            value={currentNotes}
            onChange={(e) => setNotes(e.target.value)}
            className="mb-4"
          />
        </div>

        {/* Daily Progress */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <span className="font-semibold">{currentContent.progress}</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <div className="text-sm text-muted-foreground text-center">
            {formatTime(todayStats.totalTime)} / {formatTime(dailyGoal)} ({progressPercentage.toFixed(1)}%)
          </div>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary">{formatTime(todayStats.totalTime)}</div>
            <div className="text-xs text-muted-foreground">{currentContent.todayTotal}</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary">{todayStats.sessionCount}</div>
            <div className="text-xs text-muted-foreground">{currentContent.sessions}</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary">{formatTime(todayStats.averageSession)}</div>
            <div className="text-xs text-muted-foreground">{currentContent.average}</div>
          </div>
        </div>

        {/* View All Sessions Button */}
        {onNavigate && (
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => onNavigate('time-management')}
          >
            {language === "en" ? "View All Sessions & Analytics" : "සියලු සැසි සහ විශ්ලේෂණ බලන්න"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default TimerWidget;