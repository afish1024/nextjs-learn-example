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

## 8. Static and Dynamic Rendering

## 9. Streaming

## 10. Partial Prerendering

## 11. Adding Search and Pagination

## 12. Mutating Data

## 13. Handling Errors

## 14. Improving Accessibility

## 15. Adding Authentication

## 16. Adding Metadata
