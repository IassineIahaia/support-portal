import { useQuery } from '@tanstack/react-query'
import { useAuth } from 'react-oidc-context'
import { apiClient } from '@/shared/lib/api-client'
import type { components } from '@/shared/types/api'

type ServiceRequestPage = components['schemas']['ServiceRequestPage']

export interface RequestQueryParams {
  search: string
  status: string
  priority: string
  sort: string
  page: number
  pageSize: number
}

function buildQueryString(params: RequestQueryParams): string {
  const searchParams = new URLSearchParams()
  if (params.search) searchParams.set('search', params.search)
  if (params.status) searchParams.set('status', params.status)
  if (params.priority) searchParams.set('priority', params.priority)
  searchParams.set('sort', params.sort)
  searchParams.set('page', String(params.page))
  searchParams.set('pageSize', String(params.pageSize))
  return searchParams.toString()
}

export function useServiceRequests(params: RequestQueryParams) {
  const auth = useAuth()

  return useQuery({
    queryKey: ['service-requests', params],
    queryFn: () =>
      apiClient.get<ServiceRequestPage>(`/requests?${buildQueryString(params)}`, {
        token: auth.user?.access_token,
      }),
    enabled: auth.isAuthenticated,
    placeholderData: (previousData) => previousData, 
  })
}