const TOKEN_KEY = 'delcom_token'
const BASE = import.meta.env.VITE_API_BASE_URL || ''

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const setToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

/** Wrapper fetch terpusat: menyuntik Bearer token & mengurai respons {status,message,data}. */
export async function apiRequest(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (auth && token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE}/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  let json = null
  try {
    json = await res.json()
  } catch {
    json = null
  }
  if (!res.ok) {
    const err = new Error(json?.message || `Permintaan gagal (${res.status})`)
    err.status = res.status
    throw err
  }
  return json
}
