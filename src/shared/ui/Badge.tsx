import type { ReactNode } from 'react'

export type BadgeColor =
  | 'status-open'
  | 'status-in-progress'
  | 'status-resolved'
  | 'status-closed'
  | 'priority-low'
  | 'priority-medium'
  | 'priority-high'
  | 'priority-critical'

interface BadgeProps {
  color: BadgeColor
  children: ReactNode
}


const colorStyles: Record<BadgeColor, string> = {
  'status-open': 'bg-status-open text-white',
  'status-in-progress': 'bg-status-in-progress text-white',
  'status-resolved': 'bg-status-resolved text-white',
  'status-closed': 'bg-status-closed text-white',
  'priority-low': 'bg-priority-low text-white',
  'priority-medium': 'bg-priority-medium text-white',
  'priority-high': 'bg-priority-high text-white',
  'priority-critical': 'bg-priority-critical text-white',
}

export function Badge({ color, children }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center
        font-body font-semibold text-xs uppercase tracking-wide
        px-2.5 py-1 rounded-full
        ${colorStyles[color]}
      `}
    >
      {children}
    </span>
  )
}