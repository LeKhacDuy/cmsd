import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const p = await params;
        const project = await prisma.project.findUnique({
            where: {
                slug: p.slug,
                status: 'PUBLISHED',
            },
            include: {
                program: {
                    select: {
                        name: true,
                        slug: true,
                    }
                }
            }
        });

        if (!project) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ data: project });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to fetch project' },
            { status: 500 }
        );
    }
}
