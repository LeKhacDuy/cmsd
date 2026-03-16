export const dynamic = "force-dynamic";

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import SettingsClient from './SettingsClient';

export default async function SettingsPage() {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') redirect('/admin');

    const settings = await prisma.setting.findMany();
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => { settingsMap[s.key] = s.value; });

    return <SettingsClient settings={settingsMap} />;
}
