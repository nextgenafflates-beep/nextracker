import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class LinksService {
  constructor(private prisma: PrismaService) {}

  list(workspaceId: string) {
    return this.prisma.link.findMany({
      where: { workspaceId },
      include: { geoRules: true, domain: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  get(id: string) {
    return this.prisma.link.findUnique({
      where: { id },
      include: { geoRules: { orderBy: { priority: 'asc' } }, domain: true }
    });
  }

  async create(input: any) {
    const { geo_rules = [], domainHostname, botFilterEnabled, botRedirectUrl, ...link } = input;

    const domain = domainHostname
      ? await this.prisma.domain.upsert({
          where: { hostname: domainHostname },
          update: { workspaceId: link.workspaceId, isActive: true },
          create: { workspaceId: link.workspaceId, hostname: domainHostname, isActive: true }
        })
      : null;

    return this.prisma.link.create({
      data: {
        ...link,
        botFilterEnabled: Boolean(botFilterEnabled),
        botRedirectUrl: typeof botRedirectUrl === 'string' && botRedirectUrl.trim() ? botRedirectUrl.trim() : 'https://www.google.com',
        domainId: domain?.id ?? null,
        geoRules: { create: geo_rules.map((r: any, i: number) => ({ ...r, priority: r.priority ?? i + 1 })) }
      },
      include: { geoRules: { orderBy: { priority: 'asc' } }, domain: true }
    });
  }

  async update(id: string, input: any) {
    const { geo_rules, domainHostname, botFilterEnabled, botRedirectUrl, ...patch } = input;
    let domainId = patch.domainId ?? null;

    if (domainHostname) {
      const domain = await this.prisma.domain.upsert({
        where: { hostname: domainHostname },
        update: { workspaceId: patch.workspaceId, isActive: true },
        create: { workspaceId: patch.workspaceId, hostname: domainHostname, isActive: true }
      });
      domainId = domain.id;
    }

    const normalizedPatch = {
      ...patch,
      ...(typeof botFilterEnabled === 'boolean' ? { botFilterEnabled } : {}),
      ...(typeof botRedirectUrl === 'string' ? { botRedirectUrl: botRedirectUrl.trim() || 'https://www.google.com' } : {})
    };

    await this.prisma.link.update({
      where: { id },
      data: { ...normalizedPatch, domainId }
    });

    if (Array.isArray(geo_rules)) {
      await this.prisma.$transaction([
        this.prisma.linkGeoRule.deleteMany({ where: { linkId: id } }),
        ...geo_rules.map((r: any, i: number) =>
          this.prisma.linkGeoRule.create({ data: { linkId: id, countryCode: r.country_code, url: r.url, isActive: r.is_active ?? true, priority: i + 1 } })
        )
      ]);
    }
    return this.get(id);
  }

  listDomains(workspaceId: string) {
    return this.prisma.domain.findMany({ where: { workspaceId }, orderBy: { createdAt: 'desc' } });
  }

  createDomain(input: any) {
    return this.prisma.domain.create({ data: input });
  }
}
