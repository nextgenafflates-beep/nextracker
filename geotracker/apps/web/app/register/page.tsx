"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { apiPost } from '../../lib/api';
import { saveSession } from '../../lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [promoCode, setPromoCode] = useState('RAFSAN0');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await apiPost<{ message: string; status: string; id: string; email: string; fullName: string; workspaceId: string; workspaceName: string }>( '/auth/register', { fullName, email, password, promoCode });
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
      setError(err instanceof Error ? err.message : 'Unable to create account.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(94,234,212,0.2),_transparent_35%),linear-gradient(135deg,_rgba(15,23,42,0.95),_rgba(2,6,23,1))] px-4 py-10 text-[var(--text)] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[rgba(15,23,42,0.8)] shadow-[0_24px_90px_rgba(15,23,42,0.35)] lg:flex-row">
        <div className="flex-1 bg-[linear-gradient(135deg,rgba(94,234,212,0.16),rgba(129,140,248,0.12))] p-8 sm:p-10 lg:p-12">
          <div className="max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-teal-300">NexaTrack.io</p>
            <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Launch your first tracking workspace.</h1>
            <p className="mt-4 text-base text-slate-300">Create an account, claim a workspace, and start routing traffic with real-time analytics.</p>
          </div>
        </div>
        <div className="flex-1 p-8 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-md rounded-[24px] border border-white/10 bg-[rgba(255,255,255,0.05)] p-6 shadow-inner">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Create account</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">Promo code RAFSAN0 auto-approves your workspace.</p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input className="w-full rounded-2xl border border-white/10 bg-[var(--surface-2)] px-4 py-3 outline-none focus:border-teal-400" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              <input className="w-full rounded-2xl border border-white/10 bg-[var(--surface-2)] px-4 py-3 outline-none focus:border-teal-400" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input className="w-full rounded-2xl border border-white/10 bg-[var(--surface-2)] px-4 py-3 outline-none focus:border-teal-400" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <input className="w-full rounded-2xl border border-white/10 bg-[var(--surface-2)] px-4 py-3 outline-none focus:border-teal-400" placeholder="Promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
              <button className="w-full rounded-2xl bg-[var(--primary)] px-4 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-70" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</button>
            </form>
            {message ? <p className="mt-4 text-sm text-emerald-300">{message}</p> : null}
            {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
            <div className="mt-4 text-sm text-[var(--muted)]">
              Already have an account? <Link href="/login" className="font-medium text-teal-300">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
