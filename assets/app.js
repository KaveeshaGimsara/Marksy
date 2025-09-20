// Utility localStorage keys
const LS_KEYS = {
  name: "marksy_student_name",
  marks: "marksy_marks_v1"
};

// Admin-managed data (edit here)
const notices = [
  { text: "අද Physics revision session 4pm Zoom එකට late වෙන්න එපා 😂", tag:"CLASS", important: true },
  { text: "Maths past paper pack upload උනා. බලලා marks add කරන්න.", tag:"UPDATE", important: false },
  { text: "Next week chem practical demo one shot! goggles ගෙනාවත්!", tag:"LAB", important: true },
  { text: "Group study Sunday. Bring snacks not excuses 😎", tag:"STUDY", important: false },
  { text: "A/L mock exams rescheduled to October 15th!", tag:"EXAM", important: true },
  { text: "New Biology notes available on the class drive", tag:"UPDATE", important: false }
];
const events = [
  { name:"A/L Physics Mock", date:"2025-10-15T08:00:00", note:"Do past MCQs daily." },
  { name:"A/L Combined Maths Mock", date:"2025-11-02T08:00:00", note:"Vectors revise." },
  { name:"Chemistry Theory Paper", date:"2025-11-20T08:00:00", note:"Organic summary cards." },
  { name:"Final A/L Exams Start", date:"2025-12-02T08:00:00", note:"Calm > Panic." }
];

// 110 Sinhala motivational quotes (original casual lines)
const quotes = [
"පැත්තකින් scroll කරන්න අරන් marks improve වෙන්නෙ නෑ ne 😂",
"තව page එකක් open කලත් brain cache එක clear වෙන්නේ නෑ. Study little now.",
"ඕක කරලා දැම්මොත් future self එක ඔයාට treat දෙයි.",
"දවසේ minutes 1440. ඒකෙන් 30ක් අධ්‍යාපනයට දාන්න බැරිද?",
"Coffee එක strong. ඔයාගේ willpower එක stronger කරන්න.",
"‘Later’ කියනවා future panic එකට loan book කරගැනීම තමයි.",
"Small step කියලා underestimate කරන්න එපා. ඒවෙන් තමයි marathon pass.",
"අද කරන MCQ එක exam day වෙද්දී free mark එකක්.",
"Sleep deprivation heroism නෙවෙයි. Smart scheduling තමයි game එක.",
"Brain එකට reps ඕන. එකපාර cramming කරන්න එපා.",
"ඔයා fail unoth? data එකක් ලැබුණා. ඒක use කරලා tune කරගන්න.",
"Progress slowද? Slow > Stop 💪",
"Comparison = motivation killer. Yesterday version එකත් compare කරන්න.",
"Pen එක අරන් start කරලා දාලා පස්සෙ momentum තමයි වැඩ.",
"WiFi drop una wage distraction cut කරල focus mode on කරන්න.",
"Study timer 25min set කර. Start now. Future thanks.",
"Blank page එක දකිද්දි පැනලා යන්න එපා. One word එකකින් start.",
"ඕබ්බට possible කියන එක doubt වෙද්දි previous wins check කරන්න.",
"Rest day එක luxury නෙවෙයි. එය brain upgrade patch.",
"Consistency > Motivation bursts.",
"Revision කියන්නේ reheating නෙවෙයි. Rebuilding neural path එක.",
"Guesswork reduce කරන්න past errors list එක revise කරන්න.",
"ඔයාට boredද? Skill level උඩ යන sign එකක් sometimes.",
"එදා fail උන topic එකට revenge session එකක් දාපං 😂",
"Short notes කියලා novel එකක් මැද ලියන්න එපා. Laser notes!",
"Phone silent? Good. Mind silent? Better.",
"Exam hall එකේ confidence build වෙන්නේ අදෙයි.",
"අනේ මචං කියලා postpone කරන්න life එකට bug එකක් දානවා.",
"Energy drop වෙද්ද? पानी / вода / water. Drink!",
"Mind wandering? Todo list එකට capture කරලා brain RAM free.",
"Average plan + high consistency = win formula.",
"ඔයාට heavy day එකක්ද? 10 minute micro win එකක් still possible.",
"Learning curve zig-zag. Dip එක quit reason නෙවෙයි.",
"Error එකකින් shame වුනොත් growth patch skip වෙනවා.",
"Explain to imaginary friend method භාවිතා කරලා gaps catch කරන්න.",
"Track marks = debug learning.",
"එයාලා හුඟාක් කියනවා කියලා ඔයාට ඒව follow කරන්න ඕන නෑ. Fit filtering.",
"Try එකක් දුන්නොත් chance 50%. Try නොදුන්නොත් 0%.",
"Habits build වෙන්නේ invisible mode. Suddenly visible results.",
"Scrolling dopamine cheap. Achieving marks dopamine premium.",
"Start small නම් shame දැනෙන්න එපා. Small snowball > big statue.",
"Pomodoro එකක් now. Just one. Deal?",
"Note color overload = holiday lights. Keep contrast simple.",
"ඔයාට tiredද මැද session එක? Stand up 30 sec reset.",
"Topic එක අමාරුද? Break down mini boss fights.",
"Study group එක gossip group එකක් වෙලාද? Refocus!",
"Brain fog? Maybe need oxygen. Window open කරන්න.",
"Progress track කරලා celebrate micro wins.",
"‘I can’t’ -> ‘I can’t yet’.",
"Hard subject එක future bragging rights generator 😂",
"Retry > Regret.",
"MCQ mistakes list එක අඟහරු දිනයට එවලා නොතබන්න. Daily glance.",
"Time table realisticද? Fantasy plan burnout machine.",
"Focus playlist එක loop වෙනවාද? Get fresh beats.",
"Evening slump? Light snack + water + 5 jumping jacks.",
"Mark drop? Investigate root not mood.",
"Study streak break වෙලාද? Day 1 again. Shame නෑ.",
"Exam fear = unclear prep. Clarify plan -> reduce fear.",
"Maths proof stuck? Draw / visualise.",
"Definition rote? Apply to example immediate.",
"Flashcards overstuff? Split deck lighten.",
"Procrastination = task undefined. Define first step only.",
"ඔයා late startද? Late > Never. Sprint calmly.",
"Before sleep 5min recall = memory glue.",
"Explain aloud awkwardද? Works though 😂",
"Brain not USB. Repetition spaced need.",
"Overhighlight syndrome cure = active recall.",
"Social media flex ignore. Private grind focus.",
"Deep breath 4s in 6s out calm circuit reset.",
"Quit thought popup? Observe. Not obey.",
"Teacher feedback = free cheatcode.",
"Today perfect නැත්තම් tomorrow sabotage කරන්න එපා.",
"Checklist tick dopamine harness wisely.",
"Exam countdown බලලා panic නෙවෙයි prioritize.",
"Library vibes needද? Create mini vibe home.",
"Motivation letter future self ලියලා wall එකට දාපං.",
"Uninstall one distraction app today? Try.",
"Study posture slump? Oxygen drop -> focus drop.",
"Hard start? Open book only rule. Momentum follows.",
"Wrong answer shame? Hidden lesson treasure.",
"Break = strategy. Not weakness.",
"Mind racing? Brain dump page.",
"Late night guesswork = morning rework.",
"Topic mastered? Teach junior friend.",
"Small rewrite summary after lesson cement.",
"Practice under timed mode simulate exam stress inoculation.",
"Healthy snack > sugar crash.",
"Sleep > extra 2am random reread.",
"Confidence built by evidence. Generate evidence daily.",
"Replace ‘I must’ with ‘I choose’. Autonomy boosts.",
"Check syllabus item tick after session. Feels good.",
"Hard question flag comeback later. Momentum save.",
"Background TV silent killer. Off.",
"Study desk clutter purge 2min ritual.",
"Start assignment early beta version.",
"Score low? Graph trend not single dot.",
"Celebrate improvement not only perfection.",
"Shortcut skipping basics future tax.",
"Review session start with previous mistakes recap.",
"Study buddy accountability message now. Go.",
"Battery low? So are you. Charge both.",
"Rewrite messy note tidy revision.",
"Track distract count -> gamify reduction.",
"Use exam paper margins plan attack first.",
"Reminder: You are capable. Evidence loading...",
"One focused hour today > three scattered tomorrow.",
"Curiosity mode on: ask why twice.",
"Hydrate brain: sip now.",
"Past you wished for this chance. Use it.",
"Every revise pass smooth edges sharp skill.",
"Discipline is choosing what you want most over now.",
"ඔයාලට පුළුවන්. Calm grind continue.",
"අධිශක්ති තියෙන්නේ consistency superpower එකේ.",
"හිනා වෙන්නත් ඉගෙනගන්නත් parallel run කරන්න පුළුවන්!",
"අද අඩු mark? නැගිටින්නේ ඒකෙන්.",
];

