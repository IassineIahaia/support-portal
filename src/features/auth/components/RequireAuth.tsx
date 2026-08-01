import { useAuth } from 'react-oidc-context'
import type { ReactNode } from 'react'
import { Header } from '@/shared/ui/Header'

export function RequireAuth({ children }: { children: ReactNode }) {
  const auth = useAuth()

  if (auth.isLoading) {
    return <div className="p-8 font-body text-on-surface-variant">Loading session…</div>
  }

  if (!auth.isAuthenticated) {
    void auth.signinRedirect()
    return <div className="p-8 font-body text-on-surface-variant">Redirecting to sign in…</div>
  }

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      {children}
    </div>
  )
}