// Helper for managing dynamic authentication fallback session
export interface LocalUser {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    [key: string]: any;
  };
  created_at: string;
}

const STORAGE_KEY = "ai_stimulator_session";
const authListeners: Array<(user: LocalUser | null) => void> = [];

export function getLocalUser(): LocalUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setLocalUser(email: string, name?: string): LocalUser {
  const user: LocalUser = {
    id: `usr_${Math.random().toString(36).slice(2, 11)}`,
    email,
    user_metadata: {
      full_name: name || email.split("@")[0] || "User",
    },
    created_at: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
  authListeners.forEach((fn) => fn(user));
  return user;
}

export function clearLocalUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
  authListeners.forEach((fn) => fn(null));
}

export function subscribeLocalAuth(callback: (user: LocalUser | null) => void): () => void {
  authListeners.push(callback);
  return () => {
    const idx = authListeners.indexOf(callback);
    if (idx >= 0) authListeners.splice(idx, 1);
  };
}
