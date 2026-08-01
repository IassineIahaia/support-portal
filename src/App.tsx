import { Badge } from '@/shared/ui/Badge'

function App() {
  return (
    <div className="min-h-screen bg-surface p-8 flex gap-2 items-start flex-wrap">
      <Badge color="status-open">Open</Badge>
      <Badge color="status-in-progress">In Progress</Badge>
      <Badge color="status-resolved">Resolved</Badge>
      <Badge color="status-closed">Closed</Badge>
      <Badge color="priority-critical">Critical</Badge>
    </div>
  )
}

export default App