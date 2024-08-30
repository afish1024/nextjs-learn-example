// 导入 Inter 主要字体，Lusitana 次要字体
import { Inter, Lusitana } from 'next/font/google';

export const inter = Inter({ 
    // 指定要加载的子集
    subsets: ['latin'] 
});

export const lusitana = Lusitana({
    weight: '400',
    subsets: ['latin']
})