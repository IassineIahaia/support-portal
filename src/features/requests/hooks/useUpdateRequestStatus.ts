import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from 'react-oidc-context'
import { apiClient } from '@/shared/lib/api-client'
import type { components } from '@/shared/types/api'

type ServiceRequest = components['schemas']['ServiceRequest']
type ServiceRequestStatus = components['schemas']['ServiceRequestStatus']

interface UpdateStatusInput {
  id: string
  status: ServiceRequestStatus
  version: number
}

export function useUpdateRequestStatus() {
  const auth = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status, version }: UpdateStatusInput) =>
      apiClient.patch<ServiceRequest>(
        `/requests/${id}/status`,
        { status, version },
        { token: auth.user?.access_token },
      ),
    onSuccess: (updated) => {

      queryClient.setQueryData(['service-request', updated.id], updated)

      queryClient.invalidateQueries({ queryKey: ['service-requests'] })
    },
  })
}