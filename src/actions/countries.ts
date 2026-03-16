'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';

export async function getCountriesAll() {
    return prisma.country.findMany({
        orderBy: { name: 'asc' },
        include: { _count: { select: { posts: true } } },
    });
}

export async function createCountry(formData: FormData) {
    const session = await auth();
    if (!session?.user) throw new Error('Unauthorized');

    const name = formData.get('name') as string;
    const flagIcon = formData.get('flagIcon') as string;
    const slug = slugify(name, { lower: true, strict: true, locale: 'vi' });

    await prisma.country.create({
        data: { name, slug, flagIcon: flagIcon || null },
    });

    revalidatePath('/admin/countries');
}

export async function deleteCountry(id: string) {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'ADMIN') throw new Error('Admin only');

    await prisma.country.delete({ where: { id } });
    revalidatePath('/admin/countries');
}
