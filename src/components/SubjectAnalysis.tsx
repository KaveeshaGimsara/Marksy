import { useState, useEffect } from "react";
import { Trophy, Target, Award, CheckCircle, Clock, BookOpen } from "lucide-react";
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

  const getAchievements = () => {
    const totalPapers = marksData.length;
    const grades = getGradeDistribution();
    const achievements = [];

    if (totalPapers >= 1) achievements.push({ name: "First Steps", desc: "Completed your first paper", icon: "🎯" });
    if (totalPapers >= 5) achievements.push({ name: "Getting Started", desc: "Completed 5 papers", icon: "📚" });
    if (totalPapers >= 10) achievements.push({ name: "Consistent Learner", desc: "Completed 10 papers", icon: "⭐" });
    if (totalPapers >= 25) achievements.push({ name: "Dedicated Student", desc: "Completed 25 papers", icon: "🏆" });
    if (grades.A >= 5) achievements.push({ name: "A-Grade Achiever", desc: "Earned 5 A grades", icon: "🌟" });
    if (grades.A >= 10) achievements.push({ name: "Excellence Master", desc: "Earned 10 A grades", icon: "💎" });

    return achievements;
  };

  const subjectStats = getSubjectStats();
  const gradeDistribution = getGradeDistribution();
  const achievements = getAchievements();

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gradient mb-2">Subject Analysis & Goals</h2>
        <p className="text-muted-foreground">Detailed insights into your performance and study planning</p>
      </div>

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

        <Card className="academic-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Achievements</p>
                <p className="text-xl font-bold">{achievements.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Performance */}
      <Card className="academic-card">
        <CardHeader>
          <CardTitle>Subject Performance</CardTitle>
          <CardDescription>Detailed breakdown by subject</CardDescription>
        </CardHeader>
        <CardContent>
          {subjectStats.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No data available. Start adding marks to see subject analysis!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjectStats.map((stat, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  <h3 className="font-semibold text-lg">{stat.subject}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Papers</p>
                      <p className="font-semibold">{stat.totalPapers}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Average</p>
                      <p className="font-semibold">{stat.averageMarks}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Best Score</p>
                      <p className="font-semibold text-primary">{stat.bestScore}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Marks</p>
                      <p className="font-semibold text-secondary">{stat.totalMarks}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

      {/* Achievements */}
      <Card className="academic-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Achievements & Milestones</span>
          </CardTitle>
          <CardDescription>Your academic accomplishments</CardDescription>
        </CardHeader>
        <CardContent>
          {achievements.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Complete more papers to unlock achievements!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="academic-card p-4 text-center">
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <h3 className="font-semibold">{achievement.name}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.desc}</p>
                </div>
              ))}
            </div>
          )}
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
                  className={`flex items-center space-x-3 p-3 border rounded-lg ${
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
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubjectAnalysis;