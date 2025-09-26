import React, { useState, useEffect, useMemo } from 'react';
import { Clock, Calendar, Target, Trash2, AlertCircle, Tag, Plus, BarChart3, TrendingUp, Filter, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import TimerWidget from './TimerWidget';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useTimer } from '@/context/TimerContext';

interface TimerSession {
  id: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  tag: string;
  description?: string;
  date: string; // YYYY-MM-DD
}

interface DailyStats {
  date: string;
  totalTime: number;
  sessionCount: number;
  averageSession: number;
  tags: { [key: string]: number };
}

// Enhanced color palette for better dark mode visibility
const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

// Generate unique colors for tags with better dark mode support
const generateTagColor = (tag: string): string => {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = Math.abs(hash) % 360;
  // Adjust saturation and lightness for better visibility in both modes
  const saturation = 60 + (Math.abs(hash) % 25); // 60-85%
  const lightness = 50 + (Math.abs(hash) % 15); // 50-65%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const getTagTextColor = (backgroundColor: string): string => {
  const lightnessMatch = backgroundColor.match(/(\d+)%\)$/);
  const lightness = lightnessMatch ? parseInt(lightnessMatch[1]) : 50;
  
  // Better contrast for text readability
  return lightness > 60 ? '#1f2937' : '#ffffff';
};

