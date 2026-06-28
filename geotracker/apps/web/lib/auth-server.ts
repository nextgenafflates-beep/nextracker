import { cookies } from 'next/headers';
import type { StoredSession } from './auth';

const AUTH_COOKIE_NAME = 'nexatrack-session';

export async function getServerSession(): Promise<StoredSession | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!value) return null;

  try {
    return JSON.parse(decodeURIComponent(value)) as StoredSession;
  } catch {
    return null;
  }
}

export async function getServerWorkspaceId() {
  return (await getServerSession())?.workspaceId ?? null;
}
