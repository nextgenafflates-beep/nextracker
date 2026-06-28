import { CreateLinkForm } from '@/components/links/create-link-form';
import { LinkCard } from '@/components/links/link-card';
import { apiGet } from '@/lib/api';
import { getServerWorkspaceId } from '@/lib/auth-server';

export default async function LinksPage() {
  const workspaceId = (await getServerWorkspaceId()) ?? 'workspace-1';
  const links = await apiGet<Array<{ id: string; name: string; slug: string; domain?: { hostname: string } | null }>>(`/links?workspaceId=${workspaceId}`);

  return (
    <div className="space-y-5">
      <CreateLinkForm />
      <section className="rounded-[28px] border border-white/10 bg-[rgba(10,15,24,0.8)] p-4 md:p-5 shadow-[0_20px_80px_rgba(15,23,42,0.18)]">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Your links</h2>
            <p className="text-sm text-slate-400">Create, monitor, and reset analytics for each tracking link</p>
          </div>
          <span className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">{links.length} total</span>
        </div>

        {links.length === 0 ? (
          <div className="rounded-[22px] border border-dashed border-white/10 bg-white/5 p-6 text-center text-sm text-slate-400">
            No links yet. Create your first tracking link to see it appear here.
          </div>
        ) : (
          <div className="space-y-2">
            {links.map((link) => (
              <LinkCard key={link.id} link={link} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
