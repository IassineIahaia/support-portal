/* eslint-disable react-refresh/only-export-components */
import type { ReactElement, ReactNode } from 'react'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from 'react-oidc-context'

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}


const testAuthConfig = {
  authority: 'https://test.auth0.com',
  client_id: 'test-client-id',
  redirect_uri: 'http://localhost:5173/callback',
  automaticSilentRenew: false,
  monitorSession: false,
}

function AllProviders({ children }: { children: ReactNode }) {
  const queryClient = createTestQueryClient()
  return (
    <AuthProvider {...testAuthConfig}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export function renderWithProviders(ui: ReactElement) {
  return render(ui, { wrapper: AllProviders })
}

export * from '@testing-library/react'