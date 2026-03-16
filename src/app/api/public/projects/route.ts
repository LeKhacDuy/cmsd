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
                excerpt: true,
                featuredImage: true,
                createdAt: true,
                program: {
                    select: {
                        name: true,
                        slug: true,
                    }
                }
            },
        });

        return NextResponse.json({ data: projects });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}
