import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { fullName, phone, city, email, program } = body;

        // Validate required fields
        if (!fullName || !phone || !city || !program) {
            return NextResponse.json(
                { error: 'Vui lòng điền đầy đủ thông tin bắt buộc' },
                { status: 400 }
            );
        }

        // Validate phone format (Vietnamese phone)
        const phoneClean = phone.replace(/\s+/g, '');
        if (!/^(\+?84|0)\d{9,10}$/.test(phoneClean)) {
            return NextResponse.json(
                { error: 'Số điện thoại không hợp lệ' },
                { status: 400 }
            );
        }

        // Validate email if provided
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { error: 'Email không hợp lệ' },
                { status: 400 }
            );
        }

        const consultation = await prisma.consultation.create({
            data: {
                fullName: fullName.trim(),
                phone: phoneClean,
                city: city.trim(),
                email: email?.trim() || null,
                program: program.trim(),
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Đăng ký tư vấn thành công! Chúng tôi sẽ liên hệ bạn sớm nhất.',
            id: consultation.id,
        });
    } catch (error) {
        console.error('Consultation API error:', error);
        return NextResponse.json(
            { error: 'Đã xảy ra lỗi, vui lòng thử lại' },
            { status: 500 }
        );
    }
}

// GET — list all programs (public, for dropdown)
export async function GET() {
    try {
        const programs = await prisma.program.findMany({
            where: { status: 'PUBLISHED' },
            select: { id: true, name: true, serviceGroup: { select: { name: true } } },
            orderBy: [{ serviceGroup: { sortOrder: 'asc' } }, { sortOrder: 'asc' }],
        });

        return NextResponse.json({ programs });
    } catch {
        return NextResponse.json({ programs: [] });
    }
}
