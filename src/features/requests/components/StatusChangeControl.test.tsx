import { describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { renderWithProviders, screen } from '@/test/test-utils'
import { StatusChangeControl } from './StatusChangeControl'
import type { components } from '@/shared/types/api'

type ServiceRequest = components['schemas']['ServiceRequest']

const baseRequest: ServiceRequest = {
  id: 'REQ-9001',
  title: 'Test request',
  description: 'A request used for testing status transitions.',
  category: 'Testing',
  priority: 'MEDIUM',
  status: 'OPEN',
  requesterName: 'Test User',
  requesterEmail: 'test.user@example.com',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  version: 1,
}

describe('StatusChangeControl', () => {
  it('only shows valid transitions for the current status', async () => {
    renderWithProviders(<StatusChangeControl request={baseRequest} />)

    expect(await screen.findByRole('button', { name: /move to in progress/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /move to closed/i })).toBeInTheDocument()

    expect(screen.queryByRole('button', { name: /move to resolved/i })).not.toBeInTheDocument()
  })

  it('shows no actions when the request is already closed', async () => {
    renderWithProviders(<StatusChangeControl request={{ ...baseRequest, status: 'CLOSED' }} />)

    expect(await screen.findByText(/this request is closed/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /move to/i })).not.toBeInTheDocument()
  })

  it('shows a conflict warning when the API returns 409', async () => {
   
    server.use(
      http.patch('/api/requests/:id/status', () =>
        HttpResponse.json(
          {
            type: 'https://api.example.test/problems/update-conflict',
            title: 'Update conflict',
            status: 409,
            detail: 'The request was updated by someone else. Refresh and try again.',
            instance: '/api/requests/REQ-9001/status',
            traceId: 'test-trace-id',
          },
          { status: 409 },
        ),
      ),
    )

    const user = userEvent.setup()
    renderWithProviders(<StatusChangeControl request={baseRequest} />)

    await user.click(screen.getByRole('button', { name: /move to in progress/i }))

    expect(await screen.findByText(/updated by someone else/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reload/i })).toBeInTheDocument()
  })
})