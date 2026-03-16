'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';

export async function getCategoriesAll() {
    return prisma.category.findMany({
        orderBy: { name: 'asc' },
        include: { _count: { select: { posts: true } } },
    });
}

export async function createCategory(formData: FormData) {
    const session = await auth();
    if (!session?.user) throw new Error('Unauthorized');

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const slug = slugify(name, { lower: true, strict: true, locale: 'vi' });

    await prisma.category.create({
        data: { name, slug, description: description || null },
    });

    revalidatePath('/admin/categories');
}

export async function updateCategory(id: string, formData: FormData) {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'ADMIN') throw new Error('Admin only');

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    await prisma.category.update({
        where: { id },
        data: { name, description: description || null },
    });

    revalidatePath('/admin/categories');
}

export async function deleteCategory(id: string) {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'ADMIN') throw new Error('Admin only');

    await prisma.category.delete({ where: { id } });
    revalidatePath('/admin/categories');
}
