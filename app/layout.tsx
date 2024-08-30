
// 添加全局 CSS 文件
import './ui/global.css'

import { inter } from '@/app/ui/fonts';

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
