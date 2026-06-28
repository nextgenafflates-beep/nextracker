import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { PrismaClient } from '@prisma/client';

// Validate required environment variables
if (!process.env.REDIS_URL) {
  console.error('Missing required environment variable: REDIS_URL');
  process.exit(1);
}

const prisma = new PrismaClient();
const conn = new IORedis(process.env.REDIS_URL);

const worker = new Worker('clicks', async (job) => {
  try {
    const ts = new Date();
    const day = new Date(Date.UTC(ts.getUTCFullYear(), ts.getUTCMonth(), ts.getUTCDate()));
    const d = job.data;
    const ua = d.ua ?? '';
    const isBot = Boolean(d.isBot);
    const browser = extractBrowser(ua);
    const device = extractDevice(ua);
    const os = extractOs(ua);
    const recentEvents = await prisma.clickEvent.findMany({
      where: { linkId: d.linkId, ts: { gte: new Date(ts.getTime() - 24 * 60 * 60 * 1000) } },
      select: { id: true, ipAddress: true, ua: true }
    });
    const duplicateReason = detectDuplicateReason(recentEvents, d.ipAddress, ua);
    const isDuplicate = Boolean(duplicateReason);
    await prisma.$transaction([
      prisma.clickEvent.create({
        data: {
          workspaceId: d.workspaceId, linkId: d.linkId, matchedRuleId: d.matchedRuleId,
          countryCode: d.countryCode, destination: d.destination, ua, referrer: d.referrer,
          ipAddress: d.ipAddress ?? null, browser, device, os, isBot, isDuplicate, duplicateReason, ts
        }
      }),
      prisma.analyticsDaily.upsert({
        where: { workspaceId_date: { workspaceId: d.workspaceId, date: day } },
        update: { clicks: { increment: 1 } },
        create: { workspaceId: d.workspaceId, date: day, clicks: 1 }
      })
    ]);
  } catch (error) {
    console.error('Error processing click job:', error);
    throw error;
  }
}, { connection: conn });

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await worker.close();
  await conn.quit();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await worker.close();
  await conn.quit();
  await prisma.$disconnect();
  process.exit(0);
});

function extractBrowser(userAgent: string) {
  if (/chrome|crios/i.test(userAgent)) return 'Chrome';
  if (/firefox/i.test(userAgent)) return 'Firefox';
  if (/safari/i.test(userAgent)) return 'Safari';
  if (/edg/i.test(userAgent)) return 'Edge';
  if (/opr\//i.test(userAgent)) return 'Opera';
  return 'Unknown';
}

function extractDevice(userAgent: string) {
  if (/iphone|ipad|ipod/i.test(userAgent)) return 'iPhone/iPad';
  if (/android/i.test(userAgent)) return 'Android';
  if (/mobile/i.test(userAgent)) return 'Mobile';
  if (/tablet/i.test(userAgent)) return 'Tablet';
  return 'Desktop';
}

function extractOs(userAgent: string) {
  if (/windows/i.test(userAgent)) return 'Windows';
  if (/mac os/i.test(userAgent)) return 'macOS';
  if (/android/i.test(userAgent)) return 'Android';
  if (/linux/i.test(userAgent)) return 'Linux';
  if (/ios|iphone|ipad/i.test(userAgent)) return 'iOS';
  return 'Unknown';
}

function detectDuplicateReason(events: Array<{ ipAddress: string | null; ua: string | null }>, ipAddress?: string | null, ua?: string | null) {
  if (!events.length) return null;
  const normalizedIp = (ipAddress ?? '').trim().toLowerCase();
  const normalizedUa = (ua ?? '').trim().toLowerCase();
  if (normalizedIp && events.some((event) => (event.ipAddress ?? '').trim().toLowerCase() === normalizedIp)) return 'same_ip';
  if (normalizedUa && events.some((event) => (event.ua ?? '').trim().toLowerCase() === normalizedUa)) return 'same_ua';
  return null;
}
