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

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const problem = (await response.json()) as ProblemDetails
    throw new ApiError(problem)
  }

  // 204 No Content ou respostas vazias
  const text = await response.text()
  return text ? (JSON.parse(text) as T) : (undefined as T)
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
}