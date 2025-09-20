import { useState, useEffect, useRef, useMemo } from "react";
import { BarChart3, Calendar, Filter, Download, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
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

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Dynamic subject options (includes any newly added subjects)
  const subjectOptions = useMemo(() => {
    const customSubjects: Array<{id:string;name:string;type:string}> =
      JSON.parse(localStorage.getItem('customSubjects') || '[]');
    const customMap = Object.fromEntries(customSubjects.map(s => [s.id.toLowerCase(), s.name]));

    const ids = new Set(
      marksData
        .map(m => String(m.subject).trim().toLowerCase())
        .filter(Boolean)
    );

    return Array.from(ids)
      .sort()
      .map(id => ({
        id,
        label: customMap[id] ||
          id.replace(/[-_]/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase())
      }));
  }, [marksData]);

  // If current selected subject disappears (e.g. after import), reset to 'all'
  useEffect(() => {
    if (
      selectedSubject !== 'all' &&
      !marksData.some(m => String(m.subject).trim().toLowerCase() === selectedSubject)
    ) {
      setSelectedSubject('all');
    }
  }, [marksData, selectedSubject]);

  useEffect(() => {
    // Filter data based on selected subject and date range
    let filtered = marksData;
    
    if (selectedSubject !== "all") {
      filtered = filtered.filter(
        item => String(item.subject).trim().toLowerCase() === selectedSubject
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

  interface MarksData {
    id: string;
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

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Basic file type/name check
    if (!file.name.toLowerCase().endsWith('.json') && !file.type.includes('json')) {
      toast({
        title: "Import Failed",
        description: "Please select a valid JSON file (with .json extension)",
        variant: "destructive",
      });
      // clear input so user can re-select same file if needed
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(String(e.target?.result || ''));

        // Validate array structure
        if (!Array.isArray(importedData)) {
          throw new Error('Invalid data format: Expected an array of marks');
        }

        // Validate and clean each entry
        const validatedData: MarksData[] = importedData.map((mark: any) => {
          // Check required fields
          if (!mark.subject || !mark.paperName || !mark.date || typeof mark.total !== 'number') {
            throw new Error('Invalid data: Each mark entry must have subject, paperName, date, and total');
          }

          // Return cleaned and validated entry
          return {
            id: mark.id || Date.now().toString(),
            subject: mark.subject,
            paperType: mark.paperType || undefined,
            mcq: typeof mark.mcq === 'number' ? mark.mcq : undefined,
            seq: typeof mark.seq === 'number' ? mark.seq : undefined,
            essay: typeof mark.essay === 'number' ? mark.essay : undefined,
            date: mark.date,
            paperName: mark.paperName,
            tutor: mark.tutor || "",
            total: mark.total
          };
        });

        // Update both local storage and state
        localStorage.setItem("alMarksData", JSON.stringify(validatedData));
        setMarksData(validatedData);
        setFilteredData(validatedData); // Update filtered data as well
        
        toast({
          title: "Data Imported Successfully",
          description: `Imported ${validatedData.length} marks entries.`,
        });
      } catch (error) {
        console.error('Import error:', error);
        toast({
          title: "Import Failed",
          description: error instanceof Error ? error.message : "Invalid file format. Please select a valid marks data file.",
          variant: "destructive",
        });
      } finally {
        // clear the file input so the same file can be selected again if desired
        try { input.value = ''; } catch {}
      }
    };

    reader.onerror = () => {
      toast({
        title: "Import Failed",
        description: "Error reading the file. Please try again.",
        variant: "destructive",
      });
      try { input.value = ''; } catch {}
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

  // Prepare chart data
  const prepareChartData = () => {
    const sortedData = [...filteredData].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const dates = sortedData.map(item => new Date(item.date).toLocaleDateString());
    const marks = sortedData.map(item => item.total);
    const movingAverage = marks.map((_, index) => {
      const start = Math.max(0, index - 4);
      const slice = marks.slice(start, index + 1);
      return slice.reduce((sum, val) => sum + val, 0) / slice.length;
    });

    return {
      labels: dates,
      datasets: [
        {
          label: 'Total Marks',
          data: marks,
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.5)',
          tension: 0.2
        },
        {
          label: '5-Paper Moving Average',
          data: movingAverage,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
          tension: 0.4,
          borderDashOffset: 0,
          borderDash: [5, 5]
        }
      ]
    };
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxTicksLimit: 10,
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        suggestedMin: 0,
        suggestedMax: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      }
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Light mode toggle removed site-wide */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gradient mb-2">Progress Dashboard</h2>
        <p className="text-muted-foreground">Visualize your academic performance and track your progress</p>
      </div>
      {/* Filters */}
      <Card className="academic-card">
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters & Data Management</span>
          </CardTitle>
          <CardDescription>Subject filters and data backup/restore options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Subject</label>
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjectOptions.length === 0 && (
                    <div className="px-3 py-2 text-xs text-muted-foreground">
                      No subjects yet
                    </div>
                  )}
                  {subjectOptions.map(s => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1.5">
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

            <Button 
              onClick={exportData} 
              variant="outline" 
              className="flex justify-center items-center gap-2 h-10 sm:mt-6"
            >
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </Button>

            <div className="sm:mt-6">
              <Button
                variant="outline"
                className="w-full flex justify-center items-center gap-2 h-10"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" />
                <span>Import Data</span>
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards - improved responsiveness */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
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

      {/* Progress Chart - improved responsiveness */}
      <Card className="academic-card">
        <CardHeader className="pb-4 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <CardTitle>Progress Chart</CardTitle>
            </div>
            <CardDescription className="mt-1 sm:mt-0">Track your performance over time</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {filteredData.length === 0 ? (
            <div className="h-96 flex items-center justify-center border-2 border-dashed border-primary/20 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-primary/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground">No Data Available</h3>
                <p className="text-sm text-muted-foreground">Add marks to see your progress chart</p>
              </div>
            </div>
          ) : (
            <div className="h-96 w-full">
              <Line 
                data={prepareChartData()} 
                options={chartOptions}
                className="w-full h-full"
              />
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