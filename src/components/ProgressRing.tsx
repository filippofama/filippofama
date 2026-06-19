import { motion } from 'framer-motion'

type RingDef = { value: number; goal: number; color: string }

type Props = {
  rings: RingDef[]
  size?: number
  thickness?: number
  gap?: number
  children?: React.ReactNode
}

/** Concentric animated activity rings (Apple-style), liquid-glass tinted. */
export function ProgressRing({ rings, size = 180, thickness = 14, gap = 6, children }: Props) {
  const center = size / 2
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          {rings.map((r, i) => (
            <linearGradient id={`ring-${i}`} key={i} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={r.color} stopOpacity={0.55} />
              <stop offset="100%" stopColor={r.color} />
            </linearGradient>
          ))}
        </defs>
        {rings.map((r, i) => {
          const radius = center - thickness / 2 - i * (thickness + gap)
          const circ = 2 * Math.PI * radius
          const pct = Math.min(r.value / r.goal, 1)
          return (
            <g key={i}>
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={thickness}
              />
              <motion.circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={`url(#ring-${i})`}
                strokeWidth={thickness}
                strokeLinecap="round"
                strokeDasharray={circ}
                initial={{ strokeDashoffset: circ }}
                animate={{ strokeDashoffset: circ * (1 - pct) }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.15 * i }}
                style={{ filter: `drop-shadow(0 0 6px ${r.color}66)` }}
              />
            </g>
          )
        })}
      </svg>
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
      )}
    </div>
  )
}

/** Single radial gauge for a 0–100 metric. */
export function Gauge({
  value,
  max = 100,
  color,
  size = 120,
  label,
  unit = '',
}: {
  value: number
  max?: number
  color: string
  size?: number
  label?: string
  unit?: string
}) {
  const thickness = 10
  const center = size / 2
  const radius = center - thickness / 2
  const circ = 2 * Math.PI * radius
  const pct = Math.min(value / max, 1)
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`g-${label}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.5} />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={thickness} />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`url(#g-${label})`}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - pct) }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: `drop-shadow(0 0 6px ${color}55)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tabular-nums">{value}{unit}</span>
        {label && <span className="text-[11px] uppercase tracking-wider text-white/45">{label}</span>}
      </div>
    </div>
  )
}
