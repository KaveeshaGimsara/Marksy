import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ScatterChart, Scatter, ComposedChart
} from 'recharts';
import { 
  BookOpen, Award, TrendingUp, PieChart as PieChartIcon, 
  BarChart2, Activity, RefreshCw, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Sample data - in a real app this would come from an API or database
const generateData = () => {
  const subjects = ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'ICT', 'English'];
  const months = ['January', 'February', 'March', 'April', 'May'];
  
  // Progress data for line/area charts
  const progressData = months.map(month => {
    const obj: any = { month };
    subjects.forEach(subject => {
      obj[subject] = Math.floor(65 + Math.random() * 35); // Scores between 65-100
    });
    return obj;
  });
  
  // Performance data for radar chart
  const performanceData = subjects.map(subject => ({
    subject,
    A: Math.floor(70 + Math.random() * 30),
    fullMark: 100,
  }));
  
  // Grade distribution for pie chart
  const gradeDistribution = [
    { name: 'A', value: 35, color: '#4f46e5' },
    { name: 'B', value: 25, color: '#3b82f6' },
    { name: 'C', value: 20, color: '#06b6d4' },
    { name: 'S', value: 15, color: '#10b981' },
    { name: 'F', value: 5, color: '#ef4444' }
  ];
  
  // Subject comparison for bar chart
  const subjectComparison = subjects.map(subject => ({
    subject,
    "Your Score": 65 + Math.floor(Math.random() * 25),
    "Class Average": 60 + Math.floor(Math.random() * 20),
  }));
  
  // Strength & Weakness data for composed chart
  const strengthData = subjects.map(subject => ({
    subject,
    score: 60 + Math.floor(Math.random() * 40),
    improvement: Math.floor(Math.random() * 15),
    target: 85 + Math.floor(Math.random() * 15),
  }));
  
  // Scatter data for correlation chart
  const scatterData = Array(30).fill(0).map((_, i) => ({
    studyHours: 1 + Math.floor(Math.random() * 9),
    score: 50 + Math.floor(Math.random() * 50),
    name: `Student ${i+1}`
  }));
  
  return {
    progressData,
    performanceData,
    gradeDistribution,
    subjectComparison,
    strengthData,
    scatterData
  };
};

