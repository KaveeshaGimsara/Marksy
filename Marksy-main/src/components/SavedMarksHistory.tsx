import { useState, useEffect, useMemo } from "react";
import { Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const SavedMarksHistory = () => {
  const { toast } = useToast();
  const [marksData, setMarksData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [sortOption, setSortOption] = useState("dateDesc");

  useEffect(() => {
    // Load data from localStorage
    const savedData = JSON.parse(localStorage.getItem("alMarksData") || "[]");
    setMarksData(savedData);
    setFilteredData(savedData);
  }, []);

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
    // Filter data based on selected subject
    let filtered = marksData;
    
    if (selectedSubject !== "all") {
      filtered = filtered.filter(
        item => String(item.subject).trim().toLowerCase() === selectedSubject
      );
    }

    // Sort data based on selected sort option
    filtered.sort((a, b) => {
      if (sortOption === "dateAsc") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortOption === "dateDesc") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortOption === "marksAsc") {
        return (a.total || 0) - (b.total || 0);
      } else {
        return (b.total || 0) - (a.total || 0);
      }
    });

    setFilteredData(filtered);
  }, [marksData, selectedSubject, sortOption]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gradient mb-2">Saved Marks History</h2>
        <p className="text-muted-foreground">View and manage all your recorded marks</p>
      </div>

      {/* Filters - removed Export/Import buttons */}
      <Card className="academic-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
          <CardDescription>Filter your marks by subject and date</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Subject</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
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
            
            <div>
              <label className="text-sm font-medium">Sort By</label>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dateAsc">Date: Oldest First</SelectItem>
                  <SelectItem value="dateDesc">Date: Newest First</SelectItem>
                  <SelectItem value="marksAsc">Marks: Low to High</SelectItem>
                  <SelectItem value="marksDesc">Marks: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Marks Display */}
      <Card className="academic-card">
        <CardHeader>
          <CardTitle>All Recorded Marks</CardTitle>
          <CardDescription>Manage and review your saved marks</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No marks found. Use the import feature to add your marks.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredData.map((mark, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold capitalize">{mark.subject}</h4>
                    <p className="text-sm text-muted-foreground truncate">{mark.paperName} - {mark.date}</p>
                  </div>
                  <div className="mt-2 sm:mt-0 sm:ml-4 text-right">
                    <div className="text-lg font-bold text-primary">{mark.total}</div>
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

export default SavedMarksHistory;