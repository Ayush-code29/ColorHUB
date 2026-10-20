import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import GlobalModals from '@/components/common/GlobalModals';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ColorHub - Luxury Paint Shop & Room Colour Visualizer',
  description:
    'Explore premium paint shades from Asian Paints, Berger, Dulux, Nerolac, JSW & Indigo. Test wall colours live on your room photos with our interactive visualizer.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900 font-sans">
        <StoreProvider>
          {children}
          <GlobalModals />
        </StoreProvider>
      </body>
    </html>
  );
}
