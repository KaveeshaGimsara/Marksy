import { useState, useEffect } from "react";
import { Trophy, Target, Award, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SubjectAnalysis = () => {
  const [marksData, setMarksData] = useState<any[]>([]);

  useEffect(() => {
    // Ensure we properly load data from localStorage
    try {
      const savedData = JSON.parse(localStorage.getItem("alMarksData") || "[]");
      setMarksData(Array.isArray(savedData) ? savedData : []);
    } catch (error) {
      console.error("Error loading marks data:", error);
      setMarksData([]);
    }
  }, []);

  const getGrade = (total: number) => {
    // Assuming maximum mark is 100 for percentage calculation
    const percentage = (total / 100) * 100;
    if (percentage >= 75) return 'A';
    if (percentage >= 65) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'S';
    return 'F';
  };

  const getGradeDistribution = () => {
    // Group by subject first, then calculate grades
    const subjectGrades: Record<string, { A: number, B: number, C: number, S: number, F: number }> = {};
    
    marksData.forEach(paper => {
      const subject = String(paper.subject || "").toLowerCase();
      if (!subject) return;
      
      if (!subjectGrades[subject]) {
        subjectGrades[subject] = { A: 0, B: 0, C: 0, S: 0, F: 0 };
      }
      
      const percentage = (paper.total / 100) * 100;
      if (percentage >= 75) subjectGrades[subject].A++;
      else if (percentage >= 65) subjectGrades[subject].B++;
      else if (percentage >= 50) subjectGrades[subject].C++;
      else if (percentage >= 40) subjectGrades[subject].S++;
      else subjectGrades[subject].F++;
    });
    
    // Total across all subjects
    const totals = { A: 0, B: 0, C: 0, S: 0, F: 0 };
    Object.values(subjectGrades).forEach(grades => {
      totals.A += grades.A;
      totals.B += grades.B;
      totals.C += grades.C;
      totals.S += grades.S;
      totals.F += grades.F;
    });
    
    return {
      total: totals,
      bySubject: subjectGrades
    };
  };

  const getSubjectStats = () => {
    // Get subject stats with improved error handling
    try {
      const favoriteSubjects: string[] = JSON.parse(localStorage.getItem('favoriteSubjects') || '[]');
      const customSubjects: Array<{id:string;name:string;type:string}> = 
        JSON.parse(localStorage.getItem('customSubjects') || '[]');
      const customIds = customSubjects.map(s => s.id.toLowerCase());
      
      const fromMarks = Array.from(
        new Set(marksData.map(p => String(p.subject || "").toLowerCase()).filter(Boolean))
      );
      
      const subjects = Array.from(new Set([...fromMarks, ...favoriteSubjects, ...customIds])).filter(Boolean);
      
      return subjects.map(subject => {
        const subjectPapers = marksData.filter(paper => 
          String(paper.subject || "").toLowerCase() === subject
        );
        
        const totalPapers = subjectPapers.length;
        if (totalPapers === 0) return null;
        
        const totalMarks = subjectPapers.reduce((sum, paper) => sum + (paper.total || 0), 0);
        const averageMarks = totalPapers > 0 ? (totalMarks / totalPapers).toFixed(1) : "0";
        const bestScore = Math.max(...subjectPapers.map(p => p.total || 0), 0);
        const avgGrade = totalPapers > 0 ? getGrade(Number(averageMarks)) : 'N/A';
        
        const customMatch = customSubjects.find(s => s.id.toLowerCase() === subject);
        const displayName = customMatch ? customMatch.name : 
          subject.charAt(0).toUpperCase() + subject.slice(1);
        
        return { subject: displayName, totalPapers, averageMarks, bestScore, totalMarks, avgGrade };
      }).filter(Boolean);
    } catch (error) {
      console.error("Error calculating subject stats:", error);
      return [];
    }
  };

  const subjectStats = getSubjectStats();
  const gradeDistribution = getGradeDistribution();

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gradient mb-2">Subject Analysis & Goals</h2>
        <p className="text-muted-foreground">Detailed insights into your performance</p>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
        <Card className="academic-card">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Papers</p>
                <p className="text-lg sm:text-xl font-bold">{marksData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="academic-card">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Marks</p>
                <p className="text-lg sm:text-xl font-bold">{marksData.reduce((s,p)=>s+(p.total || 0),0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="academic-card">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-warning" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">A Grades</p>
                <p className="text-lg sm:text-xl font-bold">{gradeDistribution.total.A}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="academic-card">
          <CardContent className="p-3 sm:p-4 text-sm">
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">Grade Spread</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(gradeDistribution.total).map(([g,c])=>(
                <span key={g} className="px-2 py-1 rounded-md bg-muted/40">
                  {g}:{c}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Performance */}
      <Card className="academic-card">
        <CardHeader className="pb-2 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <CardTitle>Subject Performance</CardTitle>
            <CardDescription className="mt-1 sm:mt-0">Breakdown by subject</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {subjectStats.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No data yet. Add marks to see analysis.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {subjectStats.map((stat, i) => (
                <div key={i} className="p-3 sm:p-4 border rounded-lg space-y-2">
                  <h3 className="font-semibold text-base sm:text-lg">{stat.subject}</h3>
                  <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div><p className="text-muted-foreground">Papers</p><p className="font-semibold">{stat.totalPapers}</p></div>
                    <div><p className="text-muted-foreground">Average</p><p className="font-semibold">{stat.averageMarks}</p></div>
                    <div><p className="text-muted-foreground">Best</p><p className="font-semibold text-primary">{stat.bestScore}</p></div>
                    <div><p className="text-muted-foreground">Total</p><p className="font-semibold text-secondary">{stat.totalMarks}</p></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grade Distribution */}
      <Card className="academic-card">
        <CardHeader className="pb-2 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <CardTitle>Grade Distribution</CardTitle>
            <CardDescription className="mt-1 sm:mt-0">Your grades across all subjects</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {marksData.length === 0 ? (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No data yet. Add marks to see grade distribution.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Total grades across all subjects */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">All Subjects</h4>
                <div className="flex gap-3 flex-wrap">
                  {Object.entries(gradeDistribution.total).map(([grade, count]) => (
                    <div key={grade} className="bg-muted/40 rounded-lg px-4 py-2 text-center min-w-[80px]">
                      <div className={`text-2xl font-bold ${
                        grade === 'A' ? 'text-success' : 
                        grade === 'F' ? 'text-destructive' : 
                        'text-primary'
                      }`}>{count}</div>
                      <p className="text-xs text-muted-foreground">{grade} Grade</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Per-subject breakdown */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">By Subject</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(gradeDistribution.bySubject).map(([subject, grades]) => (
                    <div key={subject} className="border rounded-lg p-4">
                      <h5 className="font-medium capitalize mb-2">{subject}</h5>
                      <div className="flex gap-2 flex-wrap">
                        {Object.entries(grades).map(([grade, count]) => 
                          count > 0 ? (
                            <span 
                              key={grade} 
                              className={`px-2 py-1 text-xs rounded ${
                                grade === 'A' ? 'bg-success/20 text-success' : 
                                grade === 'F' ? 'bg-destructive/20 text-destructive' : 
                                'bg-primary/20 text-primary'
                              }`}
                            >
                              {grade}: {count}
                            </span>
                          ) : null
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubjectAnalysis;