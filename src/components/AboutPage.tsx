import { useState } from "react";
import { GraduationCap, User, MessageSquare, Sparkles, Target, Globe2, BookOpen, ScrollText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AboutPageProps } from "@/types";

const AboutPage = ({ language: initialLanguage }: AboutPageProps) => {
  const [language] = useState<"en" | "si">(initialLanguage || "en");
  const [imageClicked, setImageClicked] = useState(false);
  const [showSinhalaLetter, setShowSinhalaLetter] = useState(false);

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
      techStack: "Technology Stack (deprecated)",
      technologies: []
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
      techStack: "තාක්ෂණික ස්ටැක් (ඉවත් කළා)",
      technologies: []
    }
  };

  const currentContent = content[language];

  return (
    <div className="px-4 py-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient mb-2">{currentContent.title}</h2>
        <p className="text-muted-foreground text-lg">{currentContent.subtitle}</p>
      </div>

      <div className="space-y-6">
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

      {/* Developer Information (Enhanced) */}
      <Card className="academic-card border-2 border-primary/20 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-600/10 pointer-events-none" />
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 relative">
            <User className="h-5 w-5" />
            <span>{currentContent.developer}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 ml-2">A/L Sri Lanka</span>
          </CardTitle>
          <CardDescription className="relative">
            {language === 'en' ? 'Focused on empowering Sri Lankan Advanced Level students with tools that encourage consistency, clarity and confidence.' : 'ශ්‍රී ලංකා උසස් පෙල සිසුන්ට ස්ථිරත්වය, පැහැදිලිභාවය සහ විශ්වාසය ගොඩනඟන උපකරණ සංවර්ධනය කිරීම මත අවධානය.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* SVG Avatar with magic hover */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-primary/30 overflow-hidden shadow-lg transition-all duration-500 group-hover:shadow-primary/40 group-hover:scale-110 group-hover:border-primary/60">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-cyan-400/20 via-fuchsia-400/10 to-amber-300/20 animate-pulse" />
                <svg viewBox="0 0 128 128" className="w-full h-full group-hover:brightness-110 transition-all duration-500" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="devBg" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                    <linearGradient id="devSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fcd4b4" />
                      <stop offset="100%" stopColor="#f8b78b" />
                    </linearGradient>
                    <linearGradient id="devHair" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1f2937" />
                      <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                  </defs>
                  <rect width="128" height="128" fill="url(#devBg)" />
                  <ellipse cx="64" cy="72" rx="26" ry="30" fill="url(#devSkin)" />
                  <ellipse cx="64" cy="46" rx="30" ry="20" fill="url(#devHair)" />
                  <circle cx="56" cy="66" r="3" fill="#1f2937" />
                  <circle cx="72" cy="66" r="3" fill="#1f2937" />
                  <path d="M55 58 Q64 52 73 58" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
                  <path d="M 56 80 Q 64 88 72 80" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <rect x="46" y="98" width="36" height="30" fill="#0ea5e9" />
                  <rect x="46" y="98" width="36" height="10" fill="#0284c7" />
                </svg>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute top-3 right-4 w-1 h-1 bg-amber-300 rounded-full animate-ping" />
                  <div className="absolute bottom-4 left-3 w-1 h-1 bg-pink-300 rounded-full animate-ping" style={{animationDelay:'0.6s'}} />
                  <div className="absolute top-8 left-8 w-1 h-1 bg-cyan-300 rounded-full animate-ping" style={{animationDelay:'1.2s'}} />
                </div>
              </div>
            </div>

            <div className="flex-1 text-center lg:text-left space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary via-fuchsia-500 to-blue-600 bg-clip-text text-transparent tracking-wide">Kaveesha Gimsara</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                {language === 'en' ? 'Building focused tools for A/L students across Sri Lanka – helping you turn revision stress into structured, trackable progress.' : 'ශ්‍රී ලංකා පුරා A/L සිසුන් සඳහා අවධානයේ සිටින උපකරණ – අධ්‍යයන පැටලිල්ල සැලසුම්ගත, ලුහුබැඳිය හැකි ප්‍රගතියක් බවට පරිවර්තනය කිරීමට.'}
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">🎓 A/L Students Sri Lanka</Badge>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">📘 Study Support</Badge>
                <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">🧠 Smart Tracking</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 flex items-start space-x-3">
                  <Target className="h-5 w-5 text-primary" />
                  <p className="text-xs leading-relaxed">
                    {language === 'en' ? 'Goal: Enable consistent self-evaluation so you know exactly where to improve before exam crunch.' : 'ඉලක්කය: විභාග මර්දයට පෙර කුමන කොටස් වැඩිදියුණු කළ යුතුදැයි නිවැරදිව දැන ගැනීමට ස්ථිර ස්වයං ඇගයීම් හැකිවීම.'}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/20 flex items-start space-x-3">
                  <Globe2 className="h-5 w-5 text-secondary" />
                  <p className="text-xs leading-relaxed">
                    {language === 'en' ? 'Reach: Designed for island-wide accessibility — offline-first mindset with low data impact.' : 'පරාසය: දූපත පුරා ප්‍රවේශය සලසා ගැනීම — අඩු දත්ත පරිභෝගයක් සහිත offline-first අදහස.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Developer Letter (Parchment Theme) */}
      <Card className="relative overflow-hidden border-2 border-amber-700/30 shadow-lg bg-gradient-to-b from-amber-100 via-amber-50 to-amber-200 dark:from-amber-950 dark:via-amber-900 dark:to-amber-950">
        <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay" style={{backgroundImage:'repeating-linear-gradient(45deg, rgba(120,53,15,0.15) 0 4px, transparent 4px 8px)'}}></div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
            <ScrollText className="h-5 w-5" />
            <span>{language === 'en' ? 'A Letter to Every A/L Student' : 'සෑම උසස් පෙළ ශිෂ්යයෙකුටම ලියමනක්'}</span>
          </CardTitle>
          <CardDescription className="text-amber-700/80 dark:text-amber-300/70">
            {language === 'en' ? 'Read this when you feel stuck, tired, or doubtful.' : 'අසාර්ථක, හිරවී, හෝ අවශ්වාසයෙන් සිටින විට මේක කියවන්න.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-6">
          {/* English Letter */}
          <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed text-amber-900 dark:text-amber-100 text-sm">
            <p>
              Hey future scholar! 👋 First, breathe. Seriously — shoulders down, jaw unclench, eyes blink. You're doing something courageous: choosing discipline when ease is always an option. This platform isn't just another marks app — it's a mirror, a compass, and sometimes a reality check. Every number you enter isn't a judgment; it's a breadcrumb on your academic trail across months of effort, focus, and small recoveries after not-so-great days.
            </p>
            <p>
              You might feel others are racing ahead — the student who finishes papers faster, the friend who says "I barely studied" (but somehow scores 80+), or the comparison trap with past you. But progress isn't loud. It's the silent decision to sit for 25 more minutes. It's re-attempting that organic mechanism. It's choosing revision over scrolling. Exams reward consistency more than raw talent — and consistency is a skill you build, not a gift you're born with.
            </p>
            <p>
              Use this tool like an honest coach: log your marks even when they're average, especially when they drop. Patterns matter. Spot weak MCQ topics? Create a mini blitz week. Essays dropping? Outline structure before writing. Timing issues? Practice in strict blocks. And celebrate micro-wins: +5 improvement, finishing a paper without skipping, understanding instead of memorizing. These stack. 📈
            </p>
            <p>
              Also: rest is strategic, not lazy. Burnout pretends to be productivity until your brain refuses. Sleep, hydration, real food, sunlight — these are performance enhancers (legal ones 😄). Talk kindly to yourself. Your internal narration affects retention and recall more than you think. Replace "I can't" with "I haven't mastered this yet." That word 'yet' is powerful.
            </p>
            <p>
              And if you're reading this late at night feeling behind — you're not alone. Thousands of Sri Lankan students are grinding through similar doubts. You're part of a resilient, brilliant community. Your value is not defined by a single rank or letter. You're building resilience, learning frameworks, and intellectual stamina that will outlast any exam hall.
            </p>
            <p>
              So keep showing up — imperfectly is fine. Track honestly. Adjust intelligently. Rest deliberately. Believe stubbornly. Your future self will be so grateful you started measuring instead of guessing. 🌟
            </p>
            <p className="font-semibold text-amber-800 dark:text-amber-200">
              With respect and code,<br />Kaveesha Gimsara
            </p>
          </div>

          {/* Sinhala Toggle */}
          <div className="pt-2">
            <Button variant="outline" size="sm" onClick={() => setShowSinhalaLetter(v=>!v)} className="border-amber-600/40 text-amber-800 dark:text-amber-200 hover:bg-amber-600/10">
              {showSinhalaLetter ? 'Hide Sinhala Version' : 'සිංහල නිකුතුව බලන්න'}
            </Button>
          </div>

          {showSinhalaLetter && (
            <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed text-amber-900 dark:text-amber-100 text-sm animate-fade-in">
              <p>
                ආයුබෝවන් අනාගත ජයග්‍රාහකයානි! 👋 පළමුව හුස්ම ගන්න. උරහිස් පහත් කරන්න, ඇස් පියවලා නැවත විවෘත කරන්න. ඔබ කිරීමේ දේ අභියෝගාත්මකයි: පහසුවේ විකල්පය තිබුණත් अनुශ්ඨානය තෝරා ගැනීම. මේ වේදිකාව සාමාන්‍ය ලකුණු යෙදුමක් නොවෙයි — ඔබේ කුසලතා මාවතක්, දැක්මක් සහ අවස්ථාවවලදී සැබෑ ඇඟවේදය. ඔබ ඇතුල් කරන සෑම අංකයක්ම විනිශ්චයකරුවෙක් නොව — කාලය පුරා ඔබේ උත්සාහයේ breadcrumb එකක්.
              </p>
              <p>
                අනෙක් කවුදෝ ඉදිරියට පනිනයයි වගේ ඔබට දැනේවි — ඉක්මනින් පත්‍ර අවසන් කරන ශිෂ්‍යයා, "මම වැඩියෙන් ඉගෙනෙලා නැහැ" කියන හැබැයි 80+ අරින යාළුවා, හෝ පසුගිය ඔබ එක්ක කරන සසඳීම. නමුත් ප්‍රගතිය අහ් ශබ්දවත් නෑ. එය තව මිනිත්තු 25ක් ඉඳින තීරණය. නැවත organic mechanism එක උත්සාහ කිරීම. Scroll කිරීම වෙනුවට අවලංගු කිරීම තෝරා ගැනීම. විභාග වලට දායක වන්නේ ස්ථිරත්වයයි — සහ ඒක ඔබ ගොඩනගන කුසලතාවක්.
              </p>
              <p>
                මේ මෙවලම විවෘත පුහුණුඥෙකුක් වගේ භාවිතා කරලා බලන්න: සාමාන්‍ය ලකුණු ආවත් ලියන්න. වැටෙද්දී නම් තව වඩාත් ලියන්න. රටා වැදගත්. අඩු MCQ ප්‍රතිඵල? සතියක blitz එකක්. Essay වැටෙද්දී? ලියන්න පෙර ව්‍යුහය ලියන්න. කාලය බිඳ වැටෙද්දී? දැඩි කොටස් වලට විභාග simulation. පුංචි ජයග්‍රහණ වලටට්ටු දෙන්න: +5 වැඩිවීම, එක පත්‍රයක් skip නැතුව අවසන් වීම, මතක කිරීම badunaṭa badila තේරුම්ගැනීම. ඒවා එකතු වෙයි. 📈
              </p>
              <p>
                විවේකය අලාසියක් නෙවෙයි — තාක්ෂණය. කාලය හරියට නාස්ති වෙද්දී මනස ඉගෙනීම අවහිර වෙනවා. නිදාගැනීම, ජලය, සත්‍ය ආහාර, හිරු ආලෝකය — මේවා performance boosters (නීතිසම්මත 😄). ඔබ ඔබට කාරුණිකව කතා කරන්න. "මට බැහැ" වෙනුවට "මට තව mastering කරලා නෑ" කියන්න. 'තව' කියන වචනයට බලය දරයි.
              </p>
              <p>
                රාත්‍රී අවසන් වෙලා ඔබ අස්ථිර තත්ත්වයක තියෙන වේලාවක මේක කියවන්නේ නම් — ඔබ තනි නෙවෙයි. දහස් ගණනක් ශ්‍රී ලාංකික සිසුන්ටත් මේම වගේ සැකය සහ common grind තියෙනවා. ඔබ ප්‍රතිරෝධශීලී හවුල්කාරක පිරිසක කොටසක්. ඔබේ අගය එක අකුරකින් හෝ rank එකකින් තීරණය නොවේ.
              </p>
              <p>
                ඒ නිසා ඉදිරියට යන්න — පරිපූර්ණ නොවුවත් සරිය. සත්‍ය ලෙස ලියන්න. බුද්ධිමත්ව සකස් කරන්න. අදහස්පුර්වක විවේක ගන්න. කටුවෙන්ම විශ්වාස කරන්න. ඔබේ අනාගත ඔබට මේක ගැන ස්තුතියි වේවි. 🌟
              </p>
              <p className="font-semibold text-amber-800 dark:text-amber-200">ගෞරවයෙන් හා කේතය සමඟ,<br />කවීෂ ගිම්සර</p>
            </div>
          )}
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

      {/* Technology Stack removed as per latest requirements */}
      </div>
    </div>
  );
};

export default AboutPage;