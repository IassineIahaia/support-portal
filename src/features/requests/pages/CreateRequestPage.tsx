import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { createRequestSchema, type CreateRequestFormValues } from '@/features/requests/lib/create-request-schema'
import { useCreateServiceRequest } from '@/features/requests/hooks/useCreateServiceRequest'
import { ApiError } from '@/shared/lib/api-client'
import { TextField, TextAreaField } from '@/shared/ui/TextField'
import { Select } from '@/shared/ui/Select'
import { Button } from '@/shared/ui/Button'

export function CreateRequestPage() {
  const navigate = useNavigate()
  const mutation = useCreateServiceRequest()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateRequestFormValues>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: { priority: 'MEDIUM' },
  })

  async function onSubmit(values: CreateRequestFormValues) {
    try {
      const created = await mutation.mutateAsync(values)
      navigate(`/requests/${created.id}`)
    } catch (err) {
      if (err instanceof ApiError && err.problem.errors) {
        // Mapeia erros 422 vindos da API direto nos campos do formulário
        for (const [field, messages] of Object.entries(err.problem.errors)) {
          setError(field as keyof CreateRequestFormValues, { message: messages[0] })
        }
      } else {
        setError('root', { message: 'Something went wrong. Please try again.' })
      }
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="font-headline text-2xl text-secondary mb-6">New Service Request</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-outline/30 rounded-container p-6 flex flex-col gap-4">
        <TextField label="Title" {...register('title')} error={errors.title?.message} />
        <TextAreaField label="Description" {...register('description')} error={errors.description?.message} />

        <div className="grid grid-cols-2 gap-4">
          <TextField label="Category" {...register('category')} error={errors.category?.message} />
          <Select label="Priority" {...register('priority')}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TextField label="Requester name" {...register('requesterName')} error={errors.requesterName?.message} />
          <TextField label="Requester email" type="email" {...register('requesterEmail')} error={errors.requesterEmail?.message} />
        </div>

        {errors.root && <span className="text-tertiary text-sm font-body">{errors.root.message}</span>}

        <div className="flex gap-3 mt-2">
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creating…' : 'Create Request'}
          </Button>
        </div>
      </form>
    </div>
  )
}