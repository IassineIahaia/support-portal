import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
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
        for (const [field, messages] of Object.entries(err.problem.errors)) {
          setError(field as keyof CreateRequestFormValues, { message: messages[0] })
        }
      } else {
        setError('root', { message: 'Something went wrong. Please try again.' })
      }
    }
  }

  return (
    <div className="max-w-[115rem] mx-auto px-4 sm:px-8 py-6 sm:py-8">
      <div className="max-w-2xl">

   <Link
        to="/requests"
        className="font-body text-sm text-on-surface-variant hover:text-secondary mb-4 inline-block"
      >
        ← Back to requests
      </Link>

        <h1 className="font-headline text-xl sm:text-2xl text-secondary mb-6">
          New Service Request
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white border border-outline/30 rounded-container p-4 sm:p-6 flex flex-col gap-4"
        >
          <TextField label="Title" {...register('title')} error={errors.title?.message} />
          <TextAreaField label="Description" {...register('description')} error={errors.description?.message} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField label="Category" {...register('category')} error={errors.category?.message} />
            <Select label="Priority" {...register('priority')}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField label="Requester name" {...register('requesterName')} error={errors.requesterName?.message} />
            <TextField label="Requester email" type="email" {...register('requesterEmail')} error={errors.requesterEmail?.message} />
          </div>

          {errors.root && <span className="text-tertiary text-sm font-body">{errors.root.message}</span>}

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? 'Creating…' : 'Create Request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}