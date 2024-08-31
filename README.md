## Nextjs Learn Example

对应 [nextjs-learn-cn](https://nextjs-learn-cn.itbox.fun) 文档的代码实践

## 1. Getting Started

```bash
# 创建新项目
npx create-next-app@latest nextjs-dashboard --use-npm --example "https://github.com/vercel/next-learn/tree/main/dashboard/starter-example"
```

## 2. CSS Styling

Next.js 支持的样式设置方案:

- CSS Modules: 创建 `xxx.module.css` 的本地样式，以避免命名冲突并提高可维护性
- Global CSS: 传统 css 方式，但随着应用程序的增长，可能会导致 CSS 体积更大、与 html 深度绑定难以维护管理。
- Tailwind CSS: 一个实用程序优先的CSS框架，允许通过组成实用程序类来快速自定义设计。
- SASS: 一个流行的CSS预处理器，通过变量、嵌套规则和混入等功能扩展CSS
- CSS-in-JS: 将CSS直接嵌入JavaScript组件中，启用动态和范围样式

使用 `clsx` 切换类名：

```ts
import clsx from 'clsx';
 
export default function InvoiceStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-sm',
        {
          'bg-gray-100 text-gray-500': status === 'pending',
          'bg-green-500 text-white': status === 'paid',
        },
      )}
    >
    // ...
)}
```

## 3. Optimizing Fonts and Images

添加优化的字体：

```ts
import { Inter } from 'next/font/google';

export const inter = Inter({ 
    // 指定要加载的子集
    subsets: ['latin'] 
});

//使用：className={`${inter.className}`}
```

添加优化的图片：

```ts
import Image from 'next/image';

export default Page() {
    return (<>
        // PC 上显示、移动端不显示, className 控制
        <Image 
            src="/hero-desktop.png"
            width={1000}
            height={760}
            className="hidden md:block"
            alt="Screenshots of the dashboard project showing desktop version"
        />
        // 移动端显示、PC 上不现实, className 控制
        <Image
            src="/hero-mobile.png"
            width={560}
            height={620}
            className="block md:hidden"
            alt="Screenshot of the dashboard project showing mobile version"
        />
    </>)
}
```

## 4. Creating Layouts and Pages

Next.js 的特殊文件：

- `page.tsx` 导出一个 React 组件，生成一个有效的路由访问
- `layout.tsx` 提供页面之间共享的嵌套布局，在导航时，只有页面组件会更新，而布局组件不会重新渲染（局部渲染）

## 5. Navigating Between Page

`<Link>` 组件，允许使用 JavaScript 进行客户端导航，只会有局部的刷新。`<a>` HTML 元素在页面导航时，会导致整个页面刷新

Next.js 会自动按路由段拆分您的应用程序

在生产环节，每当 `<Link>` 组件出现在浏览器视口中时，Next.js 会自动预加载链接路由的代码。

```ts
'use client'; // usePathname() 是 hooks 需要转为客户端组件

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function Page() {
    // 获取当前活动的路由
    const pathname = usePathname()

    return (
        <Link 
            href="/active"
            className={ 'bg-sky-100': pathname === "/active" }
        />
    )
}
```

## 6. Setting Up Your Database

创建 Postgres 数据库并填充数据

跳转路由 `localhost:3000/send` 执行方法，填充数据库数据，之后再把响应代码删除


## 7. Fetching Data

获取数据的方法：API（[路由处理程序](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)）、ORM（Prisma）、SQL 等

使用 Server Components 获取数据
- 支持 promises，无需使用 useEffect、useState 或数据获取库。
- Server Components 在服务器上执行，因此你可以将昂贵的数据获取和逻辑保留在服务器上，并仅将结果发送到客户端。

## 8. Static and Dynamic Rendering

之前的 Dashboard 是静态的，因此任何数据更新都不会反映在您的应用程序上。

使 Dashboard 动态化：

- `next/cache` 的 `unstable_noStore`，在数据获取函数的顶部调用
- Segment 配置选项，`export const dynamic = "force-dynamic"`

**使用动态渲染，您的应用程序速度只有在最慢的数据获取完成时才能达到**。

## 9. Streaming

实现流式传输的方式：

- 页面级别，使用 `loading.tsx` 文件
- 对于特定组件，使用 `<Suspense>`

`()` 创建新文件夹时，路由组允许您将文件组织成逻辑组，而不影响 URL 路径结构。

## 10. Partial Prerendering

PPR

## 11. Adding Search and Pagination

使用 URL 参数实现搜索的好处：

- 书签和共享的 URL
- 服务器端渲染以呈现初始状态
- 分析和跟踪，直接在 URL 中包含搜索查询和过滤器使得更容易跟踪用户行为，而无需额外的客户端逻辑。

- `<Search>` 是客户端组件，使用 `useSearchParams()` hook 从客户端访问参数
- `<Table>` 是服务器组件，可自己获取数据，因此将 `searchParams prop` 通过组件 prop 传递

最佳实践：防抖是一种编程实践，用于限制函数触发的速率。防抖工作原理：
1. 触发事件：当发生应该被防抖的事件（比如搜索框中的按键）时，定时器启动。
2. 等待：如果在计时器到期之前发生新事件，则重置计时器。
3. 执行：如果计时器达到倒计时结束，将执行防抖函数。


## 12. Mutating Data

使用 Server Action 添加、修改、删除数据

**React Server Actions 允许您在服务器上直接执行异步代码，操作数据库**

通过在 `<form>` 元素中使用 `action` 属性调用操作，实现 Server Action，
```ts
// Server Component
export default function Page() {
  // Action，自动接收包含捕获数据的原生 FormData 对象
  async function create(formData: FormData) {
    'use server';
 
    // Logic to mutate data...
  }
 
  // Invoke the action using the "action" attribute
  return <form action={create}>...</form>;
}
```

Server Actions 提供了有效的 Web 安全解决方案： POST 请求、加密闭包、严格的输入检查、错误消息 hashing 和主机限制等技术实现

Server Actions 与 Next.js 缓存深度集成。通过 Server Action 提交表单时，您不仅可以使用该操作来改变数据，还可以使用 `revalidatePath` 和 `revalidateTag` 等 API 来重新验证相关的缓存。

## 13. Handling Errors

处理错误的方式：

- 为 Server Action 添加 try/catch

- `error.tsx` 文件可用于为路由段定义 UI 边界。它用作意外错误的综合处理并允许您向用户显示备用 UI。
    - 作为客户端组件，需要 'use client'
    - 接受参数：`error` 原生 Errr 对象实例, `reset` 重置错误边界函数，调用时将尝试重新渲染路由段

- 使用 `notFound` 函数处理 404 错误，展示 `not-found.tsx` 内容

`notFound` 会优先于 `error.tsx`

## 14. Improving Accessibility

`eslint-plugin-jsx-a11y` 插件，以帮助早发现可访问性问题。例如，该插件会在没有 alt 文本的图像、错误使用 aria-* 和 role 属性等情况下发出警告。

form 验证：
- 客户端验证：`<input required ... />` 再次提交 form，如果尝试提交带有空值的 form，您现在应该会看到浏览器发出的警告。
- 服务端验证：使用 `react-dom` 的 `useFormState` hook
    - 确保数据发送到数据库之前是预期的格式。
    - 减少恶意用户绕过客户端验证的风险。
    - 拥有一个被认为是有效数据的真实来源。

## 15. Adding Authentication

为你的应用程序生成一个密钥。该密钥用于加密 cookie，确保用户会话的安全性。你可以通过在终端中运行以下命令来完成：
```bash
# 生成密钥
openssl rand -base64 32
# 然后将密钥加入到 .env 的 AUTH_SECRET 
```

## 16. Adding Metadata
