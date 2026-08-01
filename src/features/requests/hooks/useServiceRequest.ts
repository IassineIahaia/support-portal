import { useQuery } from '@tanstack/react-query'
import { useAuth } from 'react-oidc-context'
import { apiClient } from '@/shared/lib/api-client'
import type { components } from '@/shared/types/api'

type ServiceRequest = components['schemas']['ServiceRequest']

export function useServiceRequest(id: string | undefined) {
  const auth = useAuth()

  return useQuery({
    queryKey: ['service-request', id],
    queryFn: () =>
      apiClient.get<ServiceRequest>(`/requests/${id}`, {
        token: auth.user?.access_token,
      }),
    enabled: auth.isAuthenticated && Boolean(id),
  })
}