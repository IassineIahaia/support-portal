import type { components } from '@/shared/types/api'

export type ProblemDetails = components['schemas']['ProblemDetails']

export class ApiError extends Error {
  status: number
  problem: ProblemDetails

  constructor(problem: ProblemDetails) {
    super(problem.detail ?? problem.title ?? 'Request failed')
    this.status = problem.status ?? 500
    this.problem = problem
  }
}

interface RequestOptions extends RequestInit {
  token?: string
}

async function request<T>(path: string, { token, ...options }: RequestOptions = {}): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const problem = (await response.json()) as ProblemDetails
    throw new ApiError(problem)
  }

  const text = await response.text()
  return text ? (JSON.parse(text) as T) : (undefined as T)
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, options),
  post: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
}