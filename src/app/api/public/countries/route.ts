import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    const countries = await prisma.country.findMany({
        select: {
            id: true,
            name: true,
            slug: true,
            flagIcon: true,
            _count: { select: { posts: { where: { status: 'PUBLISHED' } } } },
        },
        orderBy: { name: 'asc' },
    });

    return NextResponse.json(countries);
}
