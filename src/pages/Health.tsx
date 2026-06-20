import { Activity, HeartPulse, Heart, Wind, Zap } from 'lucide-react'
import { Glass } from '../components/Glass'
import { Gauge } from '../components/ProgressRing'
import { AreaTrend } from '../components/Charts'
import { PageHeader, useSegment } from '../components/ui'
import { useData } from '../context/DataContext'

export function Health() {
  const { today, bodyBatteryDay, stressDay, heartRateDay } = useData()
  const { control } = useSegment(['Giorno', 'Settimana', 'Mese'])

  const stressBreakdown = [
    { name: 'Riposo', minutes: today.stressRestMin, color: '#3ee6d0' },
    { name: 'Basso', minutes: today.stressLowMin, color: '#a6e85a' },
    { name: 'Medio', minutes: today.stressMediumMin, color: '#ffc15e' },
    { name: 'Alto', minutes: today.stressHighMin, color: '#ff7a8a' },
  ]
  const stressTotal = stressBreakdown.reduce((a, s) => a + s.minutes, 0) || 1

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
          <div className="mt-4 grid grid-cols-4 gap-3">
            <Mini label="A riposo" value={`${today.restingHr}`} color="#3ee6d0" />
            <Mini label="Minima" value={`${today.minHr}`} color="#56b0ff" />
            <Mini label="Media" value={`${today.avgHr}`} color="#9b8cff" />
            <Mini label="Massima" value={`${today.maxHr}`} color="#ff7a8a" />
          </div>
        </Glass>

        {/* HRV */}
        <Glass className="col-span-12 p-6 sm:col-span-6 lg:col-span-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80"><HeartPulse size={16} className="text-glow-aqua" /> Variabilità (HRV)</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tabular-nums text-gradient">{today.hrv}</span>
            <span className="text-sm text-white/45">ms</span>
          </div>
          <span className="mt-2 inline-block rounded-full bg-glow-lime/15 px-2.5 py-1 text-xs text-glow-lime">{today.hrvStatus}</span>
          <p className="mt-3 text-xs leading-relaxed text-white/45">Media settimanale {today.hrvWeeklyAvg} ms. Un buon indicatore del recupero del sistema nervoso.</p>
        </Glass>

        {/* Body battery */}
        <Glass className="col-span-12 p-6 sm:col-span-6 lg:col-span-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80"><Zap size={16} className="text-glow-lime" /> Body Battery</h3>
          <div className="flex justify-center"><Gauge value={today.bodyBattery} color="#a6e85a" size={130} label="energia" /></div>
          <AreaTrend data={bodyBatteryDay} color="#a6e85a" height={70} showAxis={false} />
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <span className="text-glow-lime">↑ Caricata +{today.bodyBatteryCharged}</span>
            <span className="text-right text-glow-coral">↓ Consumata −{today.bodyBatteryDrained}</span>
            <span className="text-white/45">Max {today.bodyBatteryHigh}</span>
            <span className="text-right text-white/45">Min {today.bodyBatteryLow}</span>
          </div>
        </Glass>

        {/* Stress breakdown */}
        <Glass className="col-span-12 p-6 sm:col-span-6 lg:col-span-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80"><Activity size={16} className="text-glow-amber" /> Stress</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tabular-nums">{today.stress}</span>
            <span className="text-sm text-white/45">medio · max {today.stressMax}</span>
          </div>
          <div className="mt-3 flex h-2.5 overflow-hidden rounded-full">
            {stressBreakdown.map((s) => <div key={s.name} style={{ flex: s.minutes || 0.01, background: s.color }} />)}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-1.5 text-[11px]">
            {stressBreakdown.map((s) => (
              <span key={s.name} className="flex items-center gap-1.5 text-white/50">
                <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                {s.name} · {Math.round((s.minutes / stressTotal) * 100)}%
              </span>
            ))}
          </div>
        </Glass>

        {/* SpO2 */}
        <Glass className="col-span-12 p-6 sm:col-span-6 lg:col-span-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80"><Wind size={16} className="text-glow-sky" /> Ossigenazione (SpO₂)</h3>
          <div className="flex justify-center"><Gauge value={today.spo2} color="#56b0ff" size={130} label="media" unit="%" /></div>
          <p className="mt-2 text-center text-xs text-white/45">Minima notturna {today.spo2Low}% · saturazione nella norma</p>
        </Glass>

        {/* Respiration */}
        <Glass className="col-span-12 p-6 sm:col-span-6 lg:col-span-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80"><Wind size={16} className="text-glow-aqua" /> Respirazione</h3>
          <div className="flex justify-center"><Gauge value={today.respiration} max={30} color="#3ee6d0" size={130} label="resp/min" /></div>
          <p className="mt-2 text-center text-xs text-white/45">Min {today.respirationMin} · Max {today.respirationMax} respiri al minuto</p>
        </Glass>
      </div>
    </div>
  )
}

function Mini({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-2xl bg-white/4 p-3">
      <div className="mb-1 h-1 w-6 rounded-full" style={{ background: color }} />
      <p className="text-lg font-bold tabular-nums">{value}</p>
      <p className="text-[11px] text-white/40">{label}</p>
    </div>
  )
}
