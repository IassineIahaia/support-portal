import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/lib/api-client'
import type { components } from '@/shared/types/api'

type ServiceRequestPage = components['schemas']['ServiceRequestPage']

export function useServiceRequests() {
  return useQuery({
    queryKey: ['service-requests'],
    queryFn: () => apiClient.get<ServiceRequestPage>('/requests'),
  })
}