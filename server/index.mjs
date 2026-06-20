// Auralis backend — bridges the app to a real Garmin Connect account.
//
// Garmin has no public consumer OAuth, so we authenticate with the user's
// own credentials via the `garmin-connect` library (it emulates Garmin's
// official SSO flow). Credentials are used once to obtain OAuth tokens and
// are never stored; only the resulting session lives in memory, keyed by a
// random bearer token handed back to the client.
import express from 'express'
import cors from 'cors'
import crypto from 'node:crypto'
import pkg from 'garmin-connect'
const { GarminConnect } = pkg

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 8787

/** token -> { gc, profile, displayName, createdAt } */
const sessions = new Map()

// Drop sessions older than 12h so memory doesn't grow unbounded.
const TTL = 12 * 60 * 60 * 1000
setInterval(() => {
  const now = Date.now()
  for (const [t, s] of sessions) if (now - s.createdAt > TTL) sessions.delete(t)
}, 30 * 60 * 1000).unref?.()

const iso = (d = new Date()) => d.toISOString().slice(0, 10)
const auth = (req) => sessions.get((req.headers.authorization || '').replace('Bearer ', ''))

/** Run a fetch, but never let one missing metric break the whole response. */
async function safe(label, fn, fallback = null) {
  try {
    return await fn()
  } catch (e) {
    console.warn(`[garmin] ${label} failed: ${e?.message || e}`)
    return fallback
  }
}

// ---------------------------------------------------------------- login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'Email e password richieste.' })

  try {
    const gc = new GarminConnect({ username: email, password })
    await gc.login()
    const profile = await safe('profile', () => gc.getUserProfile(), {})
    const displayName = profile?.displayName || profile?.profileId || email
    const token = crypto.randomBytes(24).toString('hex')
    sessions.set(token, { gc, profile, displayName, createdAt: Date.now() })

    res.json({
      token,
      profile: {
        name: profile?.displayName || profile?.fullName || email.split('@')[0],
        fullName: profile?.fullName || '',
        avatar: (profile?.fullName || email).slice(0, 2).toUpperCase(),
        location: profile?.location || '',
      },
    })
  } catch (e) {
    const msg = String(e?.message || e)
    if (/\bmfa\b|two[- ]?factor|2fa|verification code/i.test(msg)) {
      return res.status(401).json({ error: 'Account con verifica a due fattori: non ancora supportato dal login diretto.', mfa: true })
    }
    if (/\b401\b|invalid|credential|wrong\s*password|unauthor/i.test(msg)) {
      return res.status(401).json({ error: 'Credenziali Garmin non valide. Controlla email e password.' })
    }
    res.status(502).json({ error: 'Login a Garmin non riuscito. Riprova tra poco.', detail: msg })
  }
})

const guard = (req, res, next) => {
  const s = auth(req)
  if (!s) return res.status(401).json({ error: 'Sessione scaduta. Effettua di nuovo l’accesso.' })
  req.session = s
  next()
}

// ---------------------------------------------------------------- today
app.get('/api/today', guard, async (req, res) => {
  const { gc, displayName } = req.session
  const date = iso()

  const steps = await safe('steps', () => gc.getSteps(new Date()), 0)
  const hr = await safe('hr', () => gc.getHeartRate(new Date()), null)
  const hydration = await safe('hydration', () => gc.getDailyHydration(new Date()), 0)
  const summary = await safe('summary', () =>
    gc.get(`/usersummary-service/usersummary/daily/${displayName}?calendarDate=${date}`), {})
  const stress = await safe('stress', () =>
    gc.get(`/wellness-service/wellness/dailyStress/${date}`), {})
  const battery = await safe('battery', () =>
    gc.get(`/wellness-service/wellness/bodyBattery/reports/daily?startDate=${date}&endDate=${date}`), [])

  const bb = Array.isArray(battery) ? battery[0]?.bodyBatteryValuesArray : null
  const latestBattery = bb?.length ? bb[bb.length - 1]?.[1] : null

  res.json({
    steps: { value: steps || summary?.totalSteps || 0, goal: summary?.dailyStepGoal || 10000 },
    calories: {
      value: summary?.totalKilocalories || 0,
      goal: summary?.netCalorieGoal || 2500,
      active: summary?.activeKilocalories || 0,
    },
    distanceKm: summary?.totalDistanceMeters ? +(summary.totalDistanceMeters / 1000).toFixed(1) : 0,
    floors: { value: summary?.floorsAscended || 0, goal: summary?.userFloorsAscendedGoal || 10 },
    intensityMin: {
      value: (summary?.moderateIntensityMinutes || 0) + (summary?.vigorousIntensityMinutes || 0),
      goal: summary?.intensityMinutesGoal || 150,
    },
    hydrationMl: { value: Math.round(hydration || 0), goal: 2500 },
    restingHr: hr?.restingHeartRate || summary?.restingHeartRate || 0,
    currentHr: hr?.lastSevenDaysAvgRestingHeartRate || hr?.restingHeartRate || 0,
    stress: Math.round(stress?.avgStressLevel ?? summary?.averageStressLevel ?? 0),
    bodyBattery: Math.round(latestBattery ?? summary?.bodyBatteryMostRecentValue ?? 0),
    spo2: summary?.averageSpo2 || summary?.latestSpo2 || 0,
    respiration: Math.round(summary?.avgWakingRespirationValue || summary?.latestRespirationValue || 0),
    vo2max: 0,
    bodyBatteryDay: bb ? bb.map(([ts, v], i) => ({ label: String(i), value: v })) : [],
    stressDay: stress?.stressValuesArray
      ? stress.stressValuesArray.filter(([, v]) => v >= 0).map(([, v], i) => ({ label: String(i), value: v }))
      : [],
  })
})

