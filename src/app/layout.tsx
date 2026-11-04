import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Virtual AI Newsroom HQ | 3D Interactive AI Office',
  description: 'Kantor Redaksi Virtual Berbasis 3D untuk Otomasi Portal Berita AI dengan Roblox-Inspired Avatars.',
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full bg-[#080D18]">
      <body className="h-full w-full overflow-hidden bg-[#080D18] text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
