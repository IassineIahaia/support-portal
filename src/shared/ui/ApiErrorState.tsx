import { useEffect } from 'react'
import { useAuth } from 'react-oidc-context'
import { ApiError } from '@/shared/lib/api-client'
import { Button } from '@/shared/ui/Button'

interface ApiErrorStateProps {
  error: unknown
  onRetry?: () => void
}

export function ApiErrorState({ error, onRetry }: ApiErrorStateProps) {
  const auth = useAuth()
  const status = error instanceof ApiError ? error.status : undefined


  useEffect(() => {
    if (status === 401) {
      void auth.signinRedirect()
    }
  }, [status, auth])

  if (status === 401) {
    return (
      <div className="p-8 font-body text-on-surface-variant">
        Your session has expired. Redirecting you to sign in…
      </div>
    )
  }


  if (status === 403) {
    return (
      <div className="p-8 font-body text-tertiary">
        You don't have permission to access this resource.
      </div>
    )
  }

  return (
    <div className="p-8 flex items-center gap-4">
      <span className="font-body text-tertiary">Something went wrong while loading data.</span>
      {onRetry && (
        <Button variant="outlined" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}