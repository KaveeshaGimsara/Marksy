import { User } from 'firebase/auth';

interface BackendSessionPayload {
  uid: string;
  email: string | null;
  displayName: string | null;
  loginTime: string; // ISO
  device: {
    userAgent: string;
    language: string;
    platform: string;
  };
}

// POST login session to custom backend. Non-blocking: failures won't prevent app login.
export async function syncLoginSession(user: User) {
  const baseUrl = import.meta.env.VITE_BACKEND_API_URL;
  if (!baseUrl) {
    if (import.meta.env.DEV) console.warn('[backendSync] VITE_BACKEND_API_URL not set; skipping sync');
    return;
  }

  try {
    const token = await user.getIdToken(/* forceRefresh */ false);
    const payload: BackendSessionPayload = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      loginTime: new Date().toISOString(),
      device: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: (navigator as any).platform || 'unknown'
      }
    };

    const resp = await fetch(`${baseUrl.replace(/\/$/, '')}/auth/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Backend responded ${resp.status}: ${text}`);
    }
    if (import.meta.env.DEV) console.info('[backendSync] Session synced');
  } catch (err) {
    // Log only; do not interrupt user flow
    console.warn('[backendSync] Failed to sync session:', err);
  }
}
