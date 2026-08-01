import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders the children text', () => {
    render(<Badge color="status-open">Open</Badge>)
    expect(screen.getByText('Open')).toBeInTheDocument()
  })

  it('applies the correct color class for each status', () => {
    render(<Badge color="priority-critical">Critical</Badge>)
    const badge = screen.getByText('Critical')
    expect(badge.className).toContain('bg-priority-critical')
  })
})