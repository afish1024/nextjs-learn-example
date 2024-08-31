'use server'

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
})

// export async function createInvoice(formData: FormData) {
//     const rawFormData = {
//         customerId: formData.get('customerId'),
//         amount: formData.get('amount'),
//         status: formData.get('status'),
//     }
//     // Test it out
//     console.log(rawFormData)
// }

// Use Zod to update the expected types
const CreateInvoice = FormSchema.omit({ id: true, date: true })

// Server Action，可在 <form> action 中调用
export async function createInvoice(formData: FormData) {
    // 从 formData 对象中提取数据
    // 验证和准备要出阿茹数据库的数据
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    })
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

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

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