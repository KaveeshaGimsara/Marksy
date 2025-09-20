// Admin-editable data for the home page
// This file contains all configurable content for the home page

export interface Notice {
  id: string;
  title: string;
  content: string;
  priority: 'normal' | 'important' | 'exam' | 'event';
  timestamp: string;
  pinned: boolean;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  type: 'exam' | 'deadline' | 'event';
  description?: string;
}

export interface MockMarksData {
  papers: Array<{
    id: string;
    name: string;
    subject: string;
    date: string;
    marks: number;
    totalMarks: number;
  }>;
}

// ADMIN CONFIGURATION: Edit these arrays to manage notices and events
export const adminNotices: Notice[] = [
  {
    id: "1",
    title: "📚 Advanced Level Examinations 2025",
    content: "The A/L examinations are approaching fast! Make sure to complete your past paper practice and revision schedules. All the best to every student working towards their dreams.",
    priority: "exam",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    pinned: true
  },
  {
    id: "2",
    title: "🎉 New Study Resources for A/L Students",
    content: "We've added comprehensive study materials for Mathematics, Physics, Chemistry, and Biology. Access downloadable PDFs, practice papers, and video tutorials specifically designed for Sri Lankan A/L curriculum.",
    priority: "important",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    pinned: false
  },
  {
    id: "3",
    title: "⚡ Performance Update",
    content: "We've optimized the app for better performance and faster loading times. Your academic data is now synced in real-time across all devices.",
    priority: "normal",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    pinned: false
  },
  {
    id: "4",
    title: "🏆 Achievement Milestone Reached!",
    content: "Congratulations! Over 1000+ A/L students across Sri Lanka are now using Marksy to track their academic progress. Keep up the excellent work!",
    priority: "event",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    pinned: true
  }
];

export const upcomingEvents: Event[] = [
  {
    id: "1",
    title: "Mathematics Paper 1 - Pure Mathematics",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    type: "exam",
    description: "Calculus, Algebra, and Coordinate Geometry"
  },
  {
    id: "2",
    title: "Physics Assignment Submission",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    type: "deadline",
    description: "Wave Motion and Sound practical report"
  },
  {
    id: "3",
    title: "Chemistry Practical Examination",
    date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days from now
    type: "exam",
    description: "Organic Chemistry lab evaluation"
  },
  {
    id: "4",
    title: "Biology Field Study Report Due",
    date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days from now
    type: "deadline",
    description: "Ecosystem analysis and biodiversity study"
  },
  {
    id: "5",
    title: "University Application Workshop",
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    type: "event",
    description: "Learn about university applications and Z-score calculations"
  },
  {
    id: "6",
    title: "English Literature Essay Competition",
    date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days from now
    type: "event",
    description: "Theme: 'Cultural Heritage of Sri Lanka'"
  }
];

// Mock data for demonstration purposes - represents realistic A/L student performance
export const mockMarksData: MockMarksData = {
  papers: [
    {
      id: "1",
      name: "Combined Mathematics Paper 2",
      subject: "Combined Mathematics",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      marks: 89,
      totalMarks: 100
    },
    {
      id: "2",
      name: "Physics Paper 1 - MCQ",
      subject: "Physics",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      marks: 94,
      totalMarks: 100
    },
    {
      id: "3",
      name: "Chemistry Practical Report",
      subject: "Chemistry",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
      marks: 82,
      totalMarks: 100
    },
    {
      id: "4",
      name: "Biology Unit Test - Genetics",
      subject: "Biology",
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      marks: 91,
      totalMarks: 100
    },
    {
      id: "5",
      name: "English Literature Essay",
      subject: "English",
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
      marks: 85,
      totalMarks: 100
    },
    {
      id: "6",
      name: "Mathematics Paper 1 - Past Paper",
      subject: "Combined Mathematics",
      date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), // 18 days ago
      marks: 88,
      totalMarks: 100
    },
    {
      id: "7",
      name: "Physics Practical Examination",
      subject: "Physics",
      date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 3 weeks ago
      marks: 92,
      totalMarks: 100
    },
    {
      id: "8",
      name: "Chemistry Organic Synthesis",
      subject: "Chemistry",
      date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days ago
      marks: 87,
      totalMarks: 100
    }
  ]
};

