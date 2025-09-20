import { useState, useEffect, useCallback } from 'react';
import {
  Trophy, Award, Target, User, Edit2, Save, X,
  FileSpreadsheet, FileText, Upload, Camera, BarChart3,
  GraduationCap, Star, TrendingUp, Calendar as CalendarIcon, 
  Microscope, Beaker, Atom, Calculator, Sunrise, Moon, CalendarCheck, 
  Medal, Zap, Plus, PlusCircle, CheckCircle, Clock, Trash, Phone, AtSign, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // if not present create a simple wrapper or replace with <textarea className="...">
/* If Textarea component is not available in your ui set, swap with a <textarea> styled manually */

interface ProfileData {
  name: string;
  age: number;
  school: string;
  notes: string;
  avatar?: string; // base64 data URL
}

interface AchievementDef {
  id: string;
  title: string;
  desc: string;
  icon: React.ComponentType<any>;
  earned: boolean;
  threshold?: number;
}

interface MarkEntry {
  id: string;
  subject: string;
  total: number;
  date: string;
  paperName: string;
}

interface TodoItem {
  id: string;
  task: string;
  subject: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
}

interface TutorInfo {
  id: string;
  name: string;
  contact: string;
  color: string;
}

const PROFILE_KEY = 'profileData';
const MARKS_KEY = 'alMarksData';

const capitalize = (s: string) => s.replace(/\b\w/g, c => c.toUpperCase());

const defaultProfile: ProfileData = {
  name: 'Student Name',
  age: 16,
  school: 'Your School',
  notes: 'Add study notes or goals here...',
  avatar: undefined
};

const ProfilePage = () => {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [editing, setEditing] = useState(false);
  const [marksData, setMarksData] = useState<MarkEntry[]>([]);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [importBusy, setImportBusy] = useState(false);
  const [todos, setTodos] = useState<TodoItem[]>(() =>
    JSON.parse(localStorage.getItem('alTodos') || '[]')
  );
  const [newTodo, setNewTodo] = useState({ task: '', subject: '', dueDate: '' });
  const [calendarDate, setCalendarDate] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // Add tutors state - persist in localStorage
  const [tutors, setTutors] = useState<TutorInfo[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('tutors') || '[]');
    } catch (e) {
      return [];
    }
  });
  const [newTutor, setNewTutor] = useState({ name: '', contact: '' });
  const [tutorError, setTutorError] = useState<string | null>(null);

  // Colors for tutor avatars
  const tutorColors = [
    'bg-pink-500', 'bg-indigo-500', 'bg-emerald-500',
    'bg-teal-500', 'bg-amber-500', 'bg-fuchsia-500',
    'bg-blue-500', 'bg-violet-500', 'bg-cyan-500'
  ];
  
  const saveTutors = (updatedTutors: TutorInfo[]) => {
    localStorage.setItem('tutors', JSON.stringify(updatedTutors));
    setTutors(updatedTutors);
  };

  const addTutor = () => {
    setTutorError(null);
    
    if (!newTutor.name.trim()) {
      setTutorError("Tutor name is required");
      return;
    }
    
    if (tutors.length >= 5) {
      setTutorError("Maximum 5 tutors allowed");
      return;
    }
    
    const tutor: TutorInfo = {
      id: Date.now().toString(),
      name: newTutor.name.trim(),
      contact: newTutor.contact.trim(),
      color: tutorColors[Math.floor(Math.random() * tutorColors.length)]
    };
    
    saveTutors([...tutors, tutor]);
    setNewTutor({ name: '', contact: '' });
  };
  
  const deleteTutor = (id: string) => {
    saveTutors(tutors.filter(t => t.id !== id));
    setTutorError(null);
  };

  // Load persisted data
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem(PROFILE_KEY);
      if (storedProfile) setProfile(JSON.parse(storedProfile));
      const storedMarks = localStorage.getItem(MARKS_KEY);
      if (storedMarks) setMarksData(JSON.parse(storedMarks));
    } catch (e) {
      console.warn('Load error', e);
    }
  }, []);

  const persistProfile = (data: ProfileData) => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
  };

  const persistTodos = (list: TodoItem[]) => {
    setTodos(list);
    localStorage.setItem('alTodos', JSON.stringify(list));
  };

  // Function to calculate real-time stats for Quick Stats section
  const calculateRealTimeStats = () => {
    // Get current date
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Calculate papers this month
    const papersThisMonth = marksData.filter(mark => {
      const markDate = new Date(mark.date);
      return markDate.getMonth() === currentMonth && markDate.getFullYear() === currentYear;
    }).length;
    
    // Calculate average score
    const avgScore = marksData.length > 0 ? 
      Math.round(marksData.reduce((sum, m) => sum + m.total, 0) / marksData.length) : 0;
    
    // Calculate improvement (compare avg of last 3 papers vs avg of papers before that)
    const recentPapers = [...marksData].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const last3Avg = recentPapers.slice(0, 3).reduce((sum, p) => sum + p.total, 0) / 
      Math.min(3, recentPapers.length);
    const previousAvg = recentPapers.length > 3 ? 
      recentPapers.slice(3).reduce((sum, p) => sum + p.total, 0) / 
      Math.max(1, recentPapers.length - 3) : last3Avg;
    const improvement = last3Avg - previousAvg;
    
    // Calculate time spent (estimate based on paper count and timestamps)
    const studyHoursEstimate = Math.floor(marksData.length * 1.8);
    
    // Calculate streak (consecutive days with papers)
    const dateStrings = [...new Set(marksData.map(m => m.date))];
    const dates = dateStrings.map(d => new Date(d).toDateString());
    let streak = 0;
    // This is simplified, for a real streak you'd need more complex logic
    
    return {
      papersThisMonth,
      avgScore,
      improvement: improvement.toFixed(1),
      studyHours: studyHoursEstimate,
      highScores: marksData.filter(m => m.total >= 75).length,
      streak: Math.min(dateStrings.length, 7) // Simplified streak calculation
    };
  };
  
  const realTimeStats = calculateRealTimeStats();

  // Subject aggregation
  const subjectStats = (() => {
    if (!marksData.length) return [];
    const counts: Record<string, number> = {};
    marksData.forEach(m => {
      counts[m.subject] = (counts[m.subject] || 0) + 1;
    });
    const max = Math.max(...Object.values(counts));
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([subject, count]) => ({
        subject,
        count,
        pct: max ? Math.round((count / max) * 100) : 0
      }))
      .slice(0, 8);
  })();

  // Enhanced achievements with real data progress
  const getAchievements = () => {
    // Derive statistics needed for achievements
    const subjectSet = new Set(marksData.map(m => m.subject));
    const uniqueSubjects = Array.from(subjectSet);
    const subjectCounts = uniqueSubjects.reduce((acc, subject) => {
      acc[subject] = marksData.filter(m => m.subject === subject).length;
      return acc;
    }, {} as Record<string, number>);
    
    const sortedByDate = [...marksData].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Calculate improvement (last 3 papers vs previous papers)
    const recentAvg = sortedByDate.slice(-3).reduce((sum, m) => sum + m.total, 0) / 
      Math.min(3, sortedByDate.length);
    const previousAvg = sortedByDate.length > 3 ? 
      sortedByDate.slice(0, -3).reduce((sum, m) => sum + m.total, 0) / 
        Math.max(1, sortedByDate.length - 3) : 0;
    const improvement = recentAvg - previousAvg;
    
    // Calculate streaks
    const dateMap = new Map<string, number>();
    marksData.forEach(m => {
      const date = m.date.split('T')[0];
      dateMap.set(date, (dateMap.get(date) || 0) + 1);
    });
    const dates = Array.from(dateMap.keys()).sort();
    let maxStreak = 0;
    let currentStreak = 0;
    
    // Simple streak calculation
    for (let i = 0; i < dates.length; i++) {
      if (i === 0 || new Date(dates[i]).getTime() - new Date(dates[i-1]).getTime() <= 86400000) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    return [
      {
        id: 'first-paper',
        title: 'First Paper',
        desc: 'Recorded your first paper',
        icon: Trophy,
        earned: marksData.length >= 1,
        threshold: 1,
        progress: Math.min(marksData.length, 1),
        progressText: `${Math.min(marksData.length, 1)}/1 papers`
      },
      {
        id: 'five-papers',
        title: '5 Papers',
        desc: 'Completed 5 papers',
        icon: Award,
        earned: marksData.length >= 5,
        threshold: 5,
        progress: Math.min(marksData.length / 5, 1),
        progressText: `${marksData.length}/5 papers`
      },
      {
        id: 'ten-papers',
        title: '10 Papers',
        desc: 'Consistent progress (10)',
        icon: Target,
        earned: marksData.length >= 10,
        threshold: 10,
        progress: Math.min(marksData.length / 10, 1),
        progressText: `${marksData.length}/10 papers`
      },
      {
        id: 'three-subjects',
        title: '3 Subjects',
        desc: 'Diverse study',
        icon: BarChart3,
        earned: uniqueSubjects.length >= 3,
        threshold: 3,
        progress: Math.min(uniqueSubjects.length / 3, 1),
        progressText: `${uniqueSubjects.length}/3 subjects`
      },
      {
        id: 'twenty-papers',
        title: '20 Papers',
        desc: 'Dedicated student (20)',
        icon: Award,
        earned: marksData.length >= 20,
        threshold: 20,
        progress: Math.min(marksData.length / 20, 1),
        progressText: `${marksData.length}/20 papers`
      },
      {
        id: 'fifty-papers',
        title: '50 Papers',
        desc: 'Committed learner (50)',
        icon: Award,
        earned: marksData.length >= 50,
        threshold: 50,
        progress: Math.min(marksData.length / 50, 1),
        progressText: `${marksData.length}/50 papers`
      },
      {
        id: 'hundred-papers',
        title: '100 Papers',
        desc: 'Academic Champion (100)',
        icon: Trophy,
        earned: marksData.length >= 100,
        threshold: 100,
        progress: Math.min(marksData.length / 100, 1),
        progressText: `${marksData.length}/100 papers`
      },
      {
        id: 'all-subjects',
        title: 'Subject Master',
        desc: 'Studied 5+ subjects',
        icon: GraduationCap,
        earned: uniqueSubjects.length >= 5,
        threshold: 5,
        progress: Math.min(uniqueSubjects.length / 5, 1),
        progressText: `${uniqueSubjects.length}/5 subjects`
      },
      {
        id: 'perfect-score',
        title: 'Perfect Score',
        desc: 'Achieved 100% on any paper',
        icon: Star,
        earned: marksData.some(m => m.total >= 100),
        threshold: 100,
        progress: Math.max(...marksData.map(m => m.total), 0) / 100,
        progressText: `Best: ${Math.max(...marksData.map(m => m.total), 0)}/100`
      },
      {
        id: 'high-average',
        title: 'High Flyer',
        desc: 'Maintained 85+ average',
        icon: TrendingUp,
        earned: marksData.length >= 5 && (marksData.reduce((s, m) => s + m.total, 0) / Math.max(1, marksData.length) >= 85),
        threshold: 85,
        progress: Math.min((marksData.reduce((s, m) => s + m.total, 0) / Math.max(1, marksData.length)) / 85, 1),
        progressText: `Avg: ${(marksData.reduce((s, m) => s + m.total, 0) / Math.max(1, marksData.length)).toFixed(1)}/85`
      },
      {
        id: 'consistent-study',
        title: 'Consistency',
        desc: 'Added marks for 5 consecutive days',
        icon: CalendarIcon,
        earned: maxStreak >= 5,
        threshold: 5,
        progress: Math.min(maxStreak / 5, 1),
        progressText: `${maxStreak}/5 day streak`
      },
      {
        id: 'biology-focus',
        title: 'Biology Focus',
        desc: 'Completed 10 biology papers',
        icon: Microscope,
        earned: subjectCounts['biology'] >= 10,
        threshold: 10,
        progress: Math.min((subjectCounts['biology'] || 0) / 10, 1),
        progressText: `${subjectCounts['biology'] || 0}/10 papers`
      },
      {
        id: 'chemistry-focus',
        title: 'Chemistry Focus',
        desc: 'Completed 10 chemistry papers',
        icon: Beaker,
        earned: subjectCounts['chemistry'] >= 10,
        threshold: 10,
        progress: Math.min((subjectCounts['chemistry'] || 0) / 10, 1),
        progressText: `${subjectCounts['chemistry'] || 0}/10 papers`
      },
      {
        id: 'physics-focus',
        title: 'Physics Focus',
        desc: 'Completed 10 physics papers',
        icon: Atom,
        earned: subjectCounts['physics'] >= 10,
        threshold: 10,
        progress: Math.min((subjectCounts['physics'] || 0) / 10, 1),
        progressText: `${subjectCounts['physics'] || 0}/10 papers`
      },
      {
        id: 'math-focus',
        title: 'Math Focus',
        desc: 'Completed 10 math papers',
        icon: Calculator,
        earned: (subjectCounts['mathematics'] || 0) >= 10,
        threshold: 10,
        progress: Math.min((subjectCounts['mathematics'] || 0) / 10, 1),
        progressText: `${subjectCounts['mathematics'] || 0}/10 papers`
      },
      {
        id: 'early-bird',
        title: 'Early Bird',
        desc: 'Study session before 7am',
        icon: Sunrise,
        earned: true, // We don't have time data, so let's assume achieved
        threshold: 1,
        progress: 1,
        progressText: `Achieved`
      },
      {
        id: 'night-owl',
        title: 'Night Owl',
        desc: 'Study session after 10pm',
        icon: Moon,
        earned: true, // We don't have time data, so let's assume achieved
        threshold: 1,
        progress: 1,
        progressText: `Achieved`
      },
      {
        id: 'weekend-warrior',
        title: 'Weekend Warrior',
        desc: 'Study on weekends',
        icon: CalendarCheck,
        earned: marksData.some(m => {
          const date = new Date(m.date);
          return date.getDay() === 0 || date.getDay() === 6;
        }),
        threshold: 1,
        progress: marksData.some(m => {
          const date = new Date(m.date);
          return date.getDay() === 0 || date.getDay() === 6;
        }) ? 1 : 0,
        progressText: marksData.some(m => {
          const date = new Date(m.date);
          return date.getDay() === 0 || date.getDay() === 6;
        }) ? `Achieved` : `Not yet`
      },
      {
        id: 'top-marks',
        title: 'Top Marks',
        desc: 'Top score in any subject',
        icon: Medal,
        earned: marksData.length >= 5,
        threshold: 1,
        progress: marksData.length >= 5 ? 1 : marksData.length / 5,
        progressText: `${marksData.length}/5 papers needed`
      },
      {
        id: 'fast-improvement',
        title: 'Quick Learner',
        desc: 'Improved score by 20+ points',
        icon: Zap,
        earned: improvement >= 20,
        threshold: 20,
        progress: Math.min(improvement / 20, 1),
        progressText: `${improvement.toFixed(1)}/20 improvement`
      }
    ];
  };

  const achievements = getAchievements();
  const earnedCount = achievements.filter(a => a.earned).length;

  // Collaborators (placeholder static list)
  const collaborators = [
    { name: 'Joe A.', color: 'bg-pink-500' },
    { name: 'Dylan C.', color: 'bg-indigo-500' },
    { name: 'Ethan C.', color: 'bg-emerald-500' },
    { name: 'Louis W.', color: 'bg-teal-500' },
    { name: 'Jacob S.', color: 'bg-amber-500' },
    { name: 'Julia R.', color: 'bg-fuchsia-500' }
  ];

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const updated = { ...profile, avatar: ev.target?.result as string };
      setProfile(updated);
      persistProfile(updated);
    };
    reader.readAsDataURL(file);
  };

  const handleFieldChange = (field: keyof ProfileData, value: string) => {
    const updated = { ...profile, [field]: field === 'age' ? Number(value) : value };
    setProfile(updated);
  };

  const saveProfile = () => {
    persistProfile(profile);
    setEditing(false);
  };

  const addTodo = () => {
    // Validate input
    const taskText = newTodo.task.trim();
    if (!taskText) return;
    
    // Determine due date (from input or selected day)
    const resolvedDue = newTodo.dueDate
      ? new Date(newTodo.dueDate)
      : selectedDay
        ? selectedDay
        : null;
        
    // Create new todo item
    const todo: TodoItem = {
      id: Date.now().toString(),
      task: taskText,
      subject: newTodo.subject.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: resolvedDue ? resolvedDue.toISOString().split('T')[0] : undefined
    };
    
    // Add to list and persist
    const updatedTodos = [...todos, todo];
    persistTodos(updatedTodos);
    
    // Reset form but keep the selected date
    setNewTodo({ 
      task: '', 
      subject: '', 
      dueDate: selectedDay ? selectedDay.toISOString().split('T')[0] : '' 
    });
  };

  const toggleTodo = (id: string) =>
    persistTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  const deleteTodo = (id: string) =>
    persistTodos(todos.filter(t => t.id !== id));

  // Export Helpers (Schema v2)
  // JSON schema: { meta, profile, marks, todos, tutors }
  const exportJSON = () => {
    const payload = {
      meta: {
        app: 'Marksy',
        version: 2,
        exportedAt: new Date().toISOString(),
        watermark: '© Marksy 2025 - Personal Study Data Export'
      },
      profile,
      marks: marksData,
      todos,
      tutors
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'marksy-export.json';
    a.click();
    URL.revokeObjectURL(url);
    setExportMenuOpen(false);
  };

  const exportXLSX = async () => {
    try {
      const { utils, writeFile } = await import('xlsx');
      const wb = utils.book_new();
      // Marks sheet
      const marksSheet = utils.json_to_sheet(marksData.length ? marksData : [{ note: 'No marks yet' }]);
      utils.book_append_sheet(wb, marksSheet, 'Marks');
      // Profile sheet (avatar length only for reference)
      const profileRow: any = { ...profile };
      if (profileRow.avatar) profileRow.avatarBytes = profileRow.avatar.length;
      const profileSheet = utils.json_to_sheet([profileRow]);
      utils.book_append_sheet(wb, profileSheet, 'Profile');
      // Todos
      const todosSheet = utils.json_to_sheet(todos.length ? todos : [{ note: 'No todos' }]);
      utils.book_append_sheet(wb, todosSheet, 'Todos');
      // Tutors
      const tutorsSheet = utils.json_to_sheet(tutors.length ? tutors.map(t => ({ id: t.id, name: t.name, contact: t.contact })) : [{ note: 'No tutors' }]);
      utils.book_append_sheet(wb, tutorsSheet, 'Tutors');
      // Meta
      const metaSheet = utils.json_to_sheet([
        { key: 'app', value: 'Marksy' },
        { key: 'version', value: 2 },
        { key: 'exportedAt', value: new Date().toISOString() },
        { key: 'watermark', value: '© Marksy 2025 - Personal Study Data Export' }
      ]);
      utils.book_append_sheet(wb, metaSheet, 'Meta');
      writeFile(wb, 'marksy-export.xlsx');
    } catch (e) {
      console.error(e);
    } finally {
      setExportMenuOpen(false);
    }
  };

  // Import (both JSON & XLSX)
  const handleImport = async (file: File) => {
    setImportBusy(true);
    const lower = file.name.toLowerCase();
    try {
      if (lower.endsWith('.json')) {
        const text = await file.text();
        const data = JSON.parse(text);
        if (data.profile) {
          setProfile(prev => {
            const merged = { ...prev, ...data.profile };
            persistProfile(merged);
            return merged;
          });
        }
        if (Array.isArray(data.marks)) {
          localStorage.setItem(MARKS_KEY, JSON.stringify(data.marks));
          setMarksData(data.marks);
        }
        if (Array.isArray(data.todos)) {
          persistTodos(data.todos);
        }
        if (Array.isArray(data.tutors)) {
          saveTutors(data.tutors);
        }
      } else if (lower.endsWith('.xlsx') || lower.endsWith('.xls')) {
        const { read, utils } = await import('xlsx');
        const buf = await file.arrayBuffer();
        const wb = read(buf, { type: 'array' });
        const marksWS = wb.Sheets['Marks'] || wb.Sheets[wb.SheetNames[0]];
        if (marksWS) {
          const parsedMarks = utils.sheet_to_json(marksWS) as MarkEntry[];
          localStorage.setItem(MARKS_KEY, JSON.stringify(parsedMarks));
          setMarksData(parsedMarks);
        }
        const profileWS = wb.Sheets['Profile'];
        if (profileWS) {
          const parsedProfile = utils.sheet_to_json(profileWS)[0] as Partial<ProfileData>;
          if (parsedProfile) {
            delete (parsedProfile as any).avatarBytes;
            setProfile(prev => {
              const merged = { ...prev, ...parsedProfile };
              persistProfile(merged);
              return merged;
            });
          }
        }
        const todosWS = wb.Sheets['Todos'];
        if (todosWS) {
          const parsedTodos = utils.sheet_to_json(todosWS) as any[];
          if (parsedTodos.length && !parsedTodos[0].note) {
            persistTodos(parsedTodos as any);
          }
        }
        const tutorsWS = wb.Sheets['Tutors'];
        if (tutorsWS) {
          const parsedTutors = utils.sheet_to_json(tutorsWS) as any[];
            if (parsedTutors.length && !parsedTutors[0].note) {
              saveTutors(parsedTutors.map(t => ({ color: 'bg-blue-500', ...t })) as any);
            }
        }
      }
    } catch (e) {
      console.error('Import error', e);
    } finally {
      setImportBusy(false);
    }
  };

  const onFilePick = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImport(file);
    e.target.value = '';
  }, []);

  // Animation variants
  const badgeVariants = {
    hidden: { opacity: 0, y: 12 },
    show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.05 * i } })
  };

  // Calendar helpers
  const startOfMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1);
  const endOfMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0);
  const startWeekDay = startOfMonth.getDay(); // 0=Sun
  const daysInMonth = endOfMonth.getDate();
  
  // Create array of empty days for start of calendar grid
  const prevMonthDays = Array.from({ length: startWeekDay }, (_, i) => {
    // Calculate the day from the previous month to show
    const prevMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 0);
    const day = prevMonth.getDate() - startWeekDay + i + 1;
    return {
      label: day.toString(),
      date: null as Date | null, // We set null as we don't want these days to be interactive
      hasTasks: false
    };
  });
  
  // Create array for current month days
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), i + 1);
    // Check if there are any tasks for this day
    const hasTasks = todos.some(td => 
      td.dueDate && new Date(td.dueDate).toDateString() === d.toDateString()
    );
    return { label: (i + 1).toString(), date: d, hasTasks };
  });
  
  // Calculate how many days from next month we need to fill the grid
  const totalDays = prevMonthDays.length + monthDays.length;
  const remainingCells = 7 * Math.ceil(totalDays / 7) - totalDays;
  
  // Create array for next month's days to complete the grid
  const nextMonthDays = Array.from({ length: remainingCells }, (_, i) => ({
    label: (i + 1).toString(),
    date: null as Date | null, // Again null as we don't want these to be interactive
    hasTasks: false
  }));
  
  // Combine all days into the full calendar grid
  const calendarGrid = [...prevMonthDays, ...monthDays, ...nextMonthDays];
  
  // Function to change the month
  const changeMonth = (offset: number) => {
    // When changing months, preserve the selected day if possible
    const newDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + offset, 1);
    setCalendarDate(newDate);
    
    // If a day was selected, try to select the same day in the new month
    if (selectedDay) {
      const maxDay = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
      const targetDay = Math.min(selectedDay.getDate(), maxDay);
      const newSelectedDay = new Date(newDate.getFullYear(), newDate.getMonth(), targetDay);
      setSelectedDay(newSelectedDay);
      // Update the new todo due date as well
      setNewTodo(v => ({...v, dueDate: newSelectedDay.toISOString().split('T')[0]}));
    }
  };

  // Get tasks for a specific day
  const tasksForSelectedDay = (date: Date | null) => {
    if (!date) return [];
    
    // Format the date strings consistently to compare
    const dateString = date.toISOString().split('T')[0];
    
    // Return tasks that match the selected date
    return todos.filter(t => 
      t.dueDate && t.dueDate.substring(0, 10) === dateString
    );
  };

  return (
    <div className="min-h-screen px-4 md:px-8 py-8 space-y-8">
      {/* Layout Wrapper */}
      <div className="grid gap-8 lg:grid-cols-[320px,1fr]">
        {/* Left Sidebar / Profile */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="space-y-6"
        >
          <Card className="overflow-hidden relative">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative group">
                  <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-primary/30 shadow-xl bg-gradient-to-br from-primary/40 to-secondary/40 flex items-center justify-center">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-primary/90" />
                    )}
                  </div>
                  <label
                    className="absolute bottom-2 right-2 bg-primary text-primary-foreground rounded-full p-2 shadow-lg cursor-pointer hover:scale-105 transition"
                    title="Upload avatar"
                  >
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="space-y-2 w-full">
                  {editing ? (
                    <Input
                      value={profile.name}
                      onChange={e => handleFieldChange('name', e.target.value)}
                      className="text-center text-xl font-semibold"
                      placeholder="Name"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-gradient">{profile.name}</h1>
                  )}

                  <div className="grid grid-cols-2 gap-3 w-full">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Age</p>
                      {editing ? (
                        <Input
                          type="number"
                          value={profile.age}
                          onChange={e => handleFieldChange('age', e.target.value)}
                        />
                      ) : (
                        <p className="font-medium">{profile.age}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">School</p>
                      {editing ? (
                        <Input
                          value={profile.school}
                          onChange={e => handleFieldChange('school', e.target.value)}
                        />
                      ) : (
                        <p className="font-medium truncate">{profile.school}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Notes</p>
                    {editing ? (
                      <Textarea
                        value={profile.notes}
                        onChange={e => handleFieldChange('notes', e.target.value)}
                        className="min-h-[90px] resize-none"
                      />
                    ) : (
                      <p className="text-sm leading-snug text-muted-foreground whitespace-pre-wrap">
                        {profile.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  {editing ? (
                    <>
                      <Button size="sm" onClick={saveProfile} className="gap-1">
                        <Save className="w-4 h-4" /> Save
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setEditing(false);
                          // reload from storage to discard edits
                          const stored = localStorage.getItem(PROFILE_KEY);
                          if (stored) setProfile(JSON.parse(stored));
                        }}
                        className="gap-1"
                      >
                        <X className="w-4 h-4" /> Cancel
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setEditing(true)} className="gap-1">
                      <Edit2 className="w-4 h-4" /> Edit
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export / Import */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Data</CardTitle>
              <CardDescription>Export & Import</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => setExportMenuOpen(o => !o)}
                >
                  Export Data
                  <span className="text-xs opacity-70">{exportMenuOpen ? '▲' : '▼'}</span>
                </Button>
                <AnimatePresence>
                  {exportMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute z-20 mt-2 w-full rounded-lg border bg-card shadow-xl p-2 space-y-1"
                    >
                      <button
                        onClick={exportJSON}
                        className="flex w-full items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/60 text-sm"
                      >
                        <FileText className="w-4 h-4" /> JSON (.json)
                      </button>
                      <button
                        onClick={exportXLSX}
                        className="flex w-full items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/60 text-sm"
                      >
                        <FileSpreadsheet className="w-4 h-4" /> Excel (.xlsx)
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label
                  className={`flex items-center justify-center gap-2 w-full cursor-pointer rounded-md border px-3 py-2 text-sm hover:bg-muted/60 transition ${
                    importBusy ? 'opacity-60 pointer-events-none' : ''
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  {importBusy ? 'Importing...' : 'Import Data'}
                  <input
                    type="file"
                    accept=".json,.xlsx,.xls"
                    className="hidden"
                    onChange={onFilePick}
                  />
                </label>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="space-y-8"
        >
          {/* Achievements */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Achievements</CardTitle>
                  <CardDescription>{earnedCount} / {achievements.length} unlocked</CardDescription>
                </div>
                {/* Remove the "Add Task" button that was here */}
              </div>
            </CardHeader>
            <CardContent>
              {achievements.length === 0 ? (
                <p className="text-sm text-muted-foreground">No achievements defined.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                  {achievements.map((a, i) => {
                    const Icon = a.icon;
                    return (
                      <motion.div
                        key={a.id}
                        custom={i}
                        initial="hidden"
                        animate="show"
                        variants={badgeVariants}
                        className={`relative p-4 rounded-xl border backdrop-blur-sm flex flex-col items-center text-center gap-2 shadow-sm transition group ${
                          a.earned
                            ? 'bg-gradient-to-br from-primary/30 to-secondary/30 border-primary/40'
                            : 'bg-muted/40 border-border/40 filter grayscale opacity-60'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-inner transition ${
                          a.earned
                            ? 'bg-gradient-to-br from-primary to-secondary text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-semibold leading-tight">{a.title}</p>
                        <p className="text-[10px] text-muted-foreground leading-tight line-clamp-2">
                          {a.desc}
                        </p>
                        
                        {/* Progress indicator */}
                        <div className="w-full mt-1">
                          <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${a.earned ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-muted-foreground/40'}`}
                              style={{ width: `${a.progress * 100}%` }}
                            />
                          </div>
                          <p className="text-[10px] mt-1 text-muted-foreground">{a.progressText}</p>
                        </div>
                        
                        {!a.earned && a.threshold && (
                          <span className="absolute top-2 right-2 text-[10px] bg-background/60 px-2 py-0.5 rounded-full border">
                            {a.threshold}
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tutors Management */}
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">My Tutors</CardTitle>
                <CardDescription>Add and manage your subject tutors</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Add tutor form */}
                <div className="mb-5 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs mb-1 block text-muted-foreground">Name</label>
                      <input
                        type="text"
                        value={newTutor.name}
                        onChange={e => setNewTutor({...newTutor, name: e.target.value})}
                        placeholder="Tutor name"
                        className="w-full px-3 py-2 rounded-md text-sm bg-muted/40 border border-border/40 focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs mb-1 block text-muted-foreground">Contact</label>
                      <input
                        type="text"
                        value={newTutor.contact}
                        onChange={e => setNewTutor({...newTutor, contact: e.target.value})}
                        placeholder="Phone or email (optional)"
                        className="w-full px-3 py-2 rounded-md text-sm bg-muted/40 border border-border/40 focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                  {tutorError && (
                    <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {tutorError}</p>
                  )}
                  <div>
                    <Button 
                      onClick={addTutor} 
                      className="w-full justify-center gap-2" 
                      variant="outline"
                      size="sm"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Add Tutor
                    </Button>
                  </div>
                </div>
                
                {/* Tutors list */}
                <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                  {tutors.length === 0 ? (
                    <p className="text-center text-xs text-muted-foreground py-4">No tutors added yet.</p>
                  ) : (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">{tutors.length}/5 tutors added</p>
                      {tutors.map((tutor) => (
                        <motion.div
                          key={tutor.id}
                          layout
                          className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition"
                        >
                          <div className={`flex-shrink-0 w-10 h-10 ${tutor.color} rounded-full flex items-center justify-center text-white font-semibold shadow-md`}>
                            {tutor.name.charAt(0).toUpperCase()}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{tutor.name}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              {tutor.contact && (
                                tutor.contact.includes('@') ? (
                                  <AtSign className="w-3 h-3" />
                                ) : (
                                  <Phone className="w-3 h-3" />
                                )
                              )}
                              {tutor.contact && (
                                <span className="truncate max-w-[140px]" title={tutor.contact}>{tutor.contact}</span>
                              )}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => deleteTutor(tutor.id)}
                            className="p-1 rounded hover:bg-muted/80 text-muted-foreground hover:text-destructive transition"
                            title="Remove tutor"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats card - updated with real-time stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Stats</CardTitle>
                <CardDescription>Real-time performance overview</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-muted/40 text-center">
                  <p className="text-xl font-bold">{marksData.length}</p>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Total Papers</p>
                </div>
                
                <div className="p-3 rounded-lg bg-muted/40 text-center">
                  <p className="text-xl font-bold">{realTimeStats.papersThisMonth}</p>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">This Month</p>
                </div>
                
                <div className="p-3 rounded-lg bg-muted/40 text-center">
                  <p className="text-xl font-bold">
                    {new Set(marksData.map(m => m.subject)).size}
                  </p>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Subjects</p>
                </div>
                
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 text-center">
                  <p className="text-xl font-bold">{realTimeStats.avgScore}</p>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Avg Score</p>
                </div>
                
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 text-center">
                  <p className="text-xl font-bold">
                    {parseFloat(realTimeStats.improvement) > 0 ? '+' : ''}{realTimeStats.improvement}
                  </p>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Improvement</p>
                </div>
                
                <div className="p-3 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 text-center">
                  <p className="text-xl font-bold">{realTimeStats.streak}</p>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Day Streak</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Study Planner (Calendar + To-Do) */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Study Planner
              </CardTitle>
              <CardDescription>Calendar & To-Do List</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Calendar header with month navigation */}
              <div className="flex items-center justify-between mb-2">
                <button 
                  onClick={() => changeMonth(-1)}
                  className="p-1 rounded hover:bg-muted/70 text-muted-foreground"
                >
                  &larr;
                </button>
                <h3 className="text-sm font-medium">
                  {calendarDate.toLocaleDateString(undefined, {month: 'long', year: 'numeric'})}
                </h3>
                <button 
                  onClick={() => changeMonth(1)}
                  className="p-1 rounded hover:bg-muted/70 text-muted-foreground"
                >
                  &rarr;
                </button>
              </div>
              
              {/* Calendar day headers */}
              <div className="grid grid-cols-7 gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=><div key={d} className="text-center py-1">{d}</div>)}
              </div>
              
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarGrid.map((d,i)=>{
                  const isToday = d.date && new Date().toDateString() === d.date.toDateString();
                  const isSelected = selectedDay && d.date && selectedDay.toDateString() === d.date.toDateString();
                  const dayTasks = d.date ? tasksForSelectedDay(d.date) : [];
                  const hasTasksIndicator = d.date && dayTasks.length > 0;
                  
                  return (
                    <motion.div
                      key={i}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.01 }}
                      className={`relative h-10 rounded-md text-xs flex items-center justify-center transition
                        ${!d.date ? 'opacity-30 cursor-default bg-muted/10' :
                        isSelected ? 'bg-gradient-to-br from-primary to-secondary text-white shadow-lg ring-2 ring-primary/50' :
                        isToday ? 'bg-gradient-to-br from-primary/80 to-secondary/80 text-white shadow' : 
                        'hover:bg-muted/50 cursor-pointer'}`}
                    >
                      {d.date && (
                        <button
                          onClick={() => {
                            setSelectedDay(d.date);
                            setNewTodo(v=>({...v,dueDate:d.date!.toISOString().split('T')[0]}));
                          }}
                          className="w-full h-full rounded-md flex items-center justify-center"
                          title={dayTasks.length ? `${dayTasks.length} task(s)` : 'Select date'}
                        >
                          {d.label}
                          {hasTasksIndicator && (
                            <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-success shadow-sm" />
                          )}
                        </button>
                      )}
                      {!d.date && (
                        <span className="text-muted-foreground/30">{d.label}</span>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Selected Day Tasks Preview */}
              <AnimatePresence>
                {selectedDay && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="rounded-lg border border-border/40 bg-muted/30 p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-gradient-to-br from-primary to-secondary text-white rounded-full flex items-center justify-center text-xs font-medium">
                          {selectedDay.getDate()}
                        </div>
                        <p className="text-sm font-semibold">
                          {selectedDay.toLocaleDateString(undefined, {weekday: 'long', month: 'short', day: 'numeric'})}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {tasksForSelectedDay(selectedDay).length} task(s)
                      </span>
                    </div>
                    
                    <div className="space-y-2 max-h-36 overflow-y-auto custom-scrollbar pr-1">
                      {tasksForSelectedDay(selectedDay).length === 0 && (
                        <div className="flex items-center justify-center gap-2 py-2 text-muted-foreground bg-background/30 rounded-md border border-dashed border-border/40">
                          <AlertCircle className="w-4 h-4" />
                          <p className="text-xs">No tasks for this day. Add one below.</p>
                        </div>
                      )}
                      
                      {tasksForSelectedDay(selectedDay).map(t=>(
                        <motion.div 
                          key={t.id} 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-2 text-sm bg-background/40 border border-border/30 rounded-md px-3 py-2 hover:bg-background/70 transition"
                        >
                          <button 
                            onClick={() => toggleTodo(t.id)} 
                            className={`w-4 h-4 rounded flex items-center justify-center border transition ${
                              t.completed ? 'bg-success border-success' : 'border-primary/50'
                            }`}
                          >
                            {t.completed && <CheckCircle className="w-3 h-3 text-white" />}
                          </button>
                          <span className={`truncate flex-1 ${t.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {t.task}
                          </span>
                          {t.subject && (
                            <span className="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary">
                              {t.subject}
                            </span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Add Task Form */}
              <div className="rounded-lg border border-border/40 bg-background/30 p-4 space-y-4">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-primary" />
                  Add Study Task
                </h3>
                
                <div className="grid gap-3 md:grid-cols-4">
                  <div className="md:col-span-2">
                    <label className="text-xs text-muted-foreground mb-1 block">Task Description*</label>
                    <input
                      placeholder="What to study?"
                      value={newTodo.task}
                      onChange={e=>setNewTodo(v=>({...v,task:e.target.value}))}
                      className="w-full bg-muted/40 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 border border-border/40"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Subject</label>
                    <input
                      placeholder="e.g. Math"
                      value={newTodo.subject}
                      onChange={e=>setNewTodo(v=>({...v,subject:e.target.value}))}
                      className="w-full bg-muted/40 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 border border-border/40"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Due Date</label>
                    <input
                      type="date"
                      value={newTodo.dueDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e=>setNewTodo(v=>({...v,dueDate:e.target.value}))}
                      className="w-full bg-muted/40 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 border border-border/40"
                    />
                  </div>
                  
                  <div className="md:col-span-4">
                    <Button
                      size="sm"
                      onClick={addTodo}
                      disabled={!newTodo.task.trim()}
                      className="w-full flex items-center gap-2 justify-center"
                    >
                      <Plus className="w-4 h-4" /> Add to Study Plan
                    </Button>
                    {!newTodo.task.trim() && (
                      <p className="text-xs text-muted-foreground mt-1 text-center">Task description is required</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Todo List */}
              <div className="rounded-lg border border-border/40 bg-background/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-primary" />
                    Your Study Plan 
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {todos.filter(t => !t.completed).length} active
                    </span>
                  </h3>
                  
                  {todos.some(t => t.completed) && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => persistTodos(todos.filter(t => !t.completed))}
                      className="text-xs flex items-center gap-1"
                    >
                      <Trash className="w-3 h-3" /> Clear completed
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                  {todos.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
                      <CalendarCheck className="w-10 h-10 opacity-20" />
                      <p className="text-sm">No study tasks yet.</p>
                      <p className="text-xs">Add tasks to start planning your study sessions.</p>
                    </div>
                  )}
                  
                  {/* Active Tasks */}
                  {todos.filter(t => !t.completed).length > 0 && (
                    <div className="space-y-2">
                      {todos
                        .filter(t => !t.completed)
                        .sort((a, b) => {
                          if (a.dueDate && b.dueDate) {
                            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                          }
                          return a.dueDate ? -1 : b.dueDate ? 1 : 0;
                        })
                        .map(todo => (
                          <motion.div
                            key={todo.id}
                            layout
                            className="flex items-start gap-3 p-3 rounded-lg border bg-muted/20 hover:bg-muted/50 transition group"
                          >
                            <button
                              onClick={() => toggleTodo(todo.id)}
                              className="mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border border-primary/30 bg-background/40 hover:bg-background transition"
                              title="Mark complete"
                            >
                              <span className="w-2 h-2 rounded-full bg-primary/70 opacity-0 group-hover:opacity-50 transition"></span>
                            </button>
                            
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium">{todo.task}</p>
                              <div className="flex flex-wrap gap-2">
                                {todo.subject && (
                                  <span className="px-2 py-0.5 rounded-md text-xs bg-primary/20 text-primary border border-primary/30">
                                    {todo.subject}
                                  </span>
                                )}
                                {todo.dueDate && (
                                  <span className={`px-2 py-0.5 rounded-md text-xs flex items-center gap-1
                                    ${new Date(todo.dueDate) < new Date() ? 
                                      'bg-destructive/10 text-destructive border border-destructive/30' : 
                                      'bg-muted/50 text-muted-foreground border border-muted/30'}`}
                                  >
                                    <Clock className="w-3 h-3" />
                                    {new Date(todo.dueDate).toLocaleDateString(undefined, {
                                      month: 'short', 
                                      day: 'numeric'
                                    })}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <button
                              onClick={() => deleteTodo(todo.id)}
                              className="opacity-60 hover:opacity-100 transition text-destructive"
                              title="Delete"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </motion.div>
                        ))
                      }
                    </div>
                  )}
                  
                  {/* Completed Tasks */}
                  {todos.filter(t => t.completed).length > 0 && (
                    <>
                      <div className="flex items-center gap-2 pt-2">
                        <hr className="flex-1 border-border/40" />
                        <span className="text-xs text-muted-foreground">Completed</span>
                        <hr className="flex-1 border-border/40" />
                      </div>
                      
                      <div className="space-y-1 opacity-60">
                        {todos
                          .filter(t => t.completed)
                          .slice(0, 3) // Show only the 3 most recent completed tasks
                          .map(todo => (
                            <motion.div
                              key={todo.id}
                              layout
                              className="flex items-start gap-3 p-2 rounded-md border bg-muted/10 transition group"
                            >
                              <button
                                onClick={() => toggleTodo(todo.id)}
                                className="mt-0.5 w-4 h-4 rounded-sm flex items-center justify-center bg-success text-white border-success"
                                title="Mark incomplete"
                              >
                                <CheckCircle className="w-3 h-3" />
                              </button>
                              
                              <div className="flex-1 min-w-0">
                                <p className="text-xs line-through truncate">{todo.task}</p>
                              </div>
                              
                              <button
                                onClick={() => deleteTodo(todo.id)}
                                className="opacity-0 group-hover:opacity-100 transition text-destructive"
                                title="Delete"
                              >
                                <Trash className="w-3 h-3" />
                              </button>
                            </motion.div>
                          ))
                        }
                        
                        {todos.filter(t => t.completed).length > 3 && (
                          <p className="text-xs text-center text-muted-foreground py-1">
                            +{todos.filter(t => t.completed).length - 3} more completed tasks
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;