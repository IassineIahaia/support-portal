import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'react-oidc-context'

export function CallbackPage() {
  const auth = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/requests', { replace: true })
    }
  }, [auth.isAuthenticated, navigate])

  if (auth.error) {
    return (
      <div className="p-8 font-body text-tertiary">
        Authentication error: {auth.error.message}
      </div>
    )
  }

  return <div className="p-8 font-body text-on-surface-variant">Signing you in…</div>
}