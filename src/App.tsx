import { StatusTrail } from '@/features/requests/components/StatusTrail'

function App() {
  return (
    <div className="min-h-screen bg-surface p-8 flex flex-col gap-6 items-start">
      <StatusTrail status="OPEN" />
      <StatusTrail status="IN_PROGRESS" />
      <StatusTrail status="RESOLVED" />
      <StatusTrail status="CLOSED" size="expanded" />
    </div>
  )
}

export default App