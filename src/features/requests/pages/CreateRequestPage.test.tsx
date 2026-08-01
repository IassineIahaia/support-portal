import { describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen, waitFor } from '@/test/test-utils'
import { CreateRequestPage } from './CreateRequestPage'

describe('CreateRequestPage', () => {
  it('shows validation errors when submitting an empty form', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CreateRequestPage />)

    await user.click(screen.getByRole('button', { name: /create request/i }))

    expect(await screen.findByText(/title must be at least 3 characters/i)).toBeInTheDocument()
    expect(screen.getByText(/description must be at least 10 characters/i)).toBeInTheDocument()
    expect(screen.getByText(/enter a valid email address/i)).toBeInTheDocument()
  })

  it('submits successfully with valid data', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CreateRequestPage />)

    await user.type(screen.getByLabelText(/title/i), 'Printer not working')
    await user.type(screen.getByLabelText(/description/i), 'The office printer on the 3rd floor is jammed.')
    await user.type(screen.getByLabelText(/category/i), 'Hardware')
    await user.type(screen.getByLabelText(/requester name/i), 'Ana Silva')
    await user.type(screen.getByLabelText(/requester email/i), 'ana.silva@example.com')

    await user.click(screen.getByRole('button', { name: /create request/i }))

    // Após sucesso, o botão volta ao texto normal (não fica travado em "Creating…")
    await waitFor(() => {
      expect(screen.queryByText(/creating…/i)).not.toBeInTheDocument()
    })
  })
})