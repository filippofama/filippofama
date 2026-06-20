import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { api, clearToken, getToken } from '../api/client'
import * as mock from '../data/mock'
import type { Activity } from '../data/mock'

type Status = 'login' | 'demo' | 'connecting' | 'connected'

type DataShape = {
  status: Status
  profileName: string | null
  error: string | null
  syncing: boolean
  // live-or-demo data (same shapes as mock)
  user: typeof mock.user
  today: typeof mock.today
  sleep: typeof mock.sleep
  body: typeof mock.body
  activities: Activity[]
  bodyBatteryDay: typeof mock.bodyBatteryDay
  stressDay: typeof mock.stressDay
  heartRateDay: typeof mock.heartRateDay
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  continueDemo: () => void
}

const DataContext = createContext<DataShape | null>(null)
export const useData = () => {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}

const garminTypeMap: Record<string, Activity['type']> = {
  running: 'Corsa', treadmill_running: 'Corsa', indoor_running: 'Corsa', walking: 'Corsa',
  trail_running: 'Trail', hiking: 'Trail', mountaineering: 'Trail',
  cycling: 'Ciclismo', road_biking: 'Ciclismo', mountain_biking: 'Ciclismo', indoor_cycling: 'Ciclismo', gravel_cycling: 'Ciclismo',
  lap_swimming: 'Nuoto', open_water_swimming: 'Nuoto', swimming: 'Nuoto',
  strength_training: 'Forza', indoor_cardio: 'Forza', hiit: 'Forza',
  yoga: 'Yoga', pilates: 'Yoga', breathwork: 'Yoga',
}
const normType = (key: string): Activity['type'] => garminTypeMap[key] || 'Corsa'

export function DataProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>(getToken() ? 'connecting' : 'login')
  const [profileName, setProfileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [live, setLive] = useState<Partial<DataShape>>({})

  const sync = useCallback(async () => {
    setSyncing(true)
    try {
      const [today, activitiesRaw, sleep, body] = await Promise.all([
        api.today().catch(() => null),
        api.activities().catch(() => []),
        api.sleep().catch(() => null),
        api.body().catch(() => null),
      ])

      const activities: Activity[] = (activitiesRaw || [])
        .filter((a: any) => a?.id)
        .map((a: any) => ({ ...a, type: normType(a.type) }))

      // merge live over demo so partial Garmin data never leaves blanks
      const mergedToday = today ? { ...mock.today, ...stripEmpty(today) } : mock.today
      const mergedSleep = sleep && sleep.durationH ? { ...mock.sleep, ...stripEmpty(sleep) } : mock.sleep
      const mergedBody = body && body.weightKg ? { ...mock.body, ...stripEmpty(body) } : mock.body

      setLive({
        today: mergedToday,
        sleep: mergedSleep,
        body: mergedBody,
        activities: activities.length ? activities : mock.activities,
        bodyBatteryDay: today?.bodyBatteryDay?.length ? today.bodyBatteryDay : mock.bodyBatteryDay,
        stressDay: today?.stressDay?.length ? today.stressDay : mock.stressDay,
      })
      setStatus('connected')
    } catch {
      setError('Sessione Garmin scaduta. Effettua di nuovo l’accesso.')
      clearToken()
      setStatus('login')
    } finally {
      setSyncing(false)
    }
  }, [])

  // restore session on load
  useEffect(() => {
    if (getToken()) sync()
  }, [sync])

  const login = useCallback(async (email: string, password: string) => {
    setError(null)
    setStatus('connecting')
    try {
      const { profile } = await api.login(email, password)
      setProfileName(profile.name)
      await sync()
    } catch (e: any) {
      setStatus('login')
      setError(e?.message || 'Accesso non riuscito.')
      clearToken()
      throw e
    }
  }, [sync])

  const logout = useCallback(() => {
    api.logout()
    setLive({})
    setProfileName(null)
    setStatus('login')
  }, [])

  const continueDemo = useCallback(() => setStatus('demo'), [])

  const connected = status === 'connected'
  const value: DataShape = {
    status,
    profileName,
    error,
    syncing,
    user: connected && profileName
      ? { ...mock.user, name: profileName.split(' ')[0], avatar: profileName.slice(0, 2).toUpperCase(), handle: '@' + profileName.split(' ')[0].toLowerCase() }
      : mock.user,
    today: live.today || mock.today,
    sleep: live.sleep || mock.sleep,
    body: live.body || mock.body,
    activities: live.activities || mock.activities,
    bodyBatteryDay: live.bodyBatteryDay || mock.bodyBatteryDay,
    stressDay: live.stressDay || mock.stressDay,
    heartRateDay: live.heartRateDay || mock.heartRateDay,
    login,
    logout,
    continueDemo,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

/** Drop null/0/'' fields so they don't overwrite good demo defaults. */
function stripEmpty<T extends Record<string, any>>(obj: T): Partial<T> {
  const out: Partial<T> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined || v === '' || v === 0) continue
    if (typeof v === 'object' && !Array.isArray(v)) {
      const nested = stripEmpty(v)
      if (Object.keys(nested).length) (out as any)[k] = { ...v, ...nested }
    } else if (Array.isArray(v)) {
      if (v.length) (out as any)[k] = v
    } else {
      (out as any)[k] = v
    }
  }
  return out
}
