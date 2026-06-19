// Realistic mock data powering the Auralis experience.
// Everything here mirrors the metrics a Garmin device would surface — only nicer.

export const user = {
  name: 'Filippo',
  handle: '@filippo',
  avatar: 'FF',
  device: 'Auralis Vértex Pro',
  level: 24,
  streak: 47,
  joined: 'Mar 2023',
}

export type TrendPoint = { label: string; value: number }

const days = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']

export const today = {
  steps: { value: 12847, goal: 12000 },
  calories: { value: 2436, goal: 2800, active: 842 },
  distanceKm: 9.2,
  floors: { value: 18, goal: 12 },
  intensityMin: { value: 64, goal: 150 },
  hydrationMl: { value: 1850, goal: 2500 },
  restingHr: 48,
  currentHr: 62,
  stress: 27, // 0-100
  bodyBattery: 78, // 0-100
  spo2: 97,
  respiration: 14,
  vo2max: 54,
}

export const bodyBatteryDay: TrendPoint[] = [
  { label: '00', value: 42 }, { label: '02', value: 58 }, { label: '04', value: 74 },
  { label: '06', value: 92 }, { label: '08', value: 88 }, { label: '10', value: 79 },
  { label: '12', value: 71 }, { label: '14', value: 64 }, { label: '16', value: 58 },
  { label: '18', value: 66 }, { label: '20', value: 74 }, { label: '22', value: 78 },
]

export const stressDay: TrendPoint[] = [
  { label: '00', value: 12 }, { label: '02', value: 8 }, { label: '04', value: 6 },
  { label: '06', value: 22 }, { label: '08', value: 48 }, { label: '10', value: 41 },
  { label: '12', value: 34 }, { label: '14', value: 52 }, { label: '16', value: 38 },
  { label: '18', value: 24 }, { label: '20', value: 18 }, { label: '22', value: 14 },
]

export const heartRateDay: TrendPoint[] = Array.from({ length: 24 }, (_, h) => ({
  label: String(h).padStart(2, '0'),
  value: Math.round(52 + 28 * Math.sin((h - 7) / 3.5) + (h > 16 && h < 19 ? 70 : 0) + Math.random() * 8),
}))

export const stepsWeek: TrendPoint[] = days.map((d, i) => ({
  label: d,
  value: [9800, 13200, 7400, 15600, 11200, 18400, 12847][i],
}))

export const sleep = {
  score: 86,
  durationH: 7.8,
  bedtime: '23:42',
  wake: '07:31',
  stages: [
    { name: 'Profondo', minutes: 96, color: '#56b0ff' },
    { name: 'Leggero', minutes: 234, color: '#9b8cff' },
    { name: 'REM', minutes: 114, color: '#3ee6d0' },
    { name: 'Sveglio', minutes: 24, color: '#ff7a8a' },
  ],
  hrv: 68,
  restingHr: 46,
  weekScores: days.map((d, i) => ({ label: d, value: [72, 80, 68, 88, 79, 91, 86][i] })),
}

export type Activity = {
  id: string
  type: 'Corsa' | 'Ciclismo' | 'Nuoto' | 'Forza' | 'Trail' | 'Yoga'
  title: string
  date: string
  durationMin: number
  distanceKm?: number
  avgPace?: string
  avgHr: number
  calories: number
  elevationM?: number
  trainingEffect: number
  splits?: { km: number; pace: string; hr: number }[]
  hrSeries?: number[]
  paceSeries?: number[]
  elevationSeries?: number[]
}

