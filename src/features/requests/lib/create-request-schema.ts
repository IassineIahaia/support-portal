import { z } from 'zod'

export const createRequestSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.').max(120, 'Title must be at most 120 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.').max(2000, 'Description must be at most 2000 characters.'),
  category: z.string().min(2, 'Category must be at least 2 characters.').max(50, 'Category must be at most 50 characters.'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  requesterName: z.string().min(2, 'Requester name must be at least 2 characters.').max(100, 'Requester name must be at most 100 characters.'),
  requesterEmail: z.string().email('Enter a valid email address.'),
})

export type CreateRequestFormValues = z.infer<typeof createRequestSchema>