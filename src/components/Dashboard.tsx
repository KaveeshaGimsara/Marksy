import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Calendar, Filter, Download, Upload, Trash2, Plus, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { DashboardProps } from "@/types";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Dashboard = ({ language }: DashboardProps) => {
  const { toast } = useToast();
  const [marksData, setMarksData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [subjects, setSubjects] = useState<any[]>([]);
  const [showAddSubjectDialog, setShowAddSubjectDialog] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");

  // Load subjects from localStorage
  const loadSubjects = () => {
    const savedSubjects = localStorage.getItem("alSubjects");
    if (savedSubjects) {
      try {
        const parsedSubjects = JSON.parse(savedSubjects);
        if (Array.isArray(parsedSubjects)) {
          setSubjects(parsedSubjects);
        }
      } catch (error) {
        console.error("Error parsing saved subjects:", error);
      }
    } else {
      // Default subjects if none saved
      const defaultSubjects = [
        { name: "Biology", isFavorite: false },
        { name: "Chemistry", isFavorite: false },
        { name: "Physics", isFavorite: false },
        { name: "Mathematics", isFavorite: false },
        { name: "ICT", isFavorite: false },
        { name: "English", isFavorite: false },
      ];
      setSubjects(defaultSubjects);
      localStorage.setItem("alSubjects", JSON.stringify(defaultSubjects));
    }
  };

  // Add new subject
  const addNewSubject = () => {
    if (newSubjectName.trim() !== "" && !subjects.find(s => s.name.toLowerCase() === newSubjectName.trim().toLowerCase())) {
      const newSubjects = [...subjects, { 
        name: newSubjectName.trim(), 
        isFavorite: false 
      }];
      setSubjects(newSubjects);
      localStorage.setItem("alSubjects", JSON.stringify(newSubjects));
      setNewSubjectName("");
      setShowAddSubjectDialog(false);
      toast({
        title: "Subject Added",
        description: `${newSubjectName.trim()} has been added to your subjects list.`,
      });
    } else {
      toast({
        title: "Error",
        description: "Subject already exists or name is empty.",
        variant: "destructive",
      });
    }
  };

  // Get unique subjects from marks data
  const getSubjectsWithMarks = () => {
    const subjectsWithMarks = [...new Set(marksData.map(item => item.subject))];
    return subjectsWithMarks.filter(subject => subject); // Remove any undefined/null subjects
  };

  useEffect(() => {
    // Load data from localStorage
    const savedData = JSON.parse(localStorage.getItem("alMarksData") || "[]");
    setMarksData(savedData);
    setFilteredData(savedData);
    
    // Load subjects (for adding new subjects, but filter will show only subjects with marks)
    loadSubjects();
  }, []);

  useEffect(() => {
    // Filter data based on selected subject and date range
    let filtered = marksData;
    
    if (selectedSubject !== "all") {
      filtered = filtered.filter(item => 
        item.subject && item.subject.toLowerCase() === selectedSubject.toLowerCase()
      );
    }

    // Add date filtering logic here based on dateRange
    setFilteredData(filtered);
  }, [marksData, selectedSubject, dateRange]);

  const exportData = () => {
    const dataStr = JSON.stringify(marksData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'al-marks-data.json';
    link.click();
    
    toast({
      title: "Data Exported",
      description: "Your marks data has been downloaded as JSON file.",
    });
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        localStorage.setItem("alMarksData", JSON.stringify(importedData));
        setMarksData(importedData);
        
        toast({
          title: "Data Imported",
          description: "Your marks data has been imported successfully.",
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Invalid file format. Please select a valid JSON file.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const deletePaper = (indexToDelete: number) => {
    const paperToDelete = filteredData.slice(-5).reverse()[indexToDelete];
    const originalIndex = marksData.findIndex(item => 
      item.subject === paperToDelete.subject && 
      item.paperName === paperToDelete.paperName && 
      item.date === paperToDelete.date && 
      item.total === paperToDelete.total
    );
    
    if (originalIndex !== -1) {
      const updatedData = marksData.filter((_, index) => index !== originalIndex);
      localStorage.setItem("alMarksData", JSON.stringify(updatedData));
      setMarksData(updatedData);
      
      toast({
        title: language === "en" ? "Paper Deleted" : "ප්‍රශ්න පත්‍රය මකන ලදී",
        description: language === "en" ? "The paper has been removed from your records." : "ප්‍රශ්න පත්‍රය ඔබේ වාර්තාවලින් ඉවත් කර ඇත.",
      });
    }
  };

  const calculateStats = () => {
    const totalPapers = filteredData.length;
    const totalMarks = filteredData.reduce((sum, item) => sum + (item.total || 0), 0);
    const averageMarks = totalPapers > 0 ? (totalMarks / totalPapers).toFixed(1) : 0;
    
    return { totalPapers, totalMarks, averageMarks };
  };

  const { totalPapers, totalMarks, averageMarks } = calculateStats();

  // Prepare chart data
  const prepareChartData = () => {
    if (filteredData.length === 0) return [];
    
    // Group data by date for trend analysis
    const groupedByDate = filteredData.reduce((acc: any, item) => {
      const date = item.date;
      if (!acc[date]) {
        acc[date] = { date, papers: 0, totalMarks: 0, avgMarks: 0 };
      }
      acc[date].papers += 1;
      acc[date].totalMarks += item.total || 0;
      acc[date].avgMarks = acc[date].totalMarks / acc[date].papers;
      return acc;
    }, {});

    return Object.values(groupedByDate)
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((item: any) => ({
        ...item,
        avgMarks: Math.round(item.avgMarks * 10) / 10
      }));
  };

  const chartData = prepareChartData();

  const chartConfig = {
    avgMarks: {
      label: "Average Marks",
      color: "hsl(var(--primary))",
    },
    papers: {
      label: "Papers Count",
      color: "hsl(var(--secondary))",
    },
  };

  return (
    <div className="px-4 py-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient mb-2">Progress Dashboard</h2>
        <p className="text-muted-foreground">Visualize your academic performance and track your progress</p>
      </div>

      <div className="space-y-6">
        {/* Filters */}
        <Card className="academic-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters & Data Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <div className="flex gap-2">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {getSubjectsWithMarks().map((subject) => (
                      <SelectItem key={subject} value={subject.toLowerCase()}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Refresh marks data to update subject list
                    const savedData = JSON.parse(localStorage.getItem("alMarksData") || "[]");
                    setMarksData(savedData);
                    setFilteredData(savedData);
                  }}
                  className="px-3"
                  title="Refresh subjects with marks"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Subject Management</label>
              <Dialog open={showAddSubjectDialog} onOpenChange={setShowAddSubjectDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Subject
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Subject</DialogTitle>
                    <DialogDescription>
                      Add a new subject to your subjects list for better organization.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Subject Name</label>
                      <Input
                        placeholder="Enter subject name..."
                        value={newSubjectName}
                        onChange={(e) => setNewSubjectName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addNewSubject()}
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setShowAddSubjectDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addNewSubject}>
                        Add Subject
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Data Export</label>
              <Button onClick={exportData} variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium mb-2 block">Data Import</label>
            <label className="w-full">
              <Button variant="outline" className="w-full cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Import Data
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="academic-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Papers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{totalPapers}</div>
            <p className="text-sm text-muted-foreground">Papers completed</p>
          </CardContent>
        </Card>

        <Card className="academic-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Marks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{totalMarks}</div>
            <p className="text-sm text-muted-foreground">Marks obtained</p>
          </CardContent>
        </Card>

        <Card className="academic-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{averageMarks}</div>
            <p className="text-sm text-muted-foreground">Average marks per paper</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Chart */}
      <Card className="academic-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Progress Chart</span>
          </CardTitle>
          <CardDescription>Track your performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-80">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="avgMarks" 
                  stroke="var(--color-avgMarks)" 
                  strokeWidth={2}
                  dot={{ fill: "var(--color-avgMarks)" }}
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="h-80 flex items-center justify-center border-2 border-dashed border-primary/20 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-primary/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground">No Data Yet</h3>
                <p className="text-sm text-muted-foreground">Add some marks to see your progress chart</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Papers */}
      <Card className="academic-card">
        <CardHeader>
          <CardTitle>Recent Papers</CardTitle>
          <CardDescription>Your latest paper submissions</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredData.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No papers found. Start adding your marks to see progress!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredData.slice(-5).reverse().map((paper, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors group">
                  <div className="flex-1">
                    <h4 className="font-semibold capitalize">{paper.subject}</h4>
                    <p className="text-sm text-muted-foreground">{paper.paperName} - {paper.date}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{paper.total}</div>
                      <div className="text-xs text-muted-foreground">
                        {language === "en" ? "marks" : "ලකුණු"}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deletePaper(index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default Dashboard;