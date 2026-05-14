// ============================================================
// Home page content — single source of truth for all text
// ============================================================

export const nav = {
  brand: {
    markPre: '孟',
    markAccent: '伟',
    markPost: '越剧',
    seal: '越',
    sub: 'Meng Wei Yue Opera Studio · Ottawa',
  },
  links: [
    { zh: '关于我们', en: 'About', href: '#overture' },
    { zh: '演出', en: 'Performances', href: '#season' },
    { zh: '学越剧', en: 'Learn Yue Opera', href: '#studio' },
    { zh: '创始人', en: 'Founder', href: '#repertoire' },
    { zh: '最新动态', en: 'Journal', href: '#footer' },
  ],
  contact: { zh: '联系', en: 'CONTACT' },
}

export const hero = {
  meta: 'Ottawa · Yue Opera · Est. 2018',
  titleChars: ['秀', '灵', '南', '江'],
  titleRedIndex: 2,
  poem: {
    zh: '孟伟越剧艺术传习所',
    en: 'Meng Wei Yue Opera Studio',
    stamp: '越',
  },
}

export const overture = {
  eyebrow: 'Overture · 序',
  title: { zh: ['越音流长', '戏韵在心'], en: 'Yue melody lingers, the heart keeps its rhythm' },
  quote: {
    text: '越剧不是表演，而是一种缓慢的注视。一袖，一步，一眼，皆是岁月所托。',
    attr: '孟伟 · Founder, Wei Meng',
  },
  body: [
    '越剧1906年诞生于浙江嵊州。它曲调优美，情感细腻，是中国第二大剧种，也是国家级非物质文化遗产。水袖、丝绸、二胡、琵琶、笛子，这些元素融在一起，让越剧唱得柔柔的，唱爱情，唱离别，也唱重逢。',
    'The art reached Canada slowly, the way water finds a new river: one voice, then another, then a small company. Today we are performers and teachers carrying Yue Opera forward in this country.',
  ],
  stats: [
    { value: '2018', label: 'Founded · 落地' },
    { value: '十二', label: 'Productions · 上演' },
    { value: '专注', label: 'In Ottawa · 深耕' },
  ],
}

export const season = {
  eyebrow: 'Season · 时序',
  title: { zh: '本季', en: 'The coming season 二〇二六' },
  aside: {
    zh: '一年四季，戏有自己的节奏。这个季度有三场，都是本所的主演和请来的名家一起演。',
    en: 'Three performances from spring through autumn',
  },
  events: [
    {
      num: 'N° 01',
      tag: 'Mainstage · 大戏',
      titleZh: ['梁山伯', '与祝英台'],
      titleEn: 'The Butterfly Lovers · Full Length',
      blurb: '东晋年间，女扮男装的祝英台在上学路上结识梁山伯，两人同窗三载，情谊渐深。三年后英台归家，十八里相送路上百般暗示，心事始终没说破。梁山伯后知后觉赶往祝家提亲，英台已被许配他人。梁山伯郁郁而终，祝英台出嫁当天经其墓前，地裂墓开，两人化蝶双飞',
      date: '14 March 2026',
      venue: 'NAC Studio · Ottawa',
      feature: true,
    },
    {
      num: 'N° 02',
      tag: 'Recital · 折子',
      titleZh: ['红楼·葬花'],
      titleEn: 'Burying the Blossoms',
      blurb: '学员和主演一起演的折子戏专场，在丁香花开的时候演出。',
      date: '16 May 2026',
      venue: 'Studio Hall',
      feature: false,
    },
    {
      num: 'N° 03',
      tag: 'In Concert · 雅集',
      titleZh: ['秋夜·清音'],
      titleEn: 'An Autumn Evening',
      blurb: '音乐家和演员合作，唱一晚的独唱和器乐选段，在秋分前夜。',
      date: '20 September 2026',
      venue: 'Private Salon',
      feature: false,
    },
  ],
}

export const studio = {
  eyebrow: 'Studio · 传习',
  title: { zh: '来跟我们一起学越剧', en: 'Learn Yue Opera with us' },
  body: [
    '不管你有没有基础，都欢迎来。孟伟老师亲自教唱腔、身段、念白。每个季度只招几个学生，不求快，不求多，只求每个人都能学扎实。',
    'Classes are small. The work is slow. No experience is needed. If you love Yue Opera, we will guide you step by step. We accept twelve students each year.',
  ],
  program: [
    { level: '初阶 · 入门', en: 'Foundations: sleeve, step, breath', duration: '10 weeks' },
    { level: '中阶 · 唱念', en: 'Voice and Recitation', duration: '16 weeks' },
    { level: '高阶 · 折子', en: 'Repertoire and Stagework', duration: 'by audition' },
  ],
  cta: { zh: '咨询课程', en: 'Inquire about classes' },
}

export const repertoire = {
  eyebrow: 'Repertoire · 戏目',
  title: { zh: '演过的戏', en: 'Selected works from the studio archive' },
  works: [
    { year: '2019', zh: ['碧玉', '簪'], en: 'The Jade Hairpin', image: '/assets/gallery/jade-hairpin.jpg' },
    { year: '2021', zh: ['西厢', '记'], en: 'Romance of the West Chamber', image: '/assets/gallery/west-chamber.jpg' },
    { year: '2023', zh: ['五女', '拜寿'], en: "Five Daughters' Birthday", image: '/assets/gallery/five-daughters.jpg' },
    { year: '2024', zh: ['何文', '秀'], en: 'He Wenxiu', image: '/assets/gallery/he-wenxiu.jpg' },
  ],
  hint: 'drag to explore · click to expand',
}

export const footer = {
  ornament: '声 · 袖 · 心',
  brand: {
    zh: '加拿大孟伟越剧艺术传习所',
    en: 'Meng Wei Yue Opera Studio Canada',
  },
  legal: {
    zh: '渥太华，加拿大联邦注册非营利艺术机构',
    en: 'A federally incorporated not for profit, headquartered in Ottawa, Ontario.',
  },
  columns: [
    {
      heading: 'To Visit · 拜访',
      links: [
        { zh: '关于我们', en: 'About the Studio', href: '#' },
        { zh: '演出', en: 'Performances', href: '#' },
        { zh: '学越剧', en: 'Lessons', href: '#' },
        { zh: '最新动态', en: 'Journal', href: '#' },
      ],
    },
    {
      heading: 'To Reach Us · 留书',
      links: [
        { zh: 'mengweiyue@studio.ca', en: 'By letter', href: 'mailto:hello@mengweiyue.ca' },
        { zh: '+1 (613) — · — · —', en: 'By telephone', href: '#' },
        { zh: '孟伟', en: 'By appointment', href: '#' },
      ],
    },
  ],
  copyright: '© 2026 Meng Wei Yue Opera Studio · 加拿大孟伟越剧艺术传习所',
  sealLine: 'Ottawa · Made with care',
  // stamp: '越',
}
