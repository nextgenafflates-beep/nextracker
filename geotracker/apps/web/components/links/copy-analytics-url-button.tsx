'use client';

import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';

type CopyAnalyticsUrlButtonProps = {
  linkId: string;
  slug: string;
};

export function CopyAnalyticsUrlButton({ linkId, slug }: CopyAnalyticsUrlButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    const analyticsUrl = `${window.location.origin}/analytics?linkId=${encodeURIComponent(linkId)}&slug=${encodeURIComponent(slug)}`;

    try {
      await navigator.clipboard.writeText(analyticsUrl);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-500/10 px-3 py-1.5 text-sm font-medium text-teal-200 transition hover:-translate-y-0.5 hover:bg-teal-500/20"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? 'Copied' : 'Copy analytics URL'}
    </button>
  );
}
