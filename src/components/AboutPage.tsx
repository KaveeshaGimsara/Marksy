import { useState } from "react";
import { GraduationCap, User, MessageSquare, Globe, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AboutPageProps } from "@/types";

const AboutPage = ({ language: initialLanguage }: AboutPageProps) => {
  const [language, setLanguage] = useState<"en" | "si">(initialLanguage || "en");
  const [imageClicked, setImageClicked] = useState(false);

  const content = {
    en: {
      title: "About AL Marks Analyzer",
      subtitle: "Your Personal Academic Progress Companion",
      description: "The Advanced Level Marks Analyzer is a comprehensive web application designed specifically for A/L students in Sri Lanka. Track your progress across Biology, Physics, Chemistry, English, and other subjects with detailed analytics and insights.",
      features: [
        "Complete marks tracking for all A/L subjects",
        "Interactive progress dashboards with charts",
        "Subject-wise performance analysis",
        "Achievement system with badges and milestones",
        "Study planning with integrated to-do lists",
        "Data export/import for backup and portability",
        "Grade distribution analysis (A, B, C, S, F/W)",
        "Multilingual support (English/Sinhala)"
      ],
      purpose: "Built to empower A/L students with data-driven insights into their academic performance, helping them identify strengths, weaknesses, and areas for improvement.",
      developer: "Developer Information",
      devDesc: "Created with passion by Kaveesha Gimsara, a dedicated developer focused on educational technology solutions.",
      contact: "Get in Touch",
      techStack: "Technology Stack",
      technologies: [
        "React & TypeScript for robust frontend development",
        "Tailwind CSS for modern, responsive design",
        "Chart.js for interactive data visualization",
        "Local Storage for secure, private data management",
        "shadcn/ui for beautiful, accessible components"
      ]
    },
    si: {
      title: "උසස් පෙළ ලකුණු විශ්ලේෂකය පිළිබඳ",
      subtitle: "ඔබේ පුද්ගලික අධ්‍යාපනික ප්‍රගති සහායකයා",
      description: "උසස් පෙළ ලකුණු විශ්ලේෂකය ශ්‍රී ලංකාවේ උ/පෙ සිසුන් සඳහා විශේෂයෙන් නිර්මාණය කරන ලද පුළුල් වෙබ් යෙදුමකි. ජීව විද්‍යාව, භෞතික විද්‍යාව, රසායන විද්‍යාව, ඉංග්‍රීසි සහ අනෙකුත් විෂයයන් හරහා ඔබේ ප්‍රගතිය විස්තරාත්මක විශ්ලේෂණ සහ තීක්ෂ්ණ බුද්ධිය සමඟ නිරීක්ෂණය කරන්න.",
      features: [
        "සියලුම උ/පෙ විෂයයන් සඳහා සම්පූර්ණ ලකුණු ලුහුබැඳීම",
        "ප්‍රස්ථාර සහිත අන්තර්ක්‍රියාකාරී ප්‍රගති උපකරණ පුවරු",
        "විෂය අනුව කාර්ය සාධන විශ්ලේෂණය",
        "ලාංඡන සහ සන්ධිස්ථාන සමඟ ජයග්‍රහණ පද්ධතිය",
        "ඒකාබද්ධ කළ යුතු කටයුතු ලැයිස්තු සමඟ අධ්‍යයන සැලසුම්කරණය",
        "උපස්ථ සහ ගෙනයාම සඳහා දත්ත අපනයන/ආනයන",
        "ශ්‍රේණි බෙදාහැරීමේ විශ්ලේෂණය (A, B, C, S, F/W)",
        "බහුභාෂා සහාය (ඉංග්‍රීසි/සිංහල)"
      ],
      purpose: "උ/පෙ සිසුන්ට ඔවුන්ගේ අධ්‍යාපනික කාර්ය සාධනය පිළිබඳ දත්ත මත පදනම් වූ තීක්ෂ්ණ බුද්ධිය සමඟ බලගැන්වීම, ඔවුන්ගේ ශක්තීන්, දුර්වලතා සහ වැඩිදියුණු කළ යුතු ක්ෂේත්‍ර හඳුනා ගැනීමට උපකාර කිරීම සඳහා ගොඩනගා ඇත.",
      developer: "සංවර්ධක තොරතුරු",
      devDesc: "අධ්‍යාපනික තාක්ෂණ විසඳුම් කෙරෙහි අවධානය යොමු කරන ප්‍රේමවත් සංවර්ධකයෙකු වන කවීෂ ගිම්සර විසින් ආදරයෙන් නිර්මාණය කර ඇත.",
      contact: "සම්බන්ධ වන්න",
      techStack: "තාක්ෂණික ස්ටැක්",
      technologies: [
        "ශක්තිමත් ඉදිරිපස සංවර්ධනය සඳහා React සහ TypeScript",
        "නවීන, ප්‍රතිචාරාත්මක නිර්මාණය සඳහා Tailwind CSS",
        "අන්තර්ක්‍රියාකාරී දත්ත දෘශ්‍යකරණය සඳහා Chart.js",
        "ආරක්ෂිත, පුද්ගලික දත්ත කළමනාකරණය සඳහා ප්‍රාදේශීය ගබඩාව",
        "ලස්සන, ප්‍රවේශ්‍ය සංරචක සඳහා shadcn/ui"
      ]
    }
  };

  const currentContent = content[language];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header with Language Toggle */}
      <div className="text-center relative">
        <div className="absolute top-0 right-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === "en" ? "si" : "en")}
            className="flex items-center space-x-2"
          >
            <Globe className="h-4 w-4" />
            <span>{language === "en" ? "සිංහල" : "English"}</span>
          </Button>
        </div>
        
        <h2 className="text-3xl font-bold text-gradient mb-2">{currentContent.title}</h2>
        <p className="text-muted-foreground text-lg">{currentContent.subtitle}</p>
      </div>

      {/* Main Description */}
      <Card className="academic-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6" />
            <span>Application Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {currentContent.description}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {currentContent.purpose}
          </p>
        </CardContent>
      </Card>

      {/* Features */}
      <Card className="academic-card">
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
          <CardDescription>Everything you need to track and improve your A/L performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentContent.features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm">{feature}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Developer Section */}
      <Card className="academic-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>{currentContent.developer}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Developer Image */}
            <div 
              className={`relative cursor-pointer transition-all duration-500 ${
                imageClicked ? 'animate-bounce-in' : ''
              }`}
              onClick={() => setImageClicked(!imageClicked)}
            >
              <div className={`w-24 h-24 bg-gradient-academic rounded-full flex items-center justify-center relative overflow-hidden ${
                imageClicked ? 'shadow-lg scale-110' : 'shadow-md'
              } transition-all duration-300`}>
                <User className="h-12 w-12 text-white" />
                {imageClicked && (
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse">
                    <Sparkles className="h-6 w-6 text-white absolute top-2 right-2 animate-spin" />
                  </div>
                )}
              </div>
            </div>

            <div className="text-center md:text-left flex-1">
              <h3 className="text-xl font-semibold mb-2">Kaveesha Gimsara</h3>
              <p className="text-muted-foreground mb-4">{currentContent.devDesc}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <Badge variant="secondary">Full Stack Developer</Badge>
                <Badge variant="secondary">Educational Technology</Badge>
                <Badge variant="secondary">React Specialist</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="academic-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>{currentContent.contact}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="https://t.me/kaveesha_gimsara" 
              target="_blank" 
              rel="noopener noreferrer"
              className="academic-button-primary text-center"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact via Telegram
            </a>
            <Button variant="outline" className="flex items-center justify-center">
              <span>GitHub Profile (Coming Soon)</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Technology Stack */}
      <Card className="academic-card">
        <CardHeader>
          <CardTitle>{currentContent.techStack}</CardTitle>
          <CardDescription>Modern technologies powering this application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentContent.technologies.map((tech, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="h-2 w-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm">{tech}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPage;