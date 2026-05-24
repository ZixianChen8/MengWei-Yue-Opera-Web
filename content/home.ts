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
  meta: 'Ottawa · Yue Opera · Est. 2016',
  titleChars: ['秀', '灵', '南', '江'],
  titleRedIndex: 2,
  poem: {
    zh: '加拿大孟伟越剧艺术传习所',
    en: 'Meng Wei Yue Opera Studio Canada',
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
    { value: '2016', label: 'Founded · 创建' },
    { value: '十二', label: 'Productions · 演出' },
    { value: '渥太华', label: 'In Ottawa · 深耕' },
  ],
}

export const season = {
  eyebrow: '近期活动 · Upcoming',
  title: {
    zh: '下一场',
    en: "What's next",
  },
  aside: {
    zh: '四时更迭，戏随节令。',
    en: 'Performances follow the turning seasons.',
  },
  events: [
    {
      id: 'butterfly-lovers',
      num: 'N° 01',
      tag: '大戏 · Mainstage',
      titleZh: ['梁山伯', '与祝英台'],
      titleEn: 'The Butterfly Lovers · Full Length',
      blurb: '东晋年间，女扮男装的祝英台在上学路上结识梁山伯，两人同窗三载，情谊渐深。三年后英台归家，十八里相送路上百般暗示，心事始终没说破。梁山伯后知后觉赶往祝家提亲，英台已被许配他人。梁山伯郁郁而终，祝英台出嫁当天经其墓前，地裂墓开，两人化蝶双飞。',
      description: '东晋年间，女扮男装的祝英台在上学途中邂逅梁山伯，二人同窗共读三载，情深义厚。别离之时，英台十八里相送，步步回首，暗示情意，终究缘悭一面，心事未了。梁山伯恍然大悟，急赴祝家求亲，却已迟了——英台早被许配给马家公子。郁郁成病的梁山伯含恨辞世；英台出嫁途经其墓，哭拜之际，墓地裂开，英台纵身入内，二人化为彩蝶，翩然双飞，千年不散。这是越剧最经典的剧目，孟伟老师将以全本呈现，演出时长约两小时，附场刊导赏。',
      date: '2026年3月14日',
      time: '19:30',
      duration: '2小时 · 2 Hours',
      venue: 'NAC Studio，渥太华',
      venueAddress: '53 Elgin St, Ottawa, ON K1P 5W1',
      feature: true,
      formUrl: '#',
      imageUrl: 'https://picsum.photos/seed/butterfly-lovers/1200/600',
    },
    {
      id: 'burying-blossoms',
      num: 'N° 02',
      tag: '折子 · Recital',
      titleZh: ['红楼·葬花'],
      titleEn: 'Burying the Blossoms',
      blurb: '学员和主演一起演的折子戏专场，在丁香花开的时候演出。',
      description: '春末丁香盛开之际，孟伟越剧传习所的学员与主演携手呈现《红楼梦·葬花》折子戏专场。林黛玉以一曲《葬花吟》，将一生的孤苦与不甘化入泥土，让花魂随风而去。演出由传习所高阶学员主演，孟伟老师亲自指导，集体谢幕。这场演出是我们每年最亲密的一场——小场地，近距离，听得见演员的呼吸。',
      date: '2026年5月16日',
      time: '15:00',
      duration: '1.5小时 · 90 Minutes',
      venue: 'Studio Hall，渥太华',
      venueAddress: '渥太华市区，具体地址报名后告知',
      feature: false,
      formUrl: '#',
      imageUrl: 'https://picsum.photos/seed/burying-blossoms/1200/600',
    },
    {
      id: 'autumn-evening',
      num: 'N° 03',
      tag: '雅集 · Concert',
      titleZh: ['秋夜·清音'],
      titleEn: 'An Autumn Evening',
      blurb: '音乐家和演员合作，唱一晚的独唱和器乐选段，在秋分前夜。',
      description: '秋分前夜，越剧演员与器乐家同台，共度一个安静而细腻的夜晚。二胡、琵琶、笛子与唱腔交织，折子与器乐独奏轮番上演，没有大幕，没有妆容，只有音乐本身。这是一场私人雅集的形式：小客厅，亲密座位，演出之后有茶与交流。名额有限，优先照顾长期支持者与传习所学员家属。',
      date: '2026年9月20日',
      time: '19:00',
      duration: '2小时（含茶叙） · 2 Hours incl. tea',
      venue: 'Private Salon，渥太华',
      venueAddress: '具体地址报名后以私信告知',
      feature: false,
      formUrl: '#',
      imageUrl: 'https://picsum.photos/seed/autumn-evening/1200/600',
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
  title: { zh: '往年活动', en: 'Past Events' },
  works: [
    { year: '2018', zh: ['红楼', '梦'], en: 'Dream of the Red Chamber', image: 'https://picsum.photos/seed/redchamber/280/520' },
    { year: '2019', zh: ['碧玉', '簪'], en: 'The Jade Hairpin', image: '/assets/gallery/jade-hairpin.jpg' },
    { year: '2020', zh: ['白蛇', '传'], en: 'Legend of the White Snake', image: 'https://picsum.photos/seed/whitesnake/280/520' },
    { year: '2021', zh: ['西厢', '记'], en: 'Romance of the West Chamber', image: '/assets/gallery/west-chamber.jpg' },
    { year: '2022', zh: ['孔雀', '东南飞'], en: 'Southeast the Peacock Flies', image: 'https://picsum.photos/seed/peacock/280/520' },
    { year: '2023', zh: ['五女', '拜寿'], en: "Five Daughters' Birthday", image: '/assets/gallery/five-daughters.jpg' },
    { year: '2024', zh: ['何文', '秀'], en: 'He Wenxiu', image: '/assets/gallery/he-wenxiu.jpg' },
    { year: '2025', zh: ['追', '鱼'], en: 'Chasing the Fish', image: 'https://picsum.photos/seed/chasfish/280/520' },
    { year: '2025', zh: ['三看', '御妹'], en: 'Three Glances at the Princess', image: 'https://picsum.photos/seed/princess/280/520' },
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

export const eventPage = {
  backLink: { zh: '返回演出列表', en: 'Back to Performances' },
  signup: { zh: '报名参加', en: 'Sign Up' },
  qrLabel: { zh: '扫描二维码报名', en: 'Scan to register' },
  formLink: { zh: '或点此在线报名', en: 'Or click to register online' },
  labels: {
    date:     { zh: '日期', en: 'Date' },
    time:     { zh: '时间', en: 'Time' },
    duration: { zh: '时长', en: 'Duration' },
    venue:    { zh: '地点', en: 'Venue' },
    address:  { zh: '地址', en: 'Address' },
  },
}
