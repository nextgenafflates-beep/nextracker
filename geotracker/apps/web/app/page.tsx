import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(94,234,212,0.2),_transparent_35%),linear-gradient(135deg,_rgba(15,23,42,0.95),_rgba(2,6,23,1))] px-4 py-10 text-[var(--text)] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-[32px] border border-white/10 bg-[rgba(15,23,42,0.8)] p-8 shadow-[0_24px_90px_rgba(15,23,42,0.35)] sm:p-10 lg:p-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-teal-300">NexaTrack.io</p>
            <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Smart tracking links for modern growth teams.</h1>
            <p className="mt-4 text-lg text-slate-300">Create, route, and analyze links with country rules, bot filtering, and real-time reporting.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/register" className="rounded-2xl bg-[var(--primary)] px-5 py-3 font-semibold text-slate-950">Create account</Link>
            <Link href="/login" className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold">Sign in</Link>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Geo routing', 'Send users to different destinations by country'],
            ['Bot filtering', 'Route crawlers to a safe fallback URL'],
            ['Live analytics', 'See click volume, devices, referrers, and country breakdowns']
          ].map(([title, desc]) => (
            <div key={title} className="rounded-[24px] border border-white/10 bg-[rgba(255,255,255,0.05)] p-5">
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