// 100+ Motivational quotes for students
export const motivationalQuotes = [
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The expert in anything was once a beginner.",
  "Your education is a gift that no one can take away from you.",
  "Strive for progress, not perfection.",
  "The beautiful thing about learning is that no one can take it away from you.",
  "Don't let what you cannot do interfere with what you can do.",
  "Success is the sum of small efforts repeated day in and day out.",
  "The only way to do great work is to love what you do.",
  "Believe in yourself and all that you are.",
  "You are capable of more than you know.",
  "Education is the most powerful weapon which you can use to change the world.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "It always seems impossible until it's done.",
  "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
  "The only impossible journey is the one you never begin.",
  "Success is not about being the best. It's about being better than you were yesterday.",
  "Your potential is endless.",
  "Great things never come from comfort zones.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Don't stop when you're tired. Stop when you're done.",
  "Push yourself because no one else is going to do it for you.",
  "Sometimes later becomes never. Do it now.",
  "Dream it. Wish it. Do it.",
  "Success doesn't just find you. You have to go out and get it.",
  "The key to success is to focus on goals, not obstacles.",
  "Dream bigger. Do bigger.",
  "Don't limit your challenges. Challenge your limits.",
  "Work hard in silence. Let your success be your noise.",
  "The comeback is always stronger than the setback.",
  "Focus on being productive instead of busy.",
  "You don't have to be great to get started, but you have to get started to be great.",
  "A year from now you may wish you had started today.",
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "You are never too old to set another goal or to dream a new dream.",
  "The only person you are destined to become is the person you decide to be.",
  "It's going to be hard, but hard does not mean impossible.",
  "Don't wish it were easier. Wish you were better.",
  "Good things happen to those who hustle.",
  "Whatever you do, do it well.",
  "What we plant in the soil of contemplation, we shall reap in the harvest of action.",
  "Be yourself; everyone else is already taken.",
  "You miss 100% of the shots you don't take.",
  "Whether you think you can or you think you can't, you're right.",
  "The two most important days in your life are the day you are born and the day you find out why.",
  "Life is what happens to you while you're busy making other plans.",
  "The way to get started is to quit talking and begin doing.",
  "If life were predictable it would cease to be life, and be without flavor.",
  "Your time is limited, so don't waste it living someone else's life.",
  "If you look at what you have in life, you'll always have more.",
  "Life is really simple, but we insist on making it complicated.",
  "The purpose of our lives is to be happy.",
  "You only live once, but if you do it right, once is enough.",
  "Many of life's failures are people who did not realize how close they were to success when they gave up.",
  "If you want to live a happy life, tie it to a goal, not to people or things.",
  "Never let the fear of striking out keep you from playing the game.",
  "Money and success don't change people; they merely amplify what is already there.",
  "Not how long, but how well you have lived is the main thing.",
  "If time is the most valuable thing, then wasting time would be the greatest loss.",
  "The time is always right to do what is right.",
  "Time flies over us, but leaves its shadow behind.",
  "The way I see it, if you want the rainbow, you gotta put up with the rain.",
  "Everything you've ever wanted is on the other side of fear.",
  "Believe you can and you're halfway there.",
  "When you have a dream, you've got to grab it and never let go.",
  "I can't change the direction of the wind, but I can adjust my sails to always reach my destination.",
  "No matter what you're going through, there's a light at the end of the tunnel.",
  "Life is like riding a bicycle. To keep your balance, you must keep moving.",
  "Life is a succession of lessons which must be lived to be understood.",
  "You have been assigned this mountain to show others it can be moved.",
  "Spread love everywhere you go. Let no one ever come to you without leaving happier.",
  "When you reach the end of your rope, tie a knot in it and hang on.",
  "Always remember that you are absolutely unique. Just like everyone else.",
  "Don't judge each day by the harvest you reap but by the seeds that you plant.",
  "The greatest glory in living lies not in never falling, but in rising every time we fall.",
  "Life is either a daring adventure or nothing at all.",
  "You will face many defeats in life, but never let yourself be defeated.",
  "The greatest glory in living lies not in never falling, but in rising every time we fall.",
  "In the end, it's not the years in your life that count. It's the life in your years.",
  "Life is 10% what happens to you and 90% how you react to it.",
  "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
  "Live in the moment.",
  "The only impossible journey is the one you never begin.",
  "In this life we cannot do great things. We can only do small things with great love.",
  "Only a life lived for others is a life worthwhile.",
  "The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate, to have it make some difference that you have lived and lived well.",
  "Use your smile to change the world; don't let the world change your smile.",
  "You must be the change you wish to see in the world.",
  "Yesterday is history, tomorrow is a mystery, today is a gift of God, which is why we call it the present.",
  "The difference between ordinary and extraordinary is that little extra.",
  "Education is not the learning of facts, but the training of the mind to think.",
  "Intelligence plus character—that is the goal of true education.",
  "Live as if you were to die tomorrow. Learn as if you were to live forever.",
  "An investment in knowledge pays the best interest.",
  "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
  "The roots of education are bitter, but the fruit is sweet.",
  "Learning never exhausts the mind.",
  "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
  "Education is not preparation for life; education is life itself.",
  "The mind is not a vessel to be filled, but a fire to be kindled.",
  "Tell me and I forget, teach me and I may remember, involve me and I learn.",
  "Anyone who stops learning is old, whether at twenty or eighty. Anyone who keeps learning stays young.",
  "Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.",
  "The expert in anything was once a beginner who refused to give up.",
  "Learning is a treasure that will follow its owner everywhere.",
  "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
  "Don't let schooling interfere with your education.",
  "Education is what remains after one has forgotten what one has learned in school.",
  "The beautiful thing about learning is nobody can take it away from you.",
  "Change is the end result of all true learning.",
  "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence.",
  "The goal of education is the advancement of knowledge and the dissemination of truth."
];