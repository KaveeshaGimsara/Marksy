import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// Data keys used locally
const LS_KEYS = {
  subjects: 'alSubjects',
  marks: 'alMarksData',
  timerSessions: 'timerSessions',
  dailyGoal: 'marksy-daily-goal',
  profile: 'marksy_profile',
  todos: 'alTodos'
} as const;

interface SyncOptions {
  uid: string;
  email?: string | null;
  merge?: boolean; // default true
}

interface CloudBundle {
  subjects?: any;
  marks?: any;
  timerSessions?: any;
  dailyGoal?: string | null;
  profile?: any;
  todos?: any;
  lastSynced?: any;
}

// Pull cloud data and hydrate localStorage
export async function pullUserBundle({ uid }: SyncOptions) {
  const ref = doc(db, 'userBundles', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data() as CloudBundle;
  try {
    if (data.subjects) localStorage.setItem(LS_KEYS.subjects, JSON.stringify(data.subjects));
    if (data.marks) localStorage.setItem(LS_KEYS.marks, JSON.stringify(data.marks));
    if (data.timerSessions) localStorage.setItem(LS_KEYS.timerSessions, JSON.stringify(data.timerSessions));
    if (data.dailyGoal) localStorage.setItem(LS_KEYS.dailyGoal, data.dailyGoal);
    if (data.profile) localStorage.setItem(LS_KEYS.profile, JSON.stringify(data.profile));
    if (data.todos) localStorage.setItem(LS_KEYS.todos, JSON.stringify(data.todos));
  } catch (e) {
    console.warn('[sync] Failed to write some local data', e);
  }
  return data;
}

// Push local data to cloud
export async function pushUserBundle({ uid, email, merge = true }: SyncOptions) {
  const bundle: CloudBundle = {};
  const read = (k: string) => {
    const v = localStorage.getItem(k);
    if (!v) return undefined;
    try { return JSON.parse(v); } catch { return undefined; }
  };
  bundle.subjects = read(LS_KEYS.subjects);
  bundle.marks = read(LS_KEYS.marks);
  bundle.timerSessions = read(LS_KEYS.timerSessions);
  bundle.profile = read(LS_KEYS.profile);
  bundle.todos = read(LS_KEYS.todos);
  bundle.dailyGoal = localStorage.getItem(LS_KEYS.dailyGoal);
  bundle.lastSynced = serverTimestamp();

  const ref = doc(db, 'userBundles', uid);
  await setDoc(ref, {
    uid,
    email: email || null,
    ...bundle
  }, { merge });
  return bundle;
}

// Two-way smart sync: pull first (if cloud newer), then push local changes.
export async function fullSync(uid: string, email?: string | null) {
  try {
    await pullUserBundle({ uid });
    await pushUserBundle({ uid, email });
  } catch (e) {
    console.warn('[sync] fullSync failed', e);
  }
}

// Debounced push helper
let debounceTimer: number | undefined;
export function schedulePush(uid: string, email?: string | null, delay = 2000) {
  if (debounceTimer) window.clearTimeout(debounceTimer);
  debounceTimer = window.setTimeout(() => {
    pushUserBundle({ uid, email }).catch(err => console.warn('[sync] scheduled push failed', err));
  }, delay);
}
