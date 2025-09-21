import { useState, useEffect } from "react";
import { 
  Clock, Calendar, TrendingUp, Award, Target, Brain,
  ChevronRight, Sparkles, BookOpen, Users, Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HomepageProps {
  language: string;
}

const Homepage = ({ language }: HomepageProps) => {
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

  // Mock data - in real app this would come from localStorage
  const stats = {
    totalMarks: 2847,
    papersCompleted: 34,
    averageScore: 78.5,
    streak: 12
  };

  const upcomingEvents = language === "en" ? [
    { date: "2024-12-15", event: "Biology Model Paper", type: "exam" },
    { date: "2024-12-20", event: "Chemistry Revision", type: "study" },
    { date: "2025-01-10", event: "Physics MCQ Practice", type: "practice" }
  ] : [
    { date: "2024-12-15", event: "ජීව විද්‍යා ආදර්ශ ප්‍රශ්න පත්‍රය", type: "exam" },
    { date: "2024-12-20", event: "රසායන විද්‍යා සමාලෝචනය", type: "study" },
    { date: "2025-01-10", event: "භෞතික විද්‍යා MCQ පුහුණුව", type: "practice" }
  ];

  const quickActions = language === "en" ? [
    { icon: BookOpen, label: "Add Marks", action: "marks", color: "bg-primary" },
    { icon: TrendingUp, label: "View Progress", action: "dashboard", color: "bg-secondary" },
    { icon: Award, label: "Achievements", action: "analysis", color: "bg-accent" },
    { icon: Target, label: "Set Goals", action: "goals", color: "bg-warning" }
  ] : [
    { icon: BookOpen, label: "ලකුණු එකතු කරන්න", action: "marks", color: "bg-primary" },
    { icon: TrendingUp, label: "ප්‍රගතිය බලන්න", action: "dashboard", color: "bg-secondary" },
    { icon: Award, label: "ජයග්‍රහණ", action: "analysis", color: "bg-accent" },
    { icon: Target, label: "ඉලක්ක සකසන්න", action: "goals", color: "bg-warning" }
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

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="academic-card hover-scale">
          <CardContent className="p-4 text-center space-y-2">
            <div className="text-2xl font-bold text-primary">{stats.totalMarks}</div>
            <div className="text-sm text-muted-foreground">
              {language === "en" ? "Total Marks" : "මුළු ලකුණු"}
            </div>
          </CardContent>
        </Card>
        <Card className="academic-card hover-scale">
          <CardContent className="p-4 text-center space-y-2">
            <div className="text-2xl font-bold text-secondary">{stats.papersCompleted}</div>
            <div className="text-sm text-muted-foreground">
              {language === "en" ? "Papers Done" : "කළ ප්‍රශ්න"}
            </div>
          </CardContent>
        </Card>
        <Card className="academic-card hover-scale">
          <CardContent className="p-4 text-center space-y-2">
            <div className="text-2xl font-bold text-accent">{stats.averageScore}%</div>
            <div className="text-sm text-muted-foreground">
              {language === "en" ? "Average" : "සාමාන්‍ය"}
            </div>
          </CardContent>
        </Card>
        <Card className="academic-card hover-scale">
          <CardContent className="p-4 text-center space-y-2">
            <div className="text-2xl font-bold text-warning">{stats.streak}</div>
            <div className="text-sm text-muted-foreground">
              {language === "en" ? "Day Streak" : "දින අඛණ්ඩව"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="academic-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-primary" />
            <span>{language === "en" ? "Quick Actions" : "ඉක්මන් ක්‍රියා"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-20 flex-col space-y-2 academic-button hover-scale"
              >
                <action.icon className="h-6 w-6" />
                <span className="text-xs font-medium">{action.label}</span>
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

      {/* Upcoming Events */}
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
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Badge variant={event.type === "exam" ? "destructive" : event.type === "study" ? "secondary" : "default"}>
                    {event.type}
                  </Badge>
                  <span className="font-medium">{event.event}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(event.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Noticeboard */}
      <Card className="academic-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span>{language === "en" ? "Noticeboard" : "නිවේදන පුවරුව"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <h4 className="font-medium text-foreground">
                    {language === "en" ? "System Update" : "පද්ධති යාවත්කාලීනය"}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === "en" 
                      ? "New features added: Dark mode, language switcher, and improved analytics!"
                      : "නව විශේෂාංග එකතු කර ඇත: අඳුරු ප්‍රකාරය, භාෂා මාරුව, සහ වැඩිදියුණු කළ විශ්ලේෂණ!"
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