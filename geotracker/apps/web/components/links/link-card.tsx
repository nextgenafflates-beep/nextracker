'use client';

import { CheckCircle2, RotateCcw, Copy, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiPost } from '@/lib/api';
import { getWorkspaceId } from '@/lib/auth';

type LinkCardProps = {
  link: {
    id: string;
    name: string;
    slug: string;
    domain?: { hostname: string } | null;
  };
};

export function LinkCard({ link }: LinkCardProps) {
  const router = useRouter();
  const workspaceId = getWorkspaceId() ?? 'workspace-1';
  const [pendingReset, setPendingReset] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied && !feedback) return;
    const timer = window.setTimeout(() => {
      setCopied(false);
      setFeedback('');
    }, 1600);
    return () => window.clearTimeout(timer);
  }, [copied, feedback]);

  async function handleReset() {
    setPendingReset(true);
    setFeedback('');

    try {
      await apiPost('/analytics/reset', {
        workspaceId,
        linkId: link.id
      });
      setFeedback('Analytics reset successfully.');
      router.refresh();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Unable to reset analytics.');
    } finally {
      setPendingReset(false);
    }
  }

  async function handleCopyAnalyticsUrl() {
    const analyticsUrl = `${window.location.origin}/analytics?linkId=${encodeURIComponent(link.id)}&slug=${encodeURIComponent(link.slug)}`;
    try {
      await navigator.clipboard.writeText(analyticsUrl);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-[24px] border border-white/10 bg-[rgba(255,255,255,0.05)] p-3 shadow-[0_14px_45px_rgba(8,15,25,0.16)] transition hover:border-teal-400/30">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold text-white">{link.name}</h3>
            <span className="rounded-full border border-teal-400/20 bg-teal-500/10 px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.2em] text-teal-300">
              Active
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            {link.domain?.hostname ? `${link.domain.hostname}/${link.slug}` : `/${link.slug}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyAnalyticsUrl}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-200 transition hover:-translate-y-0.5 hover:bg-white/10"
          >
            {copied ? <CheckCircle2 className="h-4 w-4 text-teal-300" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied' : 'Copy URL'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={pendingReset}
            className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1.5 text-sm font-medium text-amber-200 transition hover:-translate-y-0.5 hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <RotateCcw className="h-4 w-4" />
            {pendingReset ? 'Resetting...' : 'Reset analytics'}
          </button>
          <a
            href={`/analytics?linkId=${encodeURIComponent(link.id)}&slug=${encodeURIComponent(link.slug)}`}
            className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-500/10 px-3 py-1.5 text-sm font-medium text-teal-200 transition hover:-translate-y-0.5 hover:bg-teal-500/20"
          >
            <ExternalLink className="h-4 w-4" />
            Open analytics
          </a>
        </div>
      </div>

      {feedback ? (
        <p className={`mt-3 text-sm ${feedback.includes('successfully') ? 'text-teal-300' : 'text-rose-300'}`}>{feedback}</p>
      ) : null}
    </div>
  );
}
