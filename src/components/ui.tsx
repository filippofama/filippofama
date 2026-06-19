import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Glass } from './Glass'

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <header className="mb-6 flex items-end justify-between gap-4">
      <div>
        <motion.h1
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-extrabold tracking-tight text-gradient sm:text-3xl"
        >
          {title}
        </motion.h1>
        {subtitle && <p className="mt-1 text-sm text-white/45">{subtitle}</p>}
      </div>
      {action}
    </header>
  )
}

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export function MetricTile({
  icon: Icon,
  label,
  value,
  unit,
  sub,
  color,
  index = 0,
}: {
  icon: LucideIcon
  label: string
  value: string | number
  unit?: string
  sub?: string
  color: string
  index?: number
}) {
  return (
    <Glass variants={fade} custom={index} initial="hidden" animate="show" className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: `${color}22` }}>
          <Icon size={18} style={{ color }} />
        </span>
        <span className="text-[11px] uppercase tracking-wider text-white/35">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold tabular-nums">{value}</span>
        {unit && <span className="text-sm text-white/45">{unit}</span>}
      </div>
      {sub && <p className="mt-0.5 text-xs text-white/40">{sub}</p>}
    </Glass>
  )
}

export function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="glass glass-spec inline-flex rounded-2xl p-1">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className="relative rounded-xl px-3.5 py-1.5 text-xs font-medium transition-colors"
        >
          {value === opt && (
            <motion.div
              layoutId={`seg-${options.join()}`}
              className="absolute inset-0 rounded-xl bg-white/12"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <span className={value === opt ? 'relative text-white' : 'relative text-white/45'}>{opt}</span>
        </button>
      ))}
    </div>
  )
}

export function useSegment(options: string[], initial?: string) {
  const [value, setValue] = useState(initial ?? options[0])
  return { value, setValue, control: <SegmentedControl options={options} value={value} onChange={setValue} /> }
}

export function Stagger({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export const staggerItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
}
