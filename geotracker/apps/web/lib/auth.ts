export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  status: string;
};

export type StoredSession = {
  token: string;
  user: SessionUser;
  workspaceId: string;
  workspaceName: string;
};

const AUTH_STORAGE_KEY = 'nexatrack-session';

export function saveSession(session: StoredSession) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  const cookieValue = encodeURIComponent(JSON.stringify(session));
  document.cookie = `${AUTH_STORAGE_KEY}=${cookieValue}; path=/; Max-Age=604800; SameSite=Lax`;
}

export function getSession(): StoredSession | null {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  document.cookie = `${AUTH_STORAGE_KEY}=; path=/; Max-Age=0; SameSite=Lax`;
}

export function getWorkspaceId() {
  return getSession()?.workspaceId ?? null;
}

export function getAuthToken() {
  return getSession()?.token ?? null;
}
