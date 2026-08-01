import { useServiceRequests } from '@/features/requests/hooks/useServiceRequests'
import { Badge } from '@/shared/ui/Badge'
import { StatusTrail } from '@/features/requests/components/StatusTrail'
import { priorityToBadgeColor } from '@/features/requests/lib/badge-mappers'

export function RequestListPage() {
  const { data, isLoading, isError } = useServiceRequests()

  if (isLoading) return <div className="p-8 font-body">Carregando solicitações...</div>
  if (isError) return <div className="p-8 font-body text-tertiary">Erro ao carregar solicitações.</div>

  return (
    <div className="p-8">
      <h1 className="font-headline text-2xl text-secondary mb-6">Service Requests</h1>
      <div className="flex flex-col gap-3">
        {data?.items.map((r) => (
          <div key={r.id} className="bg-surface-card border border-outline/30 rounded-container p-4 flex items-center gap-4">
            <span className="font-technical text-xs bg-surface-container px-2 py-1 rounded-standard">{r.id}</span>
            <span className="font-body font-medium flex-1">{r.title}</span>
            <span className="font-body text-sm text-on-surface-variant">{r.requesterName}</span>
            <Badge color={priorityToBadgeColor[r.priority]!}>{r.priority}</Badge>
            <StatusTrail status={r.status} />
          </div>
        ))}
      </div>
    </div>
  )
}