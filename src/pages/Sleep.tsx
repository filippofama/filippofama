import { Moon, Sunrise, Heart, Activity } from 'lucide-react'
import { Glass } from '../components/Glass'
import { Gauge } from '../components/ProgressRing'
import { Bars } from '../components/Charts'
import { PageHeader } from '../components/ui'
import { sleep } from '../data/mock'
import { motion } from 'framer-motion'

export function Sleep() {
  const total = sleep.stages.reduce((a, s) => a + s.minutes, 0)
  return (
    <div>
      <PageHeader title="Sonno" subtitle="La qualità del tuo recupero notturno" />

      <div className="grid grid-cols-12 gap-4">
        <Glass strong className="col-span-12 p-6 lg:col-span-5">
          <div className="flex items-center gap-6">
            <Gauge value={sleep.score} color="#9b8cff" size={150} label="punteggio" />
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm"><Moon size={15} className="text-glow-violet" /><span className="text-white/55">A letto</span><span className="ml-auto font-semibold">{sleep.bedtime}</span></div>
              <div className="flex items-center gap-2 text-sm"><Sunrise size={15} className="text-glow-amber" /><span className="text-white/55">Sveglio</span><span className="ml-auto font-semibold">{sleep.wake}</span></div>
              <div className="flex items-center gap-2 text-sm"><Activity size={15} className="text-glow-aqua" /><span className="text-white/55">Durata</span><span className="ml-auto font-semibold">{sleep.durationH} h</span></div>
              <div className="flex items-center gap-2 text-sm"><Heart size={15} className="text-glow-coral" /><span className="text-white/55">FC riposo</span><span className="ml-auto font-semibold">{sleep.restingHr} bpm</span></div>
            </div>
          </div>
        </Glass>

        {/* Hypnogram */}
        <Glass className="col-span-12 p-6 lg:col-span-7">
          <h3 className="mb-4 text-sm font-semibold text-white/80">Fasi del sonno</h3>
          <div className="flex h-4 overflow-hidden rounded-full">
            {sleep.stages.map((s) => (
              <motion.div
                key={s.name}
                style={{ background: s.color }}
                initial={{ flex: 0 }}
                animate={{ flex: s.minutes }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {sleep.stages.map((s) => (
              <div key={s.name} className="rounded-2xl bg-white/4 p-3">
                <div className="mb-1 flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-xs text-white/55">{s.name}</span>
                </div>
                <p className="text-lg font-bold">{Math.floor(s.minutes / 60)}h {s.minutes % 60}m</p>
                <p className="text-[11px] text-white/40">{Math.round((s.minutes / total) * 100)}%</p>
              </div>
            ))}
          </div>
        </Glass>

        <Glass className="col-span-12 p-6 lg:col-span-7">
          <h3 className="mb-4 text-sm font-semibold text-white/80">Punteggio settimanale</h3>
          <Bars data={sleep.weekScores} color="#9b8cff" height={170} />
        </Glass>

        <Glass className="col-span-12 p-6 lg:col-span-5">
          <h3 className="mb-3 text-sm font-semibold text-white/80">HRV notturna</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tabular-nums text-gradient">{sleep.hrv}</span>
            <span className="text-sm text-white/45">ms</span>
            <span className="ml-2 rounded-full bg-glow-lime/15 px-2 py-0.5 text-xs text-glow-lime">bilanciata</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/50">
            La tua variabilità cardiaca è nella norma personale. Indica un buon equilibrio del sistema nervoso e un recupero adeguato. Continua così.
          </p>
        </Glass>
      </div>
    </div>
  )
}
