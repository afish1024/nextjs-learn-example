## Nextjs Learn Example

对应 [nextjs-learn-cn](https://nextjs-learn-cn.itbox.fun) 文档的代码实践

1. Getting Started

```bash
# 创建新项目
npx create-next-app@latest nextjs-dashboard --use-npm --example "https://github.com/vercel/next-learn/tree/main/dashboard/starter-example"
```

2. CSS Styling

Next.js 支持的样式设置方案:

- CSS Modules: 创建 `xxx.module.css` 的本地样式，以避免命名冲突并提高可维护性
- Global CSS: 传统 css 方式，但随着应用程序的增长，可能会导致 CSS 体积更大、与 html 深度绑定难以维护管理。
- Tailwind CSS: 一个实用程序优先的CSS框架，允许通过组成实用程序类来快速自定义设计。
- SASS: 一个流行的CSS预处理器，通过变量、嵌套规则和混入等功能扩展CSS
- CSS-in-JS: 将CSS直接嵌入JavaScript组件中，启用动态和范围样式

