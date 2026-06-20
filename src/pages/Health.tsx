import { Activity, Heart, Wind, Zap } from 'lucide-react'
import { Glass } from '../components/Glass'
import { Gauge } from '../components/ProgressRing'
import { AreaTrend } from '../components/Charts'
import { PageHeader, useSegment } from '../components/ui'
import { useData } from '../context/DataContext'

export function Health() {
  const { today, bodyBatteryDay, stressDay, heartRateDay } = useData()
  const { control } = useSegment(['Giorno', 'Settimana', 'Mese'])

  return (
    <div>
      <PageHeader title="Salute" subtitle="Tutti i tuoi segnali vitali, in tempo reale" action={control} />

      <div className="grid grid-cols-12 gap-4">
        {/* Heart rate big card */}
        <Glass className="col-span-12 p-6 lg:col-span-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white/80"><Heart size={16} className="text-glow-coral" /> Frequenza cardiaca</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold tabular-nums">{today.currentHr}</span>
              <span className="text-sm text-white/45">bpm</span>
            </div>
          </div>
          <AreaTrend data={heartRateDay} color="#ff7a8a" height={200} unit=" bpm" />
          <div className="mt-4 grid grid-cols-3 gap-3">
            <Mini label="A riposo" value={`${today.restingHr} bpm`} color="#3ee6d0" />
            <Mini label="Media oggi" value="71 bpm" color="#56b0ff" />
            <Mini label="Massima" value="172 bpm" color="#ff7a8a" />
          </div>
        </Glass>

        {/* Body battery */}
        <Glass className="col-span-12 p-6 sm:col-span-6 lg:col-span-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80"><Zap size={16} className="text-glow-lime" /> Body Battery</h3>
          <div className="flex justify-center"><Gauge value={today.bodyBattery} color="#a6e85a" size={140} label="energia" /></div>
          <AreaTrend data={bodyBatteryDay} color="#a6e85a" height={90} showAxis={false} />
          <p className="mt-2 text-xs text-white/45">Hai recuperato bene. Picco alle 06:00 (92%).</p>
        </Glass>

        {/* Stress */}
        <Glass className="col-span-12 p-6 sm:col-span-6 lg:col-span-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80"><Activity size={16} className="text-glow-amber" /> Stress</h3>
          <div className="flex justify-center"><Gauge value={today.stress} color="#ffc15e" size={140} label="livello" /></div>
          <AreaTrend data={stressDay} color="#ffc15e" height={90} showAxis={false} />
          <p className="mt-2 text-xs text-white/45">Prevalentemente rilassato. 6h 20m in stato di riposo.</p>
        </Glass>

        {/* SpO2 + respiration */}
        <Glass className="col-span-12 p-6 lg:col-span-8">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/80"><Wind size={16} className="text-glow-sky" /> Ossigenazione & respiro</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <Gauge value={today.spo2} color="#56b0ff" size={140} label="SpO₂" unit="%" />
              <p className="mt-2 text-xs text-white/45">Saturazione normale durante la notte.</p>
            </div>
            <div className="text-center">
              <Gauge value={today.respiration} max={30} color="#3ee6d0" size={140} label="resp/min" />
              <p className="mt-2 text-xs text-white/45">Frequenza respiratoria stabile.</p>
            </div>
          </div>
        </Glass>
      </div>
    </div>
  )
}

function Mini({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-2xl bg-white/4 p-3">
      <div className="mb-1 h-1 w-6 rounded-full" style={{ background: color }} />
      <p className="text-sm font-semibold tabular-nums">{value}</p>
      <p className="text-[11px] text-white/40">{label}</p>
    </div>
  )
}
