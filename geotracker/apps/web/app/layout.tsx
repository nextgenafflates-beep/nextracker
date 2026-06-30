import './globals.css';
import type { Metadata } from 'next';
import { Inter, DM_Sans, JetBrains_Mono } from 'next/font/google';
import { PageTransition } from '@/components/page-transition';

const inter = Inter({ subsets: ['latin'] });
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['700'] });
const mono = JetBrains_Mono({ subsets: ['latin'] });

const appUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://localhost:3000');

export const metadata: Metadata = {
  title: {
    default: 'NexaTrack',
    template: '%s | NexaTrack'
  },
  description: 'Smart tracking links for modern growth teams.',
  metadataBase: new URL(appUrl),
  openGraph: {
    title: 'NexaTrack',
    description: 'Smart tracking links for modern growth teams.',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexaTrack',
    description: 'Smart tracking links for modern growth teams.'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${dmSans.className} ${mono.className}`}>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
