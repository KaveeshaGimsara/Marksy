import { useState } from "react";
import { GraduationCap, User, MessageSquare, Sparkles, Target, Globe2, BookOpen, ScrollText, Coffee } from "lucide-react";
// NOTE: This AboutPage includes enhanced parchment letter styling, social links with animated globe highlighting Sri Lanka.
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AboutPageProps } from "@/types";
import HeartLogo from "@/components/HeartLogo";

const AboutPage = ({ language: initialLanguage }: AboutPageProps) => {
  const [language] = useState<"en" | "si">(initialLanguage || "en");
  const [imageClicked, setImageClicked] = useState(false);
  const [showSinhalaLetter, setShowSinhalaLetter] = useState(false);

  const content = {
    en: {
      title: "About Marksy",
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

      {/* Developer Letter (Parchment Theme - Enhanced) */}
      <Card className="relative overflow-hidden border-[3px] border-amber-700/40 shadow-xl bg-[radial-gradient(circle_at_30%_20%,#fff8e1,#fde68a_40%,#f59e0b_75%,#b45309_100%)] dark:bg-[radial-gradient(circle_at_30%_20%,#451a03,#92400e_35%,#b45309_55%,#78350f_85%,#431407_100%)]">
        {/* Textured overlay + subtle vignette */}
        <div className="absolute inset-0 pointer-events-none opacity-25 mix-blend-overlay" style={{backgroundImage:'repeating-linear-gradient(45deg, rgba(120,53,15,0.18) 0 4px, transparent 4px 8px)'}}></div>
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_55%,rgba(120,53,15,0.25))] dark:bg-[radial-gradient(circle_at_center,transparent_55%,rgba(0,0,0,0.55))]" />
        <div className="absolute -inset-px rounded-md border border-amber-600/40 shadow-inner pointer-events-none" style={{boxShadow:'inset 0 0 20px rgba(146,64,14,0.35), 0 0 8px rgba(245,158,11,0.25)'}} />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-900 drop-shadow-sm dark:text-amber-100">
            <ScrollText className="h-5 w-5" />
            <span>{language === 'en' ? 'A Letter to Every A/L Student' : 'සෑම උසස් පෙළ ශිෂ්යයෙකුටම ලියමනක්'}</span>
          </CardTitle>
          <CardDescription className="text-amber-700/90 dark:text-amber-200/70 italic">
            {language === 'en' ? 'Read this when you feel stuck, tired, or doubtful.' : 'අසාර්ථක, හිරවී, හෝ අවශ්වාසයෙන් සිටින විට මේක කියවන්න.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-6">
          {/* English Letter */}
          <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed text-amber-900 dark:text-amber-100 text-sm">
            <p>
              <span className="first-letter:text-4xl first-letter:font-extrabold first-letter:mr-1 first-letter:float-left first-letter:font-serif first-letter:text-amber-600 dark:first-letter:text-amber-400">H</span>ey there, 👋
            </p>
            <p>
              I'm not sure of your age or what level you're at. But I bet you clicked this link and came here looking for an answer, right? 🤔
            </p>
            <p>
              Initially, my biggest problem was figuring out how to manage my papers and keep track of my scores to see my progress. I found some good sites and apps for it, but they never had a free version. So, I thought to myself, 'This isn't gonna work.' I decided to create my own 100% free tool to track my progress. 💻✨
            </p>
            <p>
              In the end, I put in the hard work and built this site. There's no point in me being the only one to benefit from my effort, right? So, I decided to share it with everyone who's also putting in the effort. I've added as many features as I could and hosted it.
            </p>
            <p>
              Now, it's your turn to get your work organized. 🚀
            </p>
            <p>
              <span className="font-semibold text-amber-700 dark:text-amber-300">Privacy & Policy</span><br />
              Your data (details, scores) isn't saved anywhere else but on your device, so you don't have to worry about that. There are no login or signup buttons, which means no one else can access your data. However, remember to carefully export the file you get from your Profile if you switch your browser or delete it. That's where all your data is stored.
            </p>
            <p>
              <span className="font-semibold text-amber-700 dark:text-amber-300">Self Study</span><br />
              You can get into this work with passion and even become addicted to doing papers. You can complete achievements and earn badges. You can also add a To-Do List to get your work done systematically. As I said at the start, I built this for solo studying. So, make the most of it. It doesn't cost a single cent. 😉
            </p>
            <p>
              <span className="font-semibold text-amber-700 dark:text-amber-300">Important</span><br />
              Make sure to export your data and keep it safe at least once a day. You never know what might happen.
            </p>
            <p>
              <span className="font-semibold text-amber-700 dark:text-amber-300">Data Export & Import</span><br />
              You can store your data in both .XLS and .JSON formats. You can open the .XLS file with software like Excel to edit and add data, or see your progress beyond the site itself.
            </p>
            <p className="font-semibold text-amber-800 dark:text-amber-200">
              Good Luck buddies 🐼❤️
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
                <span className="first-letter:text-4xl first-letter:font-extrabold first-letter:mr-1 first-letter:float-left first-letter:font-serif first-letter:text-amber-600 dark:first-letter:text-amber-400">හෙ</span>ලෝ හෙලෝ, 👋
              </p>
              <p>
                මම දන්නෙ නෑ මේක කියවන ඔයා මොන වයසෙද, මොන මට්ටමකද කියලා. හැබැයි මේ ලින්ක් එක ක්ලික් කරලා මේකට ආවේ අනිවාර්යයෙන්ම මොකක් හරි උත්තරයක් හොයාගන්න වෙන්න ඇති, නේද? 🤔
              </p>
              <p>
                මුලින්ම මට තිබුණ ලොකුම ප්‍රශ්නයක් තමයි පේපර්ස් මැනේජ් කරගන්නෙ කොහොමද, ඒ වගේම ඒවායේ ලකුණු පිළිවෙලකට තියාගෙන ප්‍රොග්‍රස් එක බලන්නෙ කොහොමද කියන එක. මේකට හොඳ සයිට්ස්, ඇප්ස් ටිකක් හම්බ වුණා, හැබැයි ඒවයේ ෆ්‍රී වර්ෂන් නම් තිබුණෙම නෑ. ඒක නිසා මට හිතුණා මේ වැඩේ හරියන්නෙ නෑ, කොහොම හරි 100% ෆ්‍රී එකක් හදාගෙන මගේම ප්‍රොග්‍රස් එක බලාගන්න ඕනෙ කියලා. 💻✨
              </p>
              <p>
                අන්තිමට මම මහන්සි වෙලා මේ සයිට් එක හැදුවා. මගේ මහන්සියෙන් මම විතරක් ප්‍රයෝජන අරන් වැඩක් නෑනෙ. ඒක නිසා මම හිතුවා මහන්සි වෙන සෙට් එකක් එක්ක මේක බෙදාගන්න ඕනෙ කියලා. මම මේකට පුළුවන් තරම් ෆීචර්ස් ඇඩ් කරලා හොස්ට් කළා.
              </p>
              <p>
                දැන් තියෙන්නෙ ඔයාලගෙ වැඩ ටික පිළිවෙලකට කරගෙන යන්න. 🚀
              </p>
              <p>
                <span className="font-semibold text-amber-700 dark:text-amber-300">පෞද්ගලිකත්වය සහ ප්‍රතිපත්තිය (Privacy & Policy)</span><br />
                සයිට් එකේ ඩේටා (විස්තර, ලකුණු) ඔයාගේ ඩිවයිස් එකේ ඇර වෙන කොහෙවත් සේව් වෙන්නෙ නෑ. ඒ නිසා ඒ ගැන බය වෙන්න එපා. ලොගින්, සයින්අප් බටන් මුකුත් නෑ. ඒ නිසා ඔයාගේ ඩේටා වෙන කාටවත් ලොක් වෙන්නෙත් නෑ. හැබැයි, මතක ඇතුව ඔයා බ්‍රවුසර් එක මාරු කරනවා නම් හරි, බ්‍රවුසර් එක ඩිලීට් කරනවා නම් හරි, ප්‍රොෆයිල් වලට ගිහින් එක්ස්පෝර්ට් කරලා එන ෆයිල් එක පරිස්සමෙන් තියාගන්න. ඒකෙ තමා ඔයාගේ ඔක්කොම ඩේටා තියෙන්නෙ.
              </p>
              <p>
                <span className="font-semibold text-amber-700 dark:text-amber-300">ස්වයං අධ්‍යයනය (Self Study)</span><br />
                මේ වැඩේ තනියම ආසාවෙන් කරගෙන යන්න වගේම ඇඩික්ට් වෙලා වගේ පේපර්ස් කරලා ඇචීව්මන්ට් කම්ප්ලීට් කරන්න, බෑජ් ගන්න පුළුවන්. ඒ වගේම ටු-ඩූ ලිස්ට් ඇඩ් කරලා ඔයාගේ වැඩ ටික පිළිවෙලකට කරගෙන යන්නත් පුළුවන්. මුලින්ම කිව්වනෙ මේක හැදුවෙ තනියෙන් ඉගෙන ගන්න කියලා. ඒ නිසා පුළුවන් තරම් ප්‍රයෝජනෙ ගන්න. සතයක්වත් යන්නෙ නෑනෙ. �
              </p>
              <p>
                <span className="font-semibold text-amber-700 dark:text-amber-300">වැදගත් (Important)</span><br />
                අනිවාර්යයෙන් දවසකට සැරයක්වත් ඩේටා එක්ස්පෝර්ට් කරලා පරිස්සමෙන් තියාගන්න. මොනවා වෙයිද කියලා කියන්න බෑනෙ.
              </p>
              <p>
                <span className="font-semibold text-amber-700 dark:text-amber-300">ඩේටා එක්ස්පෝර්ට් සහ ඉම්පෝර්ට් (Data Export & Import)</span><br />
                .XLS සහ .JSON කියන ෆෝමැට් දෙකෙන්ම ඔයාලගේ ඩේටා ස්ටෝර් කරගන්න පුළුවන් විදියට දීලා තියෙනවා. .XLS එක එක්සෙල් වගේ සොෆ්ට්වෙයාර් එකකින් ඕපන් කරලා ඩේටා එඩිට් කරන්න, ඇඩ් කරන්න. සයිට් එකට එහා ගිය ප්‍රොග්‍රස් බලන්නත් පුළුවන්.
              </p>
              <p>
                ආ, කියන්න බැරි වුණා. කඩ්ඩ බැරි අයට, ඔන්න ඔය උඩ කෙළවරේ බට්න් එකක් ඇති. ඒක ඔබලා සිංහලට දාගන්න පුලාන්. 😉
              </p>
              <p className="font-semibold text-amber-800 dark:text-amber-200">
                ගෞරවයෙන් හා කේතය සමඟ,<br />කවීෂ ගිම්සර
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact & Social Presence (Enhanced) */}
      <Card className="academic-card relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/5 via-transparent to-amber-500/10" />
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 relative">
            <MessageSquare className="h-5 w-5" />
            <span>{currentContent.contact}</span>
            <span className="ml-2 text-xs rounded-full px-2 py-0.5 bg-gradient-to-r from-sky-500/20 to-fuchsia-500/20 text-primary border border-primary/20">Connect</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Globe + Highlight */}
            <div className="relative flex flex-col items-center justify-center p-4 rounded-lg border bg-background/50 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.25),transparent_70%)]" />
              <div className="w-40 h-40 relative">
                {/* Placeholder for rotating globe (implemented next) */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" className="w-40 h-40 text-sky-500/80 dark:text-sky-300/70 animate-[spin_18s_linear_infinite] will-change-transform">
                    <defs>
                      <radialGradient id="oceanGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.9" />
                        <stop offset="70%" stopColor="#0369a1" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.95" />
                      </radialGradient>
                      <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#16a34a" />
                        <stop offset="100%" stopColor="#15803d" />
                      </linearGradient>
                      <linearGradient id="latLine" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
                        <stop offset="50%" stopColor="#bae6fd" stopOpacity="0.55" />
                        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="lonLine" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
                        <stop offset="50%" stopColor="#bae6fd" stopOpacity="0.55" />
                        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <circle cx="100" cy="100" r="92" fill="url(#oceanGrad)" stroke="#082f49" strokeWidth="3" />
                    {/* Simplified abstract land masses */}
                    <path d="M70 60 Q85 40 110 50 Q130 60 125 80 Q120 95 100 90 Q85 88 75 75 Z" fill="url(#landGrad)" opacity="0.9" />
                    <path d="M55 115 Q70 100 90 105 Q110 115 108 135 Q100 150 78 145 Q60 140 55 130 Z" fill="url(#landGrad)" opacity="0.85" />
                    {/* Latitude lines */}
                    {[-60,-30,0,30,60].map((lat,i)=>{
                      const ry = 92*Math.cos(lat*Math.PI/180);
                      const cy = 100 + 92*Math.sin(lat*Math.PI/180)*0; // center stays
                      return <ellipse key={i} cx={100} cy={cy} rx={92} ry={ry} fill="none" stroke="url(#latLine)" strokeWidth={0.8} />
                    })}
                    {/* Longitude lines */}
                    {[0,30,60,90,120,150].map((lon,i)=>{
                      const x = 100;
                      return <path key={i} d={`M ${x} 8 Q ${100+92*Math.sin(lon*Math.PI/180)} 100 ${x} 192`} fill="none" stroke="url(#lonLine)" strokeWidth={0.7} strokeLinecap="round" />
                    })}
                    {/* Gloss highlight */}
                    <ellipse cx="85" cy="70" rx="55" ry="28" fill="#ffffff" opacity="0.08" />
                    {/* Sri Lanka marker (approx location right of India land mass) */}
                    <g>
                      <circle cx="132" cy="112" r="5" className="animate-ping" fill="#fbbf24" opacity="0.55" />
                      <circle cx="132" cy="112" r="3" fill="#f59e0b" stroke="#fff8" strokeWidth="1" />
                    </g>
                  </svg>
                </div>
                <div className="absolute inset-0 rounded-full shadow-[0_0_12px_rgba(14,165,233,0.35)_inset]" />
              </div>
              <p className="mt-3 text-xs text-center text-muted-foreground max-w-[10rem]">Global reach, Sri Lankan focus.</p>
            </div>

            {/* Social Links */}
            <div className="md:col-span-2 space-y-4">
              <p className="text-sm text-muted-foreground">Find me across platforms — collaboration, feedback, or ideas are always welcome.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <a href="https://github.com/kaveeshagimsara" target="_blank" rel="noopener noreferrer" className="group relative p-3 rounded-lg border bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 hover:shadow-md transition-all">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-slate-500/20 to-slate-800/20 dark:from-slate-400/10 dark:to-slate-700/10 transition-opacity" />
                  <div className="flex flex-col items-center gap-1">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-slate-700 dark:text-slate-200"><path fill="currentColor" d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.68c.5.09.68-.22.68-.49c0-.24-.01-.87-.01-1.71c-2.78.62-3.37-1.37-3.37-1.37c-.45-1.16-1.11-1.47-1.11-1.47c-.91-.64.07-.63.07-.63c1 .07 1.53 1.06 1.53 1.06c.9 1.57 2.36 1.12 2.94.85c.09-.67.35-1.12.63-1.38c-2.22-.26-4.56-1.14-4.56-5.07c0-1.12.39-2.03 1.03-2.75c-.1-.26-.45-1.3.1-2.71c0 0 .84-.27 2.75 1.05c.8-.23 1.65-.35 2.5-.35c.85 0 1.7.12 2.5.35c1.9-1.32 2.74-1.05 2.74-1.05c.55 1.41.2 2.45.1 2.71c.64.72 1.03 1.63 1.03 2.75c0 3.94-2.34 4.81-4.57 5.06c.36.32.68.95.68 1.92c0 1.38-.01 2.49-.01 2.83c0 .27.18.59.69.49C19.14 20.57 22 16.75 22 12.26C22 6.58 17.52 2 12 2Z"/></svg>
                    <span className="text-[10px] font-medium text-slate-700 dark:text-slate-200">GitHub</span>
                  </div>
                </a>
                <a href="https://instagram.com/kavee_gimx" target="_blank" rel="noopener noreferrer" className="group relative p-3 rounded-lg border bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 dark:from-pink-900/30 dark:via-fuchsia-900/20 dark:to-orange-900/20 hover:shadow-md transition-all">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-pink-500/30 via-fuchsia-500/30 to-amber-400/30 transition-opacity" />
                  <div className="flex flex-col items-center gap-1">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-pink-600 dark:text-pink-300"><path fill="currentColor" d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4A5.8 5.8 0 0 1 16.2 22H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4A3.8 3.8 0 0 0 20 16.2V7.8A3.8 3.8 0 0 0 16.2 4H7.8m10.45 1.25a1.05 1.05 0 0 1 1.05 1.05a1.05 1.05 0 0 1-1.05 1.05a1.05 1.05 0 0 1-1.05-1.05a1.05 1.05 0 0 1 1.05-1.05M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3Z"/></svg>
                    <span className="text-[10px] font-medium text-pink-700 dark:text-pink-200">Instagram</span>
                  </div>
                </a>
                <a href="https://t.me/kaveeshagimsara" target="_blank" rel="noopener noreferrer" className="group relative p-3 rounded-lg border bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/30 dark:to-blue-900/30 hover:shadow-md transition-all">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-sky-400/30 to-blue-600/30 transition-opacity" />
                  <div className="flex flex-col items-center gap-1">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-sky-600 dark:text-sky-300"><path fill="currentColor" d="m9.04 16.81l-.39 3.89c.56 0 .8-.24 1.09-.53l2.62-2.5l5.43 3.97c.99.55 1.69.26 1.96-.91l3.56-16.67v-.01c.32-1.49-.54-2.07-1.5-1.71L1.16 10.85c-1.45.56-1.43 1.37-.26 1.74l5.54 1.73l12.87-8.11c.6-.39 1.15-.17.7.22"/></svg>
                    <span className="text-[10px] font-medium text-sky-700 dark:text-sky-200">Telegram</span>
                  </div>
                </a>
                <a href="https://bento.me/kaveegimx" target="_blank" rel="noopener noreferrer" className="group relative p-3 rounded-lg border bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 hover:shadow-md transition-all">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-emerald-500/30 to-green-600/30 transition-opacity" />
                  <div className="flex flex-col items-center gap-1">
                    <Globe2 className="w-6 h-6 text-emerald-600 dark:text-emerald-300" />
                    <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-200">Bento</span>
                  </div>
                </a>
                <a href="https://twitter.com/kaveeshagimsara" target="_blank" rel="noopener noreferrer" className="group relative p-3 rounded-lg border bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50 dark:from-sky-900/30 dark:via-cyan-900/30 dark:to-blue-900/30 hover:shadow-md transition-all">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-sky-500/30 via-cyan-500/30 to-blue-500/30 transition-opacity" />
                  <div className="flex flex-col items-center gap-1">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-sky-600 dark:text-sky-300" fill="currentColor"><path d="M17.316 6.246c-1.136.066-2.087.52-2.75 1.497-.316.465-.463.94-.463 1.537v8.444c0 .133-.047.199-.18.199-.125 0-.278-.066-.49-.199l-1.973-1.3c-.445-.3-.86-.432-1.34-.432-.463 0-.86.133-1.242.432l-2.734 2.05c-.098.066-.21.1-.29.1-.148 0-.23-.1-.23-.266V9.28c0-1.004.148-1.537.56-2.103.463-.632 1.242-1.05 2.07-1.05.683 0 1.34.233 1.9.699.168.133.316.199.43.199c.133 0 .23-.066.363-.199c.607-.6 1.496-.931 2.422-.931c.364 0 .86.066 1.192.166c.18.066.296.1.41.1c.18 0 .296-.066.476-.232c.54-.532 1.192-.798 1.9-.798c1.34 0 2.55.865 2.892 2.13c.082.332.115.665.115 1.164v8.444c0 .133-.047.199-.18.199c-.13 0-.262-.066-.49-.199l-1.9-1.232c-.445-.3-.893-.432-1.34-.432c-.463 0-.927.133-1.34.432l-2.65 1.884c-.246.166-.395.232-.523.232c-.164 0-.246-.1-.246-.266v-8.51c0-.465.066-.798.21-1.13c.43-1.03 1.43-1.662 2.6-1.662c.86 0 1.69.366 2.267 1.03c.36.432.54.865.54 1.429v6.676c0 .133-.047.199-.18.199c-.13 0-.23-.066-.49-.199l-1.65-1.064c-.3-.2-.625-.332-.973-.366c-.082 0-.117-.066-.117-.166v-4.58c0-.133.05-.199.184-.199c.117 0 .245.066.43.199l2.084 1.497V9.28c0-1.497-.86-2.383-2.2-2.317Z"/></svg>
                    <span className="text-[10px] font-medium text-sky-700 dark:text-sky-200">Twitter</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support / Buy Me a Coffee */}
      <div className="pt-4 flex justify-center">
        <a
          href="https://buymeacoffee.com/geekyedu"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white text-sm font-semibold shadow hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 dark:focus:ring-offset-background"
          aria-label="Support project via Buy Me a Coffee"
        >
          <Coffee className="h-4 w-4 drop-shadow-sm group-hover:scale-110 transition-transform" />
          <span>Support This Project</span>
          <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded-full">Buy Me a Coffee</span>
        </a>
      </div>

      {/* Technology Stack removed as per latest requirements */}
      </div>
    </div>
  );
};

export default AboutPage;