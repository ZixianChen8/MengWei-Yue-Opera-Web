import type { Metadata } from 'next'
import {
  Ma_Shan_Zheng,
  Noto_Serif_SC,
  Cormorant_Garamond,
  JetBrains_Mono,
  Playfair_Display,
} from 'next/font/google'
import localFont from 'next/font/local'
import 'lenis/dist/lenis.css'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll/SmoothScroll'
import BubbleMenu from '@/components/BubbleMenu/BubbleMenu'

const maShanZheng = Ma_Shan_Zheng({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-ma-shan',
  display: 'swap',
  preload: false,
})

const notoSerifSC = Noto_Serif_SC({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-noto-serif-sc',
  display: 'swap',
  preload: false,
})

const cormorantGaramond = Cormorant_Garamond({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
})

const jetBrainsMono = JetBrains_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

// High-contrast Didone display serif — the editorial/ceremonial Latin voice for
// the 10th-anniversary pages (mastheads, section titles). Variable wght axis +
// true italic; weight is set per-use in CSS. Latin display only — never CJK.
const playfairDisplay = Playfair_Display({
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  preload: false,
})

const beiShiDaShuoWenXiaoZhuan = localFont({
  src: '../fonts/BeiShiDaShuoWenXiaoZhuan-1-unicode-yue.ttf',
  variable: '--font-bei-shi-da-shuo-wen-xiao-zhuan',
  display: 'swap',
})

const sanJiXingKaiJianTiCu = localFont({
  src: '../fonts/SanJiXingKaiJianTi-Cu-2.ttf',
  variable: '--font-san-ji-xing-kai-jian-ti-cu',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '加拿大孟伟越剧艺术传习所 · Meng Wei Yue Opera Studio',
  description:
    "Ottawa's only Yue Opera studio — performances, education, and a living tradition. Founded 2018.",
  icons: {
    icon: [{ url: '/assets/Logo-1.PNG', type: 'image/png' }],
    shortcut: '/assets/Logo-1.PNG',
    apple: '/assets/Logo-1.PNG',
  },
  openGraph: {
    title: '加拿大孟伟越剧艺术传习所 · Meng Wei Yue Opera Studio',
    description:
      "Ottawa's only Yue Opera company. Founded 2018. Full-length productions, student training, and classical Chinese performing arts.",
    locale: 'zh_CA',
    type: 'website',
    siteName: '孟伟越剧 · Meng Wei Yue Opera',
  },
  twitter: {
    card: 'summary_large_image',
    title: '孟伟越剧 · Meng Wei Yue Opera Studio — Ottawa',
  },
  metadataBase: new URL('https://mengweiyue.ca'),
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="zh-Hant-CA"
      className={`${maShanZheng.variable} ${notoSerifSC.variable} ${cormorantGaramond.variable} ${jetBrainsMono.variable} ${playfairDisplay.variable} ${beiShiDaShuoWenXiaoZhuan.variable} ${sanJiXingKaiJianTiCu.variable}`}
    >
      <body>
        <SmoothScroll>{children}</SmoothScroll>
        {/* Floating bubble nav for ≤1023px (the desktop horizontal Nav takes
            over from 1024px up). Renders site-wide; hides itself on /admin. */}
        <BubbleMenu />
      </body>
    </html>
  )
}
