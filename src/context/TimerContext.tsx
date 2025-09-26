import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type TimerPhase = "idle" | "running" | "paused";

interface TimerState {
  version: number;
  phase: TimerPhase;
  startTime: number | null;
  sessionStartTime: number | null;
  elapsedBeforePause: number;
  sessionId: string | null;
  currentTag: string;
  currentNotes: string;
  lastUpdated: number;
}

interface TimerActionResult {
  ok: boolean;
  reason?: "already-running" | "not-running" | "not-paused";
}

interface TimerStopResult {
  ok: boolean;
  durationSeconds: number;
  sessionStartTime: number | null;
  sessionId: string | null;
}

interface TimerContextValue {
  phase: TimerPhase;
  isRunning: boolean;
  isPaused: boolean;
  elapsedSeconds: number;
  startTime: number | null;
  sessionStartTime: number | null;
  currentTag: string;
  currentNotes: string;
  startNewSession: () => TimerActionResult;
  resumeSession: () => TimerActionResult;
  pauseSession: () => TimerActionResult;
  stopSession: () => TimerStopResult;
  resetSession: () => void;
  setTag: (tag: string) => void;
  setNotes: (notes: string) => void;
}

const STORAGE_KEY = "marksy-timer-state";
const CHANNEL_NAME = "marksy-timer-broadcast";
const STATE_VERSION = 1;

const DEFAULT_STATE: TimerState = {
  version: STATE_VERSION,
  phase: "idle",
  startTime: null,
  sessionStartTime: null,
  elapsedBeforePause: 0,
  sessionId: null,
  currentTag: "Study",
  currentNotes: "",
  lastUpdated: 0,
};

type BroadcastMessage =
  | { type: "sync-state"; senderId: string; state: TimerState }
  | { type: "request-sync"; senderId: string };

const TimerContext = createContext<TimerContextValue | undefined>(undefined);

const isBrowser = typeof window !== "undefined";

const generateId = () => {
  if (isBrowser && typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `timer-${Math.random().toString(36).slice(2, 11)}`;
};

const normalizeState = (raw: unknown): TimerState => {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_STATE };
  }

  const candidate = raw as Partial<TimerState>;
  const phase: TimerPhase = candidate.phase === "running" || candidate.phase === "paused" ? candidate.phase : "idle";

  return {
    version: STATE_VERSION,
    phase,
    startTime: typeof candidate.startTime === "number" ? candidate.startTime : null,
    sessionStartTime: typeof candidate.sessionStartTime === "number" ? candidate.sessionStartTime : null,
    elapsedBeforePause: typeof candidate.elapsedBeforePause === "number" ? candidate.elapsedBeforePause : 0,
    sessionId: typeof candidate.sessionId === "string" ? candidate.sessionId : null,
    currentTag: typeof candidate.currentTag === "string" ? candidate.currentTag : DEFAULT_STATE.currentTag,
    currentNotes: typeof candidate.currentNotes === "string" ? candidate.currentNotes : DEFAULT_STATE.currentNotes,
    lastUpdated: typeof candidate.lastUpdated === "number" ? candidate.lastUpdated : 0,
  };
};

const computeElapsedMs = (state: TimerState, now: number = Date.now()) => {
  if (state.phase === "running" && state.startTime) {
    return state.elapsedBeforePause + Math.max(0, now - state.startTime);
  }

  if (state.phase === "paused") {
    return state.elapsedBeforePause;
  }

  return 0;
};

const statesEqual = (a: TimerState, b: TimerState) =>
  a.phase === b.phase &&
  a.startTime === b.startTime &&
  a.sessionStartTime === b.sessionStartTime &&
  a.elapsedBeforePause === b.elapsedBeforePause &&
  a.sessionId === b.sessionId &&
  a.currentTag === b.currentTag &&
  a.currentNotes === b.currentNotes &&
  a.lastUpdated === b.lastUpdated;

