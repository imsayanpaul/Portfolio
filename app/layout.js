import { DM_Sans, IBM_Plex_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { ScrollFX } from './components';

const body = DM_Sans({ subsets: ['latin'], variable: '--font-body' });
const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' });

// Set SITE_URL to the deployed address (e.g. https://sayanpaul.dev) so link previews resolve to absolute URLs.
const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
const title = 'Sayan Paul — Full-stack Developer';
const description = 'Thoughtful software for everyday friction. Explore ReelDex, Appliqa, Repo2Resume, Sequential Paste, and ScrollMark.';

export const metadata = {
  title,
  description,
  metadataBase: new URL(siteUrl),
  openGraph: { title, description: 'Small sparks. Working software.', type: 'website', url: '/' },
  twitter: { card: 'summary_large_image', title, description: 'Small sparks. Working software.' },
};
export const viewport = { themeColor: '#171815' };
export default function RootLayout({ children }) {return <html lang="en" className={`${body.variable} ${display.variable} ${mono.variable}`}><body><ScrollFX/>{children}</body></html>;}
