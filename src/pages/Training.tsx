import { Activity, Dumbbell, Gauge as GaugeIcon, Play, Timer, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { Glass, GlassButton } from '../components/Glass'
import { Bars } from '../components/Charts'
import { PageHeader, Stagger, staggerItem } from '../components/ui'
import { training, workouts } from '../data/mock'

export function Training() {
  const loadPct = (training.load7d - training.loadOptimalLow) / (training.loadOptimalHigh - training.loadOptimalLow)

  return (
    <div>
      <PageHeader title="Allenamento" subtitle="Carico, forma e prossimi obiettivi" />

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
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/4 p-3">
              <p className="text-xs text-white/45">VO₂max</p>
              <p className="text-2xl font-bold">{training.vo2max}</p>
              <p className="text-[11px] text-glow-lime">{training.vo2trend}</p>
            </div>
            <div className="rounded-2xl bg-white/4 p-3">
              <p className="text-xs text-white/45">Recupero</p>
              <p className="text-2xl font-bold">{training.recoveryH}h</p>
              <p className="text-[11px] text-white/40">alla prossima sessione</p>
            </div>
          </div>
        </Glass>

        {/* Load gauge */}
        <Glass className="col-span-12 p-6 sm:col-span-6 lg:col-span-3">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80"><Activity size={16} className="text-glow-aqua" /> Carico 7 giorni</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold tabular-nums">{training.load7d}</span>
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
          <div className="mt-2 flex justify-between text-[11px] text-white/40">
            <span>Basso</span><span className="text-glow-lime">Ottimale</span><span>Alto</span>
          </div>
          <p className="mt-3 text-xs text-white/45">Acuto {training.acuteLoad} · Cronico {training.chronicLoad}</p>
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
        <Glass className="col-span-12 p-6 lg:col-span-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/80"><GaugeIcon size={16} className="text-glow-sky" /> Carico settimanale</h3>
          <Bars data={training.loadWeeks} color="#56b0ff" height={170} />
        </Glass>

        {/* Suggested workouts */}
        <div className="col-span-12 lg:col-span-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white/80"><Dumbbell size={16} className="text-glow-amber" /> Allenamenti consigliati</h3>
            <GlassButton className="!px-3 !py-1.5 text-xs">Libreria</GlassButton>
          </div>
          <Stagger className="space-y-3">
            {workouts.map((w) => (
              <motion.div key={w.id} variants={staggerItem}>
                <Glass whileHover={{ scale: 1.012, x: 2 }} className="flex items-center gap-4 p-4">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl" style={{ background: `${w.color}22` }}>
                    <Play size={18} style={{ color: w.color }} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{w.name}</p>
                    <p className="text-xs text-white/45">{w.focus} · {w.durationMin} min · {w.intensity}</p>
                  </div>
                  <span className="rounded-full px-2.5 py-1 text-[11px]" style={{ background: `${w.color}1f`, color: w.color }}>{w.type}</span>
                </Glass>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </div>
    </div>
  )
}
