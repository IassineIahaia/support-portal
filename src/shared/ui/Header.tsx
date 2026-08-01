import { useAuth } from 'react-oidc-context'
import { Button } from '@/shared/ui/Button'
import { auth0LogoutUrl } from '@/features/auth/lib/oidc-config'

export function Header() {
  const auth = useAuth()

  const handleLogout = () => {
    void auth.removeUser()
    window.location.href = auth0LogoutUrl()
  }

  return (
    <>
      
    <a href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:text-on-primary focus:px-4 focus:py-2 focus:rounded-standard"
      >
        Skip to main content
      </a>
      <header className="bg-white border-b border-outline/30 px-8 py-4 flex items-center justify-between">
        <span className="font-headline text-lg text-secondary font-semibold">Support Portal</span>
        {auth.isAuthenticated && (
          <div className="flex items-center gap-4">
            <span className="font-body text-sm text-on-surface-variant">
              {auth.user?.profile.email}
            </span>
            <Button variant="outlined" onClick={handleLogout}>
              Sign out
            </Button>
          </div>
        )}
      </header>
    </>
  )
}