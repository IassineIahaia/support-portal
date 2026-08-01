import { Button } from '@/shared/ui/Button'

function App() {
  return (
    <div className="min-h-screen bg-surface p-8 flex gap-4 items-start">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="inverted" className="bg-secondary">Inverted</Button>
    </div>
  )
}

export default App