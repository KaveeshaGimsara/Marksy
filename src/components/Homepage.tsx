import { useState, useEffect } from "react";
import { 
  Clock, Calendar, TrendingUp, Award, Target, Brain,
  ChevronRight, Sparkles, BookOpen, Users, Zap, Download,
  Timer, Bell, GraduationCap, BarChart, Plus, Eye, Settings
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface HomepageProps {
  language: string;
}

const Homepage = ({ language }: HomepageProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [studentName, setStudentName] = useState("");
  const [currentQuote, setCurrentQuote] = useState(0);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // AL Exam Date: November 11, 2025
  const alExamDate = new Date("2025-11-11T08:00:00");

  // Update time and countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Calculate countdown to AL exam
      const difference = alExamDate.getTime() - now.getTime();
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setCountdown({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [alExamDate]);

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
    streak: 0,
    studyHours: 0,
    targetProgress: 0
  });

  useEffect(() => {
    // Calculate real stats from localStorage
    const calculateStats = () => {
      try {
        const marksData = JSON.parse(localStorage.getItem("marksy-marks") || "[]");
        const profileData = JSON.parse(localStorage.getItem("marksy-profile") || "{}");
        
        const totalMarks = marksData.reduce((sum: number, entry: any) => sum + (entry.marks || 0), 0);
        const papersCompleted = marksData.length;
        const averageScore = papersCompleted > 0 ? Math.round((totalMarks / papersCompleted) * 10) / 10 : 0;
        
        // Calculate streak (simplified - days since last entry)
        const lastEntry = marksData[marksData.length - 1];
        const lastDate = lastEntry ? new Date(lastEntry.date) : new Date();
        const daysSinceLastEntry = Math.floor((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        const streak = Math.max(0, 7 - daysSinceLastEntry); // Simple streak calculation
        
        // Study hours (mock calculation based on papers completed)
        const studyHours = Math.round(papersCompleted * 2.5);
        
        // Target progress (based on AL exam preparation)
        const daysUntilExam = Math.floor((alExamDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        const totalDaysToExam = Math.floor((alExamDate.getTime() - new Date("2025-01-01").getTime()) / (1000 * 60 * 60 * 24));
        const targetProgress = Math.min(100, Math.max(0, Math.round(((totalDaysToExam - daysUntilExam) / totalDaysToExam) * 100)));
        
        setStats({
          totalMarks,
          papersCompleted,
          averageScore,
          streak,
          studyHours,
          targetProgress
        });
      } catch (error) {
        console.error("Error calculating stats:", error);
      }
    };

    calculateStats();
    
    // Recalculate stats every minute
    const statsTimer = setInterval(calculateStats, 60000);
    
    return () => clearInterval(statsTimer);
  }, [alExamDate]);

  // Mock data - in real app this would come from localStorage
  // const stats = {
  //   totalMarks: 2847,
  //   papersCompleted: 34,
  //   averageScore: 78.5,
  //   streak: 12
  // };

  const upcomingEvents = language === "en" ? [
    { date: "2025-11-11", event: "A/L Examination 2025", type: "exam", priority: "high", icon: GraduationCap },
    { date: "2025-10-20", event: "Final Revision Period", type: "study", priority: "medium", icon: BookOpen },
    { date: "2025-09-30", event: "Practice Test Series", type: "practice", priority: "medium", icon: Target },
    { date: "2025-01-15", event: "Biology Model Paper", type: "practice", priority: "low", icon: BookOpen },
    { date: "2025-01-20", event: "Chemistry Revision", type: "study", priority: "low", icon: Brain }
  ] : [
    { date: "2025-11-11", event: "උ.පො.ස. පරීක්ෂණ 2025", type: "exam", priority: "high", icon: GraduationCap },
    { date: "2025-10-20", event: "අවසාන සමාලෝචන කාලය", type: "study", priority: "medium", icon: BookOpen },
    { date: "2025-09-30", event: "පුහුණු පරීක්ෂා මාලාව", type: "practice", priority: "medium", icon: Target },
    { date: "2025-01-15", event: "ජීව විද්‍යා ආදර්ශ ප්‍රශ්න පත්‍රය", type: "practice", priority: "low", icon: BookOpen },
    { date: "2025-01-20", event: "රසායන විද්‍යා සමාලෝචනය", type: "study", priority: "low", icon: Brain }
  ];

  const quickActions = language === "en" ? [
    { icon: Plus, label: "Add Marks", action: "marks", color: "bg-primary", description: "Record new test scores" },
    { icon: BarChart, label: "View Dashboard", action: "dashboard", color: "bg-secondary", description: "Check your progress" },
    { icon: Award, label: "Subject Analysis", action: "analysis", color: "bg-accent", description: "Analyze performance" },
    { icon: Target, label: "Set Goals", action: "goals", color: "bg-warning", description: "Plan your targets" },
    { icon: Eye, label: "Profile", action: "profile", color: "bg-destructive", description: "Manage your profile" },
    { icon: Settings, label: "Settings", action: "settings", color: "bg-muted", description: "App preferences" }
  ] : [
    { icon: Plus, label: "ලකුණු එකතු කරන්න", action: "marks", color: "bg-primary", description: "නව පරීක්ෂණ ලකුණු වාර්තා කරන්න" },
    { icon: BarChart, label: "ප්‍රගතිය බලන්න", action: "dashboard", color: "bg-secondary", description: "ඔබේ ප්‍රගතිය පරීක්ෂා කරන්න" },
    { icon: Award, label: "විෂය විශ්ලේෂණය", action: "analysis", color: "bg-accent", description: "කාර්ය සාධනය විශ්ලේෂණය කරන්න" },
    { icon: Target, label: "ඉලක්ක සකසන්න", action: "goals", color: "bg-warning", description: "ඔබේ ඉලක්ක සැලසුම් කරන්න" },
    { icon: Eye, label: "පැතිකඩ", action: "profile", color: "bg-destructive", description: "ඔබේ පැතිකඩ කළමනාකරණය කරන්න" },
    { icon: Settings, label: "සැකසීම්", action: "settings", color: "bg-muted", description: "යෙදුම් මනාප" }
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

      {/* AL Exam Countdown */}
      <Card className="academic-card bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-200 dark:border-red-800 countdown-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-700 dark:text-red-300">
            <Timer className="h-5 w-5" />
            <span>{language === "en" ? "A/L Examination 2025 Countdown" : "උ.පො.ස. පරීක්ෂණ 2025 ගණනය"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {language === "en" ? "November 11, 2025" : "2025 නොවැම්බර් 11"}
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border dark:border-red-800/50">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400 countdown-number">{countdown.days}</div>
                <div className="text-sm text-red-500 dark:text-red-400">{language === "en" ? "Days" : "දින"}</div>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border dark:border-red-800/50">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400 countdown-number">{countdown.hours}</div>
                <div className="text-sm text-red-500 dark:text-red-400">{language === "en" ? "Hours" : "පැය"}</div>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border dark:border-red-800/50">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400 countdown-number">{countdown.minutes}</div>
                <div className="text-sm text-red-500 dark:text-red-400">{language === "en" ? "Minutes" : "මිනිත්තු"}</div>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border dark:border-red-800/50">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400 countdown-number">{countdown.seconds}</div>
                <div className="text-sm text-red-500 dark:text-red-400">{language === "en" ? "Seconds" : "තත්පර"}</div>
              </div>
            </div>
            <Progress value={stats.targetProgress} className="w-full" />
            <div className="text-sm text-muted-foreground">
              {language === "en" ? `${stats.targetProgress}% exam preparation progress` : `${stats.targetProgress}% පරීක්ෂණ සූදානම් ප්‍රගතිය`}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="academic-card hover-scale group stats-card">
          <CardContent className="p-4 text-center space-y-2">
            <BookOpen className="h-8 w-8 text-primary mx-auto group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-bold text-primary">{stats.totalMarks}</div>
            <div className="text-sm text-muted-foreground">
              {language === "en" ? "Total Marks" : "මුළු ලකුණු"}
            </div>
          </CardContent>
        </Card>
        <Card className="academic-card hover-scale group stats-card">
          <CardContent className="p-4 text-center space-y-2">
            <Award className="h-8 w-8 text-secondary mx-auto group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-bold text-secondary">{stats.papersCompleted}</div>
            <div className="text-sm text-muted-foreground">
              {language === "en" ? "Papers Done" : "කළ ප්‍රශ්න"}
            </div>
          </CardContent>
        </Card>
        <Card className="academic-card hover-scale group stats-card">
          <CardContent className="p-4 text-center space-y-2">
            <TrendingUp className="h-8 w-8 text-accent mx-auto group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-bold text-accent">{stats.averageScore}%</div>
            <div className="text-sm text-muted-foreground">
              {language === "en" ? "Average" : "සාමාන්‍ය"}
            </div>
          </CardContent>
        </Card>
        <Card className="academic-card hover-scale group stats-card">
          <CardContent className="p-4 text-center space-y-2">
            <Target className="h-8 w-8 text-warning mx-auto group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-bold text-warning">{stats.streak}</div>
            <div className="text-sm text-muted-foreground">
              {language === "en" ? "Day Streak" : "දින අඛණ්ඩව"}
            </div>
          </CardContent>
        </Card>
        <Card className="academic-card hover-scale group stats-card">
          <CardContent className="p-4 text-center space-y-2">
            <Clock className="h-8 w-8 text-blue-600 mx-auto group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-bold text-blue-600">{stats.studyHours}</div>
            <div className="text-sm text-muted-foreground">
              {language === "en" ? "Study Hours" : "අධ්‍යයන පැය"}
            </div>
          </CardContent>
        </Card>
        <Card className="academic-card hover-scale group stats-card">
          <CardContent className="p-4 text-center space-y-2">
            <GraduationCap className="h-8 w-8 text-green-600 mx-auto group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-bold text-green-600">{stats.targetProgress}%</div>
            <div className="text-sm text-muted-foreground">
              {language === "en" ? "Exam Ready" : "පරීක්ෂණ සූදානම"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Quick Actions */}
      <Card className="academic-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-primary" />
            <span>{language === "en" ? "Quick Actions" : "ඉක්මන් ක්‍රියා"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-24 flex-col space-y-2 academic-button hover-scale group relative overflow-hidden"
              >
                <action.icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-center">{action.label}</span>
                <span className="text-xs text-muted-foreground text-center opacity-70">{action.description}</span>
              </Button>
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
              <div key={index} className={`flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-md ${
                event.priority === "high" ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20" :
                event.priority === "medium" ? "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20" :
                "border-border bg-muted/20"
              }`}>
                <div className="flex items-center space-x-3">
                  <event.icon className={`h-5 w-5 ${
                    event.priority === "high" ? "text-red-600" :
                    event.priority === "medium" ? "text-yellow-600" :
                    "text-primary"
                  }`} />
                  <div>
                    <div className="font-medium flex items-center space-x-2">
                      <span>{event.event}</span>
                      {event.priority === "high" && <Bell className="h-4 w-4 text-red-500 animate-pulse" />}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString(language === "en" ? "en-US" : "si-LK", {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={
                    event.type === "exam" ? "destructive" : 
                    event.type === "study" ? "secondary" : 
                    "default"
                  }>
                    {event.type}
                  </Badge>
                  <Badge variant="outline" className={
                    event.priority === "high" ? "border-red-300 text-red-700" :
                    event.priority === "medium" ? "border-yellow-300 text-yellow-700" :
                    "border-gray-300 text-gray-700"
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
            {/* AL Exam Timetable Notice - Pinned */}
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 relative">
              <div className="absolute top-2 right-2">
                <Badge variant="destructive" className="text-xs">
                  {language === "en" ? "PINNED" : "ඇමිණූ"}
                </Badge>
              </div>
              <div className="flex items-start space-x-3 pr-16">
                <GraduationCap className="flex-shrink-0 w-6 h-6 text-red-600 mt-1" />
                <div className="space-y-3">
                  <div>
                    <h4 className="font-bold text-red-700 dark:text-red-300 text-lg">
                      {language === "en" ? "🚨 A/L Examination 2025 - Time Table Released!" : "🚨 උ.පො.ස. පරීක්ෂණ 2025 - කාල සටහන නිකුත් කර ඇත!"}
                    </h4>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                      {language === "en" 
                        ? "The official A/L examination timetable for 2025 has been released. Download the PDF to check your exam dates and plan your study schedule accordingly."
                        : "2025 සඳහා නිල උ.පො.ස. පරීක්ෂණ කාල සටහන නිකුත් කර ඇත. ඔබේ පරීක්ෂණ දිනයන් පරීක්ෂා කර ඒ අනුව ඔබේ අධ්‍යයන කාලසටහන සැලසුම් කිරීමට PDF බාගන්න."
                      }
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      size="sm" 
                      className="bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2"
                      onClick={() => window.open("https://www.doenets.lk/images/resources/NEWS/AL%20Time%20Table%202025_1755235159873.pdf", "_blank")}
                    >
                      <Download className="h-4 w-4" />
                      <span>{language === "en" ? "Download Timetable" : "කාල සටහන බාගන්න"}</span>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-red-300 text-red-700 hover:bg-red-50"
                      onClick={() => window.open("https://www.doenets.lk/", "_blank")}
                    >
                      <span>{language === "en" ? "Visit Official Site" : "නිල වෙබ් අඩවියට යන්න"}</span>
                    </Button>
                  </div>
                  <div className="text-xs text-red-500 dark:text-red-400">
                    {language === "en" ? "📅 Exam starts: November 11, 2025" : "📅 පරීක්ෂණ ආරම්භය: 2025 නොවැම්බර් 11"}
                  </div>
                </div>
              </div>
            </div>

            {/* Other System Updates */}
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <h4 className="font-medium text-foreground">
                    {language === "en" ? "✨ New Features Added" : "✨ නව විශේෂාංග එකතු කර ඇත"}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === "en" 
                      ? "Real-time countdown to A/L exams, improved statistics dashboard, and enhanced mobile experience!"
                      : "උ.පො.ස. පරීක්ෂණ සඳහා තත්‍ය කාලීන ගණනය, වැඩිදියුණු කළ සංඛ්‍යාලේඛන උපකරණ පුවරුව, සහ වැඩිදියුණු කළ ජංගම අත්දැකීම!"
                    }
                  </p>
                  <div className="text-xs text-muted-foreground mt-2">
                    {language === "en" ? "📱 Better mobile support • 📊 Real-time stats • ⏰ Live countdown" : "📱 වඩා හොඳ ජංගම සහාය • 📊 තත්‍ය කාලීන සංඛ්‍යාලේඛන • ⏰ සජීව ගණනය"}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                <div>
                  <h4 className="font-medium text-blue-700 dark:text-blue-300">
                    {language === "en" ? "💡 Study Tips" : "💡 අධ්‍යයන උපදෙස්"}
                  </h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                    {language === "en" 
                      ? "Create a study schedule, practice past papers regularly, and track your progress using Marksy!"
                      : "අධ්‍යයන කාලසටහනක් සාදන්න, පසුගිය ප්‍රශ්න නිතිපතා පුහුණු කරන්න, සහ Marksy භාවිතා කරමින් ඔබේ ප්‍රගතිය සොයන්න!"
                    }
                  </p>
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