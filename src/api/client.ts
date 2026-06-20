// Thin client for the Auralis Garmin bridge. The bearer token lives in
// localStorage so a reload keeps you connected until the session expires.
const BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8787'
const TOKEN_KEY = 'auralis.token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken()
  const res = await fetch(BASE + path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Errore ${res.status}`)
  }
  return res.json()
}

export type GarminProfile = { name: string; fullName: string; avatar: string; location: string }

export const api = {
  base: BASE,
  async ping(): Promise<boolean> {
    try {
      const r = await fetch(BASE + '/api/health-check')
      return r.ok
    } catch {
      return false
    }
  },
  async login(email: string, password: string) {
    const data = await req<{ token: string; profile: GarminProfile }>('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    setToken(data.token)
    return data
  },
  logout: () => req('/api/logout', { method: 'POST' }).catch(() => {}).finally(clearToken),
  today: () => req<any>('/api/today'),
  activities: () => req<any[]>('/api/activities'),
  sleep: () => req<any>('/api/sleep'),
  body: () => req<any>('/api/body'),
}
