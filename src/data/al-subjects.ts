// Official / commonly offered Sri Lanka G.C.E. A/L subjects (condensed & categorized)
// Source: Department of Examinations syllabi and widely available stream offerings.
// NOTE: Avoid adding speculative tertiary-level fields (e.g., Software Engineering) to preserve authenticity.

// Stream categories retained only as comments for grouping; runtime uses a flat string array.
export const AL_SUBJECTS: string[] = [
  // Common / Compulsory
  "General English",
  "Common General Test",

  // Science Stream Core
  "Biology",
  "Chemistry",
  "Physics",
  "Combined Mathematics",
  "Agricultural Science",
  "Information and Communication Technology (ICT)",

  // Technology Stream
  "Engineering Technology",
  "Science for Technology",
  "Bio-systems Technology",

  // Commerce Stream
  "Accounting",
  "Business Studies",
  "Economics",

  // Languages
  "Sinhala",
  "Tamil",
  "English",
  "French",
  "German",
  "Japanese",
  "Arabic",
  "Pali",
  "Sanskrit",
  // (Optional specialised language subjects can be appended here upon confirmation: e.g., Chinese, Hindi)

  // Humanities & Social Sciences
  "Geography",
  "History",
  "Political Science",
  "Logic & Scientific Method",
  "Communication & Media Studies",
  "Buddhist Civilization",
  "Christian Civilization",
  "Hindu Civilization",
  "Islamic Civilization",
  "Drama & Theatre",
  "Music",
  "Art",
  "Dancing",
  "Home Economics",
  "Sociology",
  "Psychology", // Included only if offered (some schools provide under Arts stream). Remove if unverified.
];

// If future validation removes Psychology (or others) for authenticity, update this list and changelog accordingly.

export default AL_SUBJECTS;