import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { sql } from '@vercel/postgres'; // 这里需要注意！！！
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';


/**
 * 单独文件，因为 bcrypt 依赖于 Next.js 中间件中不可用的 Node.js API
 * 比较用户输入的密码是否与数据库中的密码匹配
 */

async function getUser(email: string): Promise<User | undefined> {
    try {
        const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
        return user.rows[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    // providers 是一个数组，其中列出了不同的登录选项，如 Google 或 GitHub
    // https://authjs.dev/getting-started/providers
    providers: [
        // 添加 Credentials provider
        Credentials({
            // 使用 authorize 函数处理身份验证逻辑。类似于 Server Actions，你可以使用 zod 在检查用户是否存在于数据库之前验证电子邮件和密码：
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;

                    // 调用 bcrypt.compare 检查密码是否匹配：
                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    if (passwordsMatch) return user;

                }
                console.log('Invalid credentials');

                return null;
            },
        }),
    ],

});
