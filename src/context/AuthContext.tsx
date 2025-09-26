import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  AuthError
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, authPersistenceReady } from '@/lib/firebase';
import { syncLoginSession } from '@/lib/backendSync';
import { fullSync, initRealtimeUserSync, stopRealtimeUserSync, pushUserBundle } from '@/lib/syncService';

interface AuthContextType {
  user: User | null;
  /** True while the initial auth state is being resolved */
  initializing: boolean;
  /** True while a login/logout action is in flight */
  actionLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    // Ensure persistence layer is ready before attaching listener to avoid double callbacks.
    authPersistenceReady.finally(() => {
      unsub = onAuthStateChanged(auth, (u) => {
        setUser(u);
        setInitializing(false);
        if (u) {
          initRealtimeUserSync(u.uid, u.email || undefined);
        } else {
          stopRealtimeUserSync();
        }
      });
    });
    return () => {
      if (unsub) unsub();
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      setActionLoading(true);
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();
      if (!trimmedEmail || !trimmedPassword) {
        setError('Email and password are required.');
        return;
      }
      if (import.meta.env.DEV) console.time('auth:login');
      await authPersistenceReady; // Ensure persistence configured
      const result = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      if (import.meta.env.DEV) console.timeEnd('auth:login');
      
      // Save login details to Firestore
      if (result.user) {
        await setDoc(doc(db, 'userSessions', result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || result.user.email?.split('@')[0],
          loginTime: serverTimestamp(),
          lastActive: serverTimestamp(),
        }, { merge: true });

        // Store lightweight session snapshot locally for faster UI hydration
        const sessionSnapshot = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          lastLogin: Date.now()
        };
        try {
          localStorage.setItem('marksy_session', JSON.stringify(sessionSnapshot));
        } catch {}

        // Fire and forget backend sync (no await to avoid blocking redirect)
        syncLoginSession(result.user);
        // Kick off data sync chain (cloud <-> local)
        fullSync(result.user.uid, result.user.email || undefined);
      }
    } catch (err) {
      const authError = err as AuthError;
      
      // Handle specific Firebase auth errors
      switch (authError.code) {
        case 'auth/user-not-found':
          setError('No account found with this email address.');
          break;
        case 'auth/wrong-password':
          setError('Invalid email or password.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later.');
          break;
        case 'auth/invalid-credential':
          setError('Invalid email or password.');
          break;
        default:
          setError('Login failed. Please try again.');
      }
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setError(null);
      setActionLoading(true);
      if (user) {
        // Best-effort final push
        try { await pushUserBundle({ uid: user.uid, email: user.email || null }); } catch {}
      }
      if (import.meta.env.DEV) console.time('auth:logout');
      await signOut(auth);
      stopRealtimeUserSync();
      if (import.meta.env.DEV) console.timeEnd('auth:logout');
    } catch (err) {
      setError('Failed to logout. Please try again.');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    initializing,
    actionLoading,
    login,
    logout,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};