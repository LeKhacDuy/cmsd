'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import slugify from 'slugify';

// ============ SERVICE GROUPS ============

export async function getServiceGroups() {
    noStore();
    return prisma.serviceGroup.findMany({
        orderBy: { sortOrder: 'asc' },
        include: { _count: { select: { programs: true } } },
    });
}

export async function createServiceGroup(formData: FormData) {
    const session = await auth();
    if (!session?.user) throw new Error('Unauthorized');

    const name = formData.get('name') as string;
    const icon = formData.get('icon') as string;
    const sortOrder = parseInt(formData.get('sortOrder') as string) || 0;
    const locale = (formData.get('locale') as string) || 'vi';
    const slug = slugify(name, { lower: true, strict: true, locale: 'vi' });

    await prisma.serviceGroup.create({
        data: { name, slug, icon: icon || null, sortOrder, locale },
    });

    revalidatePath('/admin/programs');
}

export async function deleteServiceGroup(id: string) {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'ADMIN') throw new Error('Admin only');

    // Check if has programs
    const count = await prisma.program.count({ where: { serviceGroupId: id } });
    if (count > 0) throw new Error('Không thể xoá nhóm dịch vụ đang có chương trình');

    await prisma.serviceGroup.delete({ where: { id } });
    revalidatePath('/admin/programs');
}

// ============ PROGRAMS ============

export async function getPrograms(params?: {
    serviceGroupId?: string;
    countryId?: string;
    status?: string;
    search?: string;
}) {
    noStore();
    const where: any = {};

    if (params?.serviceGroupId) where.serviceGroupId = params.serviceGroupId;
    if (params?.countryId) where.countryId = params.countryId;
    if (params?.status) where.status = params.status;
    if (params?.search) where.name = { contains: params.search, mode: 'insensitive' };

    return prisma.program.findMany({
        where,
        include: {
            serviceGroup: true,
            country: true,
        },
        orderBy: [{ serviceGroup: { sortOrder: 'asc' } }, { sortOrder: 'asc' }],
    });
}

export async function getProgram(id: string) {
    noStore();
    return prisma.program.findUnique({
        where: { id },
        include: { serviceGroup: true, country: true },
    });
}

export async function createProgram(formData: FormData) {
    const session = await auth();
    if (!session?.user) throw new Error('Unauthorized');

    const name = formData.get('name') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const featuredImage = formData.get('featuredImage') as string;
    const status = formData.get('status') as string;
    const serviceGroupId = formData.get('serviceGroupId') as string;
    const countryId = formData.get('countryId') as string;
    const sortOrder = parseInt(formData.get('sortOrder') as string) || 0;
    const locale = (formData.get('locale') as string) || 'vi';
    const translationKey = formData.get('translationKey') as string;

    const slug = slugify(name, { lower: true, strict: true, locale: 'vi' });

    // Check unique slug
    const existing = await prisma.program.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const program = await prisma.program.create({
        data: {
            name,
            slug: finalSlug,
            excerpt: excerpt || null,
            content: content || '[]',
            featuredImage: featuredImage || null,
            status: status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT',
            locale,
            translationKey: translationKey || null,
            serviceGroupId,
            countryId: countryId || null,
            sortOrder,
        },
    });

    revalidatePath('/admin/programs');
    return program;
}

export async function updateProgram(id: string, formData: FormData) {
    const session = await auth();
    if (!session?.user) throw new Error('Unauthorized');

    const name = formData.get('name') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const featuredImage = formData.get('featuredImage') as string;
    const status = formData.get('status') as string;
    const serviceGroupId = formData.get('serviceGroupId') as string;
    const countryId = formData.get('countryId') as string;
    const sortOrder = parseInt(formData.get('sortOrder') as string) || 0;
    const locale = (formData.get('locale') as string) || 'vi';
    const translationKey = formData.get('translationKey') as string;

    const program = await prisma.program.update({
        where: { id },
        data: {
            name,
            excerpt: excerpt || null,
            content: content || '[]',
            featuredImage: featuredImage || null,
            status: status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT',
            locale,
            translationKey: translationKey || null,
            serviceGroupId,
            countryId: countryId || null,
            sortOrder,
        },
    });

    revalidatePath('/admin/programs');
    revalidatePath(`/admin/programs/${id}/edit`);
    return program;
}

export async function deleteProgram(id: string) {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'ADMIN') throw new Error('Admin only');

    await prisma.program.delete({ where: { id } });
    revalidatePath('/admin/programs');
}
