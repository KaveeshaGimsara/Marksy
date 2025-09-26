import { useState, useEffect } from "react";
import { User, Camera, Edit3, Save, Trophy, Star, Upload, Download, FileText, Database, Shield } from "lucide-react";
import * as XLSX from "xlsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { useToast } from "@/hooks/use-toast";
import { ProfilePageProps } from "@/types";
import SupportButton from "@/components/SupportButton";
import { useAuth } from "@/context/AuthContext";

interface ProfileData {
  name: string;
  age: string;
  school: string;
  grade: string;
  subjects: string[];
  profilePicture: string;
  unlockedBadges: string[];
  totalStudyHours: number;
  preferences: {
    timerTheme: 'digital' | 'circular';
    notifications: boolean;
  };
}

interface MarksyData {
  profile: ProfileData;
  marks: any[];
  subjects: any[];
  timerSessions: any[];
  customData: any[];
  siteVisits: string[];
  todoList: any[];
  timeManagementNotes: any[];
  badges: BadgeData[];
  achievements: any[];
  preferences: any;
  metadata: {
    exportVersion: string;
    exportDate: string;
    appVersion: string;
  };
}

interface BadgeData {
  id: string;
  name: string;
  description: string;
  condition: string;
  icon: string;
  unlocked: boolean;
}