export const activities: Activity[] = [
  {
    id: 'a1',
    type: 'Corsa',
    title: 'Corsa mattutina sul lungofiume',
    date: '2026-06-19T07:12:00',
    durationMin: 52,
    distanceKm: 10.4,
    avgPace: "5:01",
    avgHr: 156,
    calories: 742,
    elevationM: 84,
    trainingEffect: 3.6,
    splits: Array.from({ length: 10 }, (_, i) => ({
      km: i + 1,
      pace: ['5:12', '5:04', '4:58', '5:01', '4:55', '5:08', '4:52', '5:03', '4:49', '4:44'][i],
      hr: [142, 150, 154, 156, 158, 155, 160, 159, 163, 168][i],
    })),
    hrSeries: Array.from({ length: 52 }, (_, i) => Math.round(130 + 35 * Math.sin(i / 8) + i / 3 + Math.random() * 6)),
    paceSeries: Array.from({ length: 52 }, () => 4.7 + Math.random() * 0.8),
    elevationSeries: Array.from({ length: 52 }, (_, i) => 20 + 30 * Math.sin(i / 10) + 15 * Math.sin(i / 3)),
  },
  {
    id: 'a2',
    type: 'Ciclismo',
    title: 'Giro collinare al tramonto',
    date: '2026-06-17T18:30:00',
    durationMin: 98,
    distanceKm: 42.6,
    avgPace: '2:18',
    avgHr: 138,
    calories: 1180,
    elevationM: 612,
    trainingEffect: 4.1,
    hrSeries: Array.from({ length: 98 }, (_, i) => Math.round(120 + 30 * Math.sin(i / 12) + Math.random() * 8)),
    elevationSeries: Array.from({ length: 98 }, (_, i) => 100 + 200 * Math.sin(i / 20) + 80 * Math.sin(i / 6)),
  },
  {
    id: 'a3',
    type: 'Forza',
    title: 'Upper body & core',
    date: '2026-06-16T19:05:00',
    durationMin: 48,
    avgHr: 118,
    calories: 386,
    trainingEffect: 2.4,
    hrSeries: Array.from({ length: 48 }, () => Math.round(100 + 40 * Math.random())),
  },
  {
    id: 'a4',
    type: 'Nuoto',
    title: 'Vasche in piscina',
    date: '2026-06-14T08:00:00',
    durationMin: 40,
    distanceKm: 1.8,
    avgPace: '1:52',
    avgHr: 132,
    calories: 512,
    trainingEffect: 3.0,
    hrSeries: Array.from({ length: 40 }, (_, i) => Math.round(125 + 15 * Math.sin(i / 5) + Math.random() * 6)),
  },
  {
    id: 'a5',
    type: 'Trail',
    title: 'Trail del Monte Sereno',
    date: '2026-06-12T09:20:00',
    durationMin: 134,
    distanceKm: 16.2,
    avgPace: '6:34',
    avgHr: 148,
    calories: 1420,
    elevationM: 940,
    trainingEffect: 4.6,
    elevationSeries: Array.from({ length: 134 }, (_, i) => 300 + 500 * Math.sin(i / 28) + 120 * Math.sin(i / 8)),
    hrSeries: Array.from({ length: 134 }, (_, i) => Math.round(135 + 25 * Math.sin(i / 15) + Math.random() * 8)),
  },
]

export const training = {
  status: 'Produttivo',
  statusColor: '#a6e85a',
  load7d: 642,
  loadOptimalLow: 480,
  loadOptimalHigh: 920,
  vo2max: 54,
  vo2trend: '+2 in 90 giorni',
  acuteLoad: 642,
  chronicLoad: 588,
  recoveryH: 18,
  racePredictor: [
    { dist: '5K', time: '21:14' },
    { dist: '10K', time: '44:02' },
    { dist: 'Mezza', time: '1:37:40' },
    { dist: 'Maratona', time: '3:24:18' },
  ],
  loadWeeks: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'].map((w, i) => ({
    label: w,
    value: [520, 610, 470, 720, 588, 642][i],
  })),
}

