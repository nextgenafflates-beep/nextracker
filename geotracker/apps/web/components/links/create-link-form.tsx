'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiGet, apiPost } from '@/lib/api';
import { getWorkspaceId } from '@/lib/auth';

type GeoRule = {
  country_code: string;
  url: string;
  priority: number;
  is_active: boolean;
};

const continents: Record<string, string[]> = {
  Americas: ['US', 'CA', 'BR', 'MX'],
  Europe: ['GB', 'DE', 'FR', 'IT'],
  Asia: ['JP', 'IN', 'SG', 'TH'],
  Africa: ['ZA', 'NG', 'EG'],
  'Middle East': ['AE', 'SA'],
  Oceania: ['AU', 'NZ']
};

export function CreateLinkForm() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [domainId, setDomainId] = useState('');
  const [domainHostname, setDomainHostname] = useState('');
  const [defaultUrl, setDefaultUrl] = useState('');
  const [botFilterEnabled, setBotFilterEnabled] = useState(false);
  const [botRedirectUrl, setBotRedirectUrl] = useState('https://www.google.com');
  const [rules, setRules] = useState<GeoRule[]>([]);
  const [pickerIndex, setPickerIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [domains, setDomains] = useState<Array<{ id: string; hostname: string }>>([]);

  const workspaceId = getWorkspaceId() ?? 'workspace-1';

  useEffect(() => {
    apiGet<Array<{ id: string; hostname: string }>>(`/links/domains?workspaceId=${workspaceId}`).then(setDomains).catch(() => setDomains([]));
  }, [workspaceId]);

  const trackingPreview = useMemo(() => {
    const host = (domainHostname || domains.find((d) => d.id === domainId)?.hostname || 'domain.tld').trim();
    return `https://${host}/${slug || 'your-slug'}`;
  }, [domainHostname, domainId, domains, slug]);

  function addRule() {
    setRules((r) => [...r, { country_code: '', url: '', priority: r.length + 1, is_active: true }]);
  }

  function updateRule(i: number, patch: Partial<GeoRule>) {
    setRules((r) => r.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  }

  function removeRule(i: number) {
    setRules((r) => r.filter((_, idx) => idx !== i).map((x, idx) => ({ ...x, priority: idx + 1 })));
  }

  async function submit() {
    setSaving(true);
    await apiPost('/links', {
      workspaceId,
      name,
      slug,
      domainId: domainId || null,
      domainHostname: domainHostname.trim() || null,
      defaultUrl,
      botFilterEnabled,
      botRedirectUrl: botFilterEnabled ? botRedirectUrl.trim() || 'https://www.google.com' : 'https://www.google.com',
      geo_rules: rules
    });
    setSaving(false);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.4fr_0.7fr]">
      <div className="space-y-4">
        <section className="rounded-2xl border border-white/10 bg-[#10141b] p-4 md:p-5 space-y-3 shadow-xl shadow-black/10">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Link Basics</h2>
            <span className="text-xs text-slate-400">Create a new tracking link</span>
          </div>
          <input className="w-full bg-[#171d28] border border-white/10 rounded-xl px-3 py-2.5 outline-none focus:border-teal-400" placeholder="Campaign name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="w-full bg-[#171d28] border border-white/10 rounded-xl px-3 py-2.5 outline-none focus:border-teal-400" placeholder="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <select className="w-full bg-[#171d28] border border-white/10 rounded-xl px-3 py-2.5 outline-none focus:border-teal-400" value={domainId} onChange={(e) => setDomainId(e.target.value)}>
            <option value="">Select a saved custom domain</option>
            {domains.map((domain) => (
              <option key={domain.id} value={domain.id}>{domain.hostname}</option>
            ))}
          </select>
          <div className="space-y-1">
            <input className="w-full bg-[#171d28] border border-white/10 rounded-xl px-3 py-2.5 outline-none focus:border-teal-400" placeholder="Enter your custom domain, e.g. go.yourbrand.com" value={domainHostname} onChange={(e) => setDomainHostname(e.target.value)} />
            <p className="text-xs text-slate-400">Use your own domain for tracking links, such as go.yourbrand.com</p>
          </div>
          <input className="w-full bg-[#171d28] border border-white/10 rounded-xl px-3 py-2.5 outline-none focus:border-teal-400" placeholder="Default URL" value={defaultUrl} onChange={(e) => setDefaultUrl(e.target.value)} />
          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={botFilterEnabled} onChange={(e) => setBotFilterEnabled(e.target.checked)} />
              Filter bots to a fallback URL
            </label>
            {botFilterEnabled && (
              <div className="mt-3 space-y-2">
                <input className="w-full bg-[#171d28] border border-white/10 rounded-xl px-3 py-2.5 outline-none focus:border-teal-400" placeholder="https://www.google.com or https://www.facebook.com" value={botRedirectUrl} onChange={(e) => setBotRedirectUrl(e.target.value)} />
                <p className="text-xs text-slate-400">Bots and crawlers will be redirected here. Leaving this empty uses Google by default.</p>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#10141b] p-4 md:p-5 space-y-3 shadow-xl shadow-black/10">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Geo Offer Rules</h2>
            <button className="rounded-xl bg-[#5eead4] px-3 py-2 text-sm font-medium text-slate-950" onClick={addRule}>+ Add country</button>
          </div>

          {rules.map((r, i) => (
            <div key={i} className="grid gap-2 rounded-xl border border-white/10 bg-[#171d28] p-2 md:grid-cols-12">
              <button className="md:col-span-3 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-left" onClick={() => setPickerIndex(i)}>
                {r.country_code || 'Select country'}
              </button>
              <input className="md:col-span-6 rounded-lg border border-white/10 bg-black/20 px-3 py-2 outline-none" placeholder="https://offer.com/country" value={r.url} onChange={(e) => updateRule(i, { url: e.target.value })} />
              <label className="md:col-span-2 flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" checked={r.is_active} onChange={(e) => updateRule(i, { is_active: e.target.checked })} />
                Active
              </label>
              <button className="md:col-span-1 text-red-300" onClick={() => removeRule(i)}>✕</button>
            </div>
          ))}
        </section>

        <div className="sticky bottom-3 rounded-2xl border border-white/10 bg-[#10141b]/95 p-3 backdrop-blur flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm">Save Draft</button>
          <button disabled={saving} onClick={submit} className="rounded-xl bg-[#5eead4] px-4 py-2 text-sm font-semibold text-slate-950">{saving ? 'Creating...' : 'Create Link'}</button>
        </div>
      </div>

      <aside className="rounded-2xl border border-white/10 bg-[#10141b] p-4 md:p-5 h-fit shadow-xl shadow-black/10">
        <h3 className="font-semibold">Preview</h3>
        <div className="mt-3 rounded-xl border border-teal-400/20 bg-teal-500/10 p-3 text-sm break-all text-teal-200">{trackingPreview}</div>
        <div className="mt-4 space-y-2 text-sm">
          {rules.map((r, i) => (
            <div key={i} className="flex justify-between gap-3 rounded-lg bg-white/5 px-3 py-2">
              <span>{r.country_code || '??'}</span>
              <span className="truncate text-slate-400">{r.url || 'no offer url'}</span>
            </div>
          ))}
          <div className="flex justify-between gap-3 rounded-lg border-t border-white/10 pt-2 mt-2">
            <span>Other</span>
            <span className="truncate text-slate-400">{defaultUrl || 'default url'}</span>
          </div>
          {botFilterEnabled && (
            <div className="flex justify-between gap-3 rounded-lg bg-white/5 px-3 py-2">
              <span>Bot fallback</span>
              <span className="truncate text-slate-400">{botRedirectUrl || 'https://www.google.com'}</span>
            </div>
          )}
        </div>
      </aside>

      {pickerIndex !== null && (
        <CountryPicker
          onClose={() => setPickerIndex(null)}
          onSelect={(code) => {
            updateRule(pickerIndex, { country_code: code });
            setPickerIndex(null);
          }}
        />
      )}
    </div>
  );
}

function CountryPicker({ onClose, onSelect }: { onClose: () => void; onSelect: (cc: string) => void }) {
  const [q, setQ] = useState('');
  const all = Object.entries(continents).flatMap(([region, codes]) => codes.map((c) => ({ region, code: c })));
  const filtered = all.filter((x) => x.code.toLowerCase().includes(q.toLowerCase()) || x.region.toLowerCase().includes(q.toLowerCase()));

  const regionColor: Record<string, string> = {
    Americas: '#00C896', Europe: '#4F8EF7', Asia: '#F5A623', Africa: '#EF4444', 'Middle East': '#A855F7', Oceania: '#06B6D4'
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 grid place-items-end md:place-items-center">
      <div className="w-full md:w-[560px] max-h-[85vh] overflow-auto rounded-t-2xl md:rounded-2xl bg-[#161618] border border-white/10">
        <div className="sticky top-0 bg-[#161618] p-3 border-b border-white/10 flex gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search country or region" className="flex-1 bg-[#2C2C31] rounded-lg px-3 py-2" />
          <button onClick={onClose} className="px-3 py-2 rounded-lg bg-white/10">Close</button>
        </div>
        <div className="p-3 space-y-2">
          {filtered.map((x) => (
            <button key={`${x.region}-${x.code}`} onClick={() => onSelect(x.code)} className="w-full text-left rounded-lg bg-[#2C2C31] px-3 py-2 flex items-center gap-3">
              <span className="w-1.5 h-6 rounded" style={{ background: regionColor[x.region] }} />
              <span>{x.code}</span>
              <span className="text-xs text-white/60">{x.region}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
