import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useServiceRequests } from '@/features/requests/hooks/useServiceRequests'
import { useDebouncedValue } from '@/shared/lib/useDebouncedValue'
import { Badge } from '@/shared/ui/Badge'
import { Select } from '@/shared/ui/Select'
import { Button } from '@/shared/ui/Button'
import { StatusTrail } from '@/features/requests/components/StatusTrail'
import { priorityToBadgeColor } from '@/features/requests/lib/badge-mappers'

const PAGE_SIZE = 10

export function RequestListPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') ?? ''
  const status = searchParams.get('status') ?? ''
  const priority = searchParams.get('priority') ?? ''
  const sort = searchParams.get('sort') ?? '-createdAt'
  const page = Number(searchParams.get('page') ?? '1')


  const [searchInput, setSearchInput] = useState(search)
  const debouncedSearch = useDebouncedValue(searchInput, 300)


  if (debouncedSearch !== search) {
    const next = new URLSearchParams(searchParams)
    if (debouncedSearch) next.set('search', debouncedSearch)
    else next.delete('search')
    next.set('page', '1')
    setSearchParams(next, { replace: true })
  }

  const { data, isLoading, isError, isFetching } = useServiceRequests({
    search,
    status,
    priority,
    sort,
    page,
    pageSize: PAGE_SIZE,
  })

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    next.set('page', '1')
    setSearchParams(next)
  }

  function goToPage(nextPage: number) {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(nextPage))
    setSearchParams(next)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline text-2xl text-secondary">Service Requests</h1>
        <Link to="/requests/new">
          <Button variant="primary">+ New Request</Button>
        </Link>
      </div>

      <div className="flex flex-wrap items-end gap-4 mb-6">
        <label className="flex flex-col gap-1 text-xs font-body text-on-surface-variant flex-1 min-w-[240px]">
          <span className="uppercase tracking-wide font-semibold">Search</span>
          <input
            type="text"
            placeholder="Search by title or requester…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="bg-white border border-outline/50 rounded-standard px-3 py-2 text-sm font-body focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
          />
        </label>

        <Select label="Status" value={status} onChange={(e) => updateParam('status', e.target.value)}>
          <option value="">All statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </Select>

        <Select label="Priority" value={priority} onChange={(e) => updateParam('priority', e.target.value)}>
          <option value="">All priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </Select>

        <Select label="Sort by" value={sort} onChange={(e) => updateParam('sort', e.target.value)}>
          <option value="-createdAt">Newest first</option>
          <option value="createdAt">Oldest first</option>
        </Select>
      </div>

      {isLoading && <div className="font-body text-on-surface-variant">Loading requests…</div>}
      {isError && <div className="font-body text-tertiary">Failed to load requests. Please try again.</div>}

      {data && data.items.length === 0 && (
        <div className="bg-white border border-outline/30 rounded-container p-8 text-center font-body text-on-surface-variant">
          No requests match your filters.
        </div>
      )}

      {data && data.items.length > 0 && (
        <>
          <div className={`flex flex-col gap-3 transition-opacity ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
            {data.items.map((r) => (
              <Link
                key={r.id}
                to={`/requests/${r.id}`}
                className="bg-white border border-outline/30 rounded-container p-4 flex items-center gap-4 hover:border-primary transition-colors"
              >
                <span className="font-technical text-xs bg-surface-container px-2 py-1 rounded-standard">{r.id}</span>
                <span className="font-body font-medium flex-1">{r.title}</span>
                <span className="font-body text-sm text-on-surface-variant hidden md:inline">{r.requesterName}</span>
                <Badge color={priorityToBadgeColor[r.priority]!}>{r.priority}</Badge>
                <StatusTrail status={r.status} />
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6">
            <span className="font-body text-sm text-on-surface-variant">
              Page {data.page} of {data.totalPages} · {data.total} total
            </span>
            <div className="flex gap-2">
              <Button variant="outlined" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
                Previous
              </Button>
              <Button variant="outlined" disabled={page >= data.totalPages} onClick={() => goToPage(page + 1)}>
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}