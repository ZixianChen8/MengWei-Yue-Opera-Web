import { specialFromPath, specialHref, type SpecialEvent } from '@/content/specials'

export type NavBrandConfig = {
  src: string
  width: number
  height: number
  href: string
  ariaLabel: string
}

export const NAV_BRANDS = {
  default: {
    src: '/assets/Logo-1.PNG',
    width: 262,
    height: 267,
    href: '/',
    ariaLabel: 'Meng Wei Yue Opera Studio home',
  },
  special: {
    src: '/assets/Logo-1.PNG',
    width: 262,
    height: 267,
    href: '/',
    ariaLabel: 'Special event',
  },
} as const

export type NavBrand = keyof typeof NAV_BRANDS

export function brandForPath(pathname: string | null | undefined): NavBrand {
  return pathname?.startsWith('/special/') ? 'special' : 'default'
}

export function specialBrandConfig(special: SpecialEvent): NavBrandConfig {
  if (special.logo) {
    return {
      src: special.logo,
      width: 359,
      height: 139,
      href: specialHref(special.slug),
      ariaLabel: special.navEn || special.hub.pageHead.titleEn,
    }
  }
  return {
    ...NAV_BRANDS.default,
    href: specialHref(special.slug),
    ariaLabel: special.navEn || special.hub.pageHead.titleEn,
  }
}

export function resolveNavBrand(pathname: string | null | undefined): {
  brand: NavBrand
  config: NavBrandConfig
  wideLogo: boolean
} {
  const special = specialFromPath(pathname)
  if (special) {
    return {
      brand: 'special',
      config: specialBrandConfig(special),
      wideLogo: Boolean(special.logo),
    }
  }
  return { brand: 'default', config: NAV_BRANDS.default, wideLogo: false }
}
