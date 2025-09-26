import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';

// Extended / normalized localStorage keys (fixed profile naming + extra domains)
const LS_KEYS = {
  subjects: 'alSubjects',
  marks: 'alMarksData',
  timerSessions: 'timerSessions',
  dailyGoal: 'marksy-daily-goal',
  profile: 'marksy-profile',           // was marksy_profile (migrate below)
  todos: 'alTodos',
  achievements: 'marksy-achievements',
  notes: 'marksy-time-notes',
  resources: 'marksy-custom-data'
} as const;

// Session + state
const SESSION_ID = (crypto?.randomUUID?.() || Math.random().toString(36).slice(2));
let unsubscribeRT: (() => void) | null = null;
let lastRemoteServerTime: number | undefined;
let lastLocalPushAt = 0;
let localPatchInstalled = false;

// Pending offline queue
const PENDING_KEY = 'pendingBundles';

function enqueuePending(partial: any) {
  try {
    const list = JSON.parse(localStorage.getItem(PENDING_KEY) || '[]');
    list.push({ at: Date.now(), data: partial });
    localStorage.setItem(PENDING_KEY, JSON.stringify(list));
  } catch {}
}

async function flushPending(uid: string, email?: string | null) {
  try {
    const list = JSON.parse(localStorage.getItem(PENDING_KEY) || '[]');
    if (!Array.isArray(list) || !list.length) return;
    const merged = list.reduce((acc: any, cur: any) => Object.assign(acc, cur.data), {});
    localStorage.removeItem(PENDING_KEY);
    await pushUserBundle({ uid, email, merge: true, overrideData: merged });
  } catch (e) {
    // If still failing, leave queue intact
    if (import.meta.env.DEV) console.warn('[sync] flushPending failed', e);
  }
}

// Migration for old profile key (underscore version -> hyphen)
(function migrateProfileKey() {
  try {
    const old = localStorage.getItem('marksy_profile');
    const newer = localStorage.getItem(LS_KEYS.profile);
    if (old && !newer) {
      localStorage.setItem(LS_KEYS.profile, old);
      localStorage.removeItem('marksy_profile');
    }
  } catch {}
})();

interface SyncOptions {
  uid: string;
  email?: string | null;
  merge?: boolean;
  overrideData?: Partial<CloudBundle>; // internal use when flushing queue
}

interface CloudBundle {
  subjects?: any;
  marks?: any;
  timerSessions?: any;
  dailyGoal?: string | null;
  profile?: any;
  todos?: any;
  achievements?: any;
  notes?: any;
  resources?: any;
  lastSynced?: any;
  clientUpdatedAt?: number;
  sessionId?: string;
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

// Push local data to cloud (enhanced)
export async function pushUserBundle({ uid, email, merge = true, overrideData }: SyncOptions) {
  const bundle: CloudBundle = {};
  const readJSON = (k: string) => {
    const v = localStorage.getItem(k);
    if (!v) return undefined;
    try { return JSON.parse(v); } catch { return undefined; }
  };

  const base = {
    subjects: readJSON(LS_KEYS.subjects),
    marks: readJSON(LS_KEYS.marks),
    timerSessions: readJSON(LS_KEYS.timerSessions),
    profile: readJSON(LS_KEYS.profile),
    todos: readJSON(LS_KEYS.todos),
    achievements: readJSON(LS_KEYS.achievements),
    notes: readJSON(LS_KEYS.notes),
    resources: readJSON(LS_KEYS.resources),
    dailyGoal: localStorage.getItem(LS_KEYS.dailyGoal)
  };

  Object.assign(bundle, base, overrideData || {});
  bundle.lastSynced = serverTimestamp();
  bundle.clientUpdatedAt = Date.now();
  bundle.sessionId = SESSION_ID;

  const ref = doc(db, 'userBundles', uid);

  try {
    await setDoc(ref, {
      uid,
      email: email || null,
      ...bundle
    }, { merge });
    lastLocalPushAt = bundle.clientUpdatedAt;
  } catch (err: any) {
    if (!navigator.onLine || (err?.message || '').toLowerCase().includes('failed') ) {
      enqueuePending(base);
      if (import.meta.env.DEV) console.info('[sync] queued offline changes');
    } else {
      throw err;
    }
  }
  return bundle;
}

// Real-time subscription
function subscribeUserBundleRT(uid: string) {
  const ref = doc(db, 'userBundles', uid);
  return onSnapshot(ref, snap => {
    if (!snap.exists()) return;
    const data = snap.data() as CloudBundle;

    // Ignore if this doc update originated from this session very recently
    if (data.sessionId === SESSION_ID && data.clientUpdatedAt && data.clientUpdatedAt <= lastLocalPushAt) {
      return;
    }
    // Staleness check
    if (lastRemoteServerTime && data.clientUpdatedAt && data.clientUpdatedAt < lastRemoteServerTime) {
      return;
    }
    lastRemoteServerTime = data.clientUpdatedAt;

    try {
      if (data.subjects) localStorage.setItem(LS_KEYS.subjects, JSON.stringify(data.subjects));
      if (data.marks) localStorage.setItem(LS_KEYS.marks, JSON.stringify(data.marks));
      if (data.timerSessions) localStorage.setItem(LS_KEYS.timerSessions, JSON.stringify(data.timerSessions));
      if (typeof data.dailyGoal === 'string') localStorage.setItem(LS_KEYS.dailyGoal, data.dailyGoal);
      if (data.profile) localStorage.setItem(LS_KEYS.profile, JSON.stringify(data.profile));
      if (data.todos) localStorage.setItem(LS_KEYS.todos, JSON.stringify(data.todos));
      if (data.achievements) localStorage.setItem(LS_KEYS.achievements, JSON.stringify(data.achievements));
      if (data.notes) localStorage.setItem(LS_KEYS.notes, JSON.stringify(data.notes));
      if (data.resources) localStorage.setItem(LS_KEYS.resources, JSON.stringify(data.resources));
      // Trigger a lightweight custom event for UI components to react
      window.dispatchEvent(new CustomEvent('marksy:cloud-update'));
    } catch (e) {
      console.warn('[sync] RT hydration failed', e);
    }
  }, err => {
    console.warn('[sync] realtime listener error', err);
  });
}

// Install local change hook (monkey patch setItem once)
function installLocalChangeHook(uid: string, email?: string | null) {
  if (localPatchInstalled) return;
  localPatchInstalled = true;
  // Widen Set element type to string so .has accepts any localStorage key without TS error
  const watched: Set<string> = new Set<string>(Object.values(LS_KEYS));
  const orig = localStorage.setItem;
  localStorage.setItem = function(key: string, value: string) {
    orig.call(this, key, value);
    if (watched.has(key)) {
      schedulePush(uid, email || undefined, 800);
    }
  };
  // Cross-tab changes
  window.addEventListener('storage', (e) => {
    if (e.key && watched.has(e.key)) {
      schedulePush(uid, email || undefined, 1200);
    }
  });
  // Online event -> flush queue
  window.addEventListener('online', () => flushPending(uid, email));
}

// Public initializer
export function initRealtimeUserSync(uid: string, email?: string | null) {
  if (unsubscribeRT) unsubscribeRT(); // safety
  installLocalChangeHook(uid, email);
  flushPending(uid, email); // attempt early flush
  unsubscribeRT = subscribeUserBundleRT(uid);
  fullSync(uid, email); // initial hydration + push
}

// Stop
export function stopRealtimeUserSync() {
  if (unsubscribeRT) {
    unsubscribeRT();
    unsubscribeRT = null;
  }
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
