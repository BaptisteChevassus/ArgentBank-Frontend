const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1'

// Error carrying the HTTP status, so callers can tell a bad login (400)
// from an expired token (401) or a server that is down (status 0)
export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function request(path, { method = 'GET', token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Unable to reach the server. Please try again later.', 0)
  }

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new ApiError(data.message ?? 'Unexpected error', response.status)
  }
  // The API wraps every payload in { status, message, body }
  return data.body
}

export const loginRequest = (email, password) =>
  request('/user/login', { method: 'POST', body: { email, password } })

export const getProfileRequest = (token) => request('/user/profile', { token })

export const updateProfileRequest = (token, userName) =>
  request('/user/profile', { method: 'PUT', token, body: { userName } })
