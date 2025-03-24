import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
    
    try {

        // หน้าเหล่านี้ไม่ต้องเช็คสถานะการล็อกอิน
        const isPublicPage =    request.nextUrl.pathname === "/" ||
                                request.nextUrl.pathname === "/login" || 
                                //request.nextUrl.pathname === "/register" ||
                                request.nextUrl.pathname === '/forgot-password' || 
                                request.nextUrl.pathname === '/find-postdoc' ||
                                // request.nextUrl.pathname === '/admin-postdoc' ||  
                                request.nextUrl.pathname === '/articles' ||
                                request.nextUrl.pathname === '/contact'

        // อ่าน token จาก cookies
        const token = request.cookies.get("accessToken")?.value

        // ถ้าไม่มี token และเข้าหน้าที่ต้องล็อกอิน ให้ทำการ redirect ไปหน้า login
        if(!token && !isPublicPage) {
            return NextResponse.redirect(new URL('/login', request.nextUrl))
        }

        // ถ้ามี token และเข้าหน้า login ให้ทำการ redirect ไปหน้าหลัก
        return NextResponse.next()

    }
    catch(error) {
        console.error("Error: ", error)
        return NextResponse.error()
    }

}

export const config = {
    matcher: [
        '/',
        '/login',
        '/register',
        '/register-profile',        
        '/forgot-password',
        '/find-postdoc',
        '/admin-postdoc',
        '/articles',
        '/contact',
        '/user/:path*'
    ]
}