export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
  const initialState = useMemo(() => {
    if (!isBrowser) {
      return { ...DEFAULT_STATE };
    }

    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return { ...DEFAULT_STATE };
    }

    try {
      const parsed = normalizeState(JSON.parse(saved));
      return {
        ...parsed,
        version: STATE_VERSION,
      };
    } catch (error) {
      console.error("Failed to parse timer state from storage", error);
      return { ...DEFAULT_STATE };
    }
  }, []);

  const [state, setState] = useState<TimerState>(initialState);
  const [elapsedSeconds, setElapsedSeconds] = useState(() => Math.floor(computeElapsedMs(initialState) / 1000));

  const stateRef = useRef<TimerState>(initialState);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const intervalRef = useRef<number | null>(null);
  const tabId = useMemo(() => generateId(), []);

  const writeState = useCallback((nextState: TimerState) => {
    if (!isBrowser) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    } catch (error) {
      console.error("Failed to write timer state", error);
    }
  }, []);

  const broadcastState = useCallback((nextState: TimerState) => {
    if (!isBrowser) return;
    channelRef.current?.postMessage({ type: "sync-state", senderId: tabId, state: nextState } satisfies BroadcastMessage);
  }, [tabId]);

  const setAndSyncState = useCallback(
    (nextState: TimerState, options?: { broadcast?: boolean }) => {
      const shouldBroadcast = options?.broadcast ?? true;
      const previous = stateRef.current;

      if (statesEqual(previous, nextState)) {
        return;
      }

      stateRef.current = nextState;
      setState(nextState);
      setElapsedSeconds(Math.floor(computeElapsedMs(nextState) / 1000));

      if (shouldBroadcast) {
        writeState(nextState);
        broadcastState(nextState);
      }
    },
    [broadcastState, writeState]
  );

  const adoptExternalState = useCallback(
    (incoming: TimerState) => {
      const current = stateRef.current;
      if (incoming.lastUpdated <= current.lastUpdated) {
        return;
      }
      setAndSyncState({ ...incoming, version: STATE_VERSION }, { broadcast: false });
    },
    [setAndSyncState]
  );

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (!isBrowser) return;

    if (state.phase === "running" && state.startTime) {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
      intervalRef.current = window.setInterval(() => {
        const current = stateRef.current;
        setElapsedSeconds(Math.floor(computeElapsedMs(current) / 1000));
      }, 1000);
      return () => {
        if (intervalRef.current !== null) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }

    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setElapsedSeconds(Math.floor(computeElapsedMs(state) / 1000));
  }, [state.phase, state.startTime, state.elapsedBeforePause]);

  useEffect(() => {
    if (!isBrowser) return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try {
        const parsed = normalizeState(JSON.parse(event.newValue));
        adoptExternalState(parsed);
      } catch (error) {
        console.error("Failed to parse timer state from storage event", error);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [adoptExternalState]);

  useEffect(() => {
    if (!isBrowser || typeof BroadcastChannel === "undefined") return;

    const ChannelConstructor = BroadcastChannel;
    const channelInstance = new ChannelConstructor(CHANNEL_NAME);
    channelRef.current = channelInstance;

    const handleMessage = (event: MessageEvent<BroadcastMessage>) => {
      const data = event.data;
      if (!data || data.senderId === tabId) return;

      if (data.type === "sync-state") {
        adoptExternalState(normalizeState(data.state));
      } else if (data.type === "request-sync") {
        channelInstance.postMessage({ type: "sync-state", senderId: tabId, state: stateRef.current });
      }
    };

    channelInstance.addEventListener("message", handleMessage);
    channelInstance.postMessage({ type: "request-sync", senderId: tabId });

    return () => {
      channelInstance.removeEventListener("message", handleMessage);
      channelInstance.close();
      channelRef.current = null;
    };
  }, [adoptExternalState, tabId]);

  useEffect(() => {
    if (!isBrowser) return;
    // Ensure storage is up to date on mount in this tab
    writeState(stateRef.current);
  }, [writeState]);

  const startNewSession = useCallback((): TimerActionResult => {
    const now = Date.now();
    const sessionId = generateId();

    const nextState: TimerState = {
      ...stateRef.current,
      phase: "running",
      startTime: now,
      sessionStartTime: now,
      elapsedBeforePause: 0,
      sessionId,
      lastUpdated: now,
    };

    if (stateRef.current.phase === "running") {
      return { ok: false, reason: "already-running" };
    }

    setAndSyncState(nextState);
    return { ok: true };
  }, [setAndSyncState]);

  const resumeSession = useCallback((): TimerActionResult => {
    if (stateRef.current.phase !== "paused") {
      return { ok: false, reason: "not-paused" };
    }

    const now = Date.now();
    const nextState: TimerState = {
      ...stateRef.current,
      phase: "running",
      startTime: now,
      lastUpdated: now,
    };

    setAndSyncState(nextState);
    return { ok: true };
  }, [setAndSyncState]);

  const pauseSession = useCallback((): TimerActionResult => {
    if (stateRef.current.phase !== "running" || !stateRef.current.startTime) {
      return { ok: false, reason: "not-running" };
    }

    const now = Date.now();
    const elapsedBeforePause = stateRef.current.elapsedBeforePause + Math.max(0, now - stateRef.current.startTime);

    const nextState: TimerState = {
      ...stateRef.current,
      phase: "paused",
      startTime: null,
      elapsedBeforePause,
      lastUpdated: now,
    };

    setAndSyncState(nextState);
    return { ok: true };
  }, [setAndSyncState]);

  const stopSession = useCallback((): TimerStopResult => {
    if (stateRef.current.phase === "idle") {
      return {
        ok: false,
        durationSeconds: 0,
        sessionStartTime: null,
        sessionId: null,
      };
    }

    const now = Date.now();
    const activeState = stateRef.current;
    const totalElapsedMs = computeElapsedMs(activeState, now);

    const nextState: TimerState = {
      ...activeState,
      phase: "idle",
      startTime: null,
      sessionStartTime: null,
      elapsedBeforePause: 0,
      sessionId: null,
      currentNotes: "",
      lastUpdated: now,
    };

    setAndSyncState(nextState);

    return {
      ok: true,
      durationSeconds: Math.floor(totalElapsedMs / 1000),
      sessionStartTime: activeState.sessionStartTime,
      sessionId: activeState.sessionId,
    };
  }, [setAndSyncState]);

  const resetSession = useCallback(() => {
    const now = Date.now();
    const nextState: TimerState = {
      ...stateRef.current,
      phase: "idle",
      startTime: null,
      sessionStartTime: null,
      elapsedBeforePause: 0,
      sessionId: null,
      currentNotes: "",
      lastUpdated: now,
    };

    setAndSyncState(nextState);
  }, [setAndSyncState]);

  const setTag = useCallback(
    (tag: string) => {
      const now = Date.now();
      const nextState: TimerState = {
        ...stateRef.current,
        currentTag: tag,
        lastUpdated: now,
      };
      setAndSyncState(nextState);
    },
    [setAndSyncState]
  );

  const setNotes = useCallback(
    (notes: string) => {
      const now = Date.now();
      const nextState: TimerState = {
        ...stateRef.current,
        currentNotes: notes,
        lastUpdated: now,
      };
      setAndSyncState(nextState);
    },
    [setAndSyncState]
  );

  const contextValue: TimerContextValue = useMemo(
    () => ({
      phase: state.phase,
      isRunning: state.phase === "running",
      isPaused: state.phase === "paused",
      elapsedSeconds,
      startTime: state.startTime,
      sessionStartTime: state.sessionStartTime,
      currentTag: state.currentTag,
      currentNotes: state.currentNotes,
      startNewSession,
      resumeSession,
      pauseSession,
      stopSession,
      resetSession,
      setTag,
      setNotes,
    }),
    [elapsedSeconds, pauseSession, resetSession, resumeSession, setNotes, setTag, startNewSession, state.currentNotes, state.currentTag, state.phase, state.sessionStartTime, state.startTime, stopSession]
  );

  return <TimerContext.Provider value={contextValue}>{children}</TimerContext.Provider>;
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
};
