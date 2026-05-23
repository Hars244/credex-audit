import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SpendScan — Free AI Tool Spend Audit',
  description:
    'Find out if you are overspending on AI tools like Cursor, ChatGPT, Claude, and Copilot. Free instant audit.',
  openGraph: {
    title: 'SpendScan — Free AI Tool Spend Audit',
    description: 'Find out if you are overspending on AI tools. Free instant audit.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-gray-950 antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}