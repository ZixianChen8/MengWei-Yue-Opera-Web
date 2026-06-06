import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/admin-guard'
import LogoutButton from '@/components/admin/LogoutButton'
import styles from '@/components/admin/admin.module.css'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Defense in depth: proxy.ts already gates /admin, re-check here.
  if (!(await isAdmin())) {
    redirect('/admin/login')
  }

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <Link href="/admin" className={styles.brand}>
          孟<b>伟</b>越剧
          <span className={styles.brandSub}>管理后台</span>
        </Link>
        <div className={styles.spacer} />
        <Link href="/" className={styles.btn} target="_blank" rel="noopener noreferrer">
          查看网站
        </Link>
        <LogoutButton />
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
