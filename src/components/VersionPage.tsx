import { useState } from "react";
import versionsData from "@/versioning/versions.json";
import commitsData from "@/versioning/commits.json";
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

interface CommitInfo {
  hash: string;
  date: string;
  message: string;
}

const VersionPage = ({ language }: VersionPageProps) => {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  const versions: VersionInfo[] = versionsData as VersionInfo[];
  const commits: CommitInfo[] = commitsData as CommitInfo[];

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
                        {index === 0 && (
                          <span className="relative inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow animate-pulse">
                            LIVE
                          </span>
                        )}
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

        {/* Commit History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code className="h-5 w-5" />
              <span>{language === 'en' ? 'Commit History' : 'කමිට් ඉතිහාසය'}</span>
            </CardTitle>
            <CardDescription>
              {language === 'en' ? 'Recent repository changes (newest last here)' : 'මෑත ගබඩා වෙනස්කම් (අලුත්ම අන්තිමේ)'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-80 overflow-y-auto space-y-2 font-mono text-xs">
              {commits.map(c => (
                <div key={c.hash} className="flex items-start justify-between gap-4 p-2 bg-muted/40 rounded hover:bg-muted/70 transition-colors">
                  <div className="truncate flex-1">
                    <span className="text-primary font-semibold mr-2">{c.hash}</span>
                    <span>{c.message}</span>
                  </div>
                  <span className="text-muted-foreground whitespace-nowrap">{new Date(c.date).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VersionPage;