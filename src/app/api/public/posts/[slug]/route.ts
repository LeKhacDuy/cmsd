import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    const post = await prisma.post.findUnique({
        where: { slug, status: 'PUBLISHED' },
        include: {
            category: { select: { name: true, slug: true } },
            country: { select: { name: true, slug: true, flagIcon: true } },
            author: { select: { name: true } },
        },
    });

    if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Lấy tất cả bản dịch nếu có translationKey
    let translations: { locale: string; slug: string }[] = [];
    if (post.translationKey) {
        translations = await prisma.post.findMany({
            where: { translationKey: post.translationKey, status: 'PUBLISHED' },
            select: { locale: true, slug: true },
        });
    }

    return NextResponse.json({ ...post, translations });
}
