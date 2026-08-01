import { Link, useParams } from 'react-router-dom'
import { useServiceRequest } from '@/features/requests/hooks/useServiceRequest'
import { StatusTrail } from '@/features/requests/components/StatusTrail'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { priorityToBadgeColor } from '@/features/requests/lib/badge-mappers'

export function RequestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError } = useServiceRequest(id)

  if (isLoading) return <div className="p-8 font-body text-on-surface-variant">Loading request…</div>

  if (isError || !data) {
    return (
      <div className="p-8">
        <div className="font-body text-tertiary mb-4">Request not found or failed to load.</div>
        <Link to="/requests">
          <Button variant="outlined">Back to list</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl">
      <Link to="/requests" className="font-body text-sm text-on-surface-variant hover:text-secondary mb-4 inline-block">
        ← Back to requests
      </Link>

      <div className="bg-white border border-outline/30 rounded-container p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="font-technical text-xs bg-surface-container px-2 py-1 rounded-standard">{data.id}</span>
            <h1 className="font-headline text-2xl text-secondary mt-2">{data.title}</h1>
          </div>
          <Badge color={priorityToBadgeColor[data.priority]!}>{data.priority}</Badge>
        </div>

        <div className="mb-6">
          <StatusTrail status={data.status} size="expanded" />
        </div>

        <dl className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <dt className="font-body text-on-surface-variant text-xs uppercase tracking-wide">Requester</dt>
            <dd className="font-body">{data.requesterName}</dd>
          </div>
          <div>
            <dt className="font-body text-on-surface-variant text-xs uppercase tracking-wide">Email</dt>
            <dd className="font-body">{data.requesterEmail}</dd>
          </div>
          <div>
            <dt className="font-body text-on-surface-variant text-xs uppercase tracking-wide">Category</dt>
            <dd className="font-body">{data.category}</dd>
          </div>
          <div>
            <dt className="font-body text-on-surface-variant text-xs uppercase tracking-wide">Created</dt>
            <dd className="font-body">{new Date(data.createdAt).toLocaleString()}</dd>
          </div>
        </dl>

        <div className="mb-6">
          <h2 className="font-body text-xs uppercase tracking-wide text-on-surface-variant mb-2">Description</h2>
          <p className="font-body text-on-surface whitespace-pre-wrap">{data.description}</p>
        </div>

        {/* O controle de mudança de status entra na Fase 8 */}
      </div>
    </div>
  )
}