import type { components } from '@/shared/types/api'

type ServiceRequestStatus = components['schemas']['ServiceRequestStatus']

interface StatusTrailProps {
  status: ServiceRequestStatus
  size?: 'compact' | 'expanded'
}

const STAGES: { key: ServiceRequestStatus; label: string }[] = [
  { key: 'OPEN', label: 'Open' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'RESOLVED', label: 'Resolved' },
  { key: 'CLOSED', label: 'Closed' },
]

const NODE_COLOR: Record<ServiceRequestStatus, string> = {
  OPEN: 'bg-status-open border-status-open',
  IN_PROGRESS: 'bg-status-in-progress border-status-in-progress',
  RESOLVED: 'bg-status-resolved border-status-resolved',
  CLOSED: 'bg-status-closed border-status-closed',
}

const LINE_COLOR: Record<ServiceRequestStatus, string> = {
  OPEN: 'bg-status-open',
  IN_PROGRESS: 'bg-status-in-progress',
  RESOLVED: 'bg-status-resolved',
  CLOSED: 'bg-status-closed',
}

export function StatusTrail({ status, size = 'compact' }: StatusTrailProps) {
  const currentIndex = STAGES.findIndex((s) => s.key === status)
  const currentLabel = STAGES[currentIndex]?.label ?? status
  const nodeSize = size === 'compact' ? 'w-2.5 h-2.5' : 'w-4 h-4'
  const lineHeight = size === 'compact' ? 'h-0.5' : 'h-1'

  return (
    <div
      className="flex items-center"
      role="img"
      aria-label={`Request status: ${currentLabel}`}
    >
      {STAGES.map((stage, index) => {
        const isActive = index <= currentIndex

        return (
          <div key={stage.key} className="flex items-center">
            <div
              className={`
                ${nodeSize} rounded-full border-2 shrink-0
                ${isActive ? NODE_COLOR[status] : 'bg-white border-outline/50'}
              `}
              title={stage.label}
            />
            {index < STAGES.length - 1 && (
              <div
                className={`
                  ${lineHeight} w-6 md:w-8
                  ${index < currentIndex ? LINE_COLOR[status] : 'bg-outline/30'}
                `}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}