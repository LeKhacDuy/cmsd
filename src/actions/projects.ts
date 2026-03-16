'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import slugify from 'slugify';
import { PostStatus } from '@prisma/client';

export async function getProjects(params?: { search?: string; status?: PostStatus; programId?: string }) {
    noStore();
    const where: any = {};

    if (params?.search) {
        where.title = { contains: params.search, mode: 'insensitive' };
    }
    if (params?.status) {
        where.status = params.status;
    }
    if (params?.programId) {
        where.programId = params.programId;
    }

    return prisma.project.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
            program: {
                select: { id: true, name: true, slug: true },
            },
        },
    });
}

export async function getProjectById(id: string) {
    noStore();
    return prisma.project.findUnique({
        where: { id },
        include: { program: true },
    });
}

export async function getProgramsForSelect() {
    noStore();
    return prisma.program.findMany({
        select: { id: true, name: true, slug: true },
        orderBy: { createdAt: 'desc' },
    });
}

export async function createProject(formData: FormData) {
    const session = await auth();
    if (!session?.user) throw new Error('Unauthorized');

    const name = formData.get('name') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const featuredImage = formData.get('featuredImage') as string;
    const status = formData.get('status') as string;
    const programId = formData.get('programId') as string;
    const sortOrder = parseInt(formData.get('sortOrder') as string) || 0;
    const locale = (formData.get('locale') as string) || 'vi';

    const slug = slugify(name, { lower: true, strict: true, locale: 'vi' });

    // Ensure unique slug
    let finalSlug = slug;
    let counter = 1;
    while (await prisma.project.findUnique({ where: { slug: finalSlug } })) {
        finalSlug = `${slug}-${counter}`;
        counter++;
    }

    const project = await prisma.project.create({
        data: {
            name,
            slug: finalSlug,
            excerpt: excerpt || null,
            content: content || '[]',
            featuredImage: featuredImage || null,
            status: status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT',
            locale,
            programId,
            sortOrder,
        },
    });

    revalidatePath('/admin/projects');
    return project;
}

export async function updateProject(id: string, formData: FormData) {
    const session = await auth();
    if (!session?.user) throw new Error('Unauthorized');

    const name = formData.get('name') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const featuredImage = formData.get('featuredImage') as string;
    const status = formData.get('status') as string;
    const programId = formData.get('programId') as string;
    const sortOrder = parseInt(formData.get('sortOrder') as string) || 0;
    const locale = (formData.get('locale') as string) || 'vi';

    const project = await prisma.project.update({
        where: { id },
        data: {
            name,
            excerpt: excerpt || null,
            content: content || '[]',
            featuredImage: featuredImage || null,
            status: status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT',
            locale,
            programId,
            sortOrder,
        },
    });

    revalidatePath('/admin/projects');
    revalidatePath(`/admin/projects/${id}/edit`);
    return project;
}

export async function deleteProject(id: string) {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'ADMIN') throw new Error('Admin only');

    await prisma.project.delete({ where: { id } });
    revalidatePath('/admin/projects');
}
