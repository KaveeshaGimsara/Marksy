import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronRight, BookOpen, BarChart3, Trophy } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const HelpPage = () => {
  const { lang: language } = useLanguage();
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const content = {
    en: {
      title: "Help & FAQ",
      subtitle: "Get answers to common questions and learn how to use the application",
      gettingStarted: "Getting Started",
      startedDesc: "Learn the basics of using AL Marks Analyzer",
      features: "Features Guide",
      featuresDesc: "Detailed guide on using each feature",
      troubleshooting: "Troubleshooting",
      troubleshootingDesc: "Solutions to common issues",
      faqs: [
        {
          id: "what-is",
          question: "What is AL Marks Analyzer?",
          answer: "AL Marks Analyzer is a personal web application designed for Advanced Level students in Sri Lanka to track their academic progress across subjects like Biology, Physics, Chemistry, and English. It provides detailed analytics, progress tracking, and study planning tools.",
          category: "gettingStarted"
        },
        {
          id: "add-marks",
          question: "How do I add marks for a paper?",
          answer: "1. Navigate to the 'Add Marks' section\n2. Select your subject from the available options\n3. Fill in the paper information (name, date, tutor)\n4. Enter marks for different paper types (MCQ, SEQ, Essay)\n5. Click 'Calculate Total' to get your total score\n6. Click 'Add Marks' to save to your records",
          category: "features"
        },
        {
          id: "paper-types",
          question: "What are the different paper types?",
          answer: "For Science subjects (Biology, Physics, Chemistry): MCQ (Multiple Choice Questions), SEQ (Structured Essay Questions), and Essay papers.\n\nFor English: SEQ (Structured Essay Questions) and Essay papers.\n\nYou can leave any field blank if you haven't attempted that paper type.",
          category: "features"
        },
        {
          id: "view-progress",
          question: "How can I view my progress?",
          answer: "Use the 'Progress Dashboard' section to view:\n- Charts showing your performance over time\n- Filter by subject or date range\n- Statistics including total papers, marks, and averages\n- Recent paper submissions",
          category: "features"
        },
        {
          id: "subjects",
          question: "What subjects are supported?",
          answer: "Currently supported subjects include:\n- Biology\n- Physics\n- Chemistry\n- English\n- Mathematics\n- ICT\n- Economics\n- Business Studies\n- Accounting\n\nMore subjects can be added based on user feedback.",
          category: "features"
        },
        {
          id: "grades",
          question: "How are grades calculated?",
          answer: "Grades are calculated based on percentage:\n- A: 75-100%\n- B: 65-74%\n- C: 50-64%\n- S: 40-49%\n- F/W: 0-39%\n\nThe percentage is calculated based on your total marks obtained.",
          category: "features"
        },
        {
          id: "data-safety",
          question: "Is my data safe?",
          answer: "Yes! All your data is stored locally in your browser using localStorage. This means:\n- Your data never leaves your device\n- No internet connection required after loading\n- Complete privacy and security\n- You can export your data for backup purposes",
          category: "troubleshooting"
        },
        {
          id: "export-import",
          question: "How do I backup my data?",
          answer: "In the Progress Dashboard:\n1. Click 'Export Data' to download your marks as a JSON file\n2. Save this file safely as your backup\n3. To restore, use 'Import Data' and select your backup file\n\nWarning: Import will replace all current data, so be careful!",
          category: "troubleshooting"
        },
        {
          id: "lost-data",
          question: "I lost my data! What can I do?",
          answer: "If you haven't exported your data, unfortunately it cannot be recovered as everything is stored locally. To prevent this:\n- Regularly export your data\n- Don't clear browser data for this site\n- Consider bookmarking the application\n- Use the same browser consistently",
          category: "troubleshooting"
        },
        {
          id: "achievements",
          question: "How do I unlock achievements?",
          answer: "Achievements are unlocked automatically based on your activity:\n- Complete papers to unlock milestone badges\n- Achieve A grades to unlock grade-based achievements\n- Different achievements for 1, 5, 10, 25+ papers\n- Special achievements for consistent performance",
          category: "features"
        }
      ]
    },
    si: {
      title: "උපකාර සහ නිතර අසන ප්‍රශ්න",
      subtitle: "සාමාන්‍ය ප්‍රශ්නවලට පිළිතුරු ලබාගෙන යෙදුම භාවිතා කරන ආකාරය ඉගෙන ගන්න",
      gettingStarted: "ආරම්භ කිරීම",
      startedDesc: "උසස් පෙළ ලකුණු විශ්ලේෂකය භාවිතා කිරීමේ මූලික කරුණු ඉගෙන ගන්න",
      features: "විශේෂාංග මාර්ගෝපදේශය",
      featuresDesc: "සෑම විශේෂාංගයක්ම භාවිතා කිරීම පිළිබඳ විස්තරාත්මක මාර්ගෝපදේශය",
      troubleshooting: "ගැටළු නිරාකරණය",
      troubleshootingDesc: "සාමාන්‍ය ගැටළු සඳහා විසඳුම්",
      faqs: [
        {
          id: "what-is",
          question: "උසස් පෙළ ලකුණු විශ්ලේෂකය කුමක්ද?",
          answer: "උසස් පෙළ ලකුණු විශ්ලේෂකය ශ්‍රී ලංකාවේ උසස් පෙළ සිසුන් සඳහා ජීව විද්‍යාව, භෞතික විද්‍යාව, රසායන විද්‍යාව සහ ඉංග්‍රීසි වැනි විෂයයන් හරහා ඔවුන්ගේ අධ්‍යාපනික ප්‍රගතිය නිරීක්ෂණය කිරීම සඳහා නිර්මාණය කරන ලද පුද්ගලික වෙබ් යෙදුමකි.",
          category: "gettingStarted"
        },
        {
          id: "add-marks",
          question: "ප්‍රශ්න පත්‍රයක් සඳහා ලකුණු එකතු කරන්නේ කෙසේද?",
          answer: "1. 'ලකුණු එකතු කරන්න' කොටසට යන්න\n2. ඇති විකල්පවලින් ඔබේ විෂය තෝරන්න\n3. ප්‍රශ්න පත්‍ර තොරතුරු පුරවන්න (නම, දිනය, ගුරුවරයා)\n4. විවිධ ප්‍රශ්න පත්‍ර වර්ග සඳහා ලකුණු ඇතුළත් කරන්න\n5. මුළු ලකුණු ගණනය කිරීමට 'මුළු ගණනය කරන්න' ක්ලික් කරන්න\n6. ඔබේ වාර්තාවලට සුරැකීමට 'ලකුණු එකතු කරන්න' ක්ලික් කරන්න",
          category: "features"
        }
        // Add more Sinhala FAQs as needed
      ]
    }
  };

  const currentContent = content[language];

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "gettingStarted":
        return <BookOpen className="h-4 w-4" />;
      case "features":
        return <BarChart3 className="h-4 w-4" />;
      case "troubleshooting":
        return <Trophy className="h-4 w-4" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "gettingStarted":
        return "text-primary";
      case "features":
        return "text-secondary";
      case "troubleshooting":
        return "text-accent";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="text-center relative">
        <h2 className="text-3xl font-bold text-gradient mb-2">{currentContent.title}</h2>
        <p className="text-muted-foreground">{currentContent.subtitle}</p>
      </div>

      {/* Quick Start Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="academic-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-primary">
              <BookOpen className="h-5 w-5" />
              <span>{currentContent.gettingStarted}</span>
            </CardTitle>
            <CardDescription>{currentContent.startedDesc}</CardDescription>
          </CardHeader>
        </Card>

        <Card className="academic-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-secondary">
              <BarChart3 className="h-5 w-5" />
              <span>{currentContent.features}</span>
            </CardTitle>
            <CardDescription>{currentContent.featuresDesc}</CardDescription>
          </CardHeader>
        </Card>

        <Card className="academic-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-accent">
              <Trophy className="h-5 w-5" />
              <span>{currentContent.troubleshooting}</span>
            </CardTitle>
            <CardDescription>{currentContent.troubleshootingDesc}</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card className="academic-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5" />
            <span>Frequently Asked Questions</span>
          </CardTitle>
          <CardDescription>Find answers to common questions about using the application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentContent.faqs.map((faq) => (
              <Collapsible key={faq.id} open={openFaq === faq.id} onOpenChange={() => toggleFaq(faq.id)}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto text-left border rounded-lg hover:bg-accent text-foreground font-medium"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={getCategoryColor(faq.category)}>
                        {getCategoryIcon(faq.category)}
                      </div>
                      <span className="font-medium">{faq.question}</span>
                    </div>
                    {openFaq === faq.id ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4">
                  <div className="pt-3 border-t mt-3">
                    <div className="text-sm text-foreground whitespace-pre-line leading-relaxed bg-card p-4 rounded-lg border">
                      {faq.answer}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact for More Help */}
      <Card className="academic-card">
        <CardHeader>
          <CardTitle>Need More Help?</CardTitle>
          <CardDescription>Can't find what you're looking for? Get in touch!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              If you have questions not covered in this FAQ, feel free to reach out for support.
            </p>
            <a 
              href="https://t.me/kaveesha_gimsara" 
              target="_blank" 
              rel="noopener noreferrer"
              className="academic-button-primary inline-flex items-center space-x-2"
            >
              <span>Contact Support via Telegram</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpPage;