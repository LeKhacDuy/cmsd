import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'vi';

    const countries = await prisma.country.findMany({
        where: { locale },
        select: {
            id: true,
            name: true,
            slug: true,
            locale: true,
            flagIcon: true,
            _count: { select: { posts: { where: { status: 'PUBLISHED' } } } },
        },
        orderBy: { name: 'asc' },
    });

    return NextResponse.json(countries);
}
