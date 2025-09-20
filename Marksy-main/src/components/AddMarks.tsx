import { useState } from "react";
import { Calendar, Plus, Calculator, Save, Star, Download, Upload, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { SUBJECT_STRUCTURES, SITE_META } from "@/data/subjectStructures";

interface MarksData {
  id?: string;
  subject: string;
  paperType?: string;
  mcq?: number;
  seq?: number;
  essay?: number;
  date: string;
  paperName: string;
  tutor: string;
  total: number;
}

const AddMarks = () => {
  const { toast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [savedMarks, setSavedMarks] = useState<Array<MarksData & { id: string }>>(() => {
    const saved = localStorage.getItem("alMarksData");
    return saved ? JSON.parse(saved) : [];
  });
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 30 days
    to: new Date().toISOString().split('T')[0]
  });
  const [favoriteSubjects, setFavoriteSubjects] = useState<string[]>(() => {
    const saved = localStorage.getItem("favoriteSubjects");
    return saved ? JSON.parse(saved) : [];
  });
  const [marksData, setMarksData] = useState<Partial<MarksData>>({
    mcq: undefined,
    seq: undefined,
    essay: undefined,
    date: new Date().toISOString().split('T')[0],
    paperName: "",
    tutor: "",
    total: 0
  });
  const [customSubjects, setCustomSubjects] = useState<Array<{ id: string; name: string; type: string }>>(() => {
    const saved = localStorage.getItem("customSubjects");
    return saved ? JSON.parse(saved) : [];
  });
  const [newSubject, setNewSubject] = useState({ name: "", type: "science" });

  const baseSubjects = [
    { id: "biology", name: "Biology", type: "science" },
    { id: "physics", name: "Physics", type: "science" },
    { id: "chemistry", name: "Chemistry", type: "science" },
    { id: "english", name: "English", type: "language" },
    { id: "mathematics", name: "Mathematics", type: "science" },
    { id: "ict", name: "ICT", type: "science" },
    { id: "economics", name: "Economics", type: "commerce" },
    { id: "business", name: "Business Studies", type: "commerce" },
    { id: "accounting", name: "Accounting", type: "commerce" },
  ];
  const subjects = [...baseSubjects, ...customSubjects];

  const selectedSubjectData = subjects.find(s => s.id === selectedSubject);
  const isScience = selectedSubjectData?.type === "science";
  const isLanguage = selectedSubjectData?.type === "language";
  const isEnglish = selectedSubject === "english";

  const toggleFavorite = (subjectId: string) => {
    const newFavorites = favoriteSubjects.includes(subjectId)
      ? favoriteSubjects.filter(id => id !== subjectId)
      : [...favoriteSubjects, subjectId];
    
    setFavoriteSubjects(newFavorites);
    localStorage.setItem("favoriteSubjects", JSON.stringify(newFavorites));
  };

  // Filter and sort subjects: search filter first, then favorites first, then alphabetically
  const filteredAndSortedSubjects = [...subjects]
    .filter(subject => 
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aIsFavorite = favoriteSubjects.includes(a.id);
      const bIsFavorite = favoriteSubjects.includes(b.id);
      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;
      return a.name.localeCompare(b.name);
    });

  const limitedSubjects = searchTerm
    ? filteredAndSortedSubjects
    : filteredAndSortedSubjects.filter((s, idx) => favoriteSubjects.includes(s.id) || idx < 6);

  const handleMarksChange = (field: string, value: string) => {
    const numValue = value === "" ? undefined : parseInt(value);
    setMarksData(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const calculateTotal = () => {
    const { mcq = 0, seq = 0, essay = 0 } = marksData;
    const total = mcq + seq + essay;
    setMarksData(prev => ({ ...prev, total }));
    
    toast({
      title: "Total Calculated",
      description: `Total marks: ${total}`,
    });
  };

  const saveMarks = () => {
    if (!selectedSubject || !marksData.paperName) {
      toast({
        title: "Missing Information",
        description: "Please select a subject and enter paper name.",
        variant: "destructive",
      });
      return;
    }

    const savedData: MarksData & { id: string } = {
      subject: selectedSubject,
      id: Date.now().toString(),
      paperType: marksData.paperType,
      mcq: marksData.mcq,
      seq: marksData.seq,
      essay: marksData.essay,
      date: marksData.date ?? new Date().toISOString().split('T')[0],
      paperName: marksData.paperName ?? "",
      tutor: marksData.tutor ?? "",
      total: marksData.total ?? 0,
    };

    // Save to localStorage and state
    const newMarks = [...savedMarks, savedData];
    setSavedMarks(newMarks);
    localStorage.setItem("alMarksData", JSON.stringify(newMarks));

    // Notify other parts of the app (e.g., HomePage stats) that marks data changed
    try {
      window.dispatchEvent(new Event('marksDataUpdated'));
    } catch (e) {
      // no-op in non-browser environments
    }

    toast({
      title: "Marks Saved Successfully!",
      description: `${selectedSubjectData?.name} marks have been added to your records.`,
    });

    // Reset form
    setMarksData({
      mcq: undefined,
      seq: undefined,
      essay: undefined,
      date: new Date().toISOString().split('T')[0],
      paperName: "",
      tutor: "",
      total: 0
    });
    setSelectedSubject("");
  };

  const deleteMarks = (id: string) => {
    const updatedMarks = savedMarks.filter(mark => mark.id !== id);
    setSavedMarks(updatedMarks);
    localStorage.setItem("alMarksData", JSON.stringify(updatedMarks));
    
    toast({
      title: "Marks Deleted",
      description: "The marks entry has been deleted successfully.",
    });
  };

  const addNewSubject = () => {
    if (!newSubject.name.trim()) {
      toast({ title: "Subject name required", variant: "destructive" });
      return;
    }
    const id = newSubject.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (subjects.some(s => s.id === id)) {
      toast({ title: "Subject exists", description: "That subject is already in the list" });
      return;
    }
    const created = { id, name: newSubject.name.trim(), type: newSubject.type };
    const updated = [...customSubjects, created];
    setCustomSubjects(updated);
    localStorage.setItem("customSubjects", JSON.stringify(updated));
    setNewSubject({ name: "", type: "science" });
    toast({ title: "Subject Added", description: `${created.name} added.` });
  };

  const buildAchievements = (allMarks: typeof savedMarks) => {
    // Lightweight subset: only simple counts for export now (reuse logic from SubjectAnalysis if extracted later)
    const total = allMarks.length;
    const subjectsAttempted = new Set(allMarks.map(m=>m.subject)).size;
    return [
      { name: 'Total Papers', value: total },
      { name: 'Subjects Attempted', value: subjectsAttempted }
    ];
  };

  const exportJSON = () => {
    const payload = {
      site: SITE_META.name,
      exportedAt: new Date().toISOString(),
      favorites: favoriteSubjects,
      customSubjects,
      marks: savedMarks,
      achievements: buildAchievements(savedMarks),
      subjectStructures: SUBJECT_STRUCTURES,
    };
    const dataStr = JSON.stringify(payload, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'marksy-data.json';
    link.click();
    toast({ title: 'Exported JSON', description: 'Your data was exported.' });
  };

  const exportXLSX = async () => {
    try {
      const { utils, writeFile } = await import('xlsx');
      const wb = utils.book_new();

      // Marks sheet
      const marksSheet = utils.json_to_sheet(savedMarks.map(m => ({
        ID: m.id,
        Subject: m.subject,
        Date: m.date,
        Paper: m.paperName,
        MCQ: m.mcq, SEQ: m.seq, Essay: m.essay, Total: m.total
      })));
      utils.book_append_sheet(wb, marksSheet, 'Marks');

      // Subjects sheet
      const subjectsCombined = [...baseSubjects, ...customSubjects].map(s => ({
        ID: s.id, Name: s.name, Type: s.type, Stream: SUBJECT_STRUCTURES[s.id]?.stream || ''
      }));
      const subjSheet = utils.json_to_sheet(subjectsCombined);
      utils.book_append_sheet(wb, subjSheet, 'Subjects');

      // Achievements sheet
      const achSheet = utils.json_to_sheet(buildAchievements(savedMarks));
      utils.book_append_sheet(wb, achSheet, 'Summary');

      // Structures sheet
      const structSheet = utils.json_to_sheet(Object.entries(SUBJECT_STRUCTURES).map(([id, v]) => ({
        Subject: id,
        Stream: v.stream,
        Papers: v.papers.join(' | ')
      })));
      utils.book_append_sheet(wb, structSheet, 'Structures');

      writeFile(wb, 'marksy-data.xlsx');
      toast({ title: 'Exported Excel', description: 'Excel file downloaded.' });
    } catch (e) {
      console.error(e);
      toast({ title: 'Export failed', description: 'Could not generate Excel file', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gradient mb-2">Add Your Marks</h2>
        <p className="text-muted-foreground">Track your Advanced Level progress by adding marks from papers and tests</p>
      </div>
      {/* Subject Selection */}
      <Card className="academic-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Select Subject</span>
          </CardTitle>
          <CardDescription>Choose the subject for which you want to add marks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add new Subject inline */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 p-3 rounded-lg border bg-muted/30">
            <div className="sm:col-span-2">
              <Label htmlFor="newSubjectName">New Subject</Label>
              <Input id="newSubjectName" placeholder="e.g., Geography" value={newSubject.name} onChange={e=>setNewSubject(prev=>({...prev,name:e.target.value}))} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="newSubjectType">Stream / Type</Label>
              <select id="newSubjectType" className="w-full bg-background border rounded-md h-10 px-2" value={newSubject.type} onChange={e=>setNewSubject(prev=>({...prev,type:e.target.value}))}>
                <option value="science">Science</option>
                <option value="commerce">Commerce</option>
                <option value="arts">Arts</option>
                <option value="technology">Technology</option>
                <option value="common">Common</option>
                <option value="language">Language</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button type="button" onClick={addNewSubject} className="academic-button-primary w-full">Add</Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Subject Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {(limitedSubjects.length > 0 ? limitedSubjects : filteredAndSortedSubjects).map((subject) => (
              <div
                key={subject.id}
                className={`subject-card relative ${selectedSubject === subject.id ? 'selected' : ''}`}
              >
                <div
                  onClick={() => setSelectedSubject(subject.id)}
                  className="flex-1 cursor-pointer"
                >
                  <h3 className="font-semibold text-sm sm:text-lg">{subject.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground capitalize">{subject.type}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(subject.id);
                  }}
                  className="absolute top-2 right-2 p-1 hover:bg-primary/10 rounded-full transition-colors"
                  title={favoriteSubjects.includes(subject.id) ? "Remove from favorites" : "Add to favorites"}
                >
                  <Star 
                    className={`h-4 w-4 ${
                      favoriteSubjects.includes(subject.id) 
                        ? 'text-yellow-500 fill-yellow-500' 
                        : 'text-muted-foreground hover:text-yellow-500'
                    }`} 
                  />
                </button>
              </div>
            ))}
            {limitedSubjects.length === 0 && filteredAndSortedSubjects.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No subjects found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Marks Input Section */}
      {selectedSubject && (
        <Card className="academic-card animate-bounce-in">
          <CardHeader>
            <CardTitle className="text-primary">{selectedSubjectData?.name} Marks Entry</CardTitle>
            <CardDescription>Enter marks for each paper type (leave blank if not attempted)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Paper Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="paperName">Paper Name/Number</Label>
                <Input
                  id="paperName"
                  placeholder="e.g., Paper 02, 2022 Model"
                  value={marksData.paperName || ""}
                  onChange={(e) => setMarksData(prev => ({ ...prev, paperName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={marksData.date || ""}
                  onChange={(e) => setMarksData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="tutor">Tutor/Institute</Label>
                <Input
                  id="tutor"
                  placeholder="e.g., School, Tutor X"
                  value={marksData.tutor || ""}
                  onChange={(e) => setMarksData(prev => ({ ...prev, tutor: e.target.value }))}
                />
              </div>
            </div>

            {/* Marks Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {!isEnglish && (
                <div>
                  <Label htmlFor="mcq">MCQ Marks</Label>
                  <Input
                    id="mcq"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0-100"
                    value={marksData.mcq || ""}
                    onChange={(e) => handleMarksChange("mcq", e.target.value)}
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="seq">
                  {isEnglish ? "SEQ Marks" : "Structured Essay (SEQ) Marks"}
                </Label>
                <Input
                  id="seq"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0-100"
                  value={marksData.seq || ""}
                  onChange={(e) => handleMarksChange("seq", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="essay">Essay Marks</Label>
                <Input
                  id="essay"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0-100"
                  value={marksData.essay || ""}
                  onChange={(e) => handleMarksChange("essay", e.target.value)}
                />
              </div>
            </div>

            {/* Total Display */}
            <div className="bg-muted/50 p-4 rounded-lg border-2 border-dashed border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-lg font-semibold">Total Marks</Label>
                  <p className="text-3xl font-bold text-primary">{marksData.total || 0}</p>
                </div>
                <Button onClick={calculateTotal} className="academic-button-primary">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Total
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
              <Button onClick={saveMarks} className="academic-button-primary flex-1">
                <Save className="h-4 w-4 mr-2" />
                Add Marks
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved Marks List */}
      {savedMarks.length > 0 && (
        <Card className="academic-card animate-fade-in">
          <CardHeader>
            <CardTitle>Saved Marks History</CardTitle>
            <CardDescription>View and manage your saved marks entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Date Filter - Import/Export removed */}
              <div className="flex flex-col space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <Label htmlFor="dateFrom">From Date</Label>
                    <Input
                      id="dateFrom"
                      type="date"
                      value={dateRange.from}
                      onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateTo">To Date</Label>
                    <Input
                      id="dateTo"
                      type="date"
                      value={dateRange.to}
                      onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                  {savedMarks
                    .filter(mark => {
                      const markDate = new Date(mark.date);
                      const fromDate = new Date(dateRange.from);
                      const toDate = new Date(dateRange.to);
                      return markDate >= fromDate && markDate <= toDate;
                    })
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 10)
                    .map((mark) => {
                      const subjectInfo = subjects.find(s => s.id === mark.subject);
                      return (
                        <div key={mark.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors gap-4">
                          <div className="space-y-2 w-full sm:w-auto">
                            <h3 className="font-semibold text-base sm:text-lg">{subjectInfo?.name} - {mark.paperName}</h3>
                            <p className="text-sm text-muted-foreground flex flex-wrap gap-2">
                              <span>Date: {new Date(mark.date).toLocaleDateString()}</span>
                              <span className="hidden sm:inline">|</span>
                              <span>Total: {mark.total}</span>
                            </p>
                            <p className="text-xs text-muted-foreground flex flex-wrap gap-2">
                              {mark.mcq !== undefined && <span>MCQ: {mark.mcq}</span>}
                              {mark.seq !== undefined && <span>SEQ: {mark.seq}</span>}
                              {mark.essay !== undefined && <span>Essay: {mark.essay}</span>}
                            </p>
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto justify-end">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteMarks(mark.id)}
                              className="w-full sm:w-auto"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AddMarks;