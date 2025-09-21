import { useState } from "react";
import { Code, Calendar, Star, Zap, Bug, Shield, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface VersionPageProps {
  language: "en" | "si";
}

interface VersionInfo {
  version: string;
  date: string;
  type: "major" | "minor" | "patch";
  features: string[];
  bugfixes: string[];
  improvements: string[];
}

const VersionPage = ({ language }: VersionPageProps) => {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  const versions: VersionInfo[] = [
    {
      version: "v1.1.0",
      date: "2025-09-21",
      type: "minor",
      features: [
        "Real-time data visualization with interactive charts",
        "Subject Performance section in Add Marks page",
        "Dynamic subject filtering in Dashboard",
        "Enhanced export/import system with Excel support",
        "Starred subjects with 6-subject limit",
        "Data migration system for localStorage consistency",
        "Responsive progress charts with tooltips"
      ],
      bugfixes: [
        "Fixed localStorage key mismatch between AddMarks and Dashboard",
        "Fixed footer spacing issues in Add Marks page",
        "Fixed subject persistence after page refresh",
        "Fixed Progress Chart displaying 'Coming Soon' placeholder",
        "Fixed AboutPage, HelpPage, and CreditsPage layout issues"
      ],
      improvements: [
        "Unified data storage using consistent localStorage keys",
        "Better error handling for data import/export",
        "Improved chart performance and responsiveness",
        "Enhanced subject management across components",
        "Better mobile responsive design"
      ]
    },
    {
      version: "v1.0.8",
      date: "2025-09-15",
      type: "patch",
      features: [
        "Complete profile data management system",
        "Import/export functionality for backup",
        "Comprehensive badge achievement system"
      ],
      bugfixes: [
        "Fixed profile data persistence",
        "Fixed badge unlock conditions",
        "Fixed export file naming"
      ],
      improvements: [
        "Better profile form validation",
        "Improved export file structure",
        "Enhanced badge display"
      ]
    },
    {
      version: "v1.0.7",
      date: "2025-09-10",
      type: "patch",
      features: [
        "Subject analysis with detailed statistics",
        "Advanced todo management system",
        "Performance tracking per subject"
      ],
      bugfixes: [
        "Fixed todo deletion functionality",
        "Fixed subject statistics calculation",
        "Fixed date filtering in analysis"
      ],
      improvements: [
        "Better todo organization",
        "Improved analysis visualizations",
        "Enhanced subject performance metrics"
      ]
    },
    {
      version: "v1.0.6",
      date: "2025-09-05",
      type: "patch",
      features: [
        "Enhanced dashboard with data filtering",
        "Recent papers display",
        "Statistics cards with real-time updates"
      ],
      bugfixes: [
        "Fixed dashboard data loading",
        "Fixed filter functionality",
        "Fixed statistics calculation errors"
      ],
      improvements: [
        "Better dashboard performance",
        "Improved data filtering",
        "Enhanced visual design"
      ]
    },
    {
      version: "v1.0.5",
      date: "2025-08-30",
      type: "patch",
      features: [
        "Add Marks page with subject management",
        "Search functionality for subjects",
        "Auto-calculation of total marks"
      ],
      bugfixes: [
        "Fixed marks saving issues",
        "Fixed subject search functionality",
        "Fixed total calculation errors"
      ],
      improvements: [
        "Better form validation",
        "Improved subject search",
        "Enhanced user feedback"
      ]
    },
    {
      version: "v1.0.4",
      date: "2025-08-25",
      type: "patch",
      features: [
        "Help page with comprehensive FAQ",
        "About page with feature overview",
        "Credits page with contributor information"
      ],
      bugfixes: [
        "Fixed navigation issues",
        "Fixed responsive design problems",
        "Fixed text overflow issues"
      ],
      improvements: [
        "Better help content organization",
        "Improved page layouts",
        "Enhanced readability"
      ]
    },
    {
      version: "v1.0.3",
      date: "2025-08-20",
      type: "patch",
      features: [
        "Theme switching (Light/Dark mode)",
        "Language support (English/Sinhala)",
        "Local storage data persistence"
      ],
      bugfixes: [
        "Fixed theme persistence",
        "Fixed language switching",
        "Fixed data saving issues"
      ],
      improvements: [
        "Better theme consistency",
        "Improved language coverage",
        "Enhanced data reliability"
      ]
    },
    {
      version: "v1.0.2",
      date: "2025-08-15",
      type: "patch",
      features: [
        "Homepage with live statistics",
        "Quick actions navigation",
        "Motivational quotes system"
      ],
      bugfixes: [
        "Fixed homepage loading issues",
        "Fixed navigation problems",
        "Fixed quote rotation"
      ],
      improvements: [
        "Better homepage design",
        "Improved navigation flow",
        "Enhanced user experience"
      ]
    },
    {
      version: "v1.0.1",
      date: "2025-08-10",
      type: "patch",
      features: [
        "Header navigation with responsive design",
        "Footer with essential links",
        "Basic routing system"
      ],
      bugfixes: [
        "Fixed mobile navigation",
        "Fixed footer positioning",
        "Fixed routing issues"
      ],
      improvements: [
        "Better mobile responsiveness",
        "Improved navigation structure",
        "Enhanced visual consistency"
      ]
    },
    {
      version: "v1.0.0",
      date: "2025-08-05",
      type: "major",
      features: [
        "Initial release of Marksy",
        "Basic marks tracking system",
        "Subject management",
        "Simple dashboard",
        "Core UI components with shadcn/ui",
        "Tailwind CSS styling",
        "TypeScript implementation"
      ],
      bugfixes: [],
      improvements: [
        "Established project foundation",
        "Set up development environment",
        "Created basic application structure"
      ]
    }
  ];

  const getVersionTypeColor = (type: string) => {
    switch (type) {
      case "major": return "bg-red-500";
      case "minor": return "bg-blue-500";
      case "patch": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getVersionTypeIcon = (type: string) => {
    switch (type) {
      case "major": return Sparkles;
      case "minor": return Zap;
      case "patch": return Shield;
      default: return Code;
    }
  };

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {language === "en" ? "Version History" : "අනුවාද ඉතිහාසය"}
        </h1>
        <p className="text-muted-foreground text-lg">
          {language === "en" 
            ? "Track the evolution of Marksy with detailed changelog" 
            : "Marksy හි පරිණාමය සවිස්තරාත්මක වෙනස්කම් ලොගය සමඟ නිරීක්ෂණය කරන්න"
          }
        </p>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        {versions.map((version, index) => {
          const Icon = getVersionTypeIcon(version.type);
          const isExpanded = selectedVersion === version.version;
          
          return (
            <Card key={version.version} className="academic-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getVersionTypeColor(version.type)}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{version.version}</span>
                        <Badge variant={version.type === "major" ? "destructive" : version.type === "minor" ? "default" : "secondary"}>
                          {version.type}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(version.date).toLocaleDateString()}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedVersion(isExpanded ? null : version.version)}
                    className="p-2"
                  >
                    <ArrowRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </Button>
                </div>
              </CardHeader>
              
              {isExpanded && (
                <CardContent className="space-y-6">
                  {version.features.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-green-600 dark:text-green-400 flex items-center space-x-2 mb-3">
                        <Star className="h-4 w-4" />
                        <span>{language === "en" ? "New Features" : "නව විශේෂාංග"}</span>
                      </h3>
                      <ul className="space-y-2">
                        {version.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <div className="h-2 w-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {version.bugfixes.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-red-600 dark:text-red-400 flex items-center space-x-2 mb-3">
                        <Bug className="h-4 w-4" />
                        <span>{language === "en" ? "Bug Fixes" : "දෝෂ නිවැරදි කිරීම්"}</span>
                      </h3>
                      <ul className="space-y-2">
                        {version.bugfixes.map((fix, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <div className="h-2 w-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm">{fix}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {version.improvements.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-blue-600 dark:text-blue-400 flex items-center space-x-2 mb-3">
                        <Zap className="h-4 w-4" />
                        <span>{language === "en" ? "Improvements" : "වැඩිදියුණු කිරීම්"}</span>
                      </h3>
                      <ul className="space-y-2">
                        {version.improvements.map((improvement, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default VersionPage;