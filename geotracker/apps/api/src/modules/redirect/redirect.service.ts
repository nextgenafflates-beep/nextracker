import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { QueueService } from '../queue/queue.service';
import { Request } from 'express';
import { get } from 'https';

const IP2LOCATION_KEYS = [
  '0CE21DF81A3D778DE561051830772374',
  'FC6516DE3EFF874EF531BB0DAFAF1A78',
  '8A45E1FD0F80A11876A3FDE6A77170BE',
  '93504106942053D65B4D12A876539A8F'
];

@Injectable()
export class RedirectService {
  private keyIndex = 0;

  constructor(private prisma: PrismaService, private queue: QueueService) {}

  private isBotUserAgent(userAgent?: string | null) {
    if (!userAgent) return false;
    return /(bot|crawl|spider|slurp|bingpreview|headless|facebookexternalhit|twitterbot|telegrambot|googlebot|bingbot|duckduckbot|applebot)/i.test(userAgent);
  }

  private normalizeRedirectUrl(url?: string | null) {
    const trimmed = (url ?? '').trim();
    if (!trimmed) return 'https://www.google.com';
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  }

  private getNextApiKey() {
    const key = IP2LOCATION_KEYS[this.keyIndex % IP2LOCATION_KEYS.length];
    this.keyIndex += 1;
    return key;
  }

  private async lookupCountry(ipAddress?: string | null) {
    if (!ipAddress || /^(127\.0\.0\.1|::1|localhost)$/i.test(ipAddress)) return null;

    const apiKey = this.getNextApiKey();
    const url = `https://api.ip2location.io/?key=${apiKey}&ip=${encodeURIComponent(ipAddress)}`;

    return new Promise<string | null>((resolve) => {
      get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve((parsed?.country_code as string | undefined)?.toUpperCase() || null);
          } catch {
            resolve(null);
          }
        });
      }).on('error', () => resolve(null));
    });
  }

  private resolveDestination(link: any, countryCode: string | null, isBot: boolean) {
    if (link.botFilterEnabled && isBot) {
      return this.normalizeRedirectUrl(link.botRedirectUrl);
    }

    const rule = link.geoRules.find((candidate: { countryCode: string | null }) => candidate.countryCode === countryCode);
    return this.normalizeRedirectUrl(rule?.url ?? link.defaultUrl);
  }

  private async trackClickInBackground(link: any, destination: string, fallbackCountryCode: string | null, ua: string | null, ipAddress: string | null, isBot: boolean) {
    try {
      const countryCode = (await this.lookupCountry(ipAddress)) || fallbackCountryCode;
      const rule = link.geoRules.find((candidate: { countryCode: string | null }) => candidate.countryCode === countryCode);
      await this.queue.enqueueClick({
        workspaceId: link.workspaceId,
        linkId: link.id,
        matchedRuleId: rule?.id ?? null,
        countryCode,
        destination,
        ua,
        referrer: null,
        ipAddress,
        isBot
      });
    } catch {
      // Swallow background tracking errors so redirects stay fast and smooth.
    }
  }

  async resolve(slug: string, req: Request) {
    const host = req.hostname;
    const link = await this.prisma.link.findFirst({
      where: { slug, status: 'active', OR: [{ domain: { hostname: host } }, { domainId: null }] },
      include: { geoRules: { where: { isActive: true }, orderBy: { priority: 'asc' } } }
    });
    if (!link) throw new NotFoundException('Link not found');

    const fallbackCc = ((req.headers['cf-ipcountry'] as string) || '').toUpperCase() || null;
    const ua = req.headers['user-agent'] ?? null;
    const ipAddress = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ?? req.socket.remoteAddress ?? null;
    const isBot = this.isBotUserAgent(ua);
    const destination = this.resolveDestination(link, fallbackCc, isBot);

    void this.trackClickInBackground(link, destination, fallbackCc, ua, ipAddress, isBot);

    return destination;
  }
}
