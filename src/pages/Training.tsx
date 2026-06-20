import { Activity, Dumbbell, Gauge as GaugeIcon, HeartPulse, Mountain, Play, Timer, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { Glass, GlassButton } from '../components/Glass'
import { Bars } from '../components/Charts'
import { Gauge } from '../components/ProgressRing'
import { PageHeader, Stagger, staggerItem } from '../components/ui'
import { workouts } from '../data/mock'
import { useData } from '../context/DataContext'

export function Training() {
  const { training } = useData()
  const loadPct = (training.load7d - training.loadOptimalLow) / (training.loadOptimalHigh - training.loadOptimalLow)
  const focus = training.loadFocus

  return (
    <div>
      <PageHeader title="Allenamento" subtitle="Forma fisica, carico e prontezza" />

      <div className="grid grid-cols-12 gap-4">
        {/* Training status */}
        <Glass strong className="col-span-12 overflow-hidden p-6 lg:col-span-5">
          <p className="text-sm text-white/55">Stato di allenamento</p>
          <div className="mt-1 flex items-center gap-3">
            <h2 className="text-3xl font-extrabold" style={{ color: training.statusColor }}>{training.status}</h2>
            <TrendingUp style={{ color: training.statusColor }} />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            Il tuo VO₂max sta crescendo e il carico è ben bilanciato. Sei in una fase produttiva: mantieni questa progressione.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <Stat label="VO₂max corsa" value={training.vo2maxRunning || training.vo2max} accent="#a6e85a" />
            <Stat label="VO₂max bici" value={training.vo2maxCycling} accent="#56b0ff" />
            <Stat label="Età fitness" value={training.fitnessAge} accent="#9b8cff" />
          </div>
        </Glass>

        {/* Training readiness */}
        <Glass className="col-span-12 p-6 sm:col-span-6 lg:col-span-3">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80"><HeartPulse size={16} className="text-glow-coral" /> Prontezza</h3>
          <div className="flex justify-center"><Gauge value={training.readiness} color="#3ee6d0" size={120} label={training.readinessLevel} /></div>
          <div className="mt-3 space-y-1.5">
            {training.readinessFactors.map((f) => (
              <div key={f.name} className="flex items-center gap-2">
                <span className="w-24 text-[11px] text-white/45">{f.name}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/8">
                  <motion.div className="h-full rounded-full" style={{ background: f.color }} initial={{ width: 0 }} animate={{ width: `${f.value}%` }} transition={{ duration: 0.9 }} />
                </div>
              </div>
            ))}
          </div>
        </Glass>

        {/* Load gauge */}
        <Glass className="col-span-12 p-6 sm:col-span-6 lg:col-span-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80"><Activity size={16} className="text-glow-aqua" /> Carico 7 giorni</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tabular-nums">{training.load7d}</span>
            <span className="text-xs text-white/45">rapporto {training.loadRatio}</span>
          </div>
          <div className="relative mt-4 h-3 overflow-hidden rounded-full bg-white/8">
            <div className="absolute inset-y-0 rounded-full bg-glow-lime/25" style={{ left: '0%', right: '0%' }} />
            <motion.div
              className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow-glow"
              initial={{ left: 0 }}
              animate={{ left: `calc(${Math.min(Math.max(loadPct, 0), 1) * 100}% - 10px)` }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-white/40"><span>Basso</span><span className="text-glow-lime">Ottimale</span><span>Alto</span></div>
          <p className="mt-3 text-xs text-white/45">Acuto {training.acuteLoad} · Cronico {training.chronicLoad} · Recupero {training.recoveryH}h</p>
        </Glass>

        {/* Load focus */}
        <Glass className="col-span-12 p-6 sm:col-span-6 lg:col-span-4">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/80"><GaugeIcon size={16} className="text-glow-violet" /> Focus del carico</h3>
          <div className="space-y-3">
            <FocusBar label="Anaerobico" value={focus.anaerobic} color="#ff7a8a" />
            <FocusBar label="Aerobico alto" value={focus.highAerobic} color="#ffc15e" />
            <FocusBar label="Aerobico basso" value={focus.lowAerobic} color="#56b0ff" />
          </div>
        </Glass>

        {/* Endurance + hill */}
        <Glass className="col-span-12 p-6 sm:col-span-6 lg:col-span-4">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/80"><Mountain size={16} className="text-glow-lime" /> Resistenza & salita</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/4 p-3">
              <p className="text-xs text-white/45">Endurance Score</p>
              <p className="text-2xl font-bold tabular-nums">{training.enduranceScore.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl bg-white/4 p-3">
              <p className="text-xs text-white/45">Hill Score</p>
              <p className="text-2xl font-bold tabular-nums">{training.hillScore}</p>
            </div>
          </div>
        </Glass>

        {/* Race predictor */}
        <Glass className="col-span-12 p-6 sm:col-span-6 lg:col-span-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80"><Timer size={16} className="text-glow-violet" /> Tempi di gara stimati</h3>
          <div className="grid grid-cols-2 gap-3">
            {training.racePredictor.map((r) => (
              <div key={r.dist} className="rounded-2xl bg-white/4 p-3">
                <p className="text-xs text-white/45">{r.dist}</p>
                <p className="text-xl font-bold tabular-nums">{r.time}</p>
              </div>
            ))}
          </div>
        </Glass>

        {/* Load history */}
        <Glass className="col-span-12 p-6 lg:col-span-8">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/80"><GaugeIcon size={16} className="text-glow-sky" /> Carico settimanale</h3>
          <Bars data={training.loadWeeks} color="#56b0ff" height={170} />
        </Glass>

        {/* Suggested workouts */}
        <div className="col-span-12">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white/80"><Dumbbell size={16} className="text-glow-amber" /> Allenamenti consigliati</h3>
            <GlassButton className="!px-3 !py-1.5 text-xs">Libreria</GlassButton>
          </div>
          <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {workouts.map((w) => (
              <motion.div key={w.id} variants={staggerItem}>
                <Glass whileHover={{ scale: 1.015, y: -2 }} className="flex items-center gap-4 p-4">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl" style={{ background: `${w.color}22` }}>
                    <Play size={18} style={{ color: w.color }} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{w.name}</p>
                    <p className="text-xs text-white/45">{w.focus} · {w.durationMin} min · {w.intensity}</p>
                  </div>
                </Glass>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="rounded-2xl bg-white/4 p-3">
      <div className="mb-1 h-1 w-6 rounded-full" style={{ background: accent }} />
      <p className="text-xl font-bold tabular-nums">{value}</p>
      <p className="text-[11px] text-white/45">{label}</p>
    </div>
  )
}

function FocusBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs"><span className="text-white/55">{label}</span><span className="font-medium tabular-nums">{value}%</span></div>
      <div className="h-2 overflow-hidden rounded-full bg-white/8">
        <motion.div className="h-full rounded-full" style={{ background: color }} initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} />
      </div>
    </div>
  )
}
