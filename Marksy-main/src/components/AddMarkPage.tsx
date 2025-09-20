import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, X, Plus } from 'lucide-react';

const AddMarkPage = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === 'dark';
  
  // Define the default subjects
  const [subjects] = useState([
    { id: 'physics', name: 'Physics' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'biology', name: 'Biology' },
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'ict', name: 'ICT' },
    { id: 'english', name: 'English' }
  ]);
  
  const [selectedSubject, setSelectedSubject] = useState('');
  const [markValue, setMarkValue] = useState('');
  const [studentName, setStudentName] = useState('');
  const [marks, setMarks] = useState<{subject: string, mark: number}[]>([]);
  
  const handleAddMark = () => {
    if (!selectedSubject || !markValue) return;
    
    const mark = parseFloat(markValue);
    if (isNaN(mark) || mark < 0 || mark > 100) {
      alert('Please enter a valid mark between 0 and 100');
      return;
    }
    
    // Add the mark or update if subject already exists
    const exists = marks.findIndex(m => m.subject === selectedSubject);
    if (exists >= 0) {
      const updatedMarks = [...marks];
      updatedMarks[exists].mark = mark;
      setMarks(updatedMarks);
    } else {
      setMarks([...marks, { subject: selectedSubject, mark }]);
    }
    
    // Reset inputs
    setSelectedSubject('');
    setMarkValue('');
  };
  
  const handleRemoveMark = (subject: string) => {
    setMarks(marks.filter(m => m.subject !== subject));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentName) {
      alert('Please enter a student name');
      return;
    }
    
    if (marks.length === 0) {
      alert('Please add at least one mark');
      return;
    }
    
    // Submit the form data
    console.log({
      studentName,
      marks
    });
    
    // Reset the form
    setStudentName('');
    setMarks([]);
  };
  
  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-slate-900' : 'bg-blue-50'}`}>
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className={`shadow-xl max-w-3xl mx-auto ${isDark ? 'border-slate-700 bg-slate-800/80' : 'border-blue-200 bg-white/90'} backdrop-blur-md`}>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {t("addMark.title") || "Add Student Marks"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Student Name */}
              <div className="space-y-2">
                <Label htmlFor="studentName" className={isDark ? 'text-slate-200' : 'text-slate-700'}>
                  {t("addMark.studentName") || "Student Name"}
                </Label>
                <Input
                  id="studentName"
                  placeholder={t("addMark.enterName") || "Enter student name"}
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className={`${isDark ? 'bg-slate-700/50 border-slate-600 text-white' : 'bg-white border-slate-200'}`}
                  required
                />
              </div>
              
              {/* Subject Selection */}
              <div className="space-y-4">
                <Label className={isDark ? 'text-slate-200' : 'text-slate-700'}>
                  {t("addMark.selectSubject") || "Select Subject"}
                </Label>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3">
                  {subjects.map((subject) => (
                    <button
                      key={subject.id}
                      type="button"
                      className={`p-3 rounded-lg text-center transition-colors ${
                        selectedSubject === subject.id
                          ? isDark 
                            ? 'bg-primary/30 border border-primary text-primary-foreground' 
                            : 'bg-primary/20 border border-primary/50 text-primary-foreground'
                          : isDark 
                            ? 'bg-slate-700/50 border border-slate-600 hover:bg-slate-700/80 text-slate-200' 
                            : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                      onClick={() => setSelectedSubject(subject.id)}
                    >
                      {subject.name}
                    </button>
                  ))}
                </div>
                
                {/* Mark Input */}
                <div className="flex gap-2 mt-4">
                  <Input
                    placeholder={t("addMark.enterMark") || "Enter mark (0-100)"}
                    type="number"
                    min="0"
                    max="100"
                    value={markValue}
                    onChange={(e) => setMarkValue(e.target.value)}
                    className={`${isDark ? 'bg-slate-700/50 border-slate-600 text-white' : 'bg-white border-slate-200'}`}
                    disabled={!selectedSubject}
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddMark}
                    className="bg-primary hover:bg-primary/90"
                    disabled={!selectedSubject || !markValue}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Marks List */}
              {marks.length > 0 && (
                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-200' : 'text-slate-700'}>
                    {t("addMark.addedMarks") || "Added Marks"}
                  </Label>
                  <div className={`border rounded-lg ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50/50'}`}>
                    <table className="w-full">
                      <thead>
                        <tr className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                          <th className={`px-4 py-2 text-left ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Subject</th>
                          <th className={`px-4 py-2 text-left ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Mark</th>
                          <th className="px-4 py-2 w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {marks.map((mark, index) => {
                          const subjectName = subjects.find(s => s.id === mark.subject)?.name || mark.subject;
                          return (
                            <tr key={index} className={`${index !== marks.length - 1 ? `border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}` : ''}`}>
                              <td className={`px-4 py-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{subjectName}</td>
                              <td className={`px-4 py-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{mark.mark}</td>
                              <td className="px-4 py-2">
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-red-500 hover:text-red-600" 
                                  onClick={() => handleRemoveMark(mark.subject)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90"
                  disabled={marks.length === 0 || !studentName}
                >
                  <Check className="h-4 w-4 mr-2" />
                  {t("addMark.submit") || "Submit"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AddMarkPage;
