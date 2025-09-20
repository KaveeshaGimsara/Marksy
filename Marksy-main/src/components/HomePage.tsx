import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Clock, BookOpen, Target, TrendingUp, Calendar, Star, Users, Award, Bell, Home, BarChart3, Plus, User, HelpCircle, Info, Github, Mail, Twitter } from 'lucide-react';
import Header from './Header';
import AddMarks from './AddMarks';
import SubjectAnalysis from './SubjectAnalysis';
import ProfilePage from './ProfilePage';
import CreditsPage from './CreditsPage';
import HelpPage from './HelpPage';
import AboutPage from './AboutPage';
import { useLanguage } from '@/contexts/LanguageContext';

interface Subject {
  name: string;
  marks: number[];
  total: number;
  target?: number;
}

interface SavedMarks {
  id: string;
  subjects: Subject[];
  timestamp: number;
  sessionName?: string;
}

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeSection, setActiveSection] = useState('home');
  const { t, lang } = useLanguage();

  // Local state tick to force refresh when marks data changes elsewhere
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    const handler = () => setRefreshTick(t => t + 1);
    window.addEventListener('marksDataUpdated', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('marksDataUpdated', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  // Adapt existing session-based logic to actual marks entries stored in 'alMarksData'
  // We wrap each mark entry as a pseudo session so the rest of the code (recent activity, notices) still works.
  const getSavedMarks = (): SavedMarks[] => {
    try {
      const marksRaw = localStorage.getItem('alMarksData');
      const marks: any[] = marksRaw ? JSON.parse(marksRaw) : [];
      return marks.map(m => ({
        id: m.id || String(m.date) || Math.random().toString(36).slice(2),
        sessionName: m.paperName || `${m.subject} Paper`,
        timestamp: new Date(m.date || Date.now()).getTime(),
        subjects: [{
          name: m.subject,
          marks: [typeof m.total === 'number' ? m.total : 0],
          // Assume totals scaled to 100; if different, adjust logic later
          total: 100
        }]
      }));
    } catch (e) {
      console.error('Error reading alMarksData:', e);
      return [];
    }
  };

  // Calculate statistics from real data
  const calculateStats = () => {
    const savedMarksSessions = getSavedMarks();
    if (savedMarksSessions.length === 0) {
      return {
        totalSubjects: 0,
        averagePerformance: 0,
        completedTests: 0,
        currentStreak: 0,
        totalMarks: 0,
        bestPerformance: 0
      };
    }

    // Get all unique subjects across all sessions
    const allSubjects = new Set();
    let allPercentages = [];
    let totalMarksOverall = 0;
    
    savedMarksSessions.forEach(session => {
      const subjects = session.subjects || [];
      subjects.forEach(subject => {
        allSubjects.add(subject.name);
        if (subject.marks && subject.marks.length > 0 && subject.total > 0) {
          const totalMarks = subject.marks.reduce((sum, mark) => sum + mark, 0);
          const percentage = (totalMarks / subject.total) * 100;
          allPercentages.push(percentage);
          totalMarksOverall += totalMarks;
        }
      });
    });
    
    const totalSubjects = allSubjects.size;
    const completedTests = savedMarksSessions.length;
    const averagePerformance = allPercentages.length > 0 ? Math.round(allPercentages.reduce((sum, p) => sum + p, 0) / allPercentages.length) : 0;
    const bestPerformance = allPercentages.length > 0 ? Math.round(Math.max(...allPercentages)) : 0;
    
    // Calculate streak (consecutive days with activity)
    const today = new Date();
    let currentStreak = 0;
    const sortedSessions = [...savedMarksSessions].sort((a, b) => b.timestamp - a.timestamp);
    
    for (let i = 0; i < sortedSessions.length; i++) {
      const sessionDate = new Date(sortedSessions[i].timestamp);
      const diffDays = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= i + 1) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    return {
      totalSubjects,
      averagePerformance,
      completedTests,
      currentStreak: Math.min(currentStreak, 30), // Cap at 30 days
      totalMarks: totalMarksOverall,
      bestPerformance
    };
  };

  const stats = calculateStats(); // recalculates each render; refreshTick ensures re-render when data changes

  // Get recent activity from real data
  const getRecentActivity = () => {
    const savedMarksSessions = getSavedMarks();
    if (savedMarksSessions.length === 0) {
      return [
        { subject: t('activity.noneTitle'), score: t('activity.noneSubtitle'), time: '—', type: 'welcome' }
      ];
    }

    // Get the most recent 5 sessions with detailed info
    return savedMarksSessions.slice(-5).map((session, index) => {
      const subjects = session.subjects || [];
      const sessionName = session.sessionName || `Study Session ${savedMarksSessions.length - 4 + index}`;
      const date = new Date(session.timestamp);
      const timeAgo = getTimeAgo(session.timestamp);
      
      // Calculate session performance
      let totalMarks = 0;
      let totalPossible = 0;
      subjects.forEach(subject => {
        if (subject.marks && subject.marks.length > 0 && subject.total > 0) {
          totalMarks += subject.marks.reduce((sum, mark) => sum + mark, 0);
          totalPossible += subject.total;
        }
      });
      
      const performance = totalPossible > 0 ? Math.round((totalMarks / totalPossible) * 100) : 0;
      const subjectCount = subjects.length;
      
      return {
        subject: sessionName,
        score: subjectCount > 0 ? `${subjectCount} subject${subjectCount !== 1 ? 's' : ''} • ${performance}% avg` : 'No subjects',
        time: timeAgo,
        type: 'session',
        performance
      };
    }).reverse(); // Show most recent first
  };

  // Helper function to calculate time ago
  const getTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diffMs = now - timestamp;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 60) {
      return diffMinutes <= 1 ? 'Just now' : `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return new Date(timestamp).toLocaleDateString();
    }
  };

  const recentActivity = getRecentActivity();

  // Dynamic data for home page display based on user progress
  const getHomePageData = () => {
    const savedSessions = getSavedMarks();
    const hasData = savedSessions.length > 0;
    
    const notices = [
      {
        title: hasData ? "Great Progress!" : "Welcome to Marksy!",
        content: hasData ? `You've completed ${stats.completedTests} study sessions with ${stats.totalSubjects} subjects tracked` : "Start tracking your academic progress efficiently",
        type: "info"
      },
      {
        title: stats.currentStreak > 0 ? `${stats.currentStreak} Day Streak! 🔥` : "Stay Consistent",
        content: stats.currentStreak > 0 ? "Keep up the amazing work!" : "Build a study streak for better results",
        type: stats.currentStreak > 0 ? "success" : "update"
      },
      {
        title: stats.bestPerformance > 0 ? `Best Performance: ${stats.bestPerformance}%` : "Aim High",
        content: stats.bestPerformance > 0 ? "Your top session shows your potential—try to beat it this week." : "Add marks to unlock performance insights.",
        type: stats.bestPerformance > 0 ? "success" : "info"
      }
    ];

    const upcomingEvents = hasData ? [
      { 
        title: "Continue Learning", 
        content: `Your average is ${stats.averagePerformance}% - ${stats.averagePerformance >= 80 ? 'Excellent work!' : 'Keep improving!'}`, 
        date: "Today" 
      },
      { 
        title: "Subject Analysis", 
        content: "Review your performance across all subjects", 
        date: "Available" 
      }
    ] : [
      { 
        title: "Add Your First Marks", 
        content: "Start tracking your academic performance", 
        date: "Today" 
      },
      { 
        title: "Explore Features", 
        content: "Discover analysis and progress tracking tools", 
        date: "Anytime" 
      }
    ];

    return { notices, upcomingEvents };
  };

  const homePageData = getHomePageData();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return t('greeting.morning');
    if (hour < 17) return t('greeting.afternoon');
    return t('greeting.evening');
  };

  const navigationItems = [
    { id: 'home', label: t('nav.home'), value: 'home', icon: Home },
    { id: 'add-marks', label: t('nav.addMarks'), value: 'add-marks', icon: Plus },
    { id: 'analysis', label: t('nav.analysis'), value: 'analysis', icon: BarChart3 },
    { id: 'profile', label: t('nav.profile'), value: 'profile', icon: User },
    { id: 'credits', label: t('nav.credits'), value: 'credits', icon: Award }
  ];

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    // Scroll to top when changing sections for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPageContent = () => {
    switch (activeSection) {
      case 'add-marks':
        return <AddMarks />;
      case 'analysis':
        return <SubjectAnalysis />;
      case 'profile':
        return <ProfilePage />;
      case 'credits':
        return <CreditsPage />;
      case 'help':
        return <HelpPage />;
      case 'about':
        return <AboutPage />;
      case 'home':
      default:
        return renderHomeContent();
    }
  };

  const renderHomeContent = () => (
    <>
      {/* Welcome Section with Clock and Greeting */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {getGreeting()}!
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  {t('home.ready')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg sm:text-xl font-mono font-bold text-blue-600 dark:text-blue-400">
                {formatTime(currentTime)}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {currentTime.toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t('stats.subjects')}</p>
                <p className="text-lg sm:text-xl font-bold">{stats.totalSubjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t('stats.average')}</p>
                <p className="text-lg sm:text-xl font-bold">{stats.averagePerformance}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t('stats.tests')}</p>
                <p className="text-lg sm:text-xl font-bold">{stats.completedTests}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full">
                <Award className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t('stats.streak')}</p>
                <p className="text-lg sm:text-xl font-bold">{stats.currentStreak}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Notices */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              {t('activity.recent')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className={`p-1.5 sm:p-2 rounded-full ${
                  activity.type === 'welcome' 
                    ? 'bg-purple-100 dark:bg-purple-900' 
                    : activity.performance >= 80 
                      ? 'bg-green-100 dark:bg-green-900' 
                      : activity.performance >= 60 
                        ? 'bg-yellow-100 dark:bg-yellow-900' 
                        : 'bg-blue-100 dark:bg-blue-900'
                }`}>
                  {activity.type === 'welcome' ? (
                    <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400" />
                  ) : activity.performance >= 80 ? (
                    <Award className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm sm:text-base">{activity.subject}</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{activity.score}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                  {activity.type === 'session' && activity.performance > 0 && (
                    <div className={`text-xs font-medium mt-1 ${
                      activity.performance >= 80 
                        ? 'text-green-600 dark:text-green-400' 
                        : activity.performance >= 60 
                          ? 'text-yellow-600 dark:text-yellow-400' 
                          : 'text-blue-600 dark:text-blue-400'
                    }`}>
                      {activity.performance}%
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notices & Updates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
              {t('notices.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {homePageData.notices.map((notice, index) => (
              <div key={index} className="p-3 sm:p-4 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                <div className="flex items-start gap-3">
                  <Badge variant={notice.type === 'info' ? 'default' : 'secondary'} className="text-xs">
                    {notice.type}
                  </Badge>
                </div>
                <h4 className="font-medium mt-2 text-sm sm:text-base">{notice.title}</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{notice.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            {t('quick.actions')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {homePageData.upcomingEvents.map((event, index) => (
              <div key={index} className="p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm sm:text-base">{event.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{event.content}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {event.date}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );

  // Custom Footer Component
  const CustomFooter = () => (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Marksy. {t('footer.rights')}
            </span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <a href="https://github.com/kaveeshagimsara" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="mailto:kaveegimx@gmail.com">
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="https://twitter.com/kaveeshagimsara" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Help and About buttons for mobile */}
          <div className="flex items-center gap-2 lg:hidden">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleSectionChange('help')}
              className="flex items-center gap-1"
            >
              <HelpCircle className="h-4 w-4" />
              {t('nav.help')}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleSectionChange('about')}
              className="flex items-center gap-1"
            >
              <Info className="h-4 w-4" />
              {t('nav.about')}
            </Button>
          </div>

          {/* Help and About buttons for desktop */}
          <div className="hidden lg:flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleSectionChange('help')}
              className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <HelpCircle className="h-4 w-4" />
              {t('nav.help')}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleSectionChange('about')}
              className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <Info className="h-4 w-4" />
              {t('nav.about')}
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Header 
        navigationItems={navigationItems}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
      
      <main className="container mx-auto px-2 sm:px-3 lg:px-4 py-4 sm:py-6 lg:py-8 pb-20 sm:pb-8">
        <div className="space-y-4 sm:space-y-6">
          {renderPageContent()}
        </div>
      </main>

      <CustomFooter />
    </div>
  );
}