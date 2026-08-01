import { useParams } from 'react-router-dom'

export function RequestDetailPage() {
  const { id } = useParams<{ id: string }>()
  return <div className="p-8 font-headline text-2xl">Request Detail: {id}</div>
}