// Subject stream & paper structure mappings derived from user specification.
// Each subject id should match stored mark.subject values (lowercase, hyphenated).
export interface SubjectStructure {
  stream: string; // Science, Commerce, Arts, Technology, Common
  papers: string[]; // Descriptions of paper types / structure
}

export const SUBJECT_STRUCTURES: Record<string, SubjectStructure> = {
  // Science Stream
  physics: { stream: 'Science', papers: ['Paper I – MCQ', 'Paper II – Structured (SEQ) + Essay'] },
  chemistry: { stream: 'Science', papers: ['Paper I – MCQ', 'Paper II – Structured (SEQ) + Essay'] },
  biology: { stream: 'Science', papers: ['Paper I – MCQ', 'Paper II – Structured (SEQ) + Essay'] },
  'combined-mathematics': { stream: 'Science', papers: ['Paper I – Structured + Essay', 'Paper II – Structured + Essay (No MCQ)'] },

  // Commerce Stream
  accounting: { stream: 'Commerce', papers: ['Paper I – MCQ', 'Paper II – Structured (SEQ) + Essay'] },
  'business-studies': { stream: 'Commerce', papers: ['Paper I – MCQ', 'Paper II – Essay'] },
  economics: { stream: 'Commerce', papers: ['Paper I – MCQ', 'Paper II – Essay'] },
  'business-statistics': { stream: 'Commerce', papers: ['Paper I – MCQ', 'Paper II – Structured (SEQ) + Essay'] },

  // Arts / Humanities Stream
  geography: { stream: 'Arts', papers: ['Paper I – MCQ', 'Paper II – Structured (SEQ) + Essay'] },
  'political-science': { stream: 'Arts', papers: ['Paper I – MCQ', 'Paper II – Essay'] },
  'logic-scientific-method': { stream: 'Arts', papers: ['Paper I – MCQ', 'Paper II – Essay'] },
  history: { stream: 'Arts', papers: ['Paper I – MCQ', 'Paper II – Essay'] },
  civilizations: { stream: 'Arts', papers: ['Paper I – MCQ', 'Paper II – Essay'] },
  'communication-media-studies': { stream: 'Arts', papers: ['Paper I – MCQ', 'Paper II – Essay'] },
  drama: { stream: 'Arts', papers: ['Written (Essay + SEQ)', 'Practical / Performance'] },
  music: { stream: 'Arts', papers: ['Written (Essay + SEQ)', 'Practical / Performance'] },
  art: { stream: 'Arts', papers: ['Written (Essay + SEQ)', 'Practical / Performance'] },
  dance: { stream: 'Arts', papers: ['Written (Essay + SEQ)', 'Practical / Performance'] },
  languages: { stream: 'Arts', papers: ['Paper I – MCQ (Grammar/Comprehension)', 'Paper II – Essay'] },

  // Technology Stream
  'engineering-technology': { stream: 'Technology', papers: ['Paper I – MCQ', 'Paper II – Structured (SEQ) + Essay + Practical/Project'] },
  'bio-system-technology': { stream: 'Technology', papers: ['Paper I – MCQ', 'Paper II – Structured (SEQ) + Essay + Practical/Project'] },
  'science-for-technology': { stream: 'Technology', papers: ['Paper I – MCQ', 'Paper II – Structured (SEQ) + Essay'] },
  'ict-technology': { stream: 'Technology', papers: ['Paper I – MCQ', 'Paper II – Structured (SEQ) + Essay + Practical (Lab-based)'] },

  // Common for All
  'general-english': { stream: 'Common', papers: ['Paper I – MCQ (Grammar, Vocabulary, Comprehension)', 'Paper II – Essay + Writing tasks'] },
  'common-general-paper': { stream: 'Common', papers: ['Essay type only (No MCQ)'] },
};

export const SITE_META = { name: 'Marksy' };
