import { Droplets, Scale, Activity, Percent } from 'lucide-react'
import { Glass } from '../components/Glass'
import { Gauge } from '../components/ProgressRing'
import { AreaTrend } from '../components/Charts'
import { PageHeader } from '../components/ui'
import { useData } from '../context/DataContext'

export function Body() {
  const { body } = useData()
  return (
    <div>
      <PageHeader title="Corpo & Composizione" subtitle="Peso, massa e idratazione nel tempo" />

      <div className="grid grid-cols-12 gap-4">
        <Glass strong className="col-span-12 p-6 lg:col-span-7">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white/80"><Scale size={16} className="text-glow-aqua" /> Peso</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold tabular-nums">{body.weightKg}</span>
              <span className="text-sm text-white/45">kg</span>
            </div>
          </div>
          <p className="mb-2 text-xs text-glow-lime">−2.4 kg negli ultimi 2 mesi · obiettivo {body.goalKg} kg</p>
          <AreaTrend data={body.weightTrend} color="#3ee6d0" height={200} unit=" kg" />
        </Glass>

        <div className="col-span-12 grid grid-cols-2 gap-4 lg:col-span-5">
          <Glass className="p-5">
            <Activity size={16} className="mb-2 text-glow-sky" />
            <p className="text-2xl font-bold tabular-nums">{body.bmi}</p>
            <p className="text-xs text-white/45">BMI · normopeso</p>
          </Glass>
          <Glass className="p-5">
            <Percent size={16} className="mb-2 text-glow-amber" />
            <p className="text-2xl font-bold tabular-nums">{body.bodyFat}%</p>
            <p className="text-xs text-white/45">Massa grassa</p>
          </Glass>
          <Glass className="p-5">
            <Scale size={16} className="mb-2 text-glow-violet" />
            <p className="text-2xl font-bold tabular-nums">{body.muscleKg}</p>
            <p className="text-xs text-white/45">kg muscolo</p>
          </Glass>
          <Glass className="flex flex-col items-center justify-center p-5">
            <Gauge value={body.hydration} color="#56b0ff" size={110} label="acqua %" />
            <p className="mt-1 flex items-center gap-1 text-xs text-white/45"><Droplets size={12} /> Idratazione</p>
          </Glass>
        </div>

        {/* Full body composition */}
        <Glass className="col-span-12 p-6">
          <h3 className="mb-4 text-sm font-semibold text-white/80">Composizione corporea completa</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <Comp label="Acqua corporea" value={`${body.bodyWater}%`} color="#56b0ff" />
            <Comp label="Massa ossea" value={`${body.boneMassKg} kg`} color="#9b8cff" />
            <Comp label="Massa muscolare" value={`${body.muscleKg} kg`} color="#3ee6d0" />
            <Comp label="Grasso viscerale" value={`${body.visceralFat}`} color="#ffc15e" />
            <Comp label="Età metabolica" value={`${body.metabolicAge} anni`} color="#a6e85a" />
            <Comp label="Physique rating" value={`${body.physiqueRating}`} color="#ff7a8a" />
          </div>
        </Glass>
      </div>
    </div>
  )
}

function Comp({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-2xl bg-white/4 p-4">
      <div className="mb-2 h-1 w-6 rounded-full" style={{ background: color }} />
      <p className="text-xl font-bold tabular-nums">{value}</p>
      <p className="mt-0.5 text-[11px] text-white/45">{label}</p>
    </div>
  )
}
