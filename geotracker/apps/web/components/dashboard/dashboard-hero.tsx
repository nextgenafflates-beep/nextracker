'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, ShieldCheck, Sparkles, Zap } from 'lucide-react';

type DashboardHeroProps = {
  clicks: number;
};

export function DashboardHero({ clicks }: DashboardHeroProps) {
  const highlights = [
    { label: 'Clicks this week', value: clicks.toString(), hint: 'Up 18% vs last week' },
    { label: 'Live routes', value: '12', hint: 'Active targeting flows' },
    { label: 'Geo focus', value: '6', hint: 'Smart country rules' }
  ];

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#172554] p-6 shadow-[0_30px_120px_rgba(15,23,42,0.35)] md:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(94,234,212,0.25),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(129,140,248,0.22),_transparent_40%)]" />
      <div className="pointer-events-none absolute left-[-6%] top-[-10%] h-40 w-40 rounded-full bg-teal-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-8%] right-[-2%] h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-500/10 px-3 py-1 text-sm text-teal-200">
            <Sparkles className="h-4 w-4" />
            Smart tracking workspace
          </div>
          <div className="space-y-3">
            <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Turn every click into a clear growth signal.
            </h1>
            <p className="max-w-xl text-base text-slate-300 sm:text-lg">
              Route traffic smartly, filter bots, and monitor country-level performance from one calm and capable workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <motion.button whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }} className="inline-flex items-center gap-2 rounded-2xl bg-teal-400 px-4 py-2.5 font-medium text-slate-950 shadow-lg shadow-teal-400/20">
              Create a new link <ArrowRight className="h-4 w-4" />
            </motion.button>
            <Link href="/analytics" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 font-medium text-white backdrop-blur">
              <BarChart3 className="h-4 w-4" /> View analytics
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="rounded-[28px] border border-white/10 bg-slate-950/55 p-5 backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Momentum snapshot</p>
              <p className="mt-1 text-xl font-semibold text-white">Fast-moving campaign health</p>
            </div>
            <div className="rounded-full bg-emerald-400/10 p-2 text-emerald-300">
              <Zap className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-3">
            {highlights.map((item, index) => (
              <motion.div key={item.label} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25, delay: 0.15 + index * 0.06 }} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <p className="text-lg font-semibold text-white">{item.value}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <ShieldCheck className="h-4 w-4 text-teal-300" />
                  {item.hint}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
