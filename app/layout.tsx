import type { Metadata } from 'next'
import {
  Ma_Shan_Zheng,
  Noto_Serif_SC,
  Cormorant_Garamond,
  JetBrains_Mono,
} from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'

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

const beiShiDaShuoWenXiaoZhuan = localFont({
  src: '../fonts/BeiShiDaShuoWenXiaoZhuan-1-unicode-yue.ttf',
  variable: '--font-bei-shi-da-shuo-wen-xiao-zhuan',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '加拿大孟伟越剧艺术传习所 · Meng Wei Yue Opera Studio',
  description:
    "Ottawa's only Yue Opera studio — performances, education, and a living tradition. Founded 2018.",
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
      className={`${maShanZheng.variable} ${notoSerifSC.variable} ${cormorantGaramond.variable} ${jetBrainsMono.variable} ${beiShiDaShuoWenXiaoZhuan.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
