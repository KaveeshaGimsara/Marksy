import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Calendar, Filter, Download, Upload, Trash2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { DashboardProps } from "@/types";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";

const Dashboard = ({ language }: DashboardProps) => {
  const { toast } = useToast();
  const [marksData, setMarksData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [dateRange, setDateRange] = useState("all");

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
    
    // Calculate Z-Score statistics
    const marks = filteredData.map(item => item.total || 0);
    const mean = marks.length > 0 ? marks.reduce((sum, mark) => sum + mark, 0) / marks.length : 0;
    const variance = marks.length > 0 ? marks.reduce((sum, mark) => sum + Math.pow(mark - mean, 2), 0) / marks.length : 0;
    const standardDeviation = Math.sqrt(variance);
    
    // Calculate Z-Scores for each entry
    const zScores = marks.map(mark => standardDeviation > 0 ? (mark - mean) / standardDeviation : 0);
    const averageZScore = zScores.length > 0 ? zScores.reduce((sum, z) => sum + z, 0) / zScores.length : 0;
    const maxZScore = zScores.length > 0 ? Math.max(...zScores) : 0;
    const minZScore = zScores.length > 0 ? Math.min(...zScores) : 0;
    
    // Performance classification based on Z-Score
    const aboveAverage = zScores.filter(z => z > 0).length;
    const belowAverage = zScores.filter(z => z < 0).length;
    const atAverage = zScores.filter(z => z === 0).length;
    
    return { 
      totalPapers, 
      totalMarks, 
      averageMarks,
      mean: mean.toFixed(1),
      standardDeviation: standardDeviation.toFixed(1),
      averageZScore: averageZScore.toFixed(2),
      maxZScore: maxZScore.toFixed(2),
      minZScore: minZScore.toFixed(2),
      aboveAverage,
      belowAverage,
      atAverage
    };
  };

  const { 
    totalPapers, 
    totalMarks, 
    averageMarks,
    mean,
    standardDeviation,
    averageZScore,
    maxZScore,
    minZScore,
    aboveAverage,
    belowAverage,
    atAverage
  } = calculateStats();

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Data Export</label>
                <Button onClick={exportData} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
              
              <div>
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
            </div>
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
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalPapers}</div>
            <p className="text-sm text-muted-foreground">Papers completed</p>
          </CardContent>
        </Card>

        <Card className="academic-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Marks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{totalMarks}</div>
            <p className="text-sm text-muted-foreground">Marks obtained</p>
          </CardContent>
        </Card>

        <Card className="academic-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{averageMarks}</div>
            <p className="text-sm text-muted-foreground">Average marks per paper</p>
          </CardContent>
        </Card>
      </div>

      {/* Z-Score Statistics */}
      {totalPapers > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="academic-card border-orange-200 dark:border-orange-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                Z-Score Average
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{averageZScore}</div>
              <p className="text-xs text-muted-foreground">Performance vs. average</p>
            </CardContent>
          </Card>

          <Card className="academic-card border-emerald-200 dark:border-emerald-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-emerald-500" />
                Best Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{maxZScore}</div>
              <p className="text-xs text-muted-foreground">Highest Z-Score achieved</p>
            </CardContent>
          </Card>

          <Card className="academic-card border-red-200 dark:border-red-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4 text-red-500" />
                Standard Deviation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{standardDeviation}</div>
              <p className="text-xs text-muted-foreground">Score consistency</p>
            </CardContent>
          </Card>

          <Card className="academic-card border-indigo-200 dark:border-indigo-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-500" />
                Above Average
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{aboveAverage}</div>
              <p className="text-xs text-muted-foreground">Papers above mean</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Trend Chart */}
        <Card className="academic-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Progress Trend</span>
            </CardTitle>
            <CardDescription>Track your performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-80">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="avgMarks" 
                    stroke="url(#gradientLine)"
                    strokeWidth={3}
                    dot={{ fill: "var(--color-avgMarks)", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "var(--color-avgMarks)", strokeWidth: 2 }}
                  />
                  <defs>
                    <linearGradient id="gradientLine" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="50%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                  </defs>
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

        {/* Subject Performance Bar Chart */}
        <Card className="academic-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Subject Performance</span>
            </CardTitle>
            <CardDescription>Average performance by subject</CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const subjectData = getSubjectsWithMarks().map(subject => {
                const subjectMarks = filteredData.filter(item => 
                  item.subject && item.subject.toLowerCase() === subject.toLowerCase()
                );
                const avgMark = subjectMarks.length > 0 
                  ? subjectMarks.reduce((sum, item) => sum + (item.total || 0), 0) / subjectMarks.length 
                  : 0;
                return {
                  subject: subject.length > 8 ? subject.substring(0, 8) + '...' : subject,
                  fullSubject: subject,
                  avgMark: Math.round(avgMark * 10) / 10,
                  count: subjectMarks.length
                };
              });

              return subjectData.length > 0 ? (
                <ChartContainer config={{
                  avgMark: {
                    label: "Average Marks",
                    color: "hsl(var(--primary))",
                  }
                }} className="h-80">
                  <BarChart data={subjectData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis 
                      dataKey="subject" 
                      tick={{ fontSize: 10 }}
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <ChartTooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background p-3 border rounded-lg shadow-lg">
                              <p className="font-medium">{data.fullSubject}</p>
                              <p className="text-sm text-muted-foreground">
                                Average: {data.avgMark} marks
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Papers: {data.count}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="avgMark" 
                      fill="url(#gradientBar)"
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="gradientBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="50%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#EC4899" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="h-80 flex items-center justify-center border-2 border-dashed border-primary/20 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-16 w-16 text-primary/50 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground">No Subject Data</h3>
                    <p className="text-sm text-muted-foreground">Add marks for different subjects to see comparison</p>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>

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