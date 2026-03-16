import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'D Immigration CMS',
  description: 'Content Management System for D Immigration',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
