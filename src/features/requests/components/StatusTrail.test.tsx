import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusTrail } from './StatusTrail'

describe('StatusTrail', () => {
  it('exposes an accessible label reflecting the current status', () => {
    render(<StatusTrail status="IN_PROGRESS" />)
    expect(screen.getByRole('img', { name: /request status: in progress/i })).toBeInTheDocument()
  })

  it('renders one node per lifecycle stage', () => {
    const { container } = render(<StatusTrail status="OPEN" />)
   
    const nodes = container.querySelectorAll('.rounded-full')
    expect(nodes).toHaveLength(4)
  })
})