const ProfilePage = ({ language }: ProfilePageProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    age: "",
    school: "",
    grade: "",
    subjects: [],
    profilePicture: "",
    unlockedBadges: [],
    totalStudyHours: 0,
    preferences: {
      timerTheme: 'digital',
      notifications: true
    }
  });

  const [showImportDialog, setShowImportDialog] = useState(false);

  const [badges, setBadges] = useState<BadgeData[]>([
    { id: "first_mark", name: "First Steps", description: "Add your first mark", condition: "marks_count >= 1", icon: "🎯", unlocked: false },
    { id: "ten_marks", name: "Getting Started", description: "Add 10 marks", condition: "marks_count >= 10", icon: "📝", unlocked: false },
    { id: "fifty_marks", name: "Dedicated Student", description: "Add 50 marks", condition: "marks_count >= 50", icon: "📚", unlocked: false },
    { id: "hundred_marks", name: "Academic Warrior", description: "Add 100 marks", condition: "marks_count >= 100", icon: "⚔️", unlocked: false },
    { id: "perfectionist", name: "Perfectionist", description: "Score 100% on any paper", condition: "max_score >= 100", icon: "💯", unlocked: false },
    { id: "high_achiever", name: "High Achiever", description: "Average above 85%", condition: "average >= 85", icon: "🌟", unlocked: false },
    { id: "consistent", name: "Consistent Performer", description: "Submit marks for 7 consecutive days", condition: "consecutive_days >= 7", icon: "📅", unlocked: false },
    { id: "subject_master", name: "Subject Master", description: "Complete all paper types for one subject", condition: "subject_complete", icon: "🎓", unlocked: false },
    { id: "all_subjects", name: "Science Stream Champion", description: "Add marks for all 6 core science subjects", condition: "science_subjects", icon: "🧪", unlocked: false },
    { id: "early_bird", name: "Early Bird", description: "Use the app before 8 AM", condition: "early_usage", icon: "🐦", unlocked: false }
  ]);

  const availableSubjects = [
    // Science Stream (Default Watch - Main Science Subjects)
    "Biology", "Chemistry", "Physics", "Combined Mathematics", "Agricultural Science", 
    "Information and Communication Technology (ICT)",
    
    // Commerce Stream  
    "Accounting", "Business Studies", "Economics", "Business Statistics",
    
    // Arts Stream - Languages
    "Sinhala", "Tamil", "English", "Pali", "Sanskrit", "Arabic", "Japanese", "Hindi", 
    "French", "German",
    
    // Arts Stream - Social Sciences & Humanities
    "Geography", "History", "Political Science", "Logic & Scientific Method", 
    "Sociology", "Communication & Media Studies",
    
    // Arts Stream - Creative Arts
    "Art", "Dancing", "Music", "Drama & Theatre", "Home Economics",
    
    // Arts Stream - Civilizations
    "Buddhist Civilization", "Hindu Civilization", "Christian Civilization",
    
    // Technology Stream
    "Engineering Technology", "Bio-systems Technology", "Science for Technology",
    
    // Compulsory Subjects for All Streams
    "General English", "Common General Test"
  ];

  useEffect(() => {
    // Load profile data
    const savedProfile = localStorage.getItem("marksy-profile");
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfileData(parsed);
    }

    // Check and update badges
    checkBadgeConditions();
  }, []);

  const checkBadgeConditions = () => {
    const marksData = JSON.parse(localStorage.getItem("alMarksData") || "[]");
    const updatedBadges = badges.map(badge => {
      let unlocked = false;

      switch (badge.id) {
        case "first_mark":
          unlocked = marksData.length >= 1;
          break;
        case "ten_marks":
          unlocked = marksData.length >= 10;
          break;
        case "fifty_marks":
          unlocked = marksData.length >= 50;
          break;
        case "hundred_marks":
          unlocked = marksData.length >= 100;
          break;
        case "perfectionist":
          unlocked = marksData.some((mark: any) => mark.total >= 100);
          break;
        case "high_achiever":
          const average = marksData.length > 0 ? marksData.reduce((sum: number, mark: any) => sum + mark.total, 0) / marksData.length : 0;
          unlocked = average >= 85;
          break;
        case "all_subjects":
          const uniqueSubjects = [...new Set(marksData.map((mark: any) => mark.subject))];
          const coreSciences = ["Biology", "Chemistry", "Physics", "Combined Mathematics", "Agricultural Science", "Information and Communication Technology (ICT)"];
          unlocked = coreSciences.every(subject => uniqueSubjects.includes(subject));
          break;
        case "early_bird":
          const currentHour = new Date().getHours();
          unlocked = currentHour < 8;
          break;
        default:
          unlocked = badge.unlocked;
      }

      return { ...badge, unlocked };
    });

    setBadges(updatedBadges);
  };

  // Comprehensive Export Function
  const exportAllData = () => {
    try {
      // Collect all data from localStorage and state
      const marksyData: MarksyData = {
        profile: profileData,
        marks: JSON.parse(localStorage.getItem("alMarksData") || "[]"),
        subjects: JSON.parse(localStorage.getItem("marksy-subjects") || "[]"),
        timerSessions: JSON.parse(localStorage.getItem("timerSessions") || "[]"),
        customData: JSON.parse(localStorage.getItem("marksy-custom-data") || "[]"),
        siteVisits: JSON.parse(localStorage.getItem("marksy-site-visits") || "[]"),
        todoList: JSON.parse(localStorage.getItem("marksy-todo-list") || "[]"),
        timeManagementNotes: JSON.parse(localStorage.getItem("marksy-time-notes") || "[]"),
        badges: badges,
        achievements: JSON.parse(localStorage.getItem("marksy-achievements") || "[]"),
        preferences: {
          theme: localStorage.getItem("marksy-theme"),
          language: localStorage.getItem("marksy-language"),
          timerPreferences: JSON.parse(localStorage.getItem("timerPreferences") || "{}")
        },
        metadata: {
          exportVersion: "2.0",
          exportDate: new Date().toISOString(),
          appVersion: "Marksy v2.0"
        }
      };

      // Create custom Marksy format
      const marksyContent = `MARKSY_DATA_EXPORT\n${JSON.stringify(marksyData, null, 2)}\nEND_MARKSY_DATA`;
      
      // Create and download file
      const blob = new Blob([marksyContent], { type: 'text/marksy' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `marksy-complete-backup-${new Date().toISOString().split('T')[0]}.marksy`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Record the export in site visits
      const visits = JSON.parse(localStorage.getItem("marksy-site-visits") || "[]");
      visits.push(`export_${new Date().toISOString()}`);
      localStorage.setItem("marksy-site-visits", JSON.stringify(visits));

      toast({
        title: language === "en" ? "Export Successful!" : "අපනයනය සාර්ථකයි!",
        description: language === "en" 
          ? "All your Marksy data has been exported successfully." 
          : "ඔබේ සියලු Marksy දත්ත සාර්ථකව අපනයනය කර ඇත.",
      });

    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: language === "en" ? "Export Failed" : "අපනයනය අසාර්ථකයි",
        description: language === "en" 
          ? "Failed to export data. Please try again." 
          : "දත්ත අපනයනය කිරීමට අසමත්විය. කරුණාකර නැවත උත්සාහ කරන්න.",
        variant: "destructive",
      });
    }
  };

  // Comprehensive Import Function
  const importAllData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        // Check if it's a Marksy format file
        if (!content.startsWith('MARKSY_DATA_EXPORT') || !content.endsWith('END_MARKSY_DATA')) {
          throw new Error("Invalid Marksy file format");
        }

        // Extract JSON data
        const jsonContent = content.substring(
          content.indexOf('\n') + 1,
          content.lastIndexOf('\nEND_MARKSY_DATA')
        );

        const importedData: MarksyData = JSON.parse(jsonContent);

        // Validate data structure
        if (!importedData.metadata || !importedData.profile) {
          throw new Error("Invalid data structure");
        }

        // Import all data
        if (importedData.profile) {
          setProfileData(importedData.profile);
          localStorage.setItem("marksy-profile", JSON.stringify(importedData.profile));
        }
        
        if (importedData.marks) {
          localStorage.setItem("alMarksData", JSON.stringify(importedData.marks));
        }
        
        if (importedData.subjects) {
          localStorage.setItem("marksy-subjects", JSON.stringify(importedData.subjects));
        }
        
        if (importedData.timerSessions) {
          localStorage.setItem("timerSessions", JSON.stringify(importedData.timerSessions));
        }
        
        if (importedData.customData) {
          localStorage.setItem("marksy-custom-data", JSON.stringify(importedData.customData));
        }
        
        if (importedData.siteVisits) {
          localStorage.setItem("marksy-site-visits", JSON.stringify(importedData.siteVisits));
        }
        
        if (importedData.todoList) {
          localStorage.setItem("marksy-todo-list", JSON.stringify(importedData.todoList));
        }
        
        if (importedData.timeManagementNotes) {
          localStorage.setItem("marksy-time-notes", JSON.stringify(importedData.timeManagementNotes));
        }
        
        if (importedData.badges) {
          setBadges(importedData.badges);
        }
        
        if (importedData.achievements) {
          localStorage.setItem("marksy-achievements", JSON.stringify(importedData.achievements));
        }
        
        if (importedData.preferences) {
          if (importedData.preferences.theme) {
            localStorage.setItem("marksy-theme", importedData.preferences.theme);
          }
          if (importedData.preferences.language) {
            localStorage.setItem("marksy-language", importedData.preferences.language);
          }
          if (importedData.preferences.timerPreferences) {
            localStorage.setItem("timerPreferences", JSON.stringify(importedData.preferences.timerPreferences));
          }
        }

        // Record the import
        const visits = JSON.parse(localStorage.getItem("marksy-site-visits") || "[]");
        visits.push(`import_${new Date().toISOString()}`);
        localStorage.setItem("marksy-site-visits", JSON.stringify(visits));

        toast({
          title: language === "en" ? "Import Successful!" : "ආනයනය සාර්ථකයි!",
          description: language === "en" 
            ? `Successfully imported data from ${importedData.metadata.exportDate.split('T')[0]}` 
            : `${importedData.metadata.exportDate.split('T')[0]} දින දත්ත සාර්ථකව ආනයනය කරන ලදී`,
        });

        setShowImportDialog(false);

      } catch (error) {
        console.error("Import error:", error);
        toast({
          title: language === "en" ? "Import Failed" : "ආනයනය අසාර්ථකයි",
          description: language === "en" 
            ? "Failed to import data. Please check the file format." 
            : "දත්ත ආනයනය කිරීමට අසමත්විය. ගොනු ආකෘතිය පරීක්ෂා කරන්න.",
          variant: "destructive",
        });
      }
    };

    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const handleSave = () => {
    localStorage.setItem("marksy-profile", JSON.stringify(profileData));
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          profilePicture: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addSubject = (subject: string) => {
    if (!profileData.subjects.includes(subject)) {
      setProfileData(prev => ({
        ...prev,
        subjects: [...prev.subjects, subject]
      }));
    }
  };

  const removeSubject = (subject: string) => {
    setProfileData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s !== subject)
    }));
  };

  const unlockedBadgesCount = badges.filter(badge => badge.unlocked).length;

  // Comprehensive data collection function
  const getAllAppData = () => {
    const currentDate = new Date().toISOString();
    const appVersion = "1.1.0";
    
    return {
      metadata: {
        exportDate: currentDate,
        appVersion: appVersion,
        deviceInfo: navigator.userAgent,
        watermark: "Exported from AL Progress Wizard (Marksy) - Your Academic Journey, Simplified"
      },
      profile: profileData,
      badges: badges,
      alMarks: JSON.parse(localStorage.getItem("alMarksData") || "[]"),
      subjects: JSON.parse(localStorage.getItem("alSubjects") || "[]"),
      todos: JSON.parse(localStorage.getItem("alTodos") || "[]"),
      theme: localStorage.getItem("theme") || "light",
      language: localStorage.getItem("language") || "en",
      settings: {
        notifications: localStorage.getItem("notifications") || "enabled",
        autoSave: localStorage.getItem("autoSave") || "enabled"
      }
    };
  };

  // JSON Export function
  const exportToJSON = () => {
    try {
      const allData = getAllAppData();
      const dataStr = JSON.stringify(allData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `marksy-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setShowExportDialog(false); // Close dialog after successful export
      
      toast({
        title: "Export Successful",
        description: "Your complete data has been exported as JSON file.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      });
      setShowExportDialog(false); // Close dialog even on error
    }
  };

  // Excel Export function
  const exportToExcel = () => {
    try {
      const allData = getAllAppData();
      const workbook = XLSX.utils.book_new();

      // Profile Sheet
      const profileSheet = XLSX.utils.json_to_sheet([{
        'Name': profileData.name,
        'Age': profileData.age,
        'School': profileData.school,
        'Grade': profileData.grade,
        'Subjects': profileData.subjects.join(', '),
        'Unlocked Badges': unlockedBadgesCount,
        'Export Date': allData.metadata.exportDate,
        'Watermark': allData.metadata.watermark
      }]);
      XLSX.utils.book_append_sheet(workbook, profileSheet, 'Profile');

      // Marks Sheet
      if (allData.alMarks.length > 0) {
        const marksSheet = XLSX.utils.json_to_sheet(allData.alMarks.map(mark => ({
          'Subject': mark.subject,
          'Paper Name': mark.paperName,
          'Date': mark.date,
          'MCQ': mark.mcq || 0,
          'SEQ': mark.seq || 0,
          'Essay': mark.essay || 0,
          'Total': mark.total,
          'Timestamp': new Date(mark.timestamp).toLocaleString()
        })));
        XLSX.utils.book_append_sheet(workbook, marksSheet, 'Marks');
      }

      // Subjects Sheet
      if (allData.subjects.length > 0) {
        const subjectsSheet = XLSX.utils.json_to_sheet(allData.subjects.map(subject => ({
          'Subject Name': subject.name,
          'Is Favorite': subject.isFavorite ? 'Yes' : 'No'
        })));
        XLSX.utils.book_append_sheet(workbook, subjectsSheet, 'Subjects');
      }

      // Todos Sheet
      if (allData.todos.length > 0) {
        const todosSheet = XLSX.utils.json_to_sheet(allData.todos.map(todo => ({
          'Task': todo.task,
          'Subject': todo.subject,
          'Completed': todo.completed ? 'Yes' : 'No',
          'Created Date': new Date(todo.createdAt).toLocaleDateString()
        })));
        XLSX.utils.book_append_sheet(workbook, todosSheet, 'Study Tasks');
      }

      // Badges Sheet
      const badgesSheet = XLSX.utils.json_to_sheet(badges.map(badge => ({
        'Badge Name': badge.name,
        'Description': badge.description,
        'Status': badge.unlocked ? 'Unlocked' : 'Locked',
        'Icon': badge.icon
      })));
      XLSX.utils.book_append_sheet(workbook, badgesSheet, 'Badges');

      // Settings Sheet
      const settingsSheet = XLSX.utils.json_to_sheet([{
        'Theme': allData.theme,
        'Language': allData.language,
        'Notifications': allData.settings.notifications,
        'Auto Save': allData.settings.autoSave,
        'App Version': allData.metadata.appVersion,
        'Device Info': allData.metadata.deviceInfo,
        'Watermark': allData.metadata.watermark
      }]);
      XLSX.utils.book_append_sheet(workbook, settingsSheet, 'Settings');

      // Write file
      XLSX.writeFile(workbook, `marksy-data-export-${new Date().toISOString().split('T')[0]}.xlsx`);
      
      setShowExportDialog(false); // Close dialog after successful export
      
      toast({
        title: "Excel Export Successful",
        description: "Your complete data has been exported as Excel file with multiple sheets.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Excel Export Failed",
        description: "There was an error exporting your data to Excel.",
        variant: "destructive",
      });
      setShowExportDialog(false); // Close dialog even on error
    }
  };

  // JSON Import function
  const importFromJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        // Validate data structure
        if (!importedData.metadata || !importedData.metadata.watermark?.includes('AL Progress Wizard')) {
          toast({
            title: "Invalid File",
            description: "This doesn't appear to be a valid Marksy export file.",
            variant: "destructive",
          });
          return;
        }

        // Import profile data
        if (importedData.profile) {
          setProfileData(importedData.profile);
          localStorage.setItem("marksy-profile", JSON.stringify(importedData.profile));
        }

        // Import marks data (consolidate both old and new formats)
        let marksToImport = [];
        if (importedData.marks) {
          marksToImport = [...marksToImport, ...importedData.marks];
        }
        if (importedData.alMarks) {
          marksToImport = [...marksToImport, ...importedData.alMarks];
        }
        if (marksToImport.length > 0) {
          localStorage.setItem("alMarksData", JSON.stringify(marksToImport));
        }

        // Import subjects
        if (importedData.subjects) {
          localStorage.setItem("alSubjects", JSON.stringify(importedData.subjects));
        }

        // Import todos
        if (importedData.todos) {
          localStorage.setItem("alTodos", JSON.stringify(importedData.todos));
        }

        // Import settings
        if (importedData.theme) {
          localStorage.setItem("theme", importedData.theme);
        }
        if (importedData.language) {
          localStorage.setItem("language", importedData.language);
        }

        // Import badges
        if (importedData.badges) {
          setBadges(importedData.badges);
        }

        toast({
          title: "Import Successful",
          description: `Data imported successfully! Please refresh the page to see all changes.`,
          variant: "default",
        });

        // Trigger a page refresh after a delay
        setTimeout(() => {
          window.location.reload();
        }, 2000);

      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Failed to parse the imported file. Please check the file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  // Excel Import function
  const importFromExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        let importedData: any = {};

        // Read Profile sheet
        if (workbook.SheetNames.includes('Profile')) {
          const profileSheet = workbook.Sheets['Profile'];
          const profileData = XLSX.utils.sheet_to_json(profileSheet)[0] as any;
          
          if (profileData && profileData['Watermark']?.includes('AL Progress Wizard')) {
            importedData.profile = {
              name: profileData['Name'] || '',
              age: profileData['Age'] || '',
              school: profileData['School'] || '',
              grade: profileData['Grade'] || '',
              subjects: profileData['Subjects'] ? profileData['Subjects'].split(', ') : [],
              profilePicture: '',
              unlockedBadges: []
            };
          } else {
            toast({
              title: "Invalid Excel File",
              description: "This doesn't appear to be a valid Marksy export file.",
              variant: "destructive",
            });
            return;
          }
        }

        // Read Marks sheet
        if (workbook.SheetNames.includes('Marks')) {
          const marksSheet = workbook.Sheets['Marks'];
          importedData.marks = XLSX.utils.sheet_to_json(marksSheet).map((row: any) => ({
            subject: row['Subject'],
            paperName: row['Paper Name'],
            date: row['Date'],
            mcq: row['MCQ'] || 0,
            seq: row['SEQ'] || 0,
            essay: row['Essay'] || 0,
            total: row['Total'],
            timestamp: new Date(row['Timestamp']).getTime()
          }));
        }

        // Read Subjects sheet
        if (workbook.SheetNames.includes('Subjects')) {
          const subjectsSheet = workbook.Sheets['Subjects'];
          importedData.subjects = XLSX.utils.sheet_to_json(subjectsSheet).map((row: any) => ({
            name: row['Subject Name'],
            isFavorite: row['Is Favorite'] === 'Yes'
          }));
        }

        // Read Study Tasks sheet
        if (workbook.SheetNames.includes('Study Tasks')) {
          const todosSheet = workbook.Sheets['Study Tasks'];
          importedData.todos = XLSX.utils.sheet_to_json(todosSheet).map((row: any, index: number) => ({
            id: Date.now() + index,
            task: row['Task'],
            subject: row['Subject'],
            completed: row['Completed'] === 'Yes',
            createdAt: new Date(row['Created Date']).toISOString()
          }));
        }

        // Import the data using the same logic as JSON import
        if (importedData.profile) {
          setProfileData(importedData.profile);
          localStorage.setItem("marksy-profile", JSON.stringify(importedData.profile));
        }

        if (importedData.marks) {
          localStorage.setItem("alMarksData", JSON.stringify(importedData.marks));
        }

        if (importedData.subjects) {
          localStorage.setItem("alSubjects", JSON.stringify(importedData.subjects));
        }

        if (importedData.todos) {
          localStorage.setItem("alTodos", JSON.stringify(importedData.todos));
        }

        toast({
          title: "Excel Import Successful",
          description: "Data imported successfully from Excel! Please refresh the page to see all changes.",
          variant: "default",
        });

        // Trigger a page refresh after a delay
        setTimeout(() => {
          window.location.reload();
        }, 2000);

      } catch (error) {
        toast({
          title: "Excel Import Failed",
          description: "Failed to parse the Excel file. Please check the file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsArrayBuffer(file);
    
    // Reset input
    event.target.value = '';
  };

  return (
    <div className="px-4 py-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient mb-2">My Profile</h2>
        <p className="text-muted-foreground">Manage your academic profile and view achievements</p>
      </div>

      <div className="space-y-6">
        {/* User Authentication Info Card */}
        <Card className="academic-card border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-700 dark:text-green-400">
              <Shield className="h-5 w-5" />
              <span>Account Status</span>
            </CardTitle>
            <CardDescription className="text-green-600 dark:text-green-300">
              Currently logged in and synced with Firebase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-green-700 dark:text-green-400">Email Address</Label>
                <p className="text-sm bg-white dark:bg-gray-800 rounded px-3 py-2 border mt-1">
                  {user?.email || 'Not available'}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-green-700 dark:text-green-400">User ID</Label>
                <p className="text-sm bg-white dark:bg-gray-800 rounded px-3 py-2 border mt-1 font-mono">
                  {user?.uid ? user.uid.substring(0, 8) + '...' : 'Not available'}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-green-700 dark:text-green-400">Account Created</Label>
                <p className="text-sm bg-white dark:bg-gray-800 rounded px-3 py-2 border mt-1">
                  {user?.metadata?.creationTime 
                    ? new Date(user.metadata.creationTime).toLocaleDateString()
                    : 'Not available'
                  }
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-green-700 dark:text-green-400">Last Sign In</Label>
                <p className="text-sm bg-white dark:bg-gray-800 rounded px-3 py-2 border mt-1">
                  {user?.metadata?.lastSignInTime 
                    ? new Date(user.metadata.lastSignInTime).toLocaleDateString()
                    : 'Not available'
                  }
                </p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <Database className="h-4 w-4 inline mr-2" />
                All your progress and data is automatically synced with Firebase and secured with your account.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information Card */}
        <Card className="academic-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile Information</span>
            </CardTitle>
            <Button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              variant={isEditing ? "default" : "outline"}
            >
              {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
              {isEditing ? "Save" : "Edit"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-gradient-academic flex items-center justify-center overflow-hidden border-4 border-primary/20 group-hover:border-primary/50 transition-all duration-300">
                  {profileData.profilePicture ? (
                    <img 
                      src={profileData.profilePicture} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-16 w-16 text-white" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer hover:bg-primary/80 transition-colors">
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg">{profileData.name || "Your Name"}</h3>
                <p className="text-sm text-muted-foreground">{profileData.grade} Student</p>
              </div>
            </div>

            {/* Profile Details */}
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your name"
                    />
                  ) : (
                    <p className="mt-1 p-2 border rounded-md bg-muted/30">{profileData.name || "Not set"}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="age">Age</Label>
                  {isEditing ? (
                    <Input
                      id="age"
                      value={profileData.age}
                      onChange={(e) => setProfileData(prev => ({ ...prev, age: e.target.value }))}
                      placeholder="Enter your age"
                      type="number"
                    />
                  ) : (
                    <p className="mt-1 p-2 border rounded-md bg-muted/30">{profileData.age || "Not set"}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="school">School</Label>
                  {isEditing ? (
                    <Input
                      id="school"
                      value={profileData.school}
                      onChange={(e) => setProfileData(prev => ({ ...prev, school: e.target.value }))}
                      placeholder="Enter your school name"
                    />
                  ) : (
                    <p className="mt-1 p-2 border rounded-md bg-muted/30">{profileData.school || "Not set"}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="grade">Grade</Label>
                  {isEditing ? (
                    <Select
                      value={profileData.grade}
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, grade: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Grade 12">Grade 12</SelectItem>
                        <SelectItem value="Grade 13">Grade 13</SelectItem>
                        <SelectItem value="A/L Graduate">A/L Graduate</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="mt-1 p-2 border rounded-md bg-muted/30">{profileData.grade || "Not set"}</p>
                  )}
                </div>
              </div>

              {/* Subjects */}
              <div>
                <Label>Selected Subjects</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profileData.subjects.map((subject) => (
                    <Badge key={subject} variant="secondary" className="px-3 py-1">
                      {subject}
                      {isEditing && (
                        <button
                          onClick={() => removeSubject(subject)}
                          className="ml-2 text-xs hover:text-destructive"
                        >
                          ×
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="mt-2">
                    <Select onValueChange={addSubject}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Add a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSubjects
                          .filter(subject => !profileData.subjects.includes(subject))
                          .map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Section */}
      <Card className="academic-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Achievements</span>
            <Badge variant="outline" className="ml-2">
              {unlockedBadgesCount}/50
            </Badge>
          </CardTitle>
          <CardDescription>
            Unlock badges by reaching academic milestones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-lg border text-center transition-all duration-300 hover:scale-105 ${
                  badge.unlocked 
                    ? "bg-primary/10 border-primary/30 shadow-md" 
                    : "bg-muted/30 border-muted grayscale opacity-60"
                }`}
              >
                <div className="text-2xl mb-2">{badge.icon}</div>
                <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
                {badge.unlocked && (
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">
                      Unlocked!
                    </Badge>
                  </div>
                )}
              </div>
            ))}
            
            {/* Placeholder badges for the remaining 40 */}
            {Array.from({ length: 40 }, (_, i) => (
              <div
                key={`placeholder-${i}`}
                className="p-4 rounded-lg border text-center bg-muted/20 border-muted grayscale opacity-40"
              >
                <div className="text-2xl mb-2">🔒</div>
                <h4 className="font-semibold text-sm mb-1">Coming Soon</h4>
                <p className="text-xs text-muted-foreground">More badges coming</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Summary */}
      <Card className="academic-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>Progress Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {JSON.parse(localStorage.getItem("alMarksData") || "[]").length}
              </div>
              <p className="text-sm text-muted-foreground">Total Papers</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {unlockedBadgesCount}
              </div>
              <p className="text-sm text-muted-foreground">Badges Earned</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {Math.round((unlockedBadgesCount / 50) * 100)}%
              </div>
              <p className="text-sm text-muted-foreground">Achievement Progress</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comprehensive Data Management Card */}
      <Card className="academic-card border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl">
            <Database className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {language === "en" ? "Complete Data Management" : "සම්පූර්ණ දත්ත කළමනාකරණය"}
            </span>
          </CardTitle>
          <CardDescription className="text-base">
            {language === "en" 
              ? "Export and import ALL your Marksy data including marks, subjects, timer sessions, goals, badges, achievements, and preferences in one secure file" 
              : "ඔබේ සියලු Marksy දත්ත ලකුණු, විෂය, ටයිමර් සැසි, ඉලක්ක, බැඳි, ජයග්‍රහණ සහ මනාපයන් එක් ආරක්ෂිත ගොනුවකින් අපනයනය සහ ආනයනය කරන්න"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Export Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Download className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-green-700 dark:text-green-300">
                    {language === "en" ? "Export Everything" : "සියල්ල අපනයනය කරන්න"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "Download complete backup" : "සම්පූර්ණ උපස්ථය බාගන්න"}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span>{language === "en" ? "Secure .marksy format" : "ආරක්ෂිත .marksy ආකෘතිය"}</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <span>• {language === "en" ? "All marks & scores" : "සියලු ලකුණු සහ ලකුණු"}</span>
                  <span>• {language === "en" ? "Subject data" : "විෂය දත්ත"}</span>
                  <span>• {language === "en" ? "Timer sessions" : "ටයිමර් සැසි"}</span>
                  <span>• {language === "en" ? "Study goals" : "අධ්‍යයන ඉලක්ක"}</span>
                  <span>• {language === "en" ? "Badges & achievements" : "බැඩ්ජ් සහ ජයග්‍රහණ"}</span>
                  <span>• {language === "en" ? "App preferences" : "යෙදුම් මනාපයන්"}</span>
                </div>
              </div>
              
              <Button 
                onClick={exportAllData}
                className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Download className="h-5 w-5 mr-2" />
                {language === "en" ? "Export Complete Backup" : "සම්පූර්ණ උපස්ථය අපනයනය කරන්න"}
              </Button>
            </div>

            {/* Import Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-blue-700 dark:text-blue-300">
                    {language === "en" ? "Import Everything" : "සියල්ල ආනයනය කරන්න"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "Restore from backup" : "උපස්ථයෙන් ප්‍රතිෂ්ඨාපනය කරන්න"}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>{language === "en" ? "Safe import process" : "ආරක්ෂිත ආනයන ක්‍රියාවලිය"}</span>
                </div>
                <p className="text-xs">
                  {language === "en" 
                    ? "Only accepts valid .marksy files. Your existing data will be merged safely."
                    : "වලංගු .marksy ගොනු පමණක් පිළිගනී. ඔබේ පවතින දත්ත ආරක්ෂිතව ඒකාබද්ධ වනු ඇත."}
                </p>
              </div>
              
              <div className="relative">
                <input
                  type="file"
                  accept=".marksy"
                  onChange={importAllData}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button 
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  {language === "en" ? "Import Complete Backup" : "සම්පූර්ණ උපස්ථය ආනයනය කරන්න"}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Data Summary */}
          <div className="mt-6 p-4 bg-muted/30 rounded-lg border">
            <h4 className="font-medium mb-2 flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>{language === "en" ? "Your Data Summary" : "ඔබේ දත්ත සාරාංශය"}</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-lg text-primary">
                  {JSON.parse(localStorage.getItem("alMarksData") || "[]").length}
                </div>
                <div className="text-muted-foreground">{language === "en" ? "Marks" : "ලකුණු"}</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-primary">
                  {JSON.parse(localStorage.getItem("timerSessions") || "[]").length}
                </div>
                <div className="text-muted-foreground">{language === "en" ? "Sessions" : "සැසි"}</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-primary">
                  {Math.round(JSON.parse(localStorage.getItem("timerSessions") || "[]").reduce((total: number, session: any) => total + session.duration, 0) / 3600)}
                </div>
                <div className="text-muted-foreground">{language === "en" ? "Hours" : "පැය"}</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-primary">
                  {badges.filter(b => b.unlocked).length}
                </div>
                <div className="text-muted-foreground">{language === "en" ? "Badges" : "බැඩ්ජ්"}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
      <div className="mt-10 flex justify-center">
        <SupportButton />
      </div>
    </div>
  );
};

export default ProfilePage;