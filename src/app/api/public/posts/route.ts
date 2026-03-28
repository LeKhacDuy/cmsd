import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const country = searchParams.get('country');
    const search = searchParams.get('search');
    const locale = searchParams.get('locale');
    const skip = (page - 1) * limit;

    const where: any = { status: 'PUBLISHED' };

    if (locale) {
        where.locale = locale;
    }
    if (category) {
        where.category = { slug: category };
    }
    if (country) {
        where.country = { slug: country };
    }
    if (search) {
        where.title = { contains: search, mode: 'insensitive' };
    }
    const translationKey = searchParams.get('translationKey');
    if (translationKey) {
        where.translationKey = translationKey;
    }

    const [posts, total] = await Promise.all([
        prisma.post.findMany({
            where,
            select: {
                id: true,
                title: true,
                slug: true,
                locale: true,
                translationKey: true,
                excerpt: true,
                featuredImage: true,
                publishedAt: true,
                createdAt: true,
                category: { select: { name: true, slug: true } },
                country: { select: { name: true, slug: true, flagIcon: true } },
            },
            orderBy: { publishedAt: 'desc' },
            skip,
            take: limit,
        }),
        prisma.post.count({ where }),
    ]);

    return NextResponse.json({
        posts,
        pagination: {
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            limit,
        },
    });
}
