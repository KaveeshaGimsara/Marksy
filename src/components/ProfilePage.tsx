import { useState, useEffect } from "react";
import { User, Camera, Edit3, Save, Trophy, Star, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ProfilePageProps } from "@/types";

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
    { id: "all_subjects", name: "Renaissance Student", description: "Add marks for all 6 default subjects", condition: "all_subjects", icon: "🌈", unlocked: false },
    { id: "early_bird", name: "Early Bird", description: "Use the app before 8 AM", condition: "early_usage", icon: "🐦", unlocked: false }
  ]);

  const availableSubjects = ["Biology", "Chemistry", "Physics", "Mathematics", "ICT", "English"];

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
          unlocked = availableSubjects.every(subject => uniqueSubjects.includes(subject.toLowerCase()));
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

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gradient mb-2">My Profile</h2>
        <p className="text-muted-foreground">Manage your academic profile and view achievements</p>
      </div>

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
              <div className="text-3xl font-bold text-primary">
                {JSON.parse(localStorage.getItem("alMarksData") || "[]").length}
              </div>
              <p className="text-sm text-muted-foreground">Total Papers</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">
                {unlockedBadgesCount}
              </div>
              <p className="text-sm text-muted-foreground">Badges Earned</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">
                {Math.round((unlockedBadgesCount / 50) * 100)}%
              </div>
              <p className="text-sm text-muted-foreground">Achievement Progress</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;