const TimeManagementPage: React.FC = () => {
  const [sessions, setSessions] = useState<TimerSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<TimerSession[]>([]);
  const [todayStats, setTodayStats] = useState<DailyStats>({
    date: new Date().toISOString().split('T')[0],
    totalTime: 0,
    sessionCount: 0,
    averageSession: 0,
    tags: {}
  });
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dailyGoal, setDailyGoal] = useState(4 * 60 * 60); // 4 hours in seconds
  const [tempDailyGoal, setTempDailyGoal] = useState(4); // for UI input
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [showAllSessions, setShowAllSessions] = useState(false);
  const [chartType, setChartType] = useState<'daily' | 'weekly' | 'tags'>('daily');
  const { toast } = useToast();
  const { isRunning, isPaused, elapsedSeconds } = useTimer();

  const formattedTimer = useMemo(() => {
    const hours = Math.floor(elapsedSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((elapsedSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = Math.floor(elapsedSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }, [elapsedSeconds]);

  const timerStatusLabel = useMemo(() => {
    if (isRunning) {
      return 'Running';
    }
    if (isPaused && elapsedSeconds > 0) {
      return 'Paused';
    }
    if (elapsedSeconds > 0) {
      return 'Logged';
    }
    return 'Timer';
  }, [elapsedSeconds, isPaused, isRunning]);

  // Load sessions and settings from localStorage
  useEffect(() => {
    const loadData = () => {
      const storedSessions = localStorage.getItem('timerSessions');
      if (storedSessions) {
        try {
          const parsedSessions: TimerSession[] = JSON.parse(storedSessions).map((session: any) => ({
            ...session,
            startTime: new Date(session.startTime),
            endTime: new Date(session.endTime)
          }));
          setSessions(parsedSessions);
        } catch (error) {
          console.error('Error parsing stored sessions:', error);
        }
      }

      // Load daily goal
      const savedGoal = localStorage.getItem('marksy-daily-goal');
      if (savedGoal) {
        const goalInSeconds = parseInt(savedGoal);
        setDailyGoal(goalInSeconds);
        setTempDailyGoal(Math.floor(goalInSeconds / 3600)); // Convert to hours for UI
      }
    };

    loadData();

    // Listen for session updates from TimerWidget
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'timerSessions') {
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for focus events to refresh data when user comes back to the page
    const handleFocus = () => {
      loadData();
    };
    
    window.addEventListener('focus', handleFocus);
    
    // Set up interval to refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  // Calculate today's stats
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = sessions.filter(session => session.date === today);
    
    const totalTime = todaySessions.reduce((sum, session) => sum + session.duration, 0);
    const sessionCount = todaySessions.length;
    const averageSession = sessionCount > 0 ? Math.floor(totalTime / sessionCount) : 0;
    
    const tags: { [key: string]: number } = {};
    todaySessions.forEach(session => {
      tags[session.tag] = (tags[session.tag] || 0) + session.duration;
    });
    
    setTodayStats({
      date: today,
      totalTime,
      sessionCount,
      averageSession,
      tags
    });
  }, [sessions]);

  // Filter sessions based on selected criteria
  useEffect(() => {
    let filtered = [...sessions];
    
    // Filter by period
    const now = new Date();
    const filterDate = new Date();
    
    switch (selectedPeriod) {
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setDate(now.getDate() - 30);
        break;
      case 'all':
        filterDate.setFullYear(2000); // Far past date
        break;
    }
    
    filtered = filtered.filter(session => session.startTime >= filterDate);
    
    // Filter by tag
    if (selectedTag !== 'all') {
      filtered = filtered.filter(session => session.tag === selectedTag);
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(session => 
        session.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (session.description && session.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredSessions(filtered.sort((a, b) => b.startTime.getTime() - a.startTime.getTime()));
  }, [sessions, selectedPeriod, selectedTag, searchQuery]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalTime = (): number => {
    return filteredSessions.reduce((total, session) => total + session.duration, 0);
  };

  const getAverageSessionTime = (): number => {
    if (filteredSessions.length === 0) return 0;
    return Math.round(getTotalTime() / filteredSessions.length);
  };

  const getUniqueTagsFromSessions = (): string[] => {
    const tags = new Set(sessions.map(session => session.tag));
    return Array.from(tags);
  };

  const getMostUsedTag = (): { tag: string; time: number } => {
    const tagTimes: { [key: string]: number } = {};
    filteredSessions.forEach(session => {
      tagTimes[session.tag] = (tagTimes[session.tag] || 0) + session.duration;
    });
    
    const sortedTags = Object.entries(tagTimes).sort(([,a], [,b]) => b - a);
    return sortedTags.length > 0 ? { tag: sortedTags[0][0], time: sortedTags[0][1] } : { tag: 'None', time: 0 };
  };

  const updateDailyGoal = () => {
    const goalInSeconds = tempDailyGoal * 3600; // Convert hours to seconds
    setDailyGoal(goalInSeconds);
    localStorage.setItem('marksy-daily-goal', goalInSeconds.toString());
    
    toast({
      title: "Daily Goal Updated",
      description: `Your daily study goal has been set to ${tempDailyGoal} hours.`,
    });
  };

  const deleteSession = (sessionId: string) => {
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    localStorage.setItem('timerSessions', JSON.stringify(updatedSessions));
    setSessions(updatedSessions);
    setDeleteDialogOpen(false);
    setSessionToDelete(null);
    
    toast({
      title: "Session Deleted",
      description: "Timer session has been removed successfully.",
    });
  };

  const handleDeleteClick = (sessionId: string) => {
    setSessionToDelete(sessionId);
    setDeleteDialogOpen(true);
  };

  const getChartData = () => {
    const now = new Date();
    const days = [];
    
    switch (chartType) {
      case 'daily':
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          const daySessions = sessions.filter(s => s.date === dateStr);
          const totalTime = daySessions.reduce((sum, s) => sum + s.duration, 0);
          
          days.push({
            date: dateStr,
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            totalTime: totalTime / 3600, // Convert to hours
            sessions: daySessions.length,
            formatted: formatTime(totalTime)
          });
        }
        return days;
        
      case 'weekly':
        // Last 4 weeks
        const weeks = [];
        for (let i = 3; i >= 0; i--) {
          const startOfWeek = new Date(now);
          startOfWeek.setDate(startOfWeek.getDate() - (i * 7) - startOfWeek.getDay());
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          
          const weekSessions = sessions.filter(s => {
            const sessionDate = new Date(s.date);
            return sessionDate >= startOfWeek && sessionDate <= endOfWeek;
          });
          
          const totalTime = weekSessions.reduce((sum, s) => sum + s.duration, 0);
          
          weeks.push({
            week: `Week ${4 - i}`,
            totalTime: totalTime / 3600,
            sessions: weekSessions.length,
            formatted: formatTime(totalTime)
          });
        }
        return weeks;
        
      case 'tags':
        const tagStats: { [key: string]: number } = {};
        filteredSessions.forEach(session => {
          tagStats[session.tag] = (tagStats[session.tag] || 0) + session.duration;
        });
        
        return Object.entries(tagStats)
          .map(([tag, time]) => ({
            tag,
            totalTime: time / 3600,
            formatted: formatTime(time)
          }))
          .sort((a, b) => b.totalTime - a.totalTime)
          .slice(0, 8); // Top 8 tags
          
      default:
        return [];
    }
  };

  const chartData = getChartData();

  const chartAverageHours = useMemo(() => {
    if (chartData.length === 0) {
      return 0;
    }

    const totalHours = chartData.reduce((sum, item) => {
      const value = typeof item.totalTime === 'number' ? item.totalTime : 0;
      return sum + value;
    }, 0);

    return totalHours / chartData.length;
  }, [chartData]);

  const progressPercentage = Math.min((todayStats.totalTime / dailyGoal) * 100, 100);

  const handleTimerJump = () => {
    const timerSection = document.getElementById('time-management-timer');
    if (timerSection) {
      timerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-6 space-y-6">
      <div className="text-center space-y-3 animate-fade-in">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-bounce-in">
          Time Management
        </h2>
        <p className="text-base sm:text-lg text-foreground/80 font-medium animate-slide-up animation-delay-300">
          Track your study sessions and manage your time effectively
        </p>
        <div className="flex justify-center">
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Timer Widget */}
      <div id="time-management-timer" className="animate-slide-up animation-delay-500 scroll-mt-24">
        <TimerWidget language="en" />
      </div>

      {/* Charts Section - Enhanced */}
      <Card className="academic-card animate-fade-in animation-delay-700 border-2 border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-500">
        <CardHeader className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border-b border-border/50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-center sm:text-left">
            <CardTitle className="flex items-center justify-center sm:justify-start space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Study Analytics
              </span>
            </CardTitle>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <Label className="text-sm font-semibold text-foreground whitespace-nowrap">
                Chart Type:
              </Label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value as 'daily' | 'weekly' | 'tags')}
                className="w-full sm:w-48 px-4 py-2 border-2 border-primary/20 rounded-lg bg-background text-foreground font-medium hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              >
                <option value="daily">📊 Daily (7 days)</option>
                <option value="weekly">📈 Weekly (4 weeks)</option>
                <option value="tags">🏷️ By Tags</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[260px] sm:h-[320px] md:h-80 w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'tags' ? (
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.tag}: ${entry.formatted}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="totalTime"
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [formatTime(value * 3600), 'Time']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '2px solid hsl(var(--border))',
                      borderRadius: '12px',
                      color: 'hsl(var(--card-foreground))',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                    labelStyle={{
                      color: 'hsl(var(--card-foreground))',
                      fontWeight: '700'
                    }}
                  />
                </PieChart>
              ) : (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.3)" />
                  <XAxis 
                    dataKey={chartType === 'daily' ? 'day' : 'week'} 
                    tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
                    stroke="hsl(var(--foreground))"
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
                    label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'hsl(var(--foreground))', fontWeight: '600' } }}
                    stroke="hsl(var(--foreground))"
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatTime(value * 3600), 'Study Time']}
                    labelFormatter={(label) => `${chartType === 'daily' ? 'Day' : 'Period'}: ${label}`}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '2px solid hsl(var(--primary))',
                      borderRadius: '12px',
                      color: 'hsl(var(--card-foreground))',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                    labelStyle={{
                      color: 'hsl(var(--card-foreground))',
                      fontWeight: '700',
                      marginBottom: '4px'
                    }}
                    itemStyle={{
                      color: 'hsl(var(--primary))',
                      fontWeight: '600'
                    }}
                  />
                  <Bar 
                    dataKey="totalTime" 
                    fill="url(#colorGradient)" 
                    radius={[6, 6, 0, 0]}
                    animationDuration={1000}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
          
          {/* Enhanced Chart Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800 hover:scale-105 transition-transform duration-300">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {formatTime(chartData.reduce((sum, item) => sum + (item.totalTime * 3600), 0))}
              </div>
              <div className="text-sm font-semibold text-blue-700 dark:text-blue-300">Total Time</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-800 hover:scale-105 transition-transform duration-300">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                {chartData.reduce((sum, item) => sum + (item.sessions || 0), 0)}
              </div>
              <div className="text-sm font-semibold text-purple-700 dark:text-purple-300">Total Sessions</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-800 hover:scale-105 transition-transform duration-300">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                {chartData.length > 0 ? `${chartAverageHours.toFixed(3)} hrs` : '0.000 hrs'}
              </div>
              <div className="text-sm font-semibold text-green-700 dark:text-green-300">Daily Average</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Goal Setting - Enhanced */}
      <Card className="academic-card animate-slide-up animation-delay-900 bg-gradient-to-br from-background via-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg shadow-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">Daily Study Goal</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 bg-muted/50 rounded-xl border border-border text-center sm:text-left">
            <Label htmlFor="dailyGoal" className="text-base font-semibold text-foreground">
              Hours per day:
            </Label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Input
                id="dailyGoal"
                type="number"
                min="1"
                max="12"
                value={tempDailyGoal}
                onChange={(e) => setTempDailyGoal(parseInt(e.target.value) || 1)}
                className="w-full sm:w-24 text-center font-bold text-lg border-2 border-primary/20 focus:border-primary"
              />
              <Button 
                onClick={updateDailyGoal} 
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary text-white font-semibold px-6 hover:scale-105 transition-transform duration-200"
              >
                Update
              </Button>
            </div>
          </div>
          <div className="space-y-3">
            <Progress value={progressPercentage} className="h-4 bg-muted" />
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">
                {formatTime(todayStats.totalTime)} / {formatTime(dailyGoal)}
              </div>
              <div className="text-sm font-semibold text-muted-foreground">
                ({progressPercentage.toFixed(1)}% Complete)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Stats - Enhanced and Cuter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in animation-delay-1000">
        <Card className="academic-card text-center bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-800/20 border-2 border-blue-200 dark:border-blue-800 hover:scale-105 transition-all duration-300 hover:shadow-lg group">
          <CardContent className="p-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full mb-3 group-hover:animate-bounce">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-1">
              {formatTime(todayStats.totalTime)}
            </div>
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded-full">
              Total Today
            </div>
          </CardContent>
        </Card>

        <Card className="academic-card text-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-800/20 border-2 border-purple-200 dark:border-purple-800 hover:scale-105 transition-all duration-300 hover:shadow-lg group">
          <CardContent className="p-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-full mb-3 group-hover:animate-bounce">
              <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-1">
              {todayStats.sessionCount}
            </div>
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider bg-purple-100 dark:bg-purple-900/40 px-2 py-1 rounded-full">
              Sessions
            </div>
          </CardContent>
        </Card>

        <Card className="academic-card text-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-800/20 border-2 border-green-200 dark:border-green-800 hover:scale-105 transition-all duration-300 hover:shadow-lg group">
          <CardContent className="p-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-full mb-3 group-hover:animate-bounce">
              <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300 mb-1">
              {chartData.length > 0 ? `${chartAverageHours.toFixed(3)} hrs` : '0.000 hrs'}
            </div>
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider bg-green-100 dark:bg-green-900/40 px-2 py-1 rounded-full">
              Daily Average
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters - Enhanced */}
      <Card className="academic-card animate-slide-up animation-delay-1200 border-2 border-muted hover:border-primary/30 transition-colors duration-300">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold text-foreground">Filter Sessions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="flex flex-col gap-2">
              <Label className="font-semibold text-foreground">Period:</Label>
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'all')}
                className="w-full px-4 py-2 border-2 border-muted rounded-lg bg-background text-foreground font-medium hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              >
                <option value="week">📅 Last Week</option>
                <option value="month">🗓️ Last Month</option>
                <option value="all">🌟 All Time</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="font-semibold text-foreground">Tag:</Label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-4 py-2 border-2 border-muted rounded-lg bg-background text-foreground font-medium hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              >
                <option value="all">🏷️ All Tags</option>
                {getUniqueTagsFromSessions().map(tag => (
                  <option key={tag} value={tag}>#{tag}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2 xl:col-span-2">
              <Label className="font-semibold text-foreground">Search:</Label>
              <Input
                placeholder="🔍 Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-2 border-muted font-medium hover:border-primary/40 focus:border-primary text-foreground placeholder:text-muted-foreground/70"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity - Enhanced */}
      <Card className="academic-card animate-fade-in animation-delay-1400 bg-gradient-to-br from-background to-muted/20">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="text-center sm:text-left">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-foreground">Recent Activity</span>
              </CardTitle>
              <CardDescription className="text-base font-medium text-muted-foreground mt-2">
                Your latest study sessions ({filteredSessions.length} total sessions)
              </CardDescription>
            </div>
            {filteredSessions.length > 5 && (
              <Button
                variant="outline"
                onClick={() => setShowAllSessions(!showAllSessions)}
                className="w-full sm:w-auto justify-center flex items-center space-x-2 border-2 border-primary/30 text-primary hover:bg-primary hover:text-white font-semibold transition-all duration-300 hover:scale-105"
              >
                {showAllSessions ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span>{showAllSessions ? 'Show Less' : `Show All (${filteredSessions.length})`}</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {filteredSessions.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-16 w-16 text-muted-foreground/50 mx-auto mb-6 animate-bounce" />
              <h3 className="text-xl font-bold text-foreground mb-2">No Sessions Found</h3>
              <p className="text-base text-muted-foreground font-medium">
                Start your first session or adjust your filters!
              </p>
            </div>
          ) : (
            <div className={`space-y-4 ${showAllSessions ? 'max-h-96 overflow-y-auto' : ''} scroll-area`}>
              {(showAllSessions ? filteredSessions : filteredSessions.slice(0, 5)).map((session, index) => {
                const tagColor = generateTagColor(session.tag);
                const textColor = getTagTextColor(tagColor);
                
                return (
                  <div 
                    key={session.id} 
                    className="group flex items-center justify-between p-5 bg-gradient-to-r from-muted/30 to-muted/50 rounded-xl hover:from-primary/5 hover:to-secondary/5 transition-all duration-300 border-2 border-transparent hover:border-primary/20 hover:shadow-lg animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <Badge 
                          className="font-bold text-sm px-4 py-2 border-2 shadow-lg tag-dynamic hover:scale-110 transition-transform duration-200"
                          style={{ 
                            backgroundColor: tagColor,
                            color: textColor,
                            borderColor: tagColor,
                            boxShadow: `0 4px 12px ${tagColor}40`
                          }}
                        >
                          <Tag className="h-3 w-3 mr-2" />
                          {session.tag}
                        </Badge>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-bold text-xl text-primary">
                            {formatTime(session.duration)}
                          </span>
                          <span className="text-sm font-semibold text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                            {session.startTime.toLocaleDateString()} • {session.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {session.description && (
                          <p className="text-sm font-medium text-foreground/80 truncate bg-background/50 px-3 py-1 rounded-lg">
                            {session.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(session.id)}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-destructive hover:text-white hover:bg-destructive ml-4 font-semibold border-2 border-transparent hover:border-destructive hover:scale-110"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
              
              {/* Show more indicator - Enhanced */}
              {!showAllSessions && filteredSessions.length > 5 && (
                <div className="text-center py-4">
                  <Button
                    variant="ghost"
                    onClick={() => setShowAllSessions(true)}
                    className="w-full sm:w-auto text-primary hover:text-white hover:bg-primary font-bold text-base px-6 py-3 rounded-xl border-2 border-primary/30 hover:border-primary transition-all duration-300 hover:scale-105"
                  >
                    ✨ + {filteredSessions.length - 5} more sessions
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Statistics */}
      <Card className="academic-card">
        <CardHeader>
          <CardTitle>Session Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{formatTime(getTotalTime())}</div>
              <div className="text-sm text-muted-foreground">Total Time (Filtered)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{filteredSessions.length}</div>
              <div className="text-sm text-muted-foreground">Total Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{formatTime(getAverageSessionTime())}</div>
              <div className="text-sm text-muted-foreground">Average Session</div>
            </div>
          </div>
          {getMostUsedTag().tag !== 'None' && (
            <div className="mt-4 text-center">
              <Badge variant="secondary">Most Used Tag: {getMostUsedTag().tag} ({formatTime(getMostUsedTag().time)})</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <span>Delete Session</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this study session? This action cannot be undone and will permanently remove the session from your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => sessionToDelete && deleteSession(sessionToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TimeManagementPage;