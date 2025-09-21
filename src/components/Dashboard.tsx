import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Calendar, Filter, Download, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { DashboardProps } from "@/types";

const Dashboard = ({ language }: DashboardProps) => {
  const { toast } = useToast();
  const [marksData, setMarksData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  useEffect(() => {
    // Load data from localStorage
    const savedData = JSON.parse(localStorage.getItem("alMarksData") || "[]");
    setMarksData(savedData);
    setFilteredData(savedData);
  }, []);

  useEffect(() => {
    // Filter data based on selected subject and date range
    let filtered = marksData;
    
    if (selectedSubject !== "all") {
      filtered = filtered.filter(item => item.subject === selectedSubject);
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

  const calculateStats = () => {
    const totalPapers = filteredData.length;
    const totalMarks = filteredData.reduce((sum, item) => sum + (item.total || 0), 0);
    const averageMarks = totalPapers > 0 ? (totalMarks / totalPapers).toFixed(1) : 0;
    
    return { totalPapers, totalMarks, averageMarks };
  };

  const { totalPapers, totalMarks, averageMarks } = calculateStats();

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gradient mb-2">Progress Dashboard</h2>
        <p className="text-muted-foreground">Visualize your academic performance and track your progress</p>
      </div>

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
              <label className="text-sm font-medium">Subject</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="biology">Biology</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Date Range</label>
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

            <Button onClick={exportData} variant="outline" className="mt-5">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>

            <label className="mt-5">
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

      {/* Chart Placeholder */}
      <Card className="academic-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Progress Chart</span>
          </CardTitle>
          <CardDescription>Track your performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center border-2 border-dashed border-primary/20 rounded-lg">
            <div className="text-center">
              <TrendingUp className="h-16 w-16 text-primary/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground">Chart Coming Soon</h3>
              <p className="text-sm text-muted-foreground">Interactive charts will be displayed here</p>
            </div>
          </div>
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
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <h4 className="font-semibold capitalize">{paper.subject}</h4>
                    <p className="text-sm text-muted-foreground">{paper.paperName} - {paper.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{paper.total}</div>
                    <div className="text-xs text-muted-foreground">marks</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;