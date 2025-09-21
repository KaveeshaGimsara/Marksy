import { useState, useEffect } from "react";
import { User, Camera, Edit3, Save, Trophy, Star, Upload, Download, FileText, FileSpreadsheet, Import } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ProfilePageProps } from "@/types";
import * as XLSX from 'xlsx';
import SupportButton from "@/components/SupportButton";

interface ProfileData {
  name: string;
  age: string;
  school: string;
  grade: string;
  subjects: string[];
  profilePicture: string;
  unlockedBadges: string[];
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
  const [isEditing, setIsEditing] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    age: "",
    school: "",
    grade: "",
    subjects: [],
    profilePicture: "",
    unlockedBadges: []
  });

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

      {/* Data Management Card */}
      <Card className="academic-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Data Management</span>
          </CardTitle>
          <CardDescription>
            Export and import your complete academic data including marks, subjects, todos, badges, and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Export Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Export Data</span>
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Download your complete academic data with watermark. Works on any device and includes all your marks, subjects, study tasks, badges, and settings.
              </p>
              <div className="flex justify-center">
                <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Export Data</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <Download className="h-5 w-5" />
                        <span>Choose Export Format</span>
                      </DialogTitle>
                      <DialogDescription>
                        Select your preferred format to export your complete academic data.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-1 gap-4">
                        <Button 
                          onClick={exportToJSON} 
                          className="flex items-center justify-center space-x-2 h-14"
                        >
                          <FileText className="h-5 w-5" />
                          <div className="text-left">
                            <div className="font-medium">JSON Format</div>
                            <div className="text-xs opacity-80">Universal format, smaller file size</div>
                          </div>
                        </Button>
                        <Button 
                          onClick={exportToExcel} 
                          variant="outline" 
                          className="flex items-center justify-center space-x-2 h-14"
                        >
                          <FileSpreadsheet className="h-5 w-5" />
                          <div className="text-left">
                            <div className="font-medium">Excel Format</div>
                            <div className="text-xs opacity-80">Organized sheets, easy to view</div>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Import Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Import className="h-5 w-5" />
                <span>Import Data</span>
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Import your previously exported data. This will merge with your current data. Page will refresh automatically after import.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="file"
                    id="json-import"
                    accept=".json"
                    onChange={importFromJSON}
                    className="hidden"
                  />
                  <Button 
                    onClick={() => document.getElementById('json-import')?.click()}
                    variant="outline"
                    className="w-full flex items-center space-x-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Import JSON</span>
                  </Button>
                </div>
                <div>
                  <input
                    type="file"
                    id="excel-import"
                    accept=".xlsx,.xls"
                    onChange={importFromExcel}
                    className="hidden"
                  />
                  <Button 
                    onClick={() => document.getElementById('excel-import')?.click()}
                    variant="outline"
                    className="w-full flex items-center space-x-2"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Import Excel</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Device Compatibility Info */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center space-x-2">
                <Trophy className="h-4 w-4" />
                <span>Quality Features</span>
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✅ Works on all devices (Mobile, Tablet, Desktop)</li>
                <li>✅ Includes watermark and metadata</li>
                <li>✅ Complete data backup (Images, Todos, Marks, Charts, Badges)</li>
                <li>✅ Secure JSON and Excel formats</li>
                <li>✅ Easy data transfer between devices</li>
                <li>✅ Automatic validation and error handling</li>
              </ul>
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