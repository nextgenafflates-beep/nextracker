"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { apiPost } from '../../lib/api';
import { saveSession } from '../../lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await apiPost<{ message: string; id: string; email: string; fullName: string; status: string; workspaceId: string; workspaceName: string }>( '/auth/login', { email, password });
      saveSession({
        token: `local-${res.id}`,
        user: {
          id: res.id,
          email: res.email,
          fullName: res.fullName,
          status: res.status
        },
        workspaceId: res.workspaceId,
        workspaceName: res.workspaceName
      });
      setMessage(res.message);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in right now.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError('');
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ?? `${window.location.origin}/auth/google`;

    if (!clientId) {
      setMessage('Google OAuth is not configured yet. Add NEXT_PUBLIC_GOOGLE_CLIENT_ID and NEXT_PUBLIC_GOOGLE_REDIRECT_URI to enable it.');
      return;
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'token',
      scope: 'openid email profile',
      prompt: 'select_account',
      access_type: 'online'
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(94,234,212,0.2),_transparent_35%),linear-gradient(135deg,_rgba(15,23,42,0.95),_rgba(2,6,23,1))] px-4 py-10 text-[var(--text)] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[rgba(15,23,42,0.8)] shadow-[0_24px_90px_rgba(15,23,42,0.35)] lg:flex-row">
        <div className="flex-1 bg-[linear-gradient(135deg,rgba(94,234,212,0.16),rgba(129,140,248,0.12))] p-8 sm:p-10 lg:p-12">
          <div className="max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-teal-300">NexaTrack.io</p>
            <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Sign in to manage your smart links.</h1>
            <p className="mt-4 text-base text-slate-300">Track traffic, route by country, and keep your campaigns under control from one dashboard.</p>
          </div>
        </div>
        <div className="flex-1 p-8 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-md rounded-[24px] border border-white/10 bg-[rgba(255,255,255,0.05)] p-6 shadow-inner">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Welcome back</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">Use your workspace email to continue.</p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input className="w-full rounded-2xl border border-white/10 bg-[var(--surface-2)] px-4 py-3 outline-none focus:border-teal-400" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input className="w-full rounded-2xl border border-white/10 bg-[var(--surface-2)] px-4 py-3 outline-none focus:border-teal-400" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button className="w-full rounded-2xl bg-[var(--primary)] px-4 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-70" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
            </form>
            <div className="my-4 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-500">
              <div className="h-px flex-1 bg-white/10" />
              <span>Or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <button onClick={handleGoogle} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold transition hover:bg-white/10">Continue with Google</button>
            {message ? <p className="mt-4 text-sm text-emerald-300">{message}</p> : null}
            {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
            <div className="mt-4 text-sm text-[var(--muted)]">
              Don’t have an account? <Link href="/register" className="font-medium text-teal-300">Create one</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
