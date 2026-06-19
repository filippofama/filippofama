import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type Pt = { label: string; value: number }

const axis = { stroke: 'rgba(255,255,255,0.08)', tickLine: false, axisLine: false }

export function AreaTrend({
  data,
  color = '#56b0ff',
  height = 120,
  showAxis = true,
  unit = '',
}: {
  data: Pt[]
  color?: string
  height?: number
  showAxis?: boolean
  unit?: string
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id={`area-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.45} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        {showAxis && <XAxis dataKey="label" {...axis} fontSize={11} />}
        {showAxis && <YAxis {...axis} fontSize={11} width={34} />}
        <Tooltip
          cursor={{ stroke: 'rgba(255,255,255,0.2)' }}
          formatter={(v: number) => [`${v}${unit}`, '']}
          labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2.5}
          fill={`url(#area-${color})`}
          dot={false}
          activeDot={{ r: 4, fill: color }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function MiniLine({ data, color = '#3ee6d0', height = 48 }: { data: number[]; color?: string; height?: number }) {
  const pts = data.map((value, i) => ({ label: String(i), value }))
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={pts} margin={{ top: 4, right: 2, left: 2, bottom: 0 }}>
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function Bars({
  data,
  color = '#9b8cff',
  height = 140,
  highlightLast = true,
  unit = '',
}: {
  data: Pt[]
  color?: string
  height?: number
  highlightLast?: boolean
  unit?: string
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="label" {...axis} fontSize={11} />
        <YAxis {...axis} fontSize={11} width={34} />
        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} formatter={(v: number) => [`${v}${unit}`, '']} />
        <Bar dataKey="value" radius={[8, 8, 8, 8]} maxBarSize={26}>
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={color}
              fillOpacity={highlightLast && i === data.length - 1 ? 1 : 0.42}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function SeriesArea({ data, color = '#ff7a8a', height = 160 }: { data: number[]; color?: string; height?: number }) {
  const pts = data.map((value, i) => ({ label: String(i), value: Math.round(value) }))
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={pts} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id={`s-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <YAxis {...axis} fontSize={11} width={34} domain={['dataMin - 10', 'dataMax + 10']} />
        <Tooltip cursor={{ stroke: 'rgba(255,255,255,0.2)' }} />
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#s-${color})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
