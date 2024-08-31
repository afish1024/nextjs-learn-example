import { Metadata } from 'next';

// 添加全局 CSS 文件
import './ui/global.css'

import { inter } from '@/app/ui/fonts';

export const metadata: Metadata = {
  // 模板中的 %s 将替换为特定的页面标题。
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* 将 Inter 应用到整个应用， antialiased 类可使字体更加平滑 */}
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
