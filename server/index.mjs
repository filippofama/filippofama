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
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import pkg from 'garmin-connect'
const { GarminConnect } = pkg

const __dirname = path.dirname(fileURLToPath(import.meta.url))
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

const num = (...vals) => {
  for (const v of vals) if (typeof v === 'number' && !Number.isNaN(v)) return v
  return 0
}
const sec2min = (s) => Math.round((s || 0) / 60)

// ---------------------------------------------------------------- today
// Pulls the full daily picture: activity, heart, stress, Body Battery,
// SpO2, respiration, HRV — everything a Garmin device records each day.
app.get('/api/today', guard, async (req, res) => {
  const { gc, displayName } = req.session
  const date = iso()

  const [steps, hr, hydration, summary, stress, battery, spo2, respiration, hrv] = await Promise.all([
    safe('steps', () => gc.getSteps(new Date()), 0),
    safe('hr', () => gc.getHeartRate(new Date()), null),
    safe('hydration', () => gc.getDailyHydration(new Date()), 0),
    safe('summary', () => gc.get(`/usersummary-service/usersummary/daily/${displayName}?calendarDate=${date}`), {}),
    safe('stress', () => gc.get(`/wellness-service/wellness/dailyStress/${date}`), {}),
    safe('battery', () => gc.get(`/wellness-service/wellness/bodyBattery/reports/daily?startDate=${date}&endDate=${date}`), []),
    safe('spo2', () => gc.get(`/wellness-service/wellness/daily/spo2/${date}`), {}),
    safe('respiration', () => gc.get(`/wellness-service/wellness/daily/respiration/${date}`), {}),
    safe('hrv', () => gc.get(`/hrv-service/hrv/${date}`), {}),
  ])

  const bb = Array.isArray(battery) ? battery[0]?.bodyBatteryValuesArray : null
  const latestBattery = bb?.length ? bb[bb.length - 1]?.[1] : null
  const batteryVals = bb ? bb.map(([, v]) => v).filter((v) => v != null) : []

  res.json({
    steps: { value: num(steps, summary?.totalSteps), goal: num(summary?.dailyStepGoal) || 10000 },
    calories: {
      value: num(summary?.totalKilocalories),
      goal: num(summary?.netCalorieGoal) || 2500,
      active: num(summary?.activeKilocalories),
      resting: num(summary?.bmrKilocalories),
    },
    distanceKm: summary?.totalDistanceMeters ? +(summary.totalDistanceMeters / 1000).toFixed(1) : 0,
    floors: {
      value: num(summary?.floorsAscended),
      goal: num(summary?.userFloorsAscendedGoal) || 10,
      descended: num(summary?.floorsDescended),
    },
    intensityMin: {
      value: num(summary?.moderateIntensityMinutes) + num(summary?.vigorousIntensityMinutes),
      goal: num(summary?.intensityMinutesGoal) || 150,
      weekly: num(summary?.weeklyModerateIntensityMinutes) + num(summary?.weeklyVigorousIntensityMinutes),
      weeklyGoal: num(summary?.intensityMinutesGoal) || 150,
    },
    hydrationMl: { value: Math.round(num(hydration)), goal: 2500, sweatLossMl: num(summary?.sweatLoss) },
    restingHr: num(hr?.restingHeartRate, summary?.restingHeartRate),
    currentHr: num(hr?.lastSevenDaysAvgRestingHeartRate, hr?.restingHeartRate),
    minHr: num(hr?.minHeartRate, summary?.minHeartRate),
    maxHr: num(hr?.maxHeartRate, summary?.maxHeartRate),
    avgHr: num(summary?.averageHeartRate),
    stress: Math.round(num(stress?.avgStressLevel, summary?.averageStressLevel)),
    stressMax: Math.round(num(stress?.maxStressLevel, summary?.maxStressLevel)),
    stressRestMin: sec2min(summary?.restStressDuration),
    stressLowMin: sec2min(summary?.lowStressDuration),
    stressMediumMin: sec2min(summary?.mediumStressDuration),
    stressHighMin: sec2min(summary?.highStressDuration),
    bodyBattery: Math.round(num(latestBattery, summary?.bodyBatteryMostRecentValue)),
    bodyBatteryHigh: Math.round(batteryVals.length ? Math.max(...batteryVals) : num(summary?.bodyBatteryHighestValue)),
    bodyBatteryLow: Math.round(batteryVals.length ? Math.min(...batteryVals) : num(summary?.bodyBatteryLowestValue)),
    bodyBatteryCharged: num(summary?.bodyBatteryChargedValue),
    bodyBatteryDrained: num(summary?.bodyBatteryDrainedValue),
    spo2: num(spo2?.averageSpO2, summary?.averageSpo2, summary?.latestSpo2),
    spo2Low: num(spo2?.lowestSpO2, summary?.lowestSpo2),
    respiration: Math.round(num(respiration?.avgWakingRespirationValue, summary?.avgWakingRespirationValue, summary?.latestRespirationValue)),
    respirationMin: Math.round(num(respiration?.lowestRespirationValue, summary?.lowestRespirationValue)),
    respirationMax: Math.round(num(respiration?.highestRespirationValue, summary?.highestRespirationValue)),
    hrv: num(hrv?.hrvSummary?.lastNightAvg, hrv?.hrvSummary?.weeklyAvg),
    hrvStatus: translateHrv(hrv?.hrvSummary?.status),
    hrvWeeklyAvg: num(hrv?.hrvSummary?.weeklyAvg),
    activeMin: sec2min(summary?.activeSeconds),
    highlyActiveMin: sec2min(summary?.highlyActiveSeconds),
    sedentaryMin: sec2min(summary?.sedentarySeconds),
    bodyBatteryDay: bb ? bb.map(([, v], i) => ({ label: String(i), value: v })) : [],
    stressDay: stress?.stressValuesArray
      ? stress.stressValuesArray.filter(([, v]) => v >= 0).map(([, v], i) => ({ label: String(i), value: v }))
      : [],
  })
})