// ---------------------------------------------------------------- activities
const mapActivity = (a) => ({
  id: String(a.activityId),
  type: a.activityType?.typeKey || 'other',
  title: a.activityName || 'Attività',
  date: a.startTimeLocal || a.startTimeGMT,
  durationMin: a.duration ? Math.round(a.duration / 60) : 0,
  distanceKm: a.distance ? +(a.distance / 1000).toFixed(2) : undefined,
  avgPace: a.averageSpeed ? paceFromSpeed(a.averageSpeed) : undefined,
  avgHr: Math.round(a.averageHR || 0),
  calories: Math.round(a.calories || 0),
  elevationM: a.elevationGain ? Math.round(a.elevationGain) : undefined,
  trainingEffect: +(a.aerobicTrainingEffect || 0).toFixed(1),
})

function paceFromSpeed(mps) {
  if (!mps) return undefined
  const secPerKm = 1000 / mps
  const m = Math.floor(secPerKm / 60)
  const s = Math.round(secPerKm % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

app.get('/api/activities', guard, async (req, res) => {
  const { gc } = req.session
  const list = await safe('activities', () => gc.getActivities(0, 20), [])
  res.json((list || []).map(mapActivity))
})

// ---------------------------------------------------------------- sleep
app.get('/api/sleep', guard, async (req, res) => {
  const { gc } = req.session
  const data = await safe('sleep', () => gc.getSleepData(new Date()), null)
  const d = data?.dailySleepDTO || {}
  const min = (s) => Math.round((s || 0) / 60)
  res.json({
    score: d.sleepScores?.overall?.value || 0,
    durationH: d.sleepTimeSeconds ? +(d.sleepTimeSeconds / 3600).toFixed(1) : 0,
    bedtime: fmtTime(d.sleepStartTimestampLocal),
    wake: fmtTime(d.sleepEndTimestampLocal),
    stages: [
      { name: 'Profondo', minutes: min(d.deepSleepSeconds), color: '#56b0ff' },
      { name: 'Leggero', minutes: min(d.lightSleepSeconds), color: '#9b8cff' },
      { name: 'REM', minutes: min(d.remSleepSeconds), color: '#3ee6d0' },
      { name: 'Sveglio', minutes: min(d.awakeSleepSeconds), color: '#ff7a8a' },
    ],
    hrv: data?.avgOvernightHrv || 0,
    restingHr: data?.restingHeartRate || 0,
  })
})

function fmtTime(ts) {
  if (!ts) return '--:--'
  return new Date(ts).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
}

// ---------------------------------------------------------------- body
app.get('/api/body', guard, async (req, res) => {
  const { gc } = req.session
  const w = await safe('weight', () => gc.getDailyWeightData(new Date()), null)
  const hydration = await safe('hydration', () => gc.getDailyHydration(new Date()), 0)
  res.json({
    weightKg: w?.weight ? +(w.weight / 1000).toFixed(1) : 0,
    bmi: w?.bmi ? +w.bmi.toFixed(1) : 0,
    bodyFat: w?.bodyFat ? +w.bodyFat.toFixed(1) : 0,
    muscleKg: w?.muscleMass ? +(w.muscleMass / 1000).toFixed(1) : 0,
    hydration: Math.min(100, Math.round(((hydration || 0) / 2500) * 100)),
  })
})

app.post('/api/logout', guard, (req, res) => {
  sessions.delete((req.headers.authorization || '').replace('Bearer ', ''))
  res.json({ ok: true })
})

app.get('/api/health-check', (_req, res) => res.json({ ok: true, sessions: sessions.size }))

app.listen(PORT, () => console.log(`\n  Auralis · Garmin bridge in ascolto su http://localhost:${PORT}\n`))
