import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    const categories = await prisma.category.findMany({
        select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            _count: { select: { posts: { where: { status: 'PUBLISHED' } } } },
        },
        orderBy: { name: 'asc' },
    });

    return NextResponse.json(categories);
}
