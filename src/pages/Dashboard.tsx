import { motion } from 'framer-motion'
import {
  Activity as ActivityIcon,
  Droplets,
  Flame,
  Footprints,
  Gauge as GaugeIcon,
  Heart,
  Mountain,
  Moon,
  Sparkles,
  TrendingUp,
  Wind,
  Zap,
} from 'lucide-react'
import { Glass, GlassButton } from '../components/Glass'
import { Gauge, ProgressRing } from '../components/ProgressRing'
import { AreaTrend } from '../components/Charts'
import { MetricTile, Stagger, staggerItem } from '../components/ui'
import { insights } from '../data/mock'
import { useData } from '../context/DataContext'

const greeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Buongiorno'
  if (h < 18) return 'Buon pomeriggio'
  return 'Buonasera'
}

export function Dashboard() {
  const { today, sleep, bodyBatteryDay, user } = useData()
  const rings = [
    { value: today.calories.active, goal: 700, color: '#ff7a8a' },
    { value: today.intensityMin.value, goal: today.intensityMin.goal, color: '#a6e85a' },
    { value: today.steps.value, goal: today.steps.goal, color: '#3ee6d0' },
  ]

  return (
    <div>
      <header className="mb-6">
        <p className="text-sm text-white/45">{greeting()}, {user.name} 👋</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-gradient sm:text-3xl">
          Il tuo corpo, oggi
        </h1>
      </header>

      <div className="grid grid-cols-12 gap-4">
        {/* Hero rings */}
        <Glass
          strong
          className="col-span-12 overflow-hidden p-6 lg:col-span-5"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
            <ProgressRing rings={rings} size={184}>
              <span className="text-3xl font-extrabold tabular-nums">{today.steps.value.toLocaleString()}</span>
              <span className="text-[11px] uppercase tracking-widest text-white/40">passi</span>
            </ProgressRing>
            <div className="flex-1 space-y-3">
              <RingStat color="#ff7a8a" label="Calorie attive" value={`${today.calories.active} kcal`} pct={today.calories.active / 700} />
              <RingStat color="#a6e85a" label="Minuti intensi" value={`${today.intensityMin.value} / ${today.intensityMin.goal}`} pct={today.intensityMin.value / today.intensityMin.goal} />
              <RingStat color="#3ee6d0" label="Passi" value={`${today.steps.value.toLocaleString()} / ${today.steps.goal.toLocaleString()}`} pct={today.steps.value / today.steps.goal} />
              <div className="flex gap-2 pt-1">
                <span className="rounded-full bg-white/8 px-2.5 py-1 text-xs text-white/60">{today.distanceKm} km</span>
                <span className="rounded-full bg-white/8 px-2.5 py-1 text-xs text-white/60">{today.floors.value} piani</span>
              </div>
            </div>
          </div>
        </Glass>

        {/* Body Battery + Stress gauges */}
        <Glass className="col-span-12 p-6 sm:col-span-6 lg:col-span-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white/80">
            <Zap size={16} className="text-glow-lime" /> Body Battery
          </div>
          <div className="flex items-center justify-around">
            <Gauge value={today.bodyBattery} color="#a6e85a" label="energia" />
            <Gauge value={today.stress} color="#ffc15e" label="stress" />
          </div>
          <div className="mt-3 -mb-1">
            <AreaTrend data={bodyBatteryDay} color="#a6e85a" height={70} showAxis={false} />
          </div>
        </Glass>

        {/* Sleep snapshot */}
        <Glass className="col-span-12 p-6 sm:col-span-6 lg:col-span-3">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80">
            <Moon size={16} className="text-glow-violet" /> Sonno
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-extrabold tabular-nums text-gradient">{sleep.score}</span>
            <span className="mb-1 text-sm text-white/45">/ 100</span>
          </div>
          <p className="mt-1 text-sm text-white/55">{sleep.durationH} h • HRV {sleep.hrv} ms</p>
          <div className="mt-4 flex h-2.5 overflow-hidden rounded-full">
            {sleep.stages.map((s) => (
              <div key={s.name} style={{ flex: s.minutes, background: s.color }} />
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-white/45">
            {sleep.stages.map((s) => (
              <span key={s.name} className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full" style={{ background: s.color }} /> {s.name}
              </span>
            ))}
          </div>
        </Glass>
      </div>

      {/* Metric tiles */}
      <Stagger className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <MetricTile index={0} icon={Heart} label="FC riposo" value={today.restingHr} unit="bpm" color="#ff7a8a" sub="ottima" />
        <MetricTile index={1} icon={ActivityIcon} label="FC attuale" value={today.currentHr} unit="bpm" color="#ff7a8a" />
        <MetricTile index={2} icon={Wind} label="SpO₂" value={today.spo2} unit="%" color="#56b0ff" sub="normale" />
        <MetricTile index={3} icon={GaugeIcon} label="Respiro" value={today.respiration} unit="rpm" color="#3ee6d0" />
        <MetricTile index={4} icon={TrendingUp} label="VO₂max" value={today.vo2max} color="#a6e85a" sub="superiore" />
        <MetricTile index={5} icon={Flame} label="Calorie" value={today.calories.value.toLocaleString()} unit="kcal" color="#ffc15e" />
      </Stagger>

      <div className="mt-4 grid grid-cols-12 gap-4">
        {/* Hydration */}
        <Glass className="col-span-12 p-6 sm:col-span-6 lg:col-span-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-semibold text-white/80">
              <Droplets size={16} className="text-glow-sky" /> Idratazione
            </span>
            <GlassButton className="!px-3 !py-1.5 text-xs">+250 ml</GlassButton>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold tabular-nums">{today.hydrationMl.value}</span>
            <span className="text-sm text-white/45">/ {today.hydrationMl.goal} ml</span>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/8">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-glow-sky to-glow-aqua"
              initial={{ width: 0 }}
              animate={{ width: `${(today.hydrationMl.value / today.hydrationMl.goal) * 100}%` }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <div className="mt-4 flex gap-2">
            {[250, 500, 750].map((ml) => (
              <button key={ml} className="flex-1 rounded-xl bg-white/6 py-2 text-xs text-white/60 transition-colors hover:bg-white/12">
                +{ml}
              </button>
            ))}
          </div>
        </Glass>

        {/* AI insights */}
        <Glass className="col-span-12 p-6 lg:col-span-8">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/80">
            <Sparkles size={16} className="text-glow-aqua" /> Insight di Aura
            <span className="ml-1 rounded-full bg-glow-aqua/15 px-2 py-0.5 text-[10px] font-medium text-glow-aqua">AI</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {insights.map((ins, i) => (
              <motion.div
                key={ins.id}
                variants={staggerItem}
                initial="hidden"
                animate="show"
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-white/8 bg-white/4 p-4"
              >
                <div
                  className="mb-2 h-1.5 w-8 rounded-full"
                  style={{
                    background: ins.tone === 'positive' ? '#a6e85a' : ins.tone === 'warn' ? '#ffc15e' : '#56b0ff',
                  }}
                />
                <p className="text-sm font-semibold leading-snug">{ins.title}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-white/50">{ins.body}</p>
              </motion.div>
            ))}
          </div>
        </Glass>
      </div>

      {/* Quick stats row */}
      <Glass className="mt-4 flex items-center justify-around p-5">
        <QuickStat icon={Footprints} label="Distanza" value={`${today.distanceKm} km`} color="#3ee6d0" />
        <Divider />
        <QuickStat icon={Mountain} label="Dislivello" value={`${today.floors.value} piani`} color="#9b8cff" />
        <Divider />
        <QuickStat icon={Flame} label="Bruciate" value={`${today.calories.value} kcal`} color="#ffc15e" />
        <Divider />
        <QuickStat icon={Zap} label="Streak" value={`${user.streak} gg`} color="#ff7a8a" />
      </Glass>
    </div>
  )
}

function RingStat({ color, label, value, pct }: { color: string; label: string; value: string; pct: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/55">{label}</span>
        <span className="font-medium tabular-nums">{value}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/8">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(pct * 100, 100)}%` }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  )
}

function QuickStat({ icon: Icon, label, value, color }: { icon: typeof Flame; label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-2 text-center">
      <Icon size={18} style={{ color }} />
      <span className="text-sm font-semibold tabular-nums">{value}</span>
      <span className="text-[10px] uppercase tracking-wider text-white/35">{label}</span>
    </div>
  )
}

const Divider = () => <div className="h-10 w-px bg-white/8" />
