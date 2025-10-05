import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();

    // Nếu truy cập root `/`, redirect sang `/editor`
    if (url.pathname === '/') {
        url.pathname = '/editor';
        return NextResponse.redirect(url);
    }

    // Nếu không, cho phép tiếp tục
    return NextResponse.next();
}

// Áp dụng middleware cho toàn bộ route (hoặc bạn có thể tùy chỉnh)
export const config = {
    matcher: '/', // chỉ áp dụng cho route `/`
};
