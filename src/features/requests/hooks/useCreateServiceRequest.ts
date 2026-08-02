import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from 'react-oidc-context'
import { apiClient, ApiError } from '@/shared/lib/api-client'
import type { components } from '@/shared/types/api'

type ServiceRequest = components['schemas']['ServiceRequest']
type CreateServiceRequest = components['schemas']['CreateServiceRequest']

export function useCreateServiceRequest() {
  const auth = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateServiceRequest) =>
      apiClient.post<ServiceRequest>('/requests', body, { token: auth.user?.access_token }),
    onSuccess: () => {
    
      queryClient.invalidateQueries({ queryKey: ['service-requests'] })
    },
  })
}

export { ApiError }