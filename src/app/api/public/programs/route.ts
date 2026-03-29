import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const serviceGroup = searchParams.get('serviceGroup');
    const country = searchParams.get('country');
    const locale = searchParams.get('locale');

    const where: any = { status: 'PUBLISHED' };

    if (locale) {
        where.locale = locale;
    }
    if (serviceGroup) {
        where.serviceGroup = { slug: serviceGroup };
    }
    if (country) {
        where.country = { slug: country };
    }

    const programs = await prisma.program.findMany({
        where,
        select: {
            id: true,
            name: true,
            slug: true,
            locale: true,
            translationKey: true,
            excerpt: true,
            featuredImage: true,
            sortOrder: true,
            serviceGroup: { select: { name: true, slug: true } },
            country: { select: { name: true, slug: true, flagIcon: true } },
        },
        orderBy: [{ serviceGroup: { sortOrder: 'asc' } }, { sortOrder: 'asc' }],
    });

    // Lấy tất cả translations — 1 query duy nhất
    const keys = [...new Set(programs.map(p => p.translationKey).filter(Boolean))] as string[];
    const allTranslations = keys.length > 0
        ? await prisma.program.findMany({
            where: { translationKey: { in: keys }, status: 'PUBLISHED' },
            select: { translationKey: true, locale: true, slug: true },
        })
        : [];

    const programsWithTranslations = programs.map(program => ({
        ...program,
        translations: program.translationKey
            ? allTranslations
                .filter(t => t.translationKey === program.translationKey)
                .map(t => ({ locale: t.locale, slug: t.slug }))
            : [],
    }));

    return NextResponse.json({ programs: programsWithTranslations });
}