const SubjectAnalysisPage = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedSubject, setSelectedSubject] = useState('all');
  
  // Generate mock data - would be fetched from API in real app
  const [data, setData] = useState(generateData());
  
  // Refresh data when time range or subject changes
  useEffect(() => {
    setData(generateData());
  }, [timeRange, selectedSubject]);
  
  const handleExportData = () => {
    // In a real app, this would generate and download a PDF or CSV
    alert('Exporting data... (This would download a report in a real application)');
  };
  
  // Chart color schemes
  const chartColors = isDark 
    ? ['#818cf8', '#a78bfa', '#c084fc', '#f472b6', '#fb7185', '#34d399'] 
    : ['#4f46e5', '#7c3aed', '#9333ea', '#db2777', '#e11d48', '#10b981'];
  
  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-slate-900' : 'bg-blue-50'}`}>
      <main className="flex-grow container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
            {t("analysis.title") || "Subject Analysis Dashboard"}
          </h1>
          <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {t("analysis.subtitle") || "Comprehensive insights into your academic performance"}
          </p>
        </header>
        
        {/* Controls section */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-3 items-center">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className={`w-[180px] ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200'}`}>
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last month</SelectItem>
                <SelectItem value="3months">Last 3 months</SelectItem>
                <SelectItem value="6months">Last 6 months</SelectItem>
                <SelectItem value="1year">Last year</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className={`w-[180px] ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200'}`}>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="physics">Physics</SelectItem>
                <SelectItem value="chemistry">Chemistry</SelectItem>
                <SelectItem value="biology">Biology</SelectItem>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="ict">ICT</SelectItem>
                <SelectItem value="english">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setData(generateData())}
              className={`${isDark ? 'border-slate-700 bg-slate-800 text-slate-200' : 'border-slate-200 bg-white'}`}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("analysis.refresh") || "Refresh Data"}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportData}
              className={`${isDark ? 'border-slate-700 bg-slate-800 text-slate-200' : 'border-slate-200 bg-white'}`}
            >
              <Download className="h-4 w-4 mr-2" />
              {t("analysis.export") || "Export Report"}
            </Button>
          </div>
        </div>
        
        {/* Main dashboard content */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className={`grid grid-cols-4 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <TabsTrigger value="overview" className="data-[state=active]:shadow-lg">
              <Activity className="h-4 w-4 mr-2" />
              {t("analysis.overview") || "Overview"}
            </TabsTrigger>
            <TabsTrigger value="trends">
              <TrendingUp className="h-4 w-4 mr-2" />
              {t("analysis.trends") || "Progress Trends"}
            </TabsTrigger>
            <TabsTrigger value="comparison">
              <BarChart2 className="h-4 w-4 mr-2" />
              {t("analysis.comparison") || "Comparison"}
            </TabsTrigger>
            <TabsTrigger value="performance">
              <Award className="h-4 w-4 mr-2" />
              {t("analysis.performance") || "Performance"}
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {[
                {
                  title: "Average Score",
                  value: "83%",
                  change: "+5.2%",
                  icon: Award,
                  color: "text-blue-500"
                },
                {
                  title: "Most Improved",
                  value: "Physics",
                  change: "+12.8%",
                  icon: TrendingUp,
                  color: "text-purple-500"
                },
                {
                  title: "Highest Grade",
                  value: "A",
                  change: "Mathematics",
                  icon: BookOpen,
                  color: "text-green-500"
                },
                {
                  title: "Needs Attention",
                  value: "Chemistry",
                  change: "68%",
                  icon: Activity,
                  color: "text-amber-500"
                }
              ].map((card, index) => (
                <Card key={index} className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <CardContent className="flex justify-between items-center p-6">
                    <div className="space-y-1">
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{card.title}</p>
                      <p className="text-2xl font-bold text-slate-700 dark:text-slate-200">{card.value}</p>
                      <p className={`text-xs ${card.change.includes('+') ? 'text-emerald-500' : 'text-amber-500'}`}>{card.change}</p>
                    </div>
                    <div className={`rounded-full p-3 ${isDark ? 'bg-slate-700/50' : 'bg-slate-100/80'}`}>
                      <card.icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Main Overview Chart - Line */}
            <Card className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{t("analysis.overviewChart") || "Subject Performance Over Time"}</span>
                  <PieChartIcon className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.progressData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} />
                      <XAxis dataKey="month" stroke={isDark ? "#94a3b8" : "#64748b"} />
                      <YAxis stroke={isDark ? "#94a3b8" : "#64748b"} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: isDark ? '#1e293b' : '#ffffff',
                          borderColor: isDark ? '#334155' : '#e2e8f0',
                          color: isDark ? '#f8fafc' : '#0f172a'
                        }}
                      />
                      <Legend />
                      {['Physics', 'Chemistry', 'Biology', 'Mathematics', 'ICT', 'English'].map((subject, index) => (
                        <Line 
                          key={subject}
                          type="monotone" 
                          dataKey={subject} 
                          stroke={chartColors[index % chartColors.length]} 
                          strokeWidth={2}
                          activeDot={{ r: 6 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Additional Overview Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Radar Chart - Subject Strengths */}
              <Card className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <CardHeader>
                  <CardTitle>{t("analysis.strengthsRadar") || "Subject Strengths"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius="70%" data={data.performanceData}>
                        <PolarGrid stroke={isDark ? "#334155" : "#e2e8f0"} />
                        <PolarAngleAxis dataKey="subject" stroke={isDark ? "#94a3b8" : "#64748b"} />
                        <PolarRadiusAxis stroke={isDark ? "#94a3b8" : "#64748b"} />
                        <Radar 
                          name="Current Level" 
                          dataKey="A" 
                          stroke={isDark ? "#818cf8" : "#4f46e5"} 
                          fill={isDark ? "#818cf880" : "#4f46e540"} 
                          fillOpacity={0.6} 
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: isDark ? '#1e293b' : '#ffffff',
                            borderColor: isDark ? '#334155' : '#e2e8f0',
                          }}
                        />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Pie Chart - Grade Distribution */}
              <Card className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <CardHeader>
                  <CardTitle>{t("analysis.gradeDistribution") || "Grade Distribution"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.gradeDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={90}
                          fill="#8884d8"
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {data.gradeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} students`, 'Count']}
                          contentStyle={{ 
                            backgroundColor: isDark ? '#1e293b' : '#ffffff',
                            borderColor: isDark ? '#334155' : '#e2e8f0',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Progress Trends Tab */}
          <TabsContent value="trends" className="space-y-4">
            <Card className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <CardHeader>
                <CardTitle>{t("analysis.progressTrend") || "Progress Trend Analysis"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.progressData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} />
                      <XAxis dataKey="month" stroke={isDark ? "#94a3b8" : "#64748b"} />
                      <YAxis stroke={isDark ? "#94a3b8" : "#64748b"} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: isDark ? '#1e293b' : '#ffffff',
                          borderColor: isDark ? '#334155' : '#e2e8f0',
                        }}
                      />
                      <Legend />
                      {['Physics', 'Chemistry', 'Biology'].map((subject, index) => (
                        <Area
                          key={subject}
                          type="monotone"
                          dataKey={subject}
                          stackId="1"
                          stroke={chartColors[index % chartColors.length]}
                          fill={`${chartColors[index % chartColors.length]}80`}
                        />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Learning vs Performance */}
            <Card className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <CardHeader>
                <CardTitle>{t("analysis.studyCorrelation") || "Study Hours vs. Performance"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} />
                      <XAxis 
                        type="number" 
                        dataKey="studyHours" 
                        name="Study Hours" 
                        unit="h"
                        stroke={isDark ? "#94a3b8" : "#64748b"} 
                        label={{ value: 'Study Hours (per day)', position: 'bottom' }}
                      />
                      <YAxis 
                        type="number" 
                        dataKey="score" 
                        name="Score" 
                        unit="%" 
                        stroke={isDark ? "#94a3b8" : "#64748b"}
                        label={{ value: 'Test Score', angle: -90, position: 'left' }}
                      />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        contentStyle={{ 
                          backgroundColor: isDark ? '#1e293b' : '#ffffff',
                          borderColor: isDark ? '#334155' : '#e2e8f0',
                        }}
                        formatter={(value, name, props) => [`${value} ${props.unit}`, name]}
                      />
                      <Scatter 
                        name="Students" 
                        data={data.scatterData} 
                        fill={isDark ? "#818cf8" : "#4f46e5"} 
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-4">
            <Card className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <CardHeader>
                <CardTitle>{t("analysis.subjectComparison") || "Subject Performance Comparison"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.subjectComparison} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} />
                      <XAxis dataKey="subject" stroke={isDark ? "#94a3b8" : "#64748b"} />
                      <YAxis stroke={isDark ? "#94a3b8" : "#64748b"} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: isDark ? '#1e293b' : '#ffffff',
                          borderColor: isDark ? '#334155' : '#e2e8f0',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="Your Score" fill={isDark ? "#818cf8" : "#4f46e5"} barSize={30} />
                      <Bar dataKey="Class Average" fill={isDark ? "#fb7185" : "#e11d48"} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <CardHeader>
                <CardTitle>{t("analysis.progressTarget") || "Progress vs Targets"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data.strengthData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid stroke={isDark ? "#334155" : "#e2e8f0"} />
                      <XAxis dataKey="subject" stroke={isDark ? "#94a3b8" : "#64748b"} />
                      <YAxis stroke={isDark ? "#94a3b8" : "#64748b"} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: isDark ? '#1e293b' : '#ffffff',
                          borderColor: isDark ? '#334155' : '#e2e8f0',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="score" fill={isDark ? "#818cf8" : "#4f46e5"} barSize={20} />
                      <Line type="monotone" dataKey="target" stroke={isDark ? "#fb7185" : "#e11d48"} strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <CardHeader>
                  <CardTitle>{t("analysis.strengthsWeaknesses") || "Strengths & Weaknesses"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius="70%" data={data.performanceData}>
                        <PolarGrid stroke={isDark ? "#334155" : "#e2e8f0"} />
                        <PolarAngleAxis dataKey="subject" stroke={isDark ? "#94a3b8" : "#64748b"} />
                        <PolarRadiusAxis stroke={isDark ? "#94a3b8" : "#64748b"} />
                        <Radar 
                          name="Current Level" 
                          dataKey="A" 
                          stroke={isDark ? "#818cf8" : "#4f46e5"} 
                          fill={isDark ? "#818cf880" : "#4f46e540"} 
                          fillOpacity={0.6} 
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: isDark ? '#1e293b' : '#ffffff',
                            borderColor: isDark ? '#334155' : '#e2e8f0',
                          }}
                        />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <CardHeader>
                  <CardTitle>{t("analysis.gradeDistribution") || "Grade Distribution"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.gradeDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          fill="#8884d8"
                          paddingAngle={2}
                          dataKey="value"
                          label
                        >
                          {data.gradeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: isDark ? '#1e293b' : '#ffffff',
                            borderColor: isDark ? '#334155' : '#e2e8f0',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <CardHeader>
                <CardTitle>{t("analysis.subjectMastery") || "Subject Mastery Level"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.strengthData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} />
                      <XAxis dataKey="subject" stroke={isDark ? "#94a3b8" : "#64748b"} />
                      <YAxis stroke={isDark ? "#94a3b8" : "#64748b"} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: isDark ? '#1e293b' : '#ffffff',
                          borderColor: isDark ? '#334155' : '#e2e8f0',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="score" name="Mastery Level" fill={isDark ? "#818cf8" : "#4f46e5"}>
                        {data.strengthData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`}
                            fill={entry.score > 80 ? '#10b981' : entry.score > 65 ? '#3b82f6' : '#f59e0b'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SubjectAnalysisPage;
