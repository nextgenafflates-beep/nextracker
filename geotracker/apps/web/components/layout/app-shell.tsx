'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { ThemeToggle } from '@/components/theme-toggle';
import { getSession } from '@/lib/auth';

const nav = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/links', label: 'Links' },
  { href: '/analytics', label: 'Analytics' }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const session = getSession();

  return (
    <div className="min-h-screen bg-transparent text-[var(--text)]">
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 flex-col border-r border-[var(--border)] glass-panel">
        <div className="px-6 py-6">
          <div className="text-xl font-semibold tracking-tight">NexaTrack.io</div>
          <p className="mt-1 text-sm text-[var(--muted)]">Smart link routing</p>
          <div className="mt-4 rounded-2xl border border-teal-400/20 bg-teal-500/10 px-3 py-2 text-xs text-teal-200">Production-ready analytics</div>
        </div>
        <nav className="mt-3 flex-1 px-3 space-y-1">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={clsx(
                'flex items-center rounded-xl px-3 py-2.5 text-sm transition-all duration-200 hover:-translate-y-0.5',
                pathname.startsWith(n.href)
                  ? 'bg-[var(--primary)] text-slate-950 shadow-lg shadow-teal-500/20'
                  : 'text-[var(--muted)] hover:bg-white/10 hover:text-[var(--text)]'
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="md:ml-64 pb-24 md:pb-0">
        <header className="sticky top-0 z-20 h-16 border-b border-[var(--border)] glass-panel px-4 md:px-8 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">{session?.workspaceName ?? 'Workspace'}</div>
            <div className="text-xs text-[var(--muted)]">{session?.user.fullName ?? 'Signed in'} · live data</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-full border border-teal-400/30 bg-teal-500/10 px-3 py-1 text-xs text-teal-500">Live</div>
            <ThemeToggle />
          </div>
        </header>
        <div className="p-4 md:p-8">{children}</div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-[var(--border)] glass-panel">
        <div className="grid grid-cols-3">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="py-3 text-center text-xs">
              <span className={pathname.startsWith(n.href) ? 'text-[var(--primary)]' : 'text-[var(--muted)]'}>{n.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
