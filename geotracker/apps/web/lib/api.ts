const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  let payload: unknown = null;

  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = typeof payload === 'object' && payload && 'message' in payload && typeof (payload as { message?: unknown }).message === 'string'
      ? (payload as { message: string }).message
      : `API ${response.status}`;
    throw new Error(message);
  }

  return payload as T;
}

export async function apiGet<T>(path: string): Promise<T> {
  const r = await fetch(`${API}${path}`, { cache: 'no-store' });
  return parseResponse<T>(r);
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const r = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return parseResponse<T>(r);
}
