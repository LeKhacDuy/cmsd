'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getConsultations(params?: {
    isRead?: boolean;
    search?: string;
}) {
    const where: any = {};

    if (params?.isRead !== undefined) where.isRead = params.isRead;
    if (params?.search) {
        where.OR = [
            { fullName: { contains: params.search, mode: 'insensitive' } },
            { phone: { contains: params.search } },
            { email: { contains: params.search, mode: 'insensitive' } },
        ];
    }

    return prisma.consultation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
    });
}

export async function getConsultationStats() {
    const [total, unread] = await Promise.all([
        prisma.consultation.count(),
        prisma.consultation.count({ where: { isRead: false } }),
    ]);
    return { total, unread };
}

export async function markConsultationRead(id: string) {
    const session = await auth();
    if (!session?.user) throw new Error('Unauthorized');

    await prisma.consultation.update({
        where: { id },
        data: { isRead: true },
    });

    revalidatePath('/admin/consultations');
}

export async function markConsultationUnread(id: string) {
    const session = await auth();
    if (!session?.user) throw new Error('Unauthorized');

    await prisma.consultation.update({
        where: { id },
        data: { isRead: false },
    });

    revalidatePath('/admin/consultations');
}


export async function deleteConsultation(id: string) {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'ADMIN') throw new Error('Admin only');

    await prisma.consultation.delete({ where: { id } });
    revalidatePath('/admin/consultations');
}
