'use client';

import { SessionProvider } from 'next-auth/react';
import Sidebar from '@/components/Sidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SessionProvider>
            <div className="admin-layout">
                <Sidebar />
                <main className="admin-main">
                    {children}
                </main>
            </div>
        </SessionProvider>
    );
}
