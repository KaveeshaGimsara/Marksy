import { GraduationCap, User, MessageSquare, Sparkles, Github, Mail, Globe2, Twitter, MessageCircle, MapPin, Code } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AboutPage = () => {
  const { lang: language } = useLanguage();

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
  designerMsgTitle: "Message from the Designer",
  designerMsg: "Hey amazing student! 🇱🇰✨ This platform was crafted so YOU can see your progress clearly, build confidence step by step, and turn discipline into 🌱 growth and growth into 🚀 results. Don’t wait for ‘perfect’ days—win the small hours: one revision, one past paper, one focused session. 📚 Your marks are not a label; they’re a dashboard—signals to adjust, not reasons to quit. 💡 Track honestly, reflect kindly, improve deliberately. When a topic feels hard, that’s your brain forging new links 🔗—lean in, breathe, keep going. Celebrate micro‑wins 🏅: finishing a chapter, correcting a mistake, asking a smart question. Protect your energy (sleep 😴, water 💧, calm 🧘), because a healthy mind learns faster. Believe that future-you is PROUD of the quiet grind you do today. Keep your curiosity burning 🔥, your notes clear 🗂️, and your goals visible 🎯. You are building something bigger than exam marks—you’re building resilience, wisdom, and possibility. Keep pushing. We’re cheering for you! 💙",
  designerSignature: "— Design Support Team",
  designerNote: "Switch languages using the button above to read this message in Sinhala as well."
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
  designerMsgTitle: "නිර්මාණකරුවාගෙන් පණිවිඩයක්",
  designerMsg: "හෙලෝ ශ්‍රී ලාංකීය උ/පෙ ශිෂ්‍යයාණි! 🇱🇰🌟 මේ වේදිකාව ඔබට ඔබේ ප්‍රගතිය පැහැදිලිව දැක ගන්න, විශ්වාසය අඩි පාද වලින් ගොඩනගන්න, अनुශාසනය 🌱 ප්‍රගතියට, ප්‍රගතිය 🚀 ප්‍රතිඵල වෙත මාරු කරගැනීමට නිර්මාණය කළේය. ‘පරිපූර්ණ’ දිනකට රැඳී නොසිටින්න—කුඩා වේලාව ජයගන්න: එක පිටපතක්, එක කලින් ප්‍රශ්න පත්‍රයක්, එක ඉතා අවධානයෙන් පාඩම් කිරීම. 📚 ලකුණු යනු ඔබට ලේබලයක් නොවෙයි; එය යාවත්කාලීන කළ හැකි නාවික පුවරුවක්—සියුම් සංඥා, නතර වීමට හේතු නොවෙයි. 💡สัตย์සහිතව ලුහුබැඳගන්න, හෘදයාංගමව පරීක්ෂා කරන්න, සැලසුම් සහිතව වර්ධනය වෙන්න. අවාසනාවන්ත ලෙස දැනෙන විෂය කොටසක් ඔබේ මනස නව සම්බන්ධක 🔗 නිර්මාණය කරන මොහොතක්. ඉවසිලිවන්ත වන්න, හුස්ම ගන්න, ඉදිරියට යන්න. සුළු ජයග්‍රහණ 🏅 සැමරන්න: කථාංකයක් නිම කරනවා, වැරැද්දක් නිවැරදි කරනවා, ප්‍රශ්නයක් අසනවා. ශක්තිය ආරක්ෂා කරගන්න (නින්ද 😴, ජලය 💧, ප්‍රශාන්තය 🧘) —විවේකී මනස ඉක්මනින් ඉගෙන ගනී. අද ඔබ කරන නිහතමානී পরিশ്രമය සඳහා අනාගත ඔබ ගවේෂණය කරයි. උනන්දුව 🔥 තබාගන්න, සටහන් පිරිසිදු 🗂️ තබාගන්න, ඉලක්ක 🎯 දෘශ්‍යමාන තබාගන්න. විභාග ලකුණු පමණක් නොව—ඔබ ගොඩනගන්නේ ධෛර්යය, ජ്ഞානය සහ අවස්ථා. ඉදිරියට පියවර ගන්න! 💙",
  designerSignature: "— නිර්මාණ සහාය කණ්ඩායම",
  designerNote: "මෙම පණිවිඩය සිංහලෙන්ද කියවීමට ඉහළ ඇති බොත්තම භාවිතයෙන් භාෂාව මාරු කරන්න."
    }
  };

  const currentContent = content[language];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="text-center relative">
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

      {/* Enhanced Developer Section with Static Image and Responsive Design */}
      <Card className="academic-card overflow-hidden p-0">
        {/* Banner background */}
        <div className="h-28 sm:h-40 w-full relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#6D5ACF] via-[#8470FF] to-[#6366F1]"></div>
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_25%_35%,hsl(var(--primary)),transparent_60%)]"></div>
        </div>

        <div className="grid sm:grid-cols-4">
          {/* Profile section */}
          <div className="sm:col-span-1 bg-gradient-to-b from-[#5D4AB5]/95 via-[#6D5ACF]/80 to-[#6366F1]/50 px-6 pb-6 pt-0 -mt-10 sm:pb-10 relative flex flex-col">
            {/* Profile image - positioned over banner background */}
            <div className="mx-auto sm:mx-0 -mt-16 sm:-mt-20 mb-6">
              <div className="relative w-32 h-32 sm:w-28 sm:h-28 md:w-32 md:h-32 group">
                {/* Updated border with hover effect but no rolling */}
                <div className="absolute inset-0 rounded-full bg-[#6D5ACF] p-[3px] shadow-lg 
                    transition-all duration-500 
                    group-hover:bg-gradient-to-r group-hover:from-[#8A4FFF] group-hover:to-[#4F74FF]
                    group-hover:shadow-xl group-hover:shadow-primary/20">
                  <div className="w-full h-full rounded-full bg-[#18122B] flex items-center justify-center overflow-hidden 
                      transition-all duration-300
                      group-hover:bg-gradient-to-b group-hover:from-[#231942] group-hover:to-[#2E1A47]">
                    {/* Cartoon boy image with hover animation but no rotation */}
                    <div className="rounded-full overflow-hidden w-full h-full
                        transition-all duration-500">
                      <img 
                        src="/cartoon-boy.svg" 
                        alt="Cartoon Boy Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Add hover effect glow */}
                <div className="absolute inset-0 rounded-full opacity-0 
                    transition-opacity duration-500
                    group-hover:opacity-70 group-hover:animate-pulse
                    bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl"></div>
              </div>
            </div>

            <div className="text-center sm:text-left space-y-4">
              <h3 className="text-xl font-bold text-white">Kaveesha Gimsara</h3>
              <p className="text-xs uppercase tracking-wider text-white/70 font-medium leading-relaxed">
                🇱🇰 SRI LANKAN A/L STUDENT & ENTHUSIAST
              </p>

              <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mt-2">
                <span className="px-3 py-1.5 rounded bg-[#1E1538]/60 text-[11px] text-white">
                  Web Dev
                </span>
                <span className="px-3 py-1.5 rounded bg-[#1E1538]/60 text-[11px] text-white">
                  Designer
                </span>
              </div>

              {/* Social links with updated links */}
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-2">
                <a href="mailto:kaveegimx@gmail.com" className="p-2 rounded-full bg-[#1E1538]/60 text-white hover:bg-[#2A1F50]/80 transition-colors">
                  <Mail className="w-4 h-4" />
                </a>
                <a href="https://github.com/kaveeshagimsara" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-[#1E1538]/60 text-white hover:bg-[#2A1F50]/80 transition-colors">
                  <Github className="w-4 h-4" />
                </a>
                <a href="https://twitter.com/kaveeshagimsara" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-[#1E1538]/60 text-white hover:bg-[#2A1F50]/80 transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="https://bento.me/kaveegimx" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-[#1E1538]/60 text-white hover:bg-[#2A1F50]/80 transition-colors">
                  <Globe2 className="w-4 h-4" />
                </a>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 pt-4">
                {[
                  { label: "PROJECTS", value: "100+" },
                  { label: "EXPERIENCE", value: "5+ yrs" },
                  { label: "STACK", value: "10+" }
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <p className="text-sm font-semibold text-white">{s.value}</p>
                    <p className="text-[10px] tracking-wide text-white/60 uppercase">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content section */}
          <div className="sm:col-span-3 p-6 space-y-4">
            <h4 className="text-sm font-semibold tracking-wider text-primary uppercase">
              Developer Information
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              {currentContent.devDesc}
            </p>
            
            {/* Focus areas with better responsiveness */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-lg bg-muted/40 border border-border/40">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Focus</p>
                <p className="text-sm">Educational analytics & performant UI engineering.</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/40 border border-border/40">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Goal</p>
                <p className="text-sm">Empower A/L students through data clarity and motivation.</p>
              </div>
            </div>
            
            {/* Skills tags */}
            <div className="flex flex-wrap gap-2">
              {["Accessibility", "Performance", "Clean Design", "Student Success"].map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-[11px] bg-gradient-to-r from-primary/15 to-secondary/15 border border-primary/20 text-primary font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
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

      {/* Designer Message */}
      <Card className="academic-card">
        <CardHeader>
          <CardTitle>{currentContent.designerMsgTitle}</CardTitle>
          <CardDescription>
            {currentContent.designerNote}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground mb-4">
            {currentContent.designerMsg}
          </p>
          <p className="text-xs font-medium text-primary/80">{currentContent.designerSignature}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPage;