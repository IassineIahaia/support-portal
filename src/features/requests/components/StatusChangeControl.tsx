import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useUpdateRequestStatus } from '@/features/requests/hooks/useUpdateRequestStatus'
import { ApiError } from '@/shared/lib/api-client'
import { Button } from '@/shared/ui/Button'
import type { components } from '@/shared/types/api'

type ServiceRequest = components['schemas']['ServiceRequest']
type ServiceRequestStatus = components['schemas']['ServiceRequestStatus']

const VALID_TRANSITIONS: Record<ServiceRequestStatus, ServiceRequestStatus[]> = {
  OPEN: ['IN_PROGRESS', 'CLOSED'],
  IN_PROGRESS: ['RESOLVED', 'OPEN'],
  RESOLVED: ['CLOSED', 'IN_PROGRESS'],
  CLOSED: [],
}

const STATUS_LABEL: Record<ServiceRequestStatus, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
}

interface StatusChangeControlProps {
  request: ServiceRequest
}

export function StatusChangeControl({ request }: StatusChangeControlProps) {
  const mutation = useUpdateRequestStatus()
  const queryClient = useQueryClient()
  const [conflict, setConflict] = useState(false)
  const [invalidTransitionMsg, setInvalidTransitionMsg] = useState<string | null>(null)

  const options = VALID_TRANSITIONS[request.status]

  async function handleTransition(nextStatus: ServiceRequestStatus) {
    setConflict(false)
    setInvalidTransitionMsg(null)

    try {
      await mutation.mutateAsync({ id: request.id, status: nextStatus, version: request.version })
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setConflict(true)
      } else if (err instanceof ApiError && err.status === 422) {
        setInvalidTransitionMsg(err.problem.detail ?? 'This status transition is not allowed.')
      }
    }
  }

  function handleReload() {
    setConflict(false)
    queryClient.invalidateQueries({ queryKey: ['service-request', request.id] })
  }

  if (request.status === 'CLOSED') {
    return (
      <div className="font-body text-sm text-on-surface-variant">
        This request is closed. No further status changes are allowed.
      </div>
    )
  }

  return (
    <div>
      <h2 className="font-body text-xs uppercase tracking-wide text-on-surface-variant mb-2">Update status</h2>

      <div className="flex flex-wrap gap-2">
        {options.map((next) => (
          <Button
            key={next}
            variant="outlined"
            disabled={mutation.isPending}
            onClick={() => handleTransition(next)}
          >
            Move to {STATUS_LABEL[next]}
          </Button>
        ))}
      </div>

      {conflict && (
        <div className="mt-3 bg-tertiary/10 border border-tertiary/30 rounded-standard p-3 flex items-center justify-between gap-4">
          <span className="font-body text-sm text-tertiary">
            This request was updated by someone else. Refresh to see the latest version before trying again.
          </span>
          <Button variant="primary" onClick={handleReload}>
            Reload
          </Button>
        </div>
      )}

      {invalidTransitionMsg && (
        <div className="mt-3 bg-tertiary/10 border border-tertiary/30 rounded-standard p-3">
          <span className="font-body text-sm text-tertiary">{invalidTransitionMsg}</span>
        </div>
      )}
    </div>
  )
}