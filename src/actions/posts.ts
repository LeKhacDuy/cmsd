'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';

export async function getPosts(params?: {
    search?: string;
    categoryId?: string;
    countryId?: string;
    status?: string;
    page?: number;
    limit?: number;
}) {
    const page = params?.page || 1;
    const limit = params?.limit || 12;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params?.search) {
        where.title = { contains: params.search, mode: 'insensitive' };
    }
    if (params?.categoryId) {
        where.categoryId = params.categoryId;
    }
    if (params?.countryId) {
        where.countryId = params.countryId;
    }
    if (params?.status) {
        where.status = params.status;
    }

    const [posts, total] = await Promise.all([
        prisma.post.findMany({
            where,
            include: { author: true, category: true, country: true },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        }),
        prisma.post.count({ where }),
    ]);

    return {
        posts,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
    };
}

export async function getPost(id: string) {
    return prisma.post.findUnique({
        where: { id },
        include: { author: true, category: true, country: true },
    });
}

export async function createPost(formData: FormData) {
    const session = await auth();
    if (!session?.user) throw new Error('Unauthorized');

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const excerpt = formData.get('excerpt') as string;
    const categoryId = formData.get('categoryId') as string;
    const countryId = formData.get('countryId') as string;
    const status = formData.get('status') as string;
    const featuredImage = formData.get('featuredImage') as string;
    const locale = (formData.get('locale') as string) || 'vi';

    const slug = slugify(title, { lower: true, strict: true, locale: 'vi' });

    // Check unique slug
    const existing = await prisma.post.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const post = await prisma.post.create({
        data: {
            title,
            slug: finalSlug,
            content,
            excerpt: excerpt || null,
            categoryId: categoryId || null,
            countryId: countryId || null,
            status: status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT',
            featuredImage: featuredImage || null,
            publishedAt: status === 'PUBLISHED' ? new Date() : null,
            locale,
            authorId: (session.user as any).id,
        },
    });

    revalidatePath('/admin/posts');
    revalidatePath('/admin');
    return post;
}

export async function updatePost(id: string, formData: FormData) {
    const session = await auth();
    if (!session?.user) throw new Error('Unauthorized');

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const excerpt = formData.get('excerpt') as string;
    const categoryId = formData.get('categoryId') as string;
    const countryId = formData.get('countryId') as string;
    const status = formData.get('status') as string;
    const featuredImage = formData.get('featuredImage') as string;
    const locale = (formData.get('locale') as string) || 'vi';

    const post = await prisma.post.update({
        where: { id },
        data: {
            title,
            content,
            excerpt: excerpt || null,
            categoryId: categoryId || null,
            countryId: countryId || null,
            status: status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT',
            featuredImage: featuredImage || null,
            publishedAt: status === 'PUBLISHED' ? new Date() : null,
            locale,
        },
    });

    revalidatePath('/admin/posts');
    revalidatePath(`/admin/posts/${id}/edit`);
    revalidatePath('/admin');
    return post;
}

export async function deletePost(id: string) {
    const session = await auth();
    if (!session?.user) throw new Error('Unauthorized');
    if ((session.user as any).role !== 'ADMIN') throw new Error('Admin only');

    await prisma.post.delete({ where: { id } });
    revalidatePath('/admin/posts');
    revalidatePath('/admin');
}

export async function getCategories() {
    return prisma.category.findMany({ orderBy: { name: 'asc' } });
}

export async function getCountries() {
    return prisma.country.findMany({ orderBy: { name: 'asc' } });
}
