import type { BadgeColor } from '@/shared/ui/Badge'

export const statusToBadgeColor: Record<string, BadgeColor> = {
  OPEN: 'status-open',
  IN_PROGRESS: 'status-in-progress',
  RESOLVED: 'status-resolved',
  CLOSED: 'status-closed',
}

export const priorityToBadgeColor: Record<string, BadgeColor> = {
  LOW: 'priority-low',
  MEDIUM: 'priority-medium',
  HIGH: 'priority-high',
  CRITICAL: 'priority-critical',
}