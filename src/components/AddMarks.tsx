import { useState, useEffect } from "react";
import { Plus, BookOpen, Star, Search, ArrowLeft, Calculator, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface AddMarksProps {
  language: "en" | "si";
}

interface Subject {
  name: string;
  isFavorite: boolean;
}

interface MarksEntry {
  mcq: string;
  seq: string;
  essay: string;
  paperName: string;
  date: string;
  total: number;
}

const AddMarks = ({ language }: AddMarksProps) => {
  const [subjects, setSubjects] = useState<Subject[]>([
    { name: "Biology", isFavorite: false },
    { name: "Chemistry", isFavorite: false },
    { name: "Physics", isFavorite: false },
    { name: "Mathematics", isFavorite: false },
    { name: "ICT", isFavorite: false },
    { name: "English", isFavorite: false },
  ]);
  
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [marks, setMarks] = useState<MarksEntry>({
    mcq: "",
    seq: "",
    essay: "",
    paperName: "",
    date: new Date().toISOString().split('T')[0],
    total: 0
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showSubjectDialog, setShowSubjectDialog] = useState(false);
  
  // Recent Marks filter states
  const [recentMarksSearch, setRecentMarksSearch] = useState("");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("all");
  const [displayCount, setDisplayCount] = useState("10");
  const [subjectSearchTerm, setSubjectSearchTerm] = useState(""); // Search for main subject list

  // Delete mark function
  const deleteMark = (markIndex: number) => {
    const marksData = JSON.parse(localStorage.getItem("alMarksData") || "[]");
    
    // Remove the mark at the specified index
    marksData.splice(markIndex, 1);
    
    // Save back to localStorage
    localStorage.setItem("alMarksData", JSON.stringify(marksData));
    
    // Show success message
    toast.success(language === "en" ? "Mark deleted successfully!" : "ලකුණු සාර්ථකව මකන ලදී!");
    
    // Force re-render by updating a state (this will cause the component to re-render)
    setMarks({...marks});
  };

  // Calculate grade based on percentage
  const calculateGrade = (marks: number, maxMarks: number = 100): string => {
    const percentage = (marks / maxMarks) * 100;
    
    if (percentage >= 75) return 'A';
    else if (percentage >= 65) return 'B';
    else if (percentage >= 55) return 'C';
    else if (percentage >= 35) return 'S';
    else if (percentage >= 30) return 'W';
    else return 'F';
  };

  // Get grade color for display
  const getGradeColor = (grade: string): string => {
    switch (grade) {
      case 'A': return 'text-green-600 dark:text-green-400';
      case 'B': return 'text-blue-600 dark:text-blue-400';
      case 'C': return 'text-yellow-600 dark:text-yellow-400';
      case 'S': return 'text-orange-600 dark:text-orange-400';
      case 'W': return 'text-red-500 dark:text-red-400';
      case 'F': return 'text-red-700 dark:text-red-500';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Curated Sri Lanka G.C.E. A/L subject list (core + popular electives only)
  const availableSubjects = [
    // Science Stream Core
    "Biology","Chemistry","Physics","Combined Mathematics","Agricultural Science",
    // Commerce Stream Core
    "Accounting","Business Studies","Economics",
    // Arts / Languages
    "Sinhala","Tamil","English","French","German","Japanese","Arabic","Pali","Sanskrit",
    // Arts / Humanities & Social Sciences
    "Geography","History","Political Science","Logic & Scientific Method","Buddhist Civilization","Christian Civilization","Hindu Civilization","Drama & Theatre","Music","Art","Dancing","Home Economics",
    // Technology Stream
    "Engineering Technology","Science for Technology","Bio-systems Technology",
    // Common / Cross Stream
    "Information and Communication Technology (ICT)","General English","Common General Test",
    // Popular Supporting / Extension (limited set – no speculative research fields)
    "Statistics","Pure Mathematics","Applied Mathematics","Environmental Science","Computer Science","Software Engineering","Psychology","Sociology"
  ];

  // Load subjects from localStorage on component mount
  useEffect(() => {
    const savedSubjects = localStorage.getItem("alSubjects");
    if (savedSubjects) {
      try {
        const parsedSubjects = JSON.parse(savedSubjects);
        if (Array.isArray(parsedSubjects) && parsedSubjects.length > 0) {
          setSubjects(parsedSubjects);
        }
      } catch (error) {
        console.error("Error parsing saved subjects:", error);
      }
    }

    // Migration: Check if there's old marks data that needs to be migrated
    const oldMarksData = localStorage.getItem("marksy-data");
    const newMarksData = localStorage.getItem("alMarksData");
    
    if (oldMarksData && !newMarksData) {
      try {
        const oldData = JSON.parse(oldMarksData);
        if (Array.isArray(oldData) && oldData.length > 0) {
          localStorage.setItem("alMarksData", JSON.stringify(oldData));
          console.log("Migrated marks data from old storage key");
        }
      } catch (error) {
        console.error("Error migrating old marks data:", error);
      }
    }
  }, []);

  // Auto calculate total whenever marks change
  useEffect(() => {
    const total = (parseFloat(marks.mcq) || 0) + (parseFloat(marks.seq) || 0) + (parseFloat(marks.essay) || 0);
    setMarks(prev => ({ ...prev, total }));
  }, [marks.mcq, marks.seq, marks.essay]);

  const addSubject = (subjectName: string) => {
    if (subjectName.trim() !== "" && !subjects.find(s => s.name === subjectName)) {
      const favoriteCount = subjects.filter(s => s.isFavorite).length;
      
      if (favoriteCount >= 6) {
        toast.error(
          language === "en" 
            ? "Maximum 6 subjects can be starred. Unstar a subject first." 
            : "උපරිම විෂය 6ක් තරු කළ හැක. පළමුව විෂයක තරුව ඉවත් කරන්න."
        );
        return;
      }

      const newSubjects = [...subjects, { 
        name: subjectName.trim(), 
        isFavorite: true // Automatically star new subjects
      }];
      setSubjects(newSubjects);
      localStorage.setItem("alSubjects", JSON.stringify(newSubjects));
      setShowSubjectDialog(false);
      setSearchTerm("");
      toast.success(
        language === "en" 
          ? `${subjectName} added & starred` 
          : `${subjectName} එකතු කර තරු කරන ලදී`
      );
    }
  };

  const toggleFavorite = (subjectName: string) => {
    const favoriteCount = subjects.filter(s => s.isFavorite).length;
    const subject = subjects.find(s => s.name === subjectName);
    
    if (subject && !subject.isFavorite && favoriteCount >= 6) {
      toast.error(
        language === "en" ? "Maximum 6 subjects can be starred" : "උපරිම විෂය 6ක් තරු කළ හැක"
      );
      return;
    }

    const updatedSubjects = subjects.map(subject =>
      subject.name === subjectName
        ? { ...subject, isFavorite: !subject.isFavorite }
        : subject
    );
    setSubjects(updatedSubjects);
    localStorage.setItem("alSubjects", JSON.stringify(updatedSubjects));
    
    toast.success(
      subject?.isFavorite 
        ? (language === "en" ? "Subject unstarred" : "විෂයේ තරුව ඉවත් කරන ලදී")
        : (language === "en" ? "Subject starred" : "විෂයට තරුව දමන ලදී")
    );
  };

  const selectSubject = (subjectName: string) => {
    setSelectedSubject(subjectName);
    // Reset marks when selecting a new subject
    setMarks({
      mcq: "",
      seq: "",
      essay: "",
      paperName: "",
      date: new Date().toISOString().split('T')[0],
      total: 0
    });
  };

  const saveMarks = () => {
    if (!selectedSubject || !marks.paperName) {
      toast.error(language === "en" ? "Please fill in all required fields" : "කරුණාකර අවශ්‍ය සියලුම ක්ෂේත්‍ර පුරවන්න");
      return;
    }

    // Save to localStorage
    const existingData = JSON.parse(localStorage.getItem("alMarksData") || "[]");
    const newEntry = {
      subject: selectedSubject,
      ...marks,
      timestamp: Date.now()
    };
    existingData.push(newEntry);
    localStorage.setItem("alMarksData", JSON.stringify(existingData));

    toast.success(language === "en" ? "Marks saved successfully!" : "ලකුණු සාර්ථකව සුරකින ලදී!");
    
    // Reset only the form, keep subject selected for more entries
    setMarks({
      mcq: "",
      seq: "",
      essay: "",
      paperName: "",
      date: new Date().toISOString().split('T')[0],
      total: 0
    });
    // Don't reset selectedSubject - let user add more marks for same subject
  };

  // Ensure core baseline subjects always present (idempotent merge)
  const baselineSubjects = ["Biology","Chemistry","Physics"]; // ensure visible
  const mergedSubjects = (() => {
    const set = new Map(subjects.map(s => [s.name.toLowerCase(), s] as const));
    baselineSubjects.forEach(name => {
      if (!set.has(name.toLowerCase())) {
        set.set(name.toLowerCase(), { name, isFavorite: false });
      }
    });
    return Array.from(set.values());
  })();

  // Sort subjects with favorites first, then alphabetical
  const sortedSubjects = mergedSubjects
    .filter(subject => subject.name.toLowerCase().includes(subjectSearchTerm.toLowerCase()))
    .sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="min-h-screen px-4 py-6 pb-24">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {language === "en" ? "Add Your Marks" : "ඔබේ ලකුණු එකතු කරන්න"}
        </h1>
        <p className="text-muted-foreground text-lg">
          {language === "en" 
            ? "Select a subject and add your marks" 
            : "විෂයක් තෝරා ඔබේ ලකුණු එකතු කරන්න"
          }
        </p>
      </div>

      {!selectedSubject ? (
        // Subject Selection View
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>{language === "en" ? "Select Subject" : "විෂයක් තෝරන්න"}</span>
              </div>
              <Dialog open={showSubjectDialog} onOpenChange={setShowSubjectDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Star className="h-4 w-4 mr-2" />
                    {language === "en" ? "Add Subject" : "විෂයක් එකතු කරන්න"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{language === "en" ? "Add New Subject" : "නව විෂයක් එක් කරන්න"}</DialogTitle>
                    <DialogDescription>
                      {language === "en" ? "Search from 100+ available subjects" : "විෂය 100කට වැඩි ප්‍රමාණයකින් සොයන්න"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder={language === "en" ? "Search subjects..." : "විෂය සොයන්න..."}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {availableSubjects
                        .filter(subject => 
                          subject.toLowerCase().includes(searchTerm.toLowerCase()) &&
                          !subjects.find(s => s.name === subject)
                        )
                        .slice(0, 10)
                        .map(subject => (
                          <Button
                            key={subject}
                            variant="ghost"
                            className="w-full justify-between"
                            onClick={() => addSubject(subject)}
                          >
                            <span>{subject}</span>
                            <Plus className="h-4 w-4" />
                          </Button>
                        ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
            <CardDescription>
              {language === "en" 
                ? "Click on a subject to add marks" 
                : "ලකුණු එකතු කිරීමට විෂයක් මත ක්ලික් කරන්න"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search input for subjects */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={language === "en" ? "Search subjects..." : "විෂයන් සොයන්න..."}
                  value={subjectSearchTerm}
                  onChange={(e) => setSubjectSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Show message if no starred subjects */}
            {sortedSubjects.filter(s => s.isFavorite).length === 0 && subjects.filter(s=>s.isFavorite).length === 0 && (
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  {language === "en" ? "No starred subjects yet. Add subjects and star them to see them here!" : "තරු සහිත විෂයන් නැත. විෂයන් එකතු කර ඒවාට තරු දමන්න!"}
                </p>
                <Dialog open={showSubjectDialog} onOpenChange={setShowSubjectDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      {language === "en" ? "Add Subject" : "විෂයක් එකතු කරන්න"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{language === "en" ? "Add New Subject" : "නව විෂයක් එකතු කරන්න"}</DialogTitle>
                      <DialogDescription>
                        {language === "en" ? "Search and add subjects to your list" : "ඔබේ ලැයිස්තුවට විෂයන් සොයා එකතු කරන්න"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder={language === "en" ? "Search subjects..." : "විෂයන් සොයන්න..."}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {availableSubjects
                          .filter(subject => 
                            subject.toLowerCase().includes(searchTerm.toLowerCase()) &&
                            !subjects.find(s => s.name === subject)
                          )
                          .slice(0, 10)
                          .map(subject => (
                            <Button
                              key={subject}
                              variant="ghost"
                              className="w-full justify-between"
                              onClick={() => addSubject(subject)}
                            >
                              <span>{subject}</span>
                              <Star className="h-4 w-4" />
                            </Button>
                          ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {sortedSubjects
                .filter(subject => subjectSearchTerm === "" || subject.name.toLowerCase().includes(subjectSearchTerm.toLowerCase()))
                .slice(0,6)
                .map((subject) => (
                <Card 
                  key={subject.name}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md ${
                    subject.isFavorite ? 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20' : 'border-muted'
                  }`}
                  onClick={() => selectSubject(subject.name)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="font-medium">{subject.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(subject.name);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Star className={`h-4 w-4 ${subject.isFavorite ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
                      </Button>
                    </div>
                    {subject.isFavorite && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {language === "en" ? "Favorite" : "ප්‍රියතම"}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        // Marks Input View
        <Card className="animate-fade-in">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSubject(null)}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span>{selectedSubject}</span>
                </CardTitle>
                <CardDescription>
                  {language === "en" ? "Enter your marks for this subject" : "මෙම විෂය සඳහා ඔබේ ලකුණු ඇතුළත් කරන්න"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Paper Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="paperName">{language === "en" ? "Paper Name *" : "ප්‍රශ්න පත්‍ර නම *"}</Label>
                <Input
                  id="paperName"
                  value={marks.paperName}
                  onChange={(e) => setMarks(prev => ({ ...prev, paperName: e.target.value }))}
                  placeholder={language === "en" ? "e.g., 2023 Model Paper" : "උදා: 2023 ආදර්ශ ප්‍රශ්න පත්‍රය"}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="date">{language === "en" ? "Date" : "දිනය"}</Label>
                <Input
                  id="date"
                  type="date"
                  value={marks.date}
                  onChange={(e) => setMarks(prev => ({ ...prev, date: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Marks Input */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span>{language === "en" ? "Enter Marks" : "ලකුණු ඇතුළත් කරන්න"}</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="mcq">{language === "en" ? "MCQ Marks" : "MCQ ලකුණු"}</Label>
                  <Input
                    id="mcq"
                    type="number"
                    value={marks.mcq}
                    onChange={(e) => setMarks(prev => ({ ...prev, mcq: e.target.value }))}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="seq">{language === "en" ? "Structured (SEQ)" : "ව්‍යුහගත (SEQ)"}</Label>
                  <Input
                    id="seq"
                    type="number"
                    value={marks.seq}
                    onChange={(e) => setMarks(prev => ({ ...prev, seq: e.target.value }))}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="essay">{language === "en" ? "Essay Marks" : "රචනා ලකුණු"}</Label>
                  <Input
                    id="essay"
                    type="number"
                    value={marks.essay}
                    onChange={(e) => setMarks(prev => ({ ...prev, essay: e.target.value }))}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Total Display */}
              <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                <span className="text-lg font-medium">
                  {language === "en" ? "Total Marks:" : "මුළු ලකුණු:"}
                </span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 animate-pulse">
                  {marks.total}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button onClick={saveMarks} className="flex-1">
                {language === "en" ? "Save Marks" : "ලකුණු සුරකින්න"}
              </Button>
              <Button variant="outline" onClick={() => setSelectedSubject(null)}>
                {language === "en" ? "Cancel" : "අවලංගු කරන්න"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Marks Section */}
      {(() => {
        const marksData = JSON.parse(localStorage.getItem("alMarksData") || "[]");
        
        if (marksData.length === 0) return null;

        return (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span>{language === "en" ? "Recent Marks" : "මෑත කාලීන ලකුණු"}</span>
              </CardTitle>
              <CardDescription>
                {language === "en" 
                  ? "Your latest paper submissions with filtering options" 
                  : "පෙරහන් විකල්ප සමඟ ඔබේ නවතම ප්‍රශ්නපත්‍ර ඉදිරිපත් කිරීම්"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Filter Options */}
                <div className="flex flex-wrap gap-4">
                  <Input
                    placeholder={language === "en" ? "Search by subject or paper name..." : "විෂය හෝ ප්‍රශ්නපත්‍ර නම අනුව සොයන්න..."}
                    className="max-w-sm"
                    value={recentMarksSearch}
                    onChange={(e) => setRecentMarksSearch(e.target.value)}
                  />
                  <select 
                    className="px-3 py-2 border rounded-md bg-background"
                    value={selectedSubjectFilter}
                    onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                  >
                    <option value="all">{language === "en" ? "All Subjects" : "සියලුම විෂය"}</option>
                    {[...new Set(marksData.map((item: any) => item.subject))].map((subject: string) => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                  <select 
                    className="px-3 py-2 border rounded-md bg-background"
                    value={displayCount}
                    onChange={(e) => setDisplayCount(e.target.value)}
                  >
                    <option value="10">{language === "en" ? "Last 10" : "අවසන් 10"}</option>
                    <option value="25">{language === "en" ? "Last 25" : "අවසන් 25"}</option>
                    <option value="50">{language === "en" ? "Last 50" : "අවසන් 50"}</option>
                    <option value="100">{language === "en" ? "Last 100" : "අවසන් 100"}</option>
                  </select>
                </div>

                {/* Marks List */}
                <div className="max-h-96 overflow-y-auto border rounded-lg">
                  <div className="space-y-2 p-4">
                    {(() => {
                      // Filter the marks data
                      let filteredMarks = marksData;
                      
                      // Filter by subject
                      if (selectedSubjectFilter !== "all") {
                        filteredMarks = filteredMarks.filter((mark: any) => mark.subject === selectedSubjectFilter);
                      }
                      
                      // Filter by search term
                      if (recentMarksSearch) {
                        filteredMarks = filteredMarks.filter((mark: any) => 
                          mark.subject?.toLowerCase().includes(recentMarksSearch.toLowerCase()) ||
                          mark.paperName?.toLowerCase().includes(recentMarksSearch.toLowerCase())
                        );
                      }
                      
                      // Limit the count and reverse to show newest first
                      const displayedMarks = filteredMarks
                        .slice(-parseInt(displayCount))
                        .reverse();
                      
                      if (displayedMarks.length === 0) {
                        return (
                          <div className="text-center py-8 text-muted-foreground">
                            <Calculator className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>{language === "en" ? "No marks found matching your filters" : "ඔබේ පෙරහන් වලට ගැලපෙන ලකුණු හමු නොවිණි"}</p>
                          </div>
                        );
                      }
                      
                      return displayedMarks.map((mark: any, index: number) => {
                        // Calculate the original index in the full marksData array
                        const originalIndex = marksData.findIndex((originalMark: any) => 
                          originalMark.timestamp === mark.timestamp && 
                          originalMark.subject === mark.subject &&
                          originalMark.paperName === mark.paperName
                        );
                        
                        return (
                          <div key={`${mark.timestamp}-${index}`} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors group">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <Badge variant="outline">{mark.subject}</Badge>
                                <span className="font-medium">{mark.paperName}</span>
                                {(() => {
                                  // Calculate max marks (assuming standard 100 marks if not specified)
                                  const maxMarks = mark.maxMarks || 100;
                                  const grade = calculateGrade(mark.total, maxMarks);
                                  return (
                                    <Badge className={`${getGradeColor(grade)} bg-transparent border`}>
                                      {grade}
                                    </Badge>
                                  );
                                })()}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(mark.timestamp).toLocaleDateString()} • 
                                MCQ: {mark.mcq || 0} • SEQ: {mark.seq || 0} • Essay: {mark.essay || 0}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{mark.total || 0}</div>
                                <div className="text-xs text-muted-foreground">
                                  {language === "en" ? "Total" : "මුළු"}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteMark(originalIndex)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })()}
    </div>
  );
};

export default AddMarks;