function translateHrv(s) {
  const map = { BALANCED: 'Bilanciato', UNBALANCED: 'Sbilanciato', LOW: 'Basso', POOR: 'Scarso', GOOD: 'Buono' }
  return map[s] || s || ''
}

// ---------------------------------------------------------------- training
// VO2max, training status & readiness, load, race predictions, endurance.
app.get('/api/training', guard, async (req, res) => {
  const { gc, displayName } = req.session
  const date = iso()

  const [maxmet, status, readiness, race, endurance] = await Promise.all([
    safe('maxmet', () => gc.get(`/metrics-service/metrics/maxmet/latest/${date}`), null),
    safe('trainingstatus', () => gc.get(`/metrics-service/metrics/trainingstatus/aggregated/${date}`), null),
    safe('readiness', () => gc.get(`/metrics-service/metrics/trainingreadiness/${date}`), null),
    safe('race', () => gc.get(`/metrics-service/metrics/racepredictions/latest/${displayName}`), null),
    safe('endurance', () => gc.get(`/metrics-service/metrics/endurancescore?calendarDate=${date}`), null),
  ])

  const mm = Array.isArray(maxmet) ? maxmet[0] : maxmet
  const vo2Run = num(mm?.generic?.vo2MaxPreciseValue, mm?.generic?.vo2MaxValue)
  const vo2Cycle = num(mm?.cycling?.vo2MaxPreciseValue, mm?.cycling?.vo2MaxValue)
  const rd = Array.isArray(readiness) ? readiness[0] : readiness
  const latestStatus = status?.mostRecentTrainingStatus?.latestTrainingStatusData
  const statusKey = latestStatus ? Object.values(latestStatus)[0]?.trainingStatus : null
  const rp = race || {}
  const fmtRace = (s) => (s ? new Date(s * 1000).toISOString().substr(s >= 3600 ? 11 : 14, s >= 3600 ? 8 : 5) : null)
  const loadDto = latestStatus ? Object.values(latestStatus)[0]?.acuteTrainingLoadDTO : null

  res.json({
    vo2maxRunning: vo2Run,
    vo2maxCycling: vo2Cycle,
    vo2max: vo2Run || vo2Cycle,
    fitnessAge: num(mm?.generic?.fitnessAge),
    status: translateStatus(statusKey),
    acuteLoad: Math.round(num(loadDto?.acwrCurrent, loadDto?.dailyTrainingLoadAcute)),
    chronicLoad: Math.round(num(loadDto?.dailyTrainingLoadChronic)),
    loadRatio: +num(loadDto?.dailyAcuteChronicWorkloadRatio).toFixed(2) || 0,
    readiness: num(rd?.score),
    readinessLevel: translateReadiness(rd?.level),
    readinessFactors: rd
      ? [
          { name: 'Sonno', value: num(rd.sleepScore), color: '#9b8cff' },
          { name: 'Recupero HRV', value: num(rd.hrvFactorPercent), color: '#3ee6d0' },
          { name: 'Carico acuto', value: num(rd.acuteLoadFactorPercent), color: '#ffc15e' },
          { name: 'Stress', value: num(rd.stressHistoryFactorPercent), color: '#56b0ff' },
        ].filter((f) => f.value)
      : [],
    enduranceScore: num(endurance?.overallScore, endurance?.enduranceScore),
    racePredictor: [
      { dist: '5K', time: fmtRace(rp.time5K) },
      { dist: '10K', time: fmtRace(rp.time10K) },
      { dist: 'Mezza', time: fmtRace(rp.timeHalfMarathon) },
      { dist: 'Maratona', time: fmtRace(rp.timeMarathon) },
    ].filter((r) => r.time),
  })
})

