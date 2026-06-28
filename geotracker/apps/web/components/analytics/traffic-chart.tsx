'use client';

import { motion } from 'framer-motion';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowUpRight, TrendingUp } from 'lucide-react';

type TrafficChartProps = {
  data: Array<{ day: string; clicks: number }>;
};

export function TrafficChart({ data }: TrafficChartProps) {
  const totalClicks = data.reduce((sum, item) => sum + item.clicks, 0);

  return (
    <div className="rounded-[28px] border border-white/10 bg-[rgba(15,23,42,0.8)] p-5 shadow-[0_20px_80px_rgba(15,23,42,0.25)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">Country traffic</p>
          <h3 className="text-xl font-semibold text-white">Clicks by country</h3>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">
          <TrendingUp className="h-4 w-4" />
          {totalClicks} total
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.16)" strokeDasharray="4 4" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip cursor={{ fill: 'rgba(94,234,212,0.08)' }} contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px' }} />
            <Bar dataKey="clicks" fill="#5eead4" radius={[8, 8, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-2">
        {data.slice(0, 10).map((item, index) => {
          const percent = totalClicks ? Math.round((item.clicks / totalClicks) * 100) : 0;
          return (
            <motion.div key={item.day} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: index * 0.03 }} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm">
              <span className="font-medium text-slate-200">{index + 1}. {item.day}</span>
              <span className="text-slate-400">{item.clicks} clicks · {percent}%</span>
            </motion.div>
          );
        })}
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }} className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
        <span>Top country reached {data[0]?.clicks ?? 0} clicks</span>
        <span className="inline-flex items-center gap-1 font-medium text-teal-200">
          Breakdown ready <ArrowUpRight className="h-4 w-4" />
        </span>
      </motion.div>
    </div>
  );
}
