import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async summary(workspaceId: string, from: string, to: string) {
    const range = { workspaceId, ts: { gte: new Date(from), lte: new Date(to) } };
    const [agg, byCountry, byDevice, byReferrer, recentClicks] = await Promise.all([
      this.prisma.clickEvent.aggregate({ where: range, _count: { _all: true } }),
      this.prisma.clickEvent.groupBy({ by: ['countryCode'], where: range, _count: { _all: true } }),
      this.prisma.clickEvent.groupBy({ by: ['device'], where: range, _count: { _all: true } }),
      this.prisma.clickEvent.groupBy({ by: ['referrer'], where: range, _count: { _all: true } }),
      this.prisma.clickEvent.findMany({
        where: range,
        orderBy: { ts: 'desc' },
        take: 20,
        select: { id: true, ts: true, countryCode: true, referrer: true, browser: true, device: true, os: true, isBot: true, isDuplicate: true, duplicateReason: true }
      })
    ]);

    return {
      clicks: agg._count._all,
      bots: await this.prisma.clickEvent.count({ where: { ...range, isBot: true } }),
      duplicates: await this.prisma.clickEvent.count({ where: { ...range, isDuplicate: true } }),
      topCountries: byCountry.slice(0, 5).map((entry: { countryCode?: string | null; _count?: { _all?: number | null } | null }) => ({ country: entry.countryCode ?? 'Unknown', clicks: entry._count?.['_all'] ?? 0 })),
      countryChart: byCountry.map((entry: { countryCode?: string | null; _count?: { _all?: number | null } | null }) => ({ country: entry.countryCode ?? 'Unknown', clicks: entry._count?.['_all'] ?? 0 })),
      topDevices: byDevice.slice(0, 5).map((entry: { device?: string | null; _count?: { _all?: number | null } | null }) => ({ device: entry.device ?? 'Unknown', clicks: entry._count?.['_all'] ?? 0 })),
      topReferrers: byReferrer.slice(0, 5).map((entry: { referrer?: string | null; _count?: { _all?: number | null } | null }) => ({ referrer: entry.referrer ?? 'Direct', clicks: entry._count?.['_all'] ?? 0 })),
      recentClicks
    };
  }

  async reset(workspaceId: string, linkId: string) {
    const deleted = await this.prisma.clickEvent.deleteMany({
      where: { workspaceId, linkId }
    });

    return {
      success: true,
      deletedCount: deleted.count
    };
  }
}