// Simple helpers
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

// Init
document.addEventListener("DOMContentLoaded", () => {
  setYear();
  initName();
  initClock();
  initQuickAccess();
  initNotices();
  initQuotes();
  initMarksDisplays();
  initEvents();
  initMarkForm();
  initAnalyzePage();
});

// Year
function setYear(){
  const y = new Date().getFullYear();
  $$("#year").forEach(el => el.textContent = y);
}

// Name handling
function initName(){
  const greet = $("#greeting");
  const form = $("#nameForm");
  const btn = $("#setNameBtn");
  if(!greet || !btn) return;
  const stored = localStorage.getItem(LS_KEYS.name);
  
  if(stored && stored.trim() !== ""){
    greet.textContent = `Hello ${stored} 👋`;
    greet.classList.remove("hidden");
    btn.textContent = "Change Name";
    btn.classList.remove("hidden");
  } else {
    greet.classList.add("hidden");
    btn.textContent = "Set Your Name";
    btn.classList.remove("hidden");
  }
  
  btn.addEventListener("click", () => {
    form.classList.toggle("hidden");
  });
  
  form.addEventListener("submit", e => {
    e.preventDefault();
    const val = $("#studentNameInput").value.trim();
    if(!val) return;
    
    localStorage.setItem(LS_KEYS.name, val);
    greet.textContent = `Hello ${val} 👋`;
    greet.classList.remove("hidden");
    form.classList.add("hidden");
    btn.textContent = "Change Name";
  });
}

// Real-time Clock with animation
function initClock(){
  const dEl = $("#liveDate");
  const tEl = $("#liveTime");
  if(!dEl || !tEl) return;
  
  // Add classes for animation
  dEl.classList.add("date-display");
  tEl.classList.add("time-display");
  
  const upd = () => {
    const now = new Date();
    // Format date with full weekday name, day, month and year
    dEl.textContent = now.toLocaleDateString(undefined, { 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric"
    });
    
    // Format time with hours, minutes and seconds
    tEl.textContent = now.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    
    // Add a pulse animation when seconds change
    tEl.classList.add("time-pulse");
    setTimeout(() => tEl.classList.remove("time-pulse"), 500);
  };
  
  // Initial update
  upd();
  
  // Update every second
  setInterval(upd, 1000);
}

