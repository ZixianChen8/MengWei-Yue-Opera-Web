export const NAV_BRANDS = {
  default: {
    src: '/assets/Logo-1.PNG',
    width: 262,
    height: 267,
    href: '/',
    ariaLabel: 'Meng Wei Yue Opera Studio home',
  },
  anniversary: {
    src: '/assets/anniversary-logo-white.jpg',
    width: 359,
    height: 139,
    href: '/anniversary',
    ariaLabel: '10th Anniversary Special',
  },
} as const

export type NavBrand = keyof typeof NAV_BRANDS

export function brandForPath(pathname: string | null | undefined): NavBrand {
  return pathname?.startsWith('/anniversary') ? 'anniversary' : 'default'
}
