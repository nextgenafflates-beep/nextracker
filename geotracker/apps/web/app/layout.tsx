import './globals.css';
import { Inter, DM_Sans, JetBrains_Mono } from 'next/font/google';
import { PageTransition } from '@/components/page-transition';

const inter = Inter({ subsets: ['latin'] });
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['700'] });
const mono = JetBrains_Mono({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${dmSans.className} ${mono.className}`}>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