// Enhanced Notices with animation and importance levels
function initNotices(){
  const list = $("#noticeList");
  if(!list) return;
  
  // Clear existing notices
  list.innerHTML = "";
  
  // Display notices with staggered animation
  notices.forEach((n, index) => {
    const li = document.createElement("li");
    li.className = `notice ${n.important ? 'notice-important' : ''}`;
    li.style.animationDelay = `${index * 0.1}s`;
    
    // Add icon based on tag type
    let tagIcon = '';
    switch(n.tag) {
      case 'CLASS': tagIcon = '🏫'; break;
      case 'UPDATE': tagIcon = '🔄'; break;
      case 'LAB': tagIcon = '🧪'; break;
      case 'STUDY': tagIcon = '📚'; break;
      case 'EXAM': tagIcon = '📝'; break;
      default: tagIcon = '📢';
    }
    
    li.innerHTML = `
      <span>${n.text}</span>
      <span class="tag">${tagIcon} ${n.tag}</span>
    `;
    
    list.appendChild(li);
  });
}

// Quotes
function initQuotes(){
  const box = $("#quoteBox");
  if(!box) return;
  const btn = $("#newQuoteBtn");
  const load = () => {
    const q = quotes[Math.floor(Math.random()*quotes.length)];
    box.textContent = q;
  };
  btn && btn.addEventListener("click", load);
  load();
}

// Marks retrieval
function getMarks(){
  try {
    return JSON.parse(localStorage.getItem(LS_KEYS.marks)) || [];
  } catch { return []; }
}
function saveMarks(arr){
  localStorage.setItem(LS_KEYS.marks, JSON.stringify(arr));
}

