import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/public/banners
// GET /api/public/banners?slug=homepage-hero
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
        // Return a single banner with its active images
        const banner = await prisma.banner.findUnique({
            where: { slug, isActive: true },
            include: {
                images: {
                    where: { isActive: true },
                    orderBy: { sortOrder: 'asc' },
                },
            },
        });

        if (!banner) {
            return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
        }

        return NextResponse.json(banner);
    }

    // Return all active banners with their active images
    const banners = await prisma.banner.findMany({
        where: { isActive: true },
        include: {
            images: {
                where: { isActive: true },
                orderBy: { sortOrder: 'asc' },
            },
        },
        orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ banners });
}
