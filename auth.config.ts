import type { NextAuthConfig } from 'next-auth';

//  NextAuth.js 的配置选项
export const authConfig = {
    pages: {
        // 自定义登录页
        signIn: '/login',
    },
    // 添加保护路由的逻辑。这将阻止用户在未登录的情况下访问 dashboard 页面。
    callbacks: {
        // authorized 回调用于验证通过 Next.js 中间件访问页面的请求是否被授权。它在请求完成之前调用，
        // 并接收一个包含 auth 和 request 属性的对象。auth 属性包含用户的会话，request 属性包含传入的请求。
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true;
        },
    },
    // providers 选项是一个数组，其中列出了不同的登录选项。
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