// Enhanced marks display on home
function initMarksDisplays(){
  const lastEl = $("#lastMark");
  if(!lastEl) return;
  const avgEl = $("#avgMark");
  const highEl = $("#highMark");
  const subEl = $("#subCount");
  const marks = getMarks();
  
  // Add animation class
  document.querySelectorAll(".stats-items > div").forEach(div => {
    div.classList.add("stat-animated");
  });
  
  if(marks.length){
    // Get last added mark
    const last = marks[marks.length-1];
    const lastPercentage = (last.score/last.outOf)*100;
    
    // Calculate statistics
    const percentages = marks.map(m => (m.score/m.outOf)*100);
    const avg = percentages.reduce((a,b)=>a+b,0)/percentages.length;
    const high = Math.max(...percentages);
    
    // Display with emphasis on higher scores
    lastEl.innerHTML = `${last.subject} <strong>${lastPercentage.toFixed(1)}%</strong>`;
    avgEl.innerHTML = `<strong>${avg.toFixed(1)}</strong>`;
    highEl.innerHTML = `<strong>${high.toFixed(1)}</strong>`;
    subEl.innerHTML = `<strong>${marks.length}</strong>`;
    
    // Apply color coding based on percentage
    if (lastPercentage >= 75) {
      lastEl.closest('div').classList.add('high-score');
    } else if (lastPercentage < 50) {
      lastEl.closest('div').classList.add('low-score');
    }
    
  } else {
    lastEl.textContent = "-";
    avgEl.textContent = "-";
    highEl.textContent = "-";
    subEl.textContent = "0";
  }
  // Add marks table if on add-marks page
  const body = $("#marksBody");
  if(body){
    body.innerHTML = "";
    [...marks].reverse().forEach(m => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${m.subject}</td><td>${m.score}/${m.outOf}</td><td>${((m.score/m.outOf)*100).toFixed(1)}%</td><td>${m.date}</td>`;
      body.appendChild(tr);
    });
  }
}

// Mark form
function initMarkForm(){
  const form = $("#markForm");
  if(!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const subject = $("#subject").value.trim();
    const score = parseFloat($("#score").value);
    const outOf = parseFloat($("#outOf").value);
    const date = $("#date").value || new Date().toISOString().slice(0,10);
    if(!subject || isNaN(score) || isNaN(outOf) || outOf<=0) return;
    const marks = getMarks();
    marks.push({ subject, score, outOf, date });
    saveMarks(marks);
    form.reset();
    initMarksDisplays();
  });
}

// Events with countdown feature
function initEvents(){
  const wrap = $("#eventsContainer");
  if(!wrap) return;
  
  // Clear existing events
  wrap.innerHTML = "";
  
  // Sort events by date (closest first)
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Display events with countdown
  sortedEvents.forEach(ev => {
    const box = document.createElement("div");
    box.className = "event-box";
    box.innerHTML = `
      <div class="event-name">${ev.name}</div>
      <div class="countdown" data-date="${ev.date}"></div>
      <div class="event-progress"><span></span></div>
      <small class="muted">${ev.note}</small>
    `;
    wrap.appendChild(box);
  });
  const update = () => {
    const now = Date.now();
    $$(".event-box").forEach(box => {
      const cd = box.querySelector(".countdown");
      const dateStr = cd.getAttribute("data-date");
      const target = new Date(dateStr).getTime();
      const diff = target - now;
      if(diff <=0){
        cd.textContent = "Started / Done 🎯";
        box.querySelector(".event-progress span").style.width = "100%";
        return;
      }
      const d = Math.floor(diff/86400000);
      const h = Math.floor(diff%86400000/3600000);
      const m = Math.floor(diff%3600000/60000);
      const s = Math.floor(diff%60000/1000);
      cd.textContent = `${d}d ${h}h ${m}m ${s}s`;
      // progress
      const firstDate = Date.now();
      const total = target - firstDate + diff; // naive; or we track from now
      const span = box.querySelector(".event-progress span");
      // Use ratio based on days left vs 120 days window
      const maxWindow = 120*86400000;
      const perc = Math.min(100, (1 - (diff / maxWindow)) *100);
      span.style.width = perc+"%";
    });
  };
  update();
  setInterval(update,1000);
}

// Quick access overlay
function initQuickAccess(){
  const openers = [$("#quickAccessBtn"), $("#quickAccessFooter")].filter(Boolean);
  const panel = $("#quickAccessPanel");
  const close = $("#closeQuick");
  if(!panel) return;
  openers.forEach(btn => btn && btn.addEventListener("click", ()=>panel.classList.remove("hidden")));
  close && close.addEventListener("click", ()=>panel.classList.add("hidden"));
  panel.addEventListener("click", e => {
    if(e.target === panel) panel.classList.add("hidden");
  });
  document.addEventListener("keydown", e => {
    if(e.key === "Escape") panel.classList.add("hidden");
  });
}

// Analyze page
function initAnalyzePage(){
  const statWrap = $("#analyzeStats");
  if(!statWrap) return;
  const marks = getMarks();
  if(!marks.length){
    statWrap.innerHTML = "<p>No marks yet.</p>";
    return;
  }
  const percentages = marks.map(m => (m.score/m.outOf)*100);
  const avg = (percentages.reduce((a,b)=>a+b,0)/percentages.length).toFixed(2);
  const high = Math.max(...percentages).toFixed(1);
  const low = Math.min(...percentages).toFixed(1);
  statWrap.innerHTML = `
    <div><span class="label">Average:</span> ${avg}%</div>
    <div><span class="label">Highest:</span> ${high}%</div>
    <div><span class="label">Lowest:</span> ${low}%</div>
    <div><span class="label">Entries:</span> ${marks.length}</div>
  `;
  const distList = $("#distributionList");
  if(distList){
    // bucket counts
    const buckets = { "90-100":0,"80-89":0,"70-79":0,"60-69":0,"<60":0 };
    percentages.forEach(p => {
      if(p>=90) buckets["90-100"]++;
      else if(p>=80) buckets["80-89"]++;
      else if(p>=70) buckets["70-79"]++;
      else if(p>=60) buckets["60-69"]++;
      else buckets["<60"]++;
    });
    distList.innerHTML = "";
    Object.entries(buckets).forEach(([k,v])=>{
      const li = document.createElement("li");
      li.textContent = `${k}: ${v}`;
      distList.appendChild(li);
    });
  }
}
