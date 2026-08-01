import { useQuery } from '@tanstack/react-query'
import { useAuth } from 'react-oidc-context'
import { apiClient } from '@/shared/lib/api-client'
import type { components } from '@/shared/types/api'

type ServiceRequestPage = components['schemas']['ServiceRequestPage']

export function useServiceRequests() {
  const auth = useAuth()

  return useQuery({
    queryKey: ['service-requests'],
    queryFn: () =>
      apiClient.get<ServiceRequestPage>('/requests', {
        token: auth.user?.access_token,
      }),
    enabled: auth.isAuthenticated,
  })
}