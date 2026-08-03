import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RequestListPage } from '@/features/requests/pages/RequestListPage'
import { RequestDetailPage } from '@/features/requests/pages/RequestDetailPage'
import { CreateRequestPage } from '@/features/requests/pages/CreateRequestPage'
import { CallbackPage } from '@/features/auth/pages/CallbackPage'
import { NotFoundPage } from '@/shared/ui/NotFoundPage'
import { RequireAuth } from '@/features/auth/components/RequireAuth'
import { LoggedOutPage } from "@/features/auth/pages/LoggedOutPage";

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/requests" replace /> },
  {
    path: '/requests',
    element: (
      <RequireAuth>
        <RequestListPage />
      </RequireAuth>
    ),
  },
  {
    path: '/requests/new',
    element: (
      <RequireAuth>
        <CreateRequestPage />
      </RequireAuth>
    ),
  },
  {
    path: '/requests/:id',
    element: (
      <RequireAuth>
        <RequestDetailPage />
      </RequireAuth>
    ),
  },
  { path: '/callback', element: <CallbackPage /> },
  { path: "/logged-out", element: <LoggedOutPage /> },
  { path: '*', element: <NotFoundPage /> },
])