function translateStatus(s) {
  const map = {
    PRODUCTIVE: 'Produttivo', MAINTAINING: 'Mantenimento', RECOVERY: 'Recupero',
    UNPRODUCTIVE: 'Improduttivo', DETRAINING: 'Detraining', OVERREACHING: 'Sovraccarico',
    PEAKING: 'Picco di forma', NO_STATUS: 'Nessuno stato',
  }
  return map[s] || 'Produttivo'
}
function translateReadiness(s) {
  const map = { READY: 'Alta', LOW: 'Bassa', MODERATE: 'Moderata', HIGH: 'Alta', PRIME: 'Ottimale' }
  return map[s] || s || ''
}

// ---------------------------------------------------------------- records
app.get('/api/records', guard, async (req, res) => {
  const { gc, displayName } = req.session
  const prs = await safe('records', () => gc.get(`/personalrecord-service/personalrecord/prs/${displayName}`), [])
  const labels = {
    1: '1 km', 2: '1 miglio', 3: '5 km', 4: '10 km', 7: 'Mezza maratona', 8: 'Maratona',
    9: 'Salita più lunga', 12: 'Passi (giorno)', 13: 'Distanza più lunga',
  }
  const out = (Array.isArray(prs) ? prs : [])
    .map((p) => {
      const id = p.typeId
      const v = p.value
      const isTime = [1, 2, 3, 4, 7, 8].includes(id)
      return {
        dist: labels[id] || `Record ${id}`,
        time: isTime ? secsToClock(v) : id === 12 ? `${Math.round(v).toLocaleString()} passi` : `${(v / 1000).toFixed(2)} km`,
        date: p.prStartTimeGmtFormatted ? new Date(p.prStartTimeGmtFormatted).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
      }
    })
  res.json(out)
})

function secsToClock(s) {
  if (!s) return '--'
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = Math.round(s % 60)
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}` : `${m}:${String(sec).padStart(2, '0')}`
}

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
    hrv: num(data?.avgOvernightHrv, d.avgOvernightHrv),
    restingHr: num(data?.restingHeartRate, d.restingHeartRate),
    spo2Avg: num(data?.wellnessEpochSPO2DataDTOList?.[0]?.averageSPO2, d.averageSpO2Value),
    respirationAvg: Math.round(num(data?.avgRespirationValue, d.averageRespirationValue)),
    restlessness: d.restlessMomentsCount != null ? (d.restlessMomentsCount < 10 ? 'Bassa' : d.restlessMomentsCount < 25 ? 'Media' : 'Alta') : '',
    sleepNeedH: d.sleepNeed?.actual ? +(d.sleepNeed.actual / 60).toFixed(1) : 0,
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
    bodyWater: w?.bodyWater ? +w.bodyWater.toFixed(1) : 0,
    boneMassKg: w?.boneMass ? +(w.boneMass / 1000).toFixed(1) : 0,
    muscleKg: w?.muscleMass ? +(w.muscleMass / 1000).toFixed(1) : 0,
    visceralFat: num(w?.visceralFat),
    metabolicAge: num(w?.metabolicAge),
    physiqueRating: num(w?.physiqueRating),
    hydration: Math.min(100, Math.round((num(hydration) / 2500) * 100)),
  })
})

app.post('/api/logout', guard, (req, res) => {
  sessions.delete((req.headers.authorization || '').replace('Bearer ', ''))
  res.json({ ok: true })
})

app.get('/api/health-check', (_req, res) => res.json({ ok: true, sessions: sessions.size }))

// Serve the built UI so the desktop app (Electron) runs everything from a
// single local origin — no browser, no separate static host. Skipped in dev,
// where Vite serves the UI with hot reload.
const distDir = path.join(__dirname, '..', 'dist')
const indexHtml = path.join(distDir, 'index.html')
if (fs.existsSync(indexHtml)) {
  app.use(express.static(distDir))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next()
    res.sendFile(indexHtml)
  })
}

app.listen(PORT, () => console.log(`\n  Auralis · in ascolto su http://localhost:${PORT}\n`))
