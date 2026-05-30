import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/admin-guard'
import LoginForm from './LoginForm'
import styles from './login.module.css'

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  if (await isAdmin()) {
    redirect('/admin')
  }
  return (
    <div className={styles.wrap}>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
