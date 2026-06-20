import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Bike,
  ChevronLeft,
  Clock,
  Dumbbell,
  Flame,
  Footprints,
  Heart,
  Mountain,
  Plus,
  Timer,
  TrendingUp,
  Waves,
} from 'lucide-react'
import { Glass, GlassButton } from '../components/Glass'
import { SeriesArea } from '../components/Charts'
import { PageHeader, Stagger, staggerItem } from '../components/ui'
import { useData } from '../context/DataContext'
import { type Activity } from '../data/mock'

const typeIcon: Record<Activity['type'], typeof Bike> = {
  Corsa: Footprints,
  Ciclismo: Bike,
  Nuoto: Waves,
  Forza: Dumbbell,
  Trail: Mountain,
  Yoga: TrendingUp,
}

const typeColor: Record<Activity['type'], string> = {
  Corsa: '#3ee6d0',
  Ciclismo: '#56b0ff',
  Nuoto: '#9b8cff',
  Forza: '#ffc15e',
  Trail: '#a6e85a',
  Yoga: '#ff7a8a',
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

export function Activities() {
  const { activities } = useData()
  return (
    <div>
      <PageHeader
        title="Attività"
        subtitle="Ogni movimento, raccontato nei dettagli"
        action={<GlassButton className="flex items-center gap-2"><Plus size={16} /> Registra</GlassButton>}
      />

      {/* Summary strip */}
      <div className="mb-5 grid grid-cols-3 gap-4">
        <Glass className="p-4 text-center"><p className="text-2xl font-bold tabular-nums">{activities.length}</p><p className="text-xs text-white/45">attività</p></Glass>
        <Glass className="p-4 text-center"><p className="text-2xl font-bold tabular-nums">{activities.reduce((a, b) => a + (b.distanceKm ?? 0), 0).toFixed(1)}</p><p className="text-xs text-white/45">km totali</p></Glass>
        <Glass className="p-4 text-center"><p className="text-2xl font-bold tabular-nums">{(activities.reduce((a, b) => a + b.calories, 0) / 1000).toFixed(1)}k</p><p className="text-xs text-white/45">kcal</p></Glass>
      </div>

      <Stagger className="space-y-3">
        {activities.map((a) => {
          const Icon = typeIcon[a.type]
          const color = typeColor[a.type]
          return (
            <motion.div key={a.id} variants={staggerItem}>
              <Link to={`/activities/${a.id}`}>
                <Glass
                  whileHover={{ scale: 1.012, y: -2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  className="flex items-center gap-4 p-4"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl" style={{ background: `${color}22` }}>
                    <Icon size={22} style={{ color }} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{a.title}</p>
                    <p className="text-xs text-white/45">{fmtDate(a.date)}</p>
                  </div>
                  <div className="hidden gap-6 sm:flex">
                    {a.distanceKm && <Stat label="Distanza" value={`${a.distanceKm} km`} />}
                    <Stat label="Durata" value={`${a.durationMin} min`} />
                    <Stat label="FC media" value={`${a.avgHr} bpm`} />
                  </div>
                  <div className="text-right sm:hidden">
                    <p className="text-sm font-semibold">{a.distanceKm ? `${a.distanceKm} km` : `${a.durationMin} min`}</p>
                    <p className="text-xs text-white/45">{a.calories} kcal</p>
                  </div>
                </Glass>
              </Link>
            </motion.div>
          )
        })}
      </Stagger>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-right">
      <p className="text-sm font-semibold tabular-nums">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-white/35">{label}</p>
    </div>
  )
}

export function ActivityDetail() {
  const { id } = useParams()
  const { activities } = useData()
  const a = activities.find((x) => x.id === id)
  if (!a) return <div className="p-8 text-center text-white/50">Attività non trovata.</div>
  const Icon = typeIcon[a.type]
  const color = typeColor[a.type]

  return (
    <div>
      <Link to="/activities" className="mb-4 inline-flex items-center gap-1 text-sm text-white/55 hover:text-white">
        <ChevronLeft size={18} /> Attività
      </Link>

      {/* Hero with faux route map */}
      <Glass strong className="relative mb-4 overflow-hidden p-0">
        <div className="relative h-52 w-full overflow-hidden sm:h-64">
          <RouteMap color={color} />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-xs backdrop-blur-md" style={{ color }}>
              <Icon size={14} /> {a.type}
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{a.title}</h1>
            <p className="mt-1 text-sm text-white/55">{fmtDate(a.date)}</p>
          </div>
        </div>
      </Glass>

      {/* Big stats */}
      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {a.distanceKm && <BigStat icon={Footprints} color="#3ee6d0" label="Distanza" value={`${a.distanceKm}`} unit="km" />}
        <BigStat icon={Clock} color="#56b0ff" label="Durata" value={`${a.durationMin}`} unit="min" />
        {a.avgPace && <BigStat icon={Timer} color="#9b8cff" label="Passo medio" value={a.avgPace} unit="/km" />}
        <BigStat icon={Heart} color="#ff7a8a" label="FC media" value={`${a.avgHr}`} unit="bpm" />
        <BigStat icon={Flame} color="#ffc15e" label="Calorie" value={`${a.calories}`} unit="kcal" />
        {a.elevationM && <BigStat icon={Mountain} color="#a6e85a" label="Dislivello" value={`${a.elevationM}`} unit="m" />}
        <BigStat icon={TrendingUp} color="#3ee6d0" label="Training Effect" value={`${a.trainingEffect}`} unit="/5" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        {a.hrSeries && (
          <Glass className="col-span-12 p-5 lg:col-span-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80"><Heart size={16} className="text-glow-coral" /> Frequenza cardiaca</h3>
            <SeriesArea data={a.hrSeries} color="#ff7a8a" height={180} />
            <HrZones avg={a.avgHr} />
          </Glass>
        )}
        {a.elevationSeries && (
          <Glass className="col-span-12 p-5 lg:col-span-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80"><Mountain size={16} className="text-glow-lime" /> Altimetria</h3>
            <SeriesArea data={a.elevationSeries} color="#a6e85a" height={180} />
          </Glass>
        )}

        {a.splits && (
          <Glass className="col-span-12 p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/80"><Timer size={16} className="text-glow-violet" /> Frazioni al km</h3>
            <div className="space-y-2">
              {a.splits.map((s) => {
                const paces = a.splits!.map((x) => paceToSec(x.pace))
                const min = Math.min(...paces), max = Math.max(...paces)
                const w = max === min ? 1 : 1 - (paceToSec(s.pace) - min) / (max - min)
                return (
                  <div key={s.km} className="flex items-center gap-3">
                    <span className="w-6 text-sm font-medium text-white/50">{s.km}</span>
                    <div className="h-7 flex-1 overflow-hidden rounded-lg bg-white/5">
                      <motion.div
                        className="flex h-full items-center justify-end rounded-lg bg-gradient-to-r from-glow-violet/40 to-glow-aqua/70 pr-2"
                        initial={{ width: 0 }}
                        animate={{ width: `${30 + w * 70}%` }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: s.km * 0.04 }}
                      >
                        <span className="text-xs font-semibold">{s.pace}</span>
                      </motion.div>
                    </div>
                    <span className="w-16 text-right text-xs text-white/45">{s.hr} bpm</span>
                  </div>
                )
              })}
            </div>
          </Glass>
        )}
      </div>
    </div>
  )
}

function paceToSec(p: string) {
  const [m, s] = p.split(':').map(Number)
  return m * 60 + s
}

function BigStat({ icon: Icon, color, label, value, unit }: { icon: typeof Heart; color: string; label: string; value: string; unit: string }) {
  return (
    <Glass className="p-4">
      <Icon size={16} style={{ color }} className="mb-2" />
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold tabular-nums">{value}</span>
        <span className="text-xs text-white/40">{unit}</span>
      </div>
      <p className="mt-0.5 text-[11px] uppercase tracking-wider text-white/35">{label}</p>
    </Glass>
  )
}

function HrZones({ avg }: { avg: number }) {
  const zones = [
    { name: 'Z1', color: '#56b0ff', pct: 12 },
    { name: 'Z2', color: '#3ee6d0', pct: 28 },
    { name: 'Z3', color: '#a6e85a', pct: 34 },
    { name: 'Z4', color: '#ffc15e', pct: 20 },
    { name: 'Z5', color: '#ff7a8a', pct: 6 },
  ]
  return (
    <div className="mt-4">
      <div className="flex h-2.5 overflow-hidden rounded-full">
        {zones.map((z) => <div key={z.name} style={{ flex: z.pct, background: z.color }} />)}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-white/40">
        {zones.map((z) => <span key={z.name}>{z.name} · {z.pct}%</span>)}
      </div>
    </div>
  )
}

/** A stylised SVG route line — evokes a GPS track without a real map tile. */
function RouteMap({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 400 260" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="map-bg" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#16213a" />
          <stop offset="100%" stopColor="#0a0e1a" />
        </radialGradient>
      </defs>
      <rect width="400" height="260" fill="url(#map-bg)" />
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={'h' + i} x1="0" y1={i * 32} x2="400" y2={i * 32} stroke="rgba(255,255,255,0.04)" />
      ))}
      {Array.from({ length: 13 }).map((_, i) => (
        <line key={'v' + i} x1={i * 32} y1="0" x2={i * 32} y2="260" stroke="rgba(255,255,255,0.04)" />
      ))}
      <motion.path
        d="M40 200 C 90 120, 130 220, 180 150 S 280 60, 320 120 S 370 180, 360 90"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />
      <circle cx="40" cy="200" r="6" fill="#fff" />
      <circle cx="360" cy="90" r="6" fill={color} />
    </svg>
  )
}
