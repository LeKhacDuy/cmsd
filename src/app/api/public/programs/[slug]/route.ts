import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { enrichContentIcons } from '@/lib/contentUtils';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    const program = await prisma.program.findUnique({
        where: { slug, status: 'PUBLISHED' },
        include: {
            serviceGroup: { select: { name: true, slug: true, icon: true } },
            country: { select: { name: true, slug: true, flagIcon: true } },
        },
    });

    if (!program) {
        return NextResponse.json({ error: 'Program not found' }, { status: 404 });
    }

    // Lấy tất cả bản dịch nếu có translationKey
    let translations: { locale: string; slug: string }[] = [];
    if (program.translationKey) {
        translations = await prisma.program.findMany({
            where: { translationKey: program.translationKey, status: 'PUBLISHED' },
            select: { locale: true, slug: true },
        });
    }

    // Enrich icon URLs trong content thành full URL
    const baseUrl = new URL(request.url).origin;
    const content = enrichContentIcons(program.content, baseUrl);

    return NextResponse.json({ ...program, content, translations });
}

