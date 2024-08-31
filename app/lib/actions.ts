'use server'

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

// const FormSchema = z.object({
//     id: z.string(),
//     customerId: z.string(),
//     amount: z.coerce.number(),
//     status: z.enum(['pending', 'paid']),
//     date: z.string(),
// })

// export async function createInvoice(formData: FormData) {
//     const rawFormData = {
//         customerId: formData.get('customerId'),
//         amount: formData.get('amount'),
//         status: formData.get('status'),
//     }
//     // Test it out
//     console.log(rawFormData)
// }

const FormSchema = z.object({
    id: z.string(),
    // 如果 customer 字段为空，Zod 会抛出一个错误，因为它期望是一个 string 类型
    // 添加一条友好的提示消息，以防用户没有选择 customer
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    // 将 amount 类型从 string 强制转换为 number，如果字符串为空，则默认为零。
    // 使用 .gt() 函数告诉 Zod 我们始终希望 amount 大于 0。
    amount: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than $0.' }),
    // 如果 status 字段为空，Zod 会抛出一个错误，因为它期望是 "pending" 或 "paid"
    // 添加一条友好的提示消息，以防用户没有选择 status
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
});

// Use Zod to update the expected types
const CreateInvoice = FormSchema.omit({ id: true, date: true })

// This is temporary until @types/react-dom is updated
export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};

// Server Action，可在 <form> action 中调用
// prevState - 包含从 useFormState hook 传递的状态。
export async function createInvoice(preState: State, formData: FormData) {
    // 从 formData 对象中提取数据
    // 验证和准备要出阿茹数据库的数据
    // safeParse() 将返回一个包含 success 或 error 字段的对象。这将有助于更优雅地处理验证，而无需将此逻辑放在 try/catch 块中。
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    })

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100; // 转为分
    const date = new Date().toISOString().split('T')[0] // 日期格式为 "YYYY-MM-DD" 的日期

    try {
        // 插入数据库
        await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Invoice.',
        }
    }

    // 清除缓存，并触发服务器的新请求
    revalidatePath('/dashboard/invoices')
    // 重定向回 /dashboard/invoices 页面
    redirect('/dashboard/invoices')
}

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true })

export async function updateInvoice(id: string, preState: State, formData: FormData) {
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
        };
    }

    const { customerId, amount, status } = validatedFields.data;

    const amountInCents = amount * 100;

    try {
        await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
    } catch (error) {
        return { message: 'Database Error: Failed to Update Invoice.' };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    // throw new Error('Failed to Delete Invoice');

    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`
        revalidatePath('/dashboard/invoices');
        return { message: 'Deleted Invoice.' };
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Invoice.' };
    }

}

// 将身份验证逻辑与登录 form 连接起来
export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}