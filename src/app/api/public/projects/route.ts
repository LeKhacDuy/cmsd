import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limitParam = searchParams.get('limit');
        const locale = searchParams.get('locale') || 'vi';
        const programSlug = searchParams.get('program');

        let programId = undefined;
        if (programSlug) {
            const program = await prisma.program.findUnique({
                where: { slug: programSlug },
                select: { id: true },
            });
            if (program) {
                programId = program.id;
            } else {
                return NextResponse.json({ data: [] });
            }
        }

        const limit = limitParam ? parseInt(limitParam) : undefined;

        const projects = await prisma.project.findMany({
            where: {
                status: 'PUBLISHED',
                locale,
                ...(programId ? { programId } : {}),
            },
            orderBy: [
                { sortOrder: 'asc' },
                { createdAt: 'desc' },
            ],
            take: limit,
            select: {
                id: true,
                name: true,
                slug: true,
                locale: true,
                translationKey: true,
                excerpt: true,
                featuredImage: true,
                availability: true,
                createdAt: true,
                program: {
                    select: {
                        name: true,
                        slug: true,
                    }
                }
            },
        });

        // Lấy tất cả translations — 1 query duy nhất
        const keys = [...new Set(projects.map(p => p.translationKey).filter(Boolean))] as string[];
        const allTranslations = keys.length > 0
            ? await prisma.project.findMany({
                where: { translationKey: { in: keys }, status: 'PUBLISHED' },
                select: { translationKey: true, locale: true, slug: true },
            })
            : [];

        const projectsWithTranslations = projects.map(project => ({
            ...project,
            translations: project.translationKey
                ? allTranslations
                    .filter(t => t.translationKey === project.translationKey)
                    .map(t => ({ locale: t.locale, slug: t.slug }))
                : [],
        }));

        return NextResponse.json({ data: projectsWithTranslations });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}
