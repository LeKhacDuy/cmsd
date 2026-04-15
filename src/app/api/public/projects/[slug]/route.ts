import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { enrichContentIcons } from '@/lib/contentUtils';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const p = await params;

        const project = await prisma.project.findUnique({
            where: { slug: p.slug, status: 'PUBLISHED' },
            include: {
                program: { select: { name: true, slug: true } },
            },
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Lấy tất cả bản dịch nếu có translationKey
        let translations: { locale: string; slug: string }[] = [];
        if (project.translationKey) {
            translations = await prisma.project.findMany({
                where: { translationKey: project.translationKey, status: 'PUBLISHED' },
                select: { locale: true, slug: true },
            });
        }

        // Enrich icon URLs trong content thành full URL
        const baseUrl = new URL(request.url).origin;
        const content = enrichContentIcons(project.content, baseUrl);

        return NextResponse.json({ data: { ...project, content, translations } });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }
}

