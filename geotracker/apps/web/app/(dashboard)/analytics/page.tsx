import { motion } from 'framer-motion';
import { apiGet } from '@/lib/api';
import { TrafficChart } from '@/components/analytics/traffic-chart';
import { getServerWorkspaceId } from '@/lib/auth-server';

type AnalyticsSummary = {
  clicks: number;
  bots: number;
  duplicates: number;
  topCountries: Array<{ country: string; clicks: number }>;
  countryChart: Array<{ country: string; clicks: number }>;
  topDevices: Array<{ device: string; clicks: number }>;
  topReferrers: Array<{ referrer: string; clicks: number }>;
  recentClicks: Array<{
    id: string;
    ts: string;
    countryCode: string | null;
    referrer: string | null;
    browser: string | null;
    device: string | null;
    os: string | null;
    isBot: boolean;
    isDuplicate: boolean;
    duplicateReason: string | null;
  }>;
};

export default async function AnalyticsPage() {
  const workspaceId = (await getServerWorkspaceId()) ?? 'workspace-1';
  const from = new Date(Date.now() - 30 * 86400000).toISOString();
  const to = new Date().toISOString();
  const summary = await apiGet<AnalyticsSummary>(`/analytics/summary?workspaceId=${workspaceId}&from=${from}&to=${to}`);

  const chartData = summary.countryChart.map((item) => ({
    day: item.country,
    clicks: item.clicks
  }));

  return (
    <div className="space-y-5">
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="rounded-[32px] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03))] p-6 shadow-[0_25px_90px_rgba(15,23,42,0.16)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--primary)]">Analytics</p>
            <h2 className="text-2xl font-semibold">Performance overview</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Clear visibility into clicks, bot traffic, duplicates, and country-level activity.</p>
          </div>
          <div className="rounded-full border border-[var(--border)] bg-white/10 px-3 py-1 text-sm text-[var(--muted)]">Last 30 days</div>
        </div>
      </motion.section>

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          { label: 'Total clicks', value: summary.clicks },
          { label: 'Bot clicks', value: summary.bots },
          { label: 'Duplicate clicks', value: summary.duplicates }
        ].map((item, index) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, delay: index * 0.06 }} className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)]/90 p-4 shadow-[0_16px_50px_rgba(15,23,42,0.12)]">
            <p className="text-sm text-[var(--muted)]">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold">{item.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
        <TrafficChart data={chartData} />

        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.12 }} className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)]/90 p-4 shadow-[0_16px_50px_rgba(15,23,42,0.12)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Top countries</h3>
            <span className="text-sm text-[var(--muted)]">By traffic</span>
          </div>
          <div className="space-y-3">
            {summary.topCountries.map((item) => (
              <motion.div key={item.country} whileHover={{ x: 4 }} className="flex items-center justify-between rounded-2xl bg-[var(--surface-2)] px-3 py-3 transition">
                <span>{item.country}</span>
                <span className="text-[var(--muted)]">{item.clicks}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
