import { motion } from 'framer-motion';
import { apiGet } from '@/lib/api';
import { DashboardHero } from '@/components/dashboard/dashboard-hero';
import { getServerWorkspaceId } from '@/lib/auth-server';

export default async function DashboardPage() {
  const workspaceId = (await getServerWorkspaceId()) ?? 'workspace-1';
  const from = new Date(Date.now() - 7 * 86400000).toISOString();
  const to = new Date().toISOString();

  const summary = await apiGet<{ clicks: number }>(`/analytics/summary?workspaceId=${workspaceId}&from=${from}&to=${to}`);

  return (
    <div className="space-y-5">
      <DashboardHero clicks={summary.clicks} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card label="Clicks" value={String(summary.clicks)} accent="teal" />
        <Card label="Links" value="12" accent="indigo" />
        <Card label="Geo rules" value="6" accent="amber" />
        <Card label="Bot filter" value="Enabled" accent="pink" />
      </div>

      <section className="rounded-[28px] border border-white/10 bg-[rgba(10,15,24,0.8)] p-5 shadow-[0_20px_80px_rgba(15,23,42,0.22)]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Traffic pulse</p>
            <h2 className="text-xl font-semibold text-white">Recent activity</h2>
          </div>
          <span className="rounded-full border border-teal-400/20 bg-teal-500/10 px-3 py-1 text-sm text-teal-200">Live</span>
        </div>
        <div className="flex h-44 items-end gap-2 rounded-[24px] border border-white/10 bg-gradient-to-t from-[#111827] via-[#0f172a] to-[#172554] p-4">
          {[38, 62, 51, 74, 68, 81, 92].map((h, i) => (
            <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 0.06 * i, duration: 0.35 }} className="group relative flex-1 rounded-t-2xl bg-gradient-to-t from-[#14b8a6] via-[#5eead4] to-[#818cf8] shadow-lg shadow-teal-500/10" />
          ))}
        </div>
      </section>
    </div>
  );
}

function Card({ label, value, accent }: { label: string; value: string; accent: 'teal' | 'indigo' | 'amber' | 'pink' }) {
  const tones = {
    teal: 'from-teal-500/20 to-cyan-500/10 text-teal-200',
    indigo: 'from-indigo-500/20 to-violet-500/10 text-indigo-200',
    amber: 'from-amber-500/20 to-orange-500/10 text-amber-200',
    pink: 'from-pink-500/20 to-rose-500/10 text-pink-200'
  };

  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} transition={{ type: 'spring', stiffness: 220, damping: 18 }} className={`rounded-[24px] border border-white/10 bg-gradient-to-br ${tones[accent]} p-4 shadow-[0_18px_60px_rgba(15,23,42,0.16)]`}>
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    </motion.div>
  );
}
