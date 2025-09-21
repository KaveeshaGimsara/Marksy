import { useState, useEffect } from "react";
import { Plus, BookOpen, Star, Search, ArrowLeft, Calculator } from "lucide-react";
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

  // Available subjects for search (100 subjects)
  const availableSubjects = [
    "Accounting", "Agriculture", "Applied Mathematics", "Art", "Astronomy", "Biochemistry",
    "Biology", "Botany", "Business Studies", "Chemistry", "Chinese", "Civics", "Commerce",
    "Computer Science", "Dance", "Drama", "Economics", "Engineering Technology", "English",
    "Environmental Science", "Ethics", "Food Technology", "French", "Geography", "Geology",
    "German", "Greek", "Hindi", "History", "Home Economics", "ICT", "Italian", "Japanese",
    "Korean", "Latin", "Law", "Logic", "Mathematics", "Media Studies", "Microbiology",
    "Music", "Painting", "Philosophy", "Photography", "Physical Education", "Physics",
    "Political Science", "Psychology", "Religion", "Russian", "Science for Technology",
    "Sculpture", "Sinhala", "Social Studies", "Sociology", "Spanish", "Statistics",
    "Tamil", "Technology", "Textile Technology", "Theatre", "Zoology", "Arabic",
    "Anthropology", "Architecture", "Banking", "Bioethics", "Biotechnology", "Cartography",
    "Ceramics", "Classical Studies", "Communication", "Criminology", "Cybersecurity",
    "Data Science", "Dermatology", "Digital Arts", "Ecology", "Electronics", "Fashion Design",
    "Film Studies", "Finance", "Forensics", "Genetics", "Health Science", "Immunology",
    "Industrial Arts", "Information Systems", "International Relations", "Journalism",
    "Library Science", "Linguistics", "Marine Biology", "Marketing", "Meteorology",
    "Nanotechnology", "Neuroscience", "Nutrition", "Oceanography", "Paleontology",
    "Pharmacology", "Physiology", "Robotics", "Social Work", "Software Engineering",
    "Sports Science", "Urban Planning", "Veterinary Science", "Web Development"
  ];

  // Auto calculate total whenever marks change
  useEffect(() => {
    const total = (parseFloat(marks.mcq) || 0) + (parseFloat(marks.seq) || 0) + (parseFloat(marks.essay) || 0);
    setMarks(prev => ({ ...prev, total }));
  }, [marks.mcq, marks.seq, marks.essay]);

  const addSubject = (subjectName: string) => {
    if (subjectName.trim() !== "" && !subjects.find(s => s.name === subjectName)) {
      setSubjects([...subjects, { 
        name: subjectName.trim(), 
        isFavorite: false 
      }]);
      setShowSubjectDialog(false);
      setSearchTerm("");
      toast.success(`${subjectName} added to subjects`);
    }
  };

  const toggleFavorite = (subjectName: string) => {
    setSubjects(subjects.map(subject => 
      subject.name === subjectName 
        ? { ...subject, isFavorite: !subject.isFavorite }
        : subject
    ));
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
    const existingData = JSON.parse(localStorage.getItem("marksy-data") || "[]");
    const newEntry = {
      subject: selectedSubject,
      ...marks,
      timestamp: Date.now()
    };
    existingData.push(newEntry);
    localStorage.setItem("marksy-data", JSON.stringify(existingData));

    toast.success(language === "en" ? "Marks saved successfully!" : "ලකුණු සාර්ථකව සුරකින ලදී!");
    
    // Reset form
    setMarks({
      mcq: "",
      seq: "",
      essay: "",
      paperName: "",
      date: new Date().toISOString().split('T')[0],
      total: 0
    });
    setSelectedSubject(null);
  };

  // Sort subjects with favorites first
  const sortedSubjects = [...subjects].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return 0;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
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
                    <Plus className="h-4 w-4 mr-2" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {sortedSubjects.map((subject) => (
                <Card 
                  key={subject.name}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md ${
                    subject.isFavorite ? 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20' : ''
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
                <span className="text-2xl font-bold text-primary animate-pulse">
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
    </div>
  );
};

export default AddMarks;