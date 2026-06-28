"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiPost } from '../../../lib/api';
import { saveSession } from '../../../lib/auth';

export default function GoogleAuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState('Signing you in...');

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');

    async function finishAuth() {
      if (!accessToken) {
        setMessage('Google sign-in was cancelled or failed.');
        return;
      }

      try {
        const profileResponse = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${encodeURIComponent(accessToken)}`);
        if (!profileResponse.ok) {
          throw new Error('Unable to read your Google profile.');
        }

        const profile = await profileResponse.json() as { sub?: string; email?: string; name?: string };
        const res = await apiPost<{ message: string; id: string; email: string; fullName: string; status: string; workspaceId: string; workspaceName: string }>('/auth/google', {
          providerId: profile.sub ?? accessToken,
          email: profile.email ?? '',
          fullName: profile.name ?? 'Google User'
        });
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
        setTimeout(() => router.push('/dashboard'), 800);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Google sign-in failed.');
      }
    }

    finishAuth();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl">
        <h1 className="text-2xl font-semibold">Google sign-in</h1>
        <p className="mt-3 text-sm text-slate-300">{message}</p>
      </div>
    </div>
  );
}