export const workouts = [
  { id: 'w1', name: 'Soglia 4×8 min', type: 'Corsa', focus: 'Soglia', durationMin: 56, intensity: 'Alta', color: '#ff7a8a' },
  { id: 'w2', name: 'Lungo lento Z2', type: 'Corsa', focus: 'Resistenza', durationMin: 90, intensity: 'Bassa', color: '#56b0ff' },
  { id: 'w3', name: 'VO2max 6×3 min', type: 'Corsa', focus: 'VO2max', durationMin: 48, intensity: 'Massima', color: '#9b8cff' },
  { id: 'w4', name: 'Forza funzionale', type: 'Forza', focus: 'Potenza', durationMin: 45, intensity: 'Media', color: '#ffc15e' },
  { id: 'w5', name: 'Recupero + mobilità', type: 'Yoga', focus: 'Recupero', durationMin: 30, intensity: 'Bassa', color: '#3ee6d0' },
]

export const challenges = [
  { id: 'c1', title: 'Giugno in movimento', goal: '300 km', progress: 0.62, participants: 8420, days: 11, color: '#3ee6d0' },
  { id: 'c2', title: 'Sfida 10K passi', goal: '30 giorni', progress: 0.78, participants: 21300, days: 7, color: '#56b0ff' },
  { id: 'c3', title: 'Scalatori d\'Italia', goal: '5000 m D+', progress: 0.41, participants: 3120, days: 19, color: '#9b8cff' },
]

export const badges = [
  { id: 'b1', name: 'Maratoneta', icon: '🏅', earned: true },
  { id: 'b2', name: 'Alba runner', icon: '🌅', earned: true },
  { id: 'b3', name: '100 km club', icon: '💯', earned: true },
  { id: 'b4', name: 'Scalatore', icon: '⛰️', earned: true },
  { id: 'b5', name: 'Notturno', icon: '🌙', earned: false },
  { id: 'b6', name: 'Ferreo', icon: '🔥', earned: false },
]

export const records = [
  { dist: '1 km', time: '3:48', date: '12 mag 2026' },
  { dist: '5 km', time: '20:42', date: '03 giu 2026' },
  { dist: '10 km', time: '43:18', date: '28 mag 2026' },
  { dist: 'Mezza maratona', time: '1:36:05', date: '14 apr 2026' },
  { dist: 'Salita più lunga', time: '940 m D+', date: '12 giu 2026' },
  { dist: 'Giornata record', time: '24.310 passi', date: '07 giu 2026' },
]

export const body = {
  weightKg: 71.4,
  goalKg: 70,
  bmi: 22.1,
  bodyFat: 14.8,
  muscleKg: 33.2,
  hydration: 58,
  weightTrend: ['1', '2', '3', '4', '5', '6', '7', '8'].map((w, i) => ({
    label: 'S' + w,
    value: [73.8, 73.2, 72.9, 72.4, 72.0, 71.8, 71.6, 71.4][i],
  })),
}

export const feed = [
  { id: 'f1', user: 'Giulia M.', avatar: 'GM', action: 'ha completato una corsa di 14 km', time: '2 h fa', kudos: 24, type: 'Corsa' },
  { id: 'f2', user: 'Marco T.', avatar: 'MT', action: 'ha battuto il suo record sui 10K', time: '5 h fa', kudos: 58, type: 'Record' },
  { id: 'f3', user: 'Sara L.', avatar: 'SL', action: 'ha guadagnato il badge "Scalatore"', time: 'ieri', kudos: 41, type: 'Badge' },
  { id: 'f4', user: 'Luca R.', avatar: 'LR', action: 'ha pedalato 68 km in montagna', time: 'ieri', kudos: 33, type: 'Ciclismo' },
]

export const insights = [
  {
    id: 'i1',
    title: 'Sei pronto per una sessione intensa',
    body: 'Body Battery a 78% e HRV in salita: il tuo corpo è recuperato. Buon momento per la sessione di soglia.',
    tone: 'positive',
  },
  {
    id: 'i2',
    title: 'Idratazione sotto target',
    body: 'Sei al 74% dell\'obiettivo. Bevi ~650 ml nelle prossime ore per restare in zona ottimale.',
    tone: 'warn',
  },
  {
    id: 'i3',
    title: 'Sonno costante questa settimana',
    body: 'Media 7h 42m con punteggio 84. La regolarità sta migliorando il tuo recupero notturno.',
    tone: 'neutral',
  },
]
