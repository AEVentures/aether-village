import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

afterEach(cleanup)
import { App } from './App'

describe('Aether Village', () => {
  it('presents the project as a feasibility-stage concept', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /build the future/i })).toBeInTheDocument()
    expect(screen.getByText(/feasibility before fantasy/i)).toBeInTheDocument()
    expect(screen.getByText(/no deposits or investment solicitation/i)).toBeInTheDocument()
  })

  it('rejects an incomplete application', () => {
    render(<App />)
    fireEvent.submit(screen.getByRole('button', { name: /submit application/i }).closest('form')!)
    expect(screen.getByRole('status')).toHaveTextContent(/complete every field/i)
  })
})
