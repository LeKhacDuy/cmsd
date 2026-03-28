'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import slugify from 'slugify';

// ========== BANNERS ==========

export async function getBanners() {
    noStore();
    return prisma.banner.findMany({
        include: {
            images: {
                orderBy: { sortOrder: 'asc' },
            },
            _count: { select: { images: true } },
        },
        orderBy: { createdAt: 'desc' },
    });
}

export async function getBanner(id: string) {
    return prisma.banner.findUnique({
        where: { id },
        include: {
            images: { orderBy: { sortOrder: 'asc' } },
        },
    });
}

export async function createBanner(formData: FormData) {
    const session = await auth();
    if (!session?.user) throw new Error('Unauthorized');

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    const slug = slugify(name, { lower: true, strict: true, locale: 'vi' });
    const existing = await prisma.banner.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const banner = await prisma.banner.create({
        data: {
            name,
            slug: finalSlug,
            description: description || null,
        },
    });

    revalidatePath('/admin/banners');
    return banner;
}

export async function updateBanner(id: string, formData: FormData) {
    const session = await auth();
    if (!session?.user) throw new Error('Unauthorized');

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const isActive = formData.get('isActive') === 'true';

    await prisma.banner.update({
        where: { id },
        data: { name, description: description || null, isActive },
    });

    revalidatePath('/admin/banners');
}

export async function deleteBanner(id: string) {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'ADMIN') throw new Error('Admin only');

    // BannerImages are cascade deleted via schema
    await prisma.banner.delete({ where: { id } });
    revalidatePath('/admin/banners');
}

// ========== BANNER IMAGES ==========

export async function addBannerImage(bannerId: string, data: {
    url: string;
    title?: string;
    link?: string;
    sortOrder?: number;
}) {
    const session = await auth();
    if (!session?.user) throw new Error('Unauthorized');

    const image = await prisma.bannerImage.create({
        data: {
            bannerId,
            url: data.url,
            title: data.title || null,
            link: data.link || null,
            sortOrder: data.sortOrder ?? 0,
        },
    });

    revalidatePath('/admin/banners');
    return image;
}

export async function updateBannerImage(id: string, data: {
    title?: string;
    titleEn?: string;
    link?: string;
    sortOrder?: number;
    isActive?: boolean;
}) {
    const session = await auth();
    if (!session?.user) throw new Error('Unauthorized');

    await prisma.bannerImage.update({
        where: { id },
        data: {
            title: data.title ?? undefined,
            titleEn: data.titleEn ?? undefined,
            link: data.link ?? undefined,
            sortOrder: data.sortOrder ?? undefined,
            isActive: data.isActive ?? undefined,
        },
    });

    revalidatePath('/admin/banners');
}

export async function deleteBannerImage(id: string) {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'ADMIN') throw new Error('Admin only');

    await prisma.bannerImage.delete({ where: { id } });
    revalidatePath('/admin/banners');
}
