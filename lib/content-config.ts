// ============================================================
// Registry of admin-editable content sections.
//
// Maps a (target, section) pair to the JSON data file and the
// top-level key inside it. Used by the dashboard to list editors
// and by the content API to validate writes (only known sections
// may be written).
// ============================================================

export type ContentTarget = 'home' | 'gallery' | 'booklet'

export const DATA_FILES: Record<ContentTarget, string> = {
  home: 'content/data/home.json',
  gallery: 'content/data/gallery.json',
  booklet: 'content/data/booklet.json',
}

export type SectionGroup = 'Programme' | 'Site text' | 'Pages'

// Chinese display labels for the dashboard group headings. Keys stay as stable
// English identifiers (used for ordering/filtering); the operator sees Chinese.
export const GROUP_LABELS: Record<SectionGroup, string> = {
  Programme: '节目内容',
  'Site text': '网站文字',
  Pages: '页面',
}

export type SectionDef = {
  target: ContentTarget
  section: string
  label: string
  blurb: string
  group: SectionGroup
}

// Order here is the order shown on the dashboard.
export const SECTIONS: SectionDef[] = [
  { target: 'home', section: 'season', label: '活动', blurb: '近期演出、日期、地点与横幅图片。最多可在 3 个活动上勾选"首页展示"，决定哪些显示在首页板块。', group: 'Programme' },
  { target: 'home', section: 'repertoire', label: '往年活动', blurb: '首页影像条的标题与滚动提示（其照片来自"画廊"）。', group: 'Programme' },
  { target: 'gallery', section: 'galleryPage', label: '画廊', blurb: '上传照片（数量不限），每张可填写标题、说明与日期。用 ▲▼ 箭头调整顺序；勾选"首页展示"可同时显示在首页影像条。', group: 'Programme' },

  { target: 'home', section: 'hero', label: '首屏', blurb: '首屏机构中英文名称（显示在人物剪影后方）。', group: 'Site text' },
  { target: 'home', section: 'overture', label: '序章', blurb: '开篇板块文案、引言以及三项数据。', group: 'Site text' },
  { target: 'home', section: 'studio', label: '教学 / 课程', blurb: '课程介绍与班级列表。', group: 'Site text' },
  { target: 'home', section: 'about', label: '关于（首页板块）', blurb: '首页上显示的竖排诗句与宗旨。', group: 'Site text' },
  { target: 'home', section: 'nav', label: '导航菜单', blurb: '菜单文字与链接，以及品牌标识。', group: 'Site text' },
  { target: 'home', section: 'footer', label: '页脚', blurb: '页脚栏目、联系方式与版权文字。', group: 'Site text' },

  { target: 'booklet', section: 'anniversary', label: '十周年专场（入口）', blurb: '/anniversary 页面的标题、副标题与子菜单卡片。', group: 'Pages' },
  { target: 'booklet', section: 'booklet', label: '场刊', blurb: '十周年专场场刊：封面、序言、贺信、演职人员、节目单、委员会与支持单位。', group: 'Pages' },
  { target: 'booklet', section: 'programmePage', label: '中文节目单', blurb: '/anniversary/programme 页面：抬头、主持人，以及演出曲目（类别、中英文剧名、演职人员）。', group: 'Pages' },
  { target: 'booklet', section: 'appreciationPage', label: '导赏', blurb: '/anniversary/appreciation 页面：抬头、引言，以及每一折的剧情梗概与观赏看点。', group: 'Pages' },

  { target: 'home', section: 'aboutPage', label: '关于页面', blurb: '完整的 /about 页面：简介、联系方式与表单标签。', group: 'Pages' },
  { target: 'home', section: 'eventsListingPage', label: '活动页面', blurb: '/events 列表页头、月份条与往年存档。', group: 'Pages' },
  { target: 'home', section: 'eventPage', label: '活动详情标签', blurb: '每个 /events/[id] 详情页上显示的标签文字。', group: 'Pages' },
]

export function findSection(target: string, section: string): SectionDef | undefined {
  return SECTIONS.find((s) => s.target === target && s.section === section)
}
