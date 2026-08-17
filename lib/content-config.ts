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

// Only the CMS-scoped sections. Everything else stays in JSON for the site
// but is not editable via /admin.
export const SECTIONS: SectionDef[] = [
  {
    target: 'home',
    section: 'season',
    label: '活动',
    blurb:
      '演出信息、图片与横幅（单张不超过 4 MB）。勾选"首页展示"（最多 3 个）显示在首页；勾选"往迹 / 已结束"或活动日期过后，会出现在 /events 往迹区并自动关闭报名。',
    group: 'Programme',
  },
  {
    target: 'gallery',
    section: 'galleryPage',
    label: '画廊',
    blurb:
      '上传照片（数量不限，单张不超过 4 MB），每张可填写标题、说明与日期，并用「所属活动」归入对应演出册页。用 ▲▼ 箭头调整顺序；勾选"首页展示"可同时显示在首页影像条。',
    group: 'Programme',
  },

  {
    target: 'home',
    section: 'studio',
    label: '教学 / 课程',
    blurb: '课程介绍与班级列表。咨询按钮的邮箱来自「联络方式」。',
    group: 'Site text',
  },
  {
    target: 'home',
    section: 'contact',
    label: '联络方式',
    blurb: '唯一邮箱来源：页脚、导航联系入口与课程咨询按钮共用此地址。',
    group: 'Site text',
  },
  {
    target: 'home',
    section: 'about',
    label: '关于（首页板块）',
    blurb: '首页上显示的竖排诗句与宗旨。',
    group: 'Site text',
  },

  {
    target: 'home',
    section: 'aboutPage',
    label: '关于页面',
    blurb: '完整的 /about 页面：简介与联系表单文案。',
    group: 'Pages',
  },
]

export function findSection(target: string, section: string): SectionDef | undefined {
  return SECTIONS.find((s) => s.target === target && s.section === section)
}
