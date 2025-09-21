import { useState, useEffect } from "react";
import { Trophy, Target, Award, CheckCircle, Clock, BookOpen, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface TodoItem {
  id: string;
  task: string;
  subject: string;
  completed: boolean;
  createdAt: string;
}

import { SubjectAnalysisProps } from "@/types";

const SubjectAnalysis = ({ language }: SubjectAnalysisProps) => {
  const { toast } = useToast();
  const [marksData, setMarksData] = useState<any[]>([]);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState({ task: "", subject: "" });

  useEffect(() => {
    // Load data from localStorage
    const savedData = JSON.parse(localStorage.getItem("alMarksData") || "[]");
    const savedTodos = JSON.parse(localStorage.getItem("alTodos") || "[]");
    setMarksData(savedData);
    setTodos(savedTodos);
  }, []);

  const getGradeDistribution = () => {
    const grades = { A: 0, B: 0, C: 0, S: 0, F: 0 };
    
    marksData.forEach(paper => {
      const percentage = (paper.total / 300) * 100; // Assuming max 300 marks
      if (percentage >= 75) grades.A++;
      else if (percentage >= 65) grades.B++;
      else if (percentage >= 50) grades.C++;
      else if (percentage >= 40) grades.S++;
      else grades.F++;
    });

    return grades;
  };

  const getSubjectStats = () => {
    const subjects = ["biology", "physics", "chemistry", "english", "mathematics"];
    return subjects.map(subject => {
      const subjectPapers = marksData.filter(paper => paper.subject === subject);
      const totalPapers = subjectPapers.length;
      const totalMarks = subjectPapers.reduce((sum, paper) => sum + paper.total, 0);
      const averageMarks = totalPapers > 0 ? (totalMarks / totalPapers).toFixed(1) : 0;
      const bestScore = Math.max(...subjectPapers.map(p => p.total), 0);
      
      return {
        subject: subject.charAt(0).toUpperCase() + subject.slice(1),
        totalPapers,
        averageMarks,
        bestScore,
        totalMarks
      };
    }).filter(stat => stat.totalPapers > 0);
  };

  const addTodo = () => {
    if (!newTodo.task.trim() || !newTodo.subject) {
      toast({
        title: "Missing Information",
        description: "Please enter both task and subject.",
        variant: "destructive",
      });
      return;
    }

    const todo: TodoItem = {
      id: Date.now().toString(),
      task: newTodo.task,
      subject: newTodo.subject,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const updatedTodos = [...todos, todo];
    setTodos(updatedTodos);
    localStorage.setItem("alTodos", JSON.stringify(updatedTodos));
    setNewTodo({ task: "", subject: "" });

    toast({
      title: "Task Added",
      description: "New study task has been added to your list.",
    });
  };

  const toggleTodo = (id: string) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    localStorage.setItem("alTodos", JSON.stringify(updatedTodos));
  };

  const deleteTodo = (id: string) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    localStorage.setItem("alTodos", JSON.stringify(updatedTodos));
    
    toast({
      title: "Task Deleted",
      description: "Study task has been removed from your list.",
    });
  };

  const subjectStats = getSubjectStats();
  const gradeDistribution = getGradeDistribution();

  return (
    <div className="px-4 py-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient mb-2">Subject Analysis & Goals</h2>
        <p className="text-muted-foreground">Detailed insights into your performance and study planning</p>
      </div>

      <div className="space-y-6">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="academic-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Papers</p>
                <p className="text-xl font-bold">{marksData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="academic-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Total Marks</p>
                <p className="text-xl font-bold">{marksData.reduce((sum, p) => sum + p.total, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="academic-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">A Grades</p>
                <p className="text-xl font-bold">{gradeDistribution.A}</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Subject Performance Section */}
      <Card className="academic-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>{language === "en" ? "Subject Performance Overview" : "විෂය කාර්යසාධන සාරාංශය"}</span>
          </CardTitle>
          <CardDescription>
            {language === "en" 
              ? "Detailed performance analysis for each subject with marks data" 
              : "ලකුණු දත්ත සහිත එක් එක් විෂය සඳහා සවිස්තරාත්මක කාර්යසාධන විශ්ලේෂණය"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(() => {
              const subjectsWithMarks = [...new Set(marksData.map((item: any) => item.subject))].filter(Boolean);
              
              if (subjectsWithMarks.length === 0) {
                return (
                  <div className="col-span-full text-center py-8">
                    <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                      {language === "en" ? "No Performance Data" : "කාර්යසාධන දත්ත නැත"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === "en" 
                        ? "Add some marks to see your subject performance analysis" 
                        : "ඔබේ විෂය කාර්යසාධන විශ්ලේෂණය බැලීමට සමහර ලකුණු එකතු කරන්න"
                      }
                    </p>
                  </div>
                );
              }

              return subjectsWithMarks.map((subject: string) => {
                const subjectMarks = marksData.filter((item: any) => item.subject === subject);
                const totalPapers = subjectMarks.length;
                const totalMarks = subjectMarks.reduce((sum: number, item: any) => sum + (item.total || 0), 0);
                const avgMarksValue = totalPapers > 0 ? (totalMarks / totalPapers) : 0;
                const avgMarks = avgMarksValue.toFixed(1);
                const bestMark = Math.max(...subjectMarks.map((item: any) => item.total || 0));
                const worstMark = Math.min(...subjectMarks.map((item: any) => item.total || 0));
                const improvement = subjectMarks.length >= 2 ? 
                  (subjectMarks[subjectMarks.length - 1].total || 0) - (subjectMarks[0].total || 0) : 0;
                
                return (
                  <Card key={subject} className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-xl text-primary">{subject}</h3>
                          <Badge variant={avgMarksValue >= 75 ? "default" : avgMarksValue >= 50 ? "secondary" : "destructive"}>
                            {avgMarksValue >= 75 ? "Excellent" : avgMarksValue >= 50 ? "Good" : "Needs Work"}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-primary/10 rounded-lg">
                            <div className="text-2xl font-bold text-primary">{totalPapers}</div>
                            <div className="text-xs text-muted-foreground">
                              {language === "en" ? "Papers" : "ප්‍රශ්නපත්‍ර"}
                            </div>
                          </div>
                          <div className="text-center p-3 bg-secondary/10 rounded-lg">
                            <div className="text-2xl font-bold text-secondary">{avgMarks}</div>
                            <div className="text-xs text-muted-foreground">
                              {language === "en" ? "Average" : "සාමාන්‍ය"}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              {language === "en" ? "Best Score:" : "හොඳම ලකුණු:"}
                            </span>
                            <span className="font-semibold text-green-600">{bestMark}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              {language === "en" ? "Lowest Score:" : "අඩුම ලකුණු:"}
                            </span>
                            <span className="font-semibold text-red-600">{worstMark}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              {language === "en" ? "Total Marks:" : "මුළු ලකුණු:"}
                            </span>
                            <span className="font-semibold">{totalMarks}</span>
                          </div>
                          {improvement !== 0 && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">
                                {language === "en" ? "Improvement:" : "වැඩිදියුණු කිරීම:"}
                              </span>
                              <span className={`font-semibold ${improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {improvement > 0 ? '+' : ''}{improvement}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              });
            })()}
          </div>
        </CardContent>
      </Card>

      {/* Grade Distribution */}
      <Card className="academic-card">
        <CardHeader>
          <CardTitle>Grade Distribution</CardTitle>
          <CardDescription>Your grade performance overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(gradeDistribution).map(([grade, count]) => (
              <div key={grade} className="text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2 ${
                  grade === 'A' ? 'bg-accent' :
                  grade === 'B' ? 'bg-primary' :
                  grade === 'C' ? 'bg-secondary' :
                  grade === 'S' ? 'bg-warning' : 'bg-destructive'
                }`}>
                  {grade}
                </div>
                <p className="text-sm text-muted-foreground">Grade {grade}</p>
                <p className="text-lg font-bold">{count}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* To-Do List */}
      <Card className="academic-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Study To-Do List</span>
          </CardTitle>
          <CardDescription>Plan your revision and study goals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add new todo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="task">Study Task</Label>
              <Input
                id="task"
                placeholder="e.g., Revise Organic Chemistry"
                value={newTodo.task}
                onChange={(e) => setNewTodo(prev => ({ ...prev, task: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="e.g., Chemistry"
                value={newTodo.subject}
                onChange={(e) => setNewTodo(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>
            <Button onClick={addTodo} className="academic-button-primary mt-5">
              <Target className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>

          {/* Todo list */}
          <div className="space-y-2">
            {todos.length === 0 ? (
              <div className="text-center py-4">
                <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No study tasks yet. Add some goals!</p>
              </div>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center space-x-3 p-3 border rounded-lg group ${
                    todo.completed ? 'bg-muted/50 opacity-75' : 'hover:bg-muted/30'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <p className={`font-medium ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {todo.task}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">{todo.subject}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(todo.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Developer Section moved to About Page */}

      </div>
    </div>
  );
};

export default SubjectAnalysis;