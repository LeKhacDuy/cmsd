import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const allowedOrigins = [
    'https://d-immigration.vn',
    'https://d-immigration.com',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
];

function setCorsHeaders(response: NextResponse, origin: string | null) {
    if (origin && allowedOrigins.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        response.headers.set('Access-Control-Max-Age', '86400');
    }
    return response;
}

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const origin = request.headers.get('origin');

    // Handle CORS preflight for public API
    if (pathname.startsWith('/api/public') && request.method === 'OPTIONS') {
        const response = new NextResponse(null, { status: 204 });
        return setCorsHeaders(response, origin);
    }

    // Add CORS headers to public API responses
    if (pathname.startsWith('/api/public')) {
        const response = NextResponse.next();
        return setCorsHeaders(response, origin);
    }

    // Protect admin routes
    if (pathname.startsWith('/admin')) {
        const session = await auth();
        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Redirect logged in users from login page
    if (pathname === '/login') {
        const session = await auth();
        if (session) {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/login', '/api/public/:path*'],
};
