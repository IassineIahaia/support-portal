import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RequestListPage } from '@/features/requests/pages/RequestListPage'
import { RequestDetailPage } from '@/features/requests/pages/RequestDetailPage'
import { CreateRequestPage } from '@/features/requests/pages/CreateRequestPage'
import { CallbackPage } from '@/features/auth/pages/CallbackPage'
import { NotFoundPage } from '@/shared/ui/NotFoundPage'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/requests" replace /> },
  { path: '/requests', element: <RequestListPage /> },
  { path: '/requests/new', element: <CreateRequestPage /> },
  { path: '/requests/:id', element: <RequestDetailPage /> },
  { path: '/callback', element: <CallbackPage /> },
  { path: '*', element: <NotFoundPage /> },
])