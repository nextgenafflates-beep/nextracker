'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const stored = window.localStorage.getItem('theme') as 'dark' | 'light' | null;
    const initial = stored ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    window.localStorage.setItem('theme', next);
    document.documentElement.dataset.theme = next;
  }

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm transition hover:-translate-y-0.5 hover:bg-white/20"
    >
      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}
