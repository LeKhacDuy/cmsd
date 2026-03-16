'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { hashSync } from 'bcryptjs';

export async function getUsers() {
    return prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
}


export async function deleteUser(id: string) {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'ADMIN') throw new Error('Admin only');
    if ((session.user as any).id === id) throw new Error('Cannot delete yourself');

    await prisma.user.delete({ where: { id } });
    revalidatePath('/admin/users');
}
