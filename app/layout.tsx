import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Lodaya Coffee Nusantara', description: 'Discover the origin, character, and story behind Indonesian coffee.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="id"><body>{children}</body></html>; }
