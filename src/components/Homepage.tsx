import { useState, useEffect } from "react";
import {
  Clock, Calendar, TrendingUp, Award, Target, Brain,
  ChevronRight, Sparkles, BookOpen, Users, Zap, Download,
  Timer, Bell, GraduationCap, BarChart, Plus, Eye, Settings, Code,
  Heart, Github, Coffee, ArrowRight, User
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface HomepageProps {
  language: string;
  onNavigate?: (section: string) => void;
}

const Homepage = ({ language, onNavigate }: HomepageProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [studentName, setStudentName] = useState("");
  const [currentQuote, setCurrentQuote] = useState(0);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Load student name from localStorage
  useEffect(() => {
    const name = localStorage.getItem("marksy-student-name");
    if (name) setStudentName(name);
  }, []);

  // Motivation quotes
  const quotes = language === "en" ? [
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Don't watch the clock; do what it does. Keep going.",
    "Education is the most powerful weapon which you can use to change the world.",
    "The expert in anything was once a beginner.",
    "Your limitation—it's only your imagination.",
    "Great things never come from comfort zones.",
    "Dream it. Wish it. Do it.",
    "Success doesn't just find you. You have to go out and get it.",
    "The harder you work for something, the greater you'll feel when you achieve it."
  ] : [
    "සාර්ථකත්වය අවසන් නොවේ, අසාර්ථකත්වය මාරාන්තික නොවේ: ඉදිරියට යාමේ ධෛර්යය ගණන් කරයි.",
    "අනාගතය අයිති වන්නේ තම සිහිනවල සුන්දරත්වය විශ්වාස කරන අයට ය.",
    "ඔරලෝසුව බලන්න එපා; ඒක කරන දේ කරන්න. ඉදිරියට යන්න.",
    "ලෝකය වෙනස් කිරීමට ඔබට භාවිතා කළ හැකි බලවත්ම ආයුධය අධ්‍යාපනයයි.",
    "ඕනෑම දෙයක විශේෂඥයා වරක් ආරම්භකයෙක් වූවා.",
    "ඔබේ සීමාව - එය ඔබේ පරිකල්පනය පමණි.",
    "විශිෂ්ට දේවල් කිසි විටෙක සුවපහසු කලාපවලින් පැමිණෙන්නේ නැත.",
    "සිහින දකින්න. ප්‍රාර්ථනා කරන්න. කරන්න.",
    "සාර්ථකත්වය ඔබව හමුවන්නේ නැත. ඔබ පිටතට ගොස් එය ලබා ගත යුතුයි.",
    "යමක් සඳහා ඔබ වැඩිපුර වෙහෙස වන තරමට එය සාක්ෂාත් කර ගන්නා විට ඔබට වැඩි සතුටක් දැනෙනු ඇත."
  ];

  // Rotate quotes every 10 seconds
  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 10000);

    return () => clearInterval(quoteTimer);
  }, [quotes.length]);

  // Load and calculate real-time stats from localStorage
  const [stats, setStats] = useState({
    totalMarks: 0,
    papersCompleted: 0,
    averageScore: 0,
    streak: 0
  });

  useEffect(() => {
    // Calculate real stats from localStorage
    const calculateStats = () => {
      try {
        // Use the correct localStorage key
        const marksData = JSON.parse(localStorage.getItem("alMarksData") || "[]");
        const profileData = JSON.parse(localStorage.getItem("marksy-profile") || "{}");
        
        const totalMarks = marksData.reduce((sum: number, entry: any) => sum + (entry.total || 0), 0);
        const papersCompleted = marksData.length;
        const averageScore = papersCompleted > 0 ? Math.round((totalMarks / papersCompleted) * 10) / 10 : 0;

        // Real consecutive day streak calculation:
        // 1. Collect unique calendar dates that have at least one entry.
        // 2. Sort descending.
        // 3. Starting from today, count backwards while each prior day exists in the set.
        const dateSet = new Set<string>();
        for (const entry of marksData) {
          if (entry.date) {
            dateSet.add(entry.date.slice(0,10));
          } else if (entry.timestamp) {
            const d = new Date(entry.timestamp);
            dateSet.add(d.toISOString().slice(0,10));
          }
        }
        let streak = 0;
        const today = new Date();
        // Helper to format date as YYYY-MM-DD in local time
        const fmt = (d: Date) => {
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };
        // Iterate backwards until a day without activity is found
        while (true) {
          const key = fmt(today);
            if (dateSet.has(key)) {
              streak += 1;
              // Move one day back
              today.setDate(today.getDate() - 1);
            } else {
              break;
            }
        }
        
        setStats({
          totalMarks,
          papersCompleted,
          averageScore,
          streak
        });
      } catch (error) {
        console.error("Error calculating stats:", error);
      }
    };

    calculateStats();
    
    // Recalculate stats every minute
    const statsTimer = setInterval(calculateStats, 60000);
    
    return () => clearInterval(statsTimer);
  }, []);

  // Upcoming events (only confirmed/officially published items included)
  // Added 2025 A/L examination commencement date (provided by user). 2026 date pending exact day confirmation.
  const upcomingEvents = language === "en" ? [
    {
      event: "2025 G.C.E. A/L Examination Commences",
      date: "2025-11-10",
      type: "exam",
      priority: "high",
      icon: GraduationCap,
      description: "Official commencement date for the 2025 Advanced Level examinations. Focus your final revisions." 
    }
  ] : [
    {
      event: "2025 උ.පො.ස. උසස් පෙළ විභාගය ආරම්භ වේ",
      date: "2025-11-10",
      type: "exam",
      priority: "high",
      icon: GraduationCap,
      description: "2025 A/L විභාගයේ නිල ආරම්භක දිනය. අවසාන ආවර්තන වල යෙදෙන්න." 
    }
  ];

  const quickActions = language === "en" ? [
    { icon: Plus, label: "Add Marks", action: "marks", color: "from-blue-500 to-blue-600", description: "Record new test scores", gradient: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20" },
    { icon: BarChart, label: "View Progress", action: "dashboard", color: "from-purple-500 to-purple-600", description: "Check your analytics", gradient: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20" },
    { icon: Award, label: "Analysis", action: "analysis", color: "from-emerald-500 to-emerald-600", description: "Subject performance", gradient: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20" },
    { icon: Timer, label: "Time Tracker", action: "time-management", color: "from-orange-500 to-orange-600", description: "Study timer & goals", gradient: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20" },
    { icon: User, label: "Profile", action: "profile", color: "from-pink-500 to-pink-600", description: "Manage account", gradient: "bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20" },
    { icon: Settings, label: "About", action: "about", color: "from-gray-500 to-gray-600", description: "App information", gradient: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20" }
  ] : [
    { icon: Plus, label: "ලකුණු එකතු කරන්න", action: "marks", color: "from-blue-500 to-blue-600", description: "නව පරීක්ෂණ ලකුණු", gradient: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20" },
    { icon: BarChart, label: "ප්‍රගතිය", action: "dashboard", color: "from-purple-500 to-purple-600", description: "ඔබේ විශ්ලේෂණ", gradient: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20" },
    { icon: Award, label: "විශ්ලේෂණය", action: "analysis", color: "from-emerald-500 to-emerald-600", description: "විෂය කාර්යසාධනය", gradient: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20" },
    { icon: Timer, label: "කාල කළමනාකරණය", action: "time-management", color: "from-orange-500 to-orange-600", description: "අධ්‍යයන ටයිමර්", gradient: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20" },
    { icon: User, label: "පැතිකඩ", action: "profile", color: "from-pink-500 to-pink-600", description: "ගිණුම් කළමනාකරණය", gradient: "bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20" },
    { icon: Settings, label: "තොරතුරු", action: "about", color: "from-gray-500 to-gray-600", description: "යෙදුම් තොරතුරු", gradient: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20" }
  ];

  return (
    <div className="space-y-8 px-4 py-6">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 rounded-3xl border border-border/50">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient animate-bounce-in">
            Marksy
          </h1>
          <div className="flex items-center justify-center space-x-2 text-xl md:text-2xl text-muted-foreground">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            <span className="font-medium">
              {language === "en" ? "Your Academic Journey, Simplified" : "ඔබේ ශාස්ත්‍රීය ගමන, සරල කර ඇත"}
            </span>
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          </div>
        </div>

        {/* Personal Greeting */}
        <div className="text-lg md:text-xl">
          {studentName ? (
            <span className="text-foreground font-medium">
              {language === "en" ? `Hello, ${studentName}! 👋` : `ආයුබෝවන්, ${studentName}! 👋`}
            </span>
          ) : (
            <span className="text-muted-foreground">
              {language === "en" ? "Welcome to Marksy! 🎓" : "Marksy වෙත ඔබව සාදරයෙන් පිළිගනිමු! 🎓"}
            </span>
          )}
        </div>

        {/* Live Clock */}
        <Card className="max-w-md mx-auto academic-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-center space-x-4">
              <Clock className="h-5 w-5 text-primary" />
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-foreground">
                  {currentTime.toLocaleTimeString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {currentTime.toLocaleDateString(language === "en" ? "en-US" : "si-LK", {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <Calendar className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Quick Stats */}
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        <Card className="academic-card hover-scale group stats-card">
          <CardContent className="p-4 text-center space-y-2">
            <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalMarks}</div>
            <div className="text-sm text-muted-foreground">
              {language === "en" ? "Total Marks" : "මුළු ලකුණු"}
            </div>
          </CardContent>
        </Card>
        <Card className="academic-card hover-scale group stats-card">
          <CardContent className="p-4 text-center space-y-2">
            <Award className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.papersCompleted}</div>
            <div className="text-sm text-muted-foreground">
              {language === "en" ? "Papers Done" : "කළ ප්‍රශ්න"}
            </div>
          </CardContent>
        </Card>
        <Card className="academic-card hover-scale group stats-card">
          <CardContent className="p-4 text-center space-y-2">
            <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.averageScore}%</div>
            <div className="text-sm text-muted-foreground">
              {language === "en" ? "Average" : "සාමාන්‍ය"}
            </div>
          </CardContent>
        </Card>
        <Card className="academic-card hover-scale group stats-card">
          <CardContent className="p-4 text-center space-y-2">
            <Target className="h-8 w-8 text-orange-600 dark:text-orange-400 mx-auto group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.streak}</div>
            <div className="text-sm text-muted-foreground">
              {language === "en" ? "Day Streak" : "දින අඛණ්ඩව"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Quick Actions with Modern Animations */}
      <Card className="academic-card overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 pointer-events-none" />
        <CardHeader className="relative">
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-primary to-secondary rounded-lg shadow-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold">
              {language === "en" ? "Quick Actions" : "ඉක්මන් ක්‍රියා"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`${action.gradient} p-6 rounded-xl border border-border/50 transition-all duration-500 group-hover:border-primary/30 group-hover:shadow-2xl backdrop-blur-sm cursor-pointer`}>
                  {/* Animated background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-xl`} />
                  
                  {/* Floating particles on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                    <div className="absolute top-2 right-3 w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="absolute top-4 right-6 w-0.5 h-0.5 bg-current rounded-full animate-ping" style={{ animationDelay: '200ms' }} />
                    <div className="absolute bottom-3 right-2 w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
                  </div>

                  <div className="relative z-10 text-center space-y-3">
                    <div className="relative inline-block">
                      <div className={`p-3 bg-gradient-to-r ${action.color} rounded-xl shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                        <action.icon className="h-6 w-6 text-white drop-shadow-sm" />
                      </div>
                      
                      {/* Ripple effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${action.color} rounded-xl opacity-0 group-hover:opacity-30 animate-ping`} />
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="font-semibold text-sm leading-tight text-foreground group-hover:text-primary transition-colors duration-300">
                        {action.label}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {action.description}
                      </p>
                    </div>

                    {/* Arrow indicator */}
                    <div className="flex justify-center">
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </div>

                {/* Click overlay */}
                <button
                  onClick={() => onNavigate && onNavigate(action.action)}
                  className="absolute inset-0 w-full h-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl"
                  aria-label={action.label}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Motivation Quote */}
      <Card className="academic-card bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <Brain className="h-8 w-8 text-primary mx-auto animate-pulse" />
            <blockquote className="text-lg md:text-xl italic text-foreground font-medium leading-relaxed">
              "{quotes[currentQuote]}"
            </blockquote>
            <div className="flex justify-center space-x-1">
              {quotes.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                    index === currentQuote ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Upcoming Events */}
      <Card className="academic-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>{language === "en" ? "Upcoming Events" : "ඉදිරි සිදුවීම්"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div key={index} className={`flex items-start justify-between p-4 rounded-lg border transition-all hover:shadow-md ${
                event.priority === "high" ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20" :
                event.priority === "medium" ? "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20" :
                "border-border bg-muted/20"
              }`}>
                <div className="flex items-start space-x-3 flex-1">
                  <event.icon className={`h-5 w-5 mt-1 ${
                    event.priority === "high" ? "text-red-600" :
                    event.priority === "medium" ? "text-yellow-600" :
                    "text-primary"
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium flex items-center space-x-2">
                      <span>{event.event}</span>
                      {event.priority === "high" && <Bell className="h-4 w-4 text-red-500 animate-pulse" />}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {new Date(event.date).toLocaleDateString(language === "en" ? "en-US" : "si-LK", {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    {event.description && (
                      <div className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        {event.description}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1 ml-4">
                  <Badge variant={
                    event.type === "exam" ? "destructive" : 
                    event.type === "deadline" ? "destructive" :
                    event.type === "study" ? "secondary" : 
                    "default"
                  }>
                    {event.type}
                  </Badge>
                  <Badge variant="outline" className={
                    event.priority === "high" ? "border-red-300 text-red-700 dark:border-red-700 dark:text-red-300" :
                    event.priority === "medium" ? "border-yellow-300 text-yellow-700 dark:border-yellow-700 dark:text-yellow-300" :
                    "border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300"
                  }>
                    {event.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Noticeboard */}
      <Card className="academic-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span>{language === "en" ? "Notice Board" : "නිවේදන පුවරුව"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Developer Pinned Message */}
            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 relative">
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                  {language === "en" ? "DEVELOPER" : "සංවර්ධක"}
                </Badge>
              </div>
              <div className="flex items-start space-x-3 pr-20">
                <Heart className="flex-shrink-0 w-6 h-6 text-purple-600 mt-1" />
                <div className="space-y-3">
                  <div>
                    <h4 className="font-bold text-purple-700 dark:text-purple-300 text-lg">
                      {language === "en" ? "💜 Message from KGX (Kaveesha Gimsara)" : "💜 KGX (කවීෂ ගිම්සර) ගෙන් පණිවිඩයක්"}
                    </h4>
                    <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">
                      {language === "en" 
                        ? "Thank you for using Marksy! This tool was built with love for Sri Lankan A/L students. Your success is our motivation. Keep studying hard and chase your dreams! 🌟"
                        : "Marksy භාවිතා කිරීම සඳහා ස්තූතියි! මෙම මෙවලම ශ්‍රී ලාංකික උ.පො.ස. සිසුන් සඳහා ආදරයෙන් සාදන ලදී. ඔබේ සාර්ථකත්වය අපේ උත්සාහයයි. වෙහෙස මහන්සි වී ඉගෙන ගෙන ඔබේ සිහින පසුපස හඹා යන්න! 🌟"
                      }
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      size="sm" 
                      className="bg-purple-600 hover:bg-purple-700 dark:hover:bg-purple-500 text-white flex items-center space-x-2"
                      onClick={() => window.open("https://github.com/kaveeshagimsara/", "_blank")}
                    >
                      <Github className="h-4 w-4" />
                      <span>{language === "en" ? "Visit GitHub" : "GitHub වෙත යන්න"}</span>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900/40"
                      onClick={() => window.open("https://buymeacoffee.com/geekyedu", "_blank")}
                    >
                      <Coffee className="h-4 w-4 mr-1" />
                      <span>{language === "en" ? "Support Development" : "සංවර්ධනයට සහාය වන්න"}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Auto-Generated Version Update Notice */}
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                <div className="flex-1">
                  <h4 className="font-medium text-green-700 dark:text-green-300">
                    {language === "en" ? "🚀 Version 1.5.0 Update" : "🚀 සංස්කරණ 1.5.0 යාවත්කාලීනය"}
                  </h4>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    {language === "en" 
                      ? "Latest features: Heartbeat loading animation, Z-score statistics, enhanced progress charts, and improved UI/UX."
                      : "නවතම විශේෂාංග: හෘද ස්පන්දන පැටවුම් සජීවිකරණය, Z-ලකුණු සංඛ්‍යාලේඛන, වැඩිදියුණු කළ ප්‍රගති ප්‍රස්ථාර, සහ වැඩිදියුණු කළ UI/UX."
                    }
                  </p>
                  {/* Removed changelog and repository buttons per user request */}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Homepage;