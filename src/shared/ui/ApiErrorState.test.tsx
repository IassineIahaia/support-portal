import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen } from '@/test/test-utils'
import { ApiErrorState } from './ApiErrorState'
import { ApiError } from '@/shared/lib/api-client'

function makeApiError(status: number) {
  return new ApiError({
    type: 'https://api.example.test/problems/test',
    title: 'Test error',
    status,
    detail: 'Test detail',
    instance: '/api/requests',
    traceId: 'test-trace',
  })
}

describe('ApiErrorState', () => {
  it('shows a permission message for 403 without redirecting', async () => {
    renderWithProviders(<ApiErrorState error={makeApiError(403)} />)
    expect(await screen.findByText(/don't have permission/i)).toBeInTheDocument()
  })

  it('shows a generic retry message for other errors', async () => {
    renderWithProviders(<ApiErrorState error={makeApiError(500)} />)
    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument()
  })
})