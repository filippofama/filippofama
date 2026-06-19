import { Award, Flame, Trophy, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { Glass } from '../components/Glass'
import { PageHeader, Stagger, staggerItem, useSegment } from '../components/ui'
import { badges, challenges, feed, records } from '../data/mock'

export function Challenges() {
  const { value: tab, control } = useSegment(['Sfide', 'Badge', 'Record', 'Feed'])

  return (
    <div>
      <PageHeader title="Sfide & Community" subtitle="Competi, conquista, condividi" action={control} />

      {tab === 'Sfide' && (
        <Stagger className="grid grid-cols-12 gap-4">
          {challenges.map((c) => (
            <motion.div key={c.id} variants={staggerItem} className="col-span-12 sm:col-span-6 lg:col-span-4">
              <Glass className="overflow-hidden p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl" style={{ background: `${c.color}22` }}>
                    <Trophy size={20} style={{ color: c.color }} />
                  </span>
                  <span className="rounded-full bg-white/8 px-2.5 py-1 text-xs text-white/55">{c.days} giorni</span>
                </div>
                <h3 className="font-bold">{c.title}</h3>
                <p className="text-sm text-white/45">Obiettivo: {c.goal}</p>
                <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/8">
                  <motion.div className="h-full rounded-full" style={{ background: c.color }} initial={{ width: 0 }} animate={{ width: `${c.progress * 100}%` }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-white/45">
                  <span className="flex items-center gap-1"><Users size={13} /> {c.participants.toLocaleString()}</span>
                  <span className="font-semibold" style={{ color: c.color }}>{Math.round(c.progress * 100)}%</span>
                </div>
              </Glass>
            </motion.div>
          ))}
        </Stagger>
      )}

      {tab === 'Badge' && (
        <Stagger className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {badges.map((b) => (
            <motion.div key={b.id} variants={staggerItem}>
              <Glass className={`flex flex-col items-center p-5 text-center ${b.earned ? '' : 'opacity-40 grayscale'}`}>
                <span className="text-4xl">{b.icon}</span>
                <p className="mt-2 text-xs font-medium">{b.name}</p>
                {b.earned && <span className="mt-1 text-[10px] text-glow-lime">ottenuto</span>}
              </Glass>
            </motion.div>
          ))}
        </Stagger>
      )}

      {tab === 'Record' && (
        <Stagger className="space-y-3">
          {records.map((r, i) => (
            <motion.div key={r.dist} variants={staggerItem}>
              <Glass className="flex items-center gap-4 p-4">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-glow-amber/30 to-glow-coral/20">
                  <Award size={20} className="text-glow-amber" />
                </span>
                <div className="flex-1">
                  <p className="font-semibold">{r.dist}</p>
                  <p className="text-xs text-white/45">{r.date}</p>
                </div>
                <span className="text-xl font-bold tabular-nums text-gradient">{r.time}</span>
              </Glass>
            </motion.div>
          ))}
        </Stagger>
      )}

      {tab === 'Feed' && (
        <Stagger className="space-y-3">
          {feed.map((f) => (
            <motion.div key={f.id} variants={staggerItem}>
              <Glass className="flex items-center gap-4 p-4">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-glow-violet to-glow-sky text-sm font-bold">{f.avatar}</span>
                <div className="flex-1">
                  <p className="text-sm"><span className="font-semibold">{f.user}</span> <span className="text-white/55">{f.action}</span></p>
                  <p className="text-xs text-white/40">{f.time}</p>
                </div>
                <button className="flex items-center gap-1 rounded-full bg-white/6 px-3 py-1.5 text-xs text-white/60 transition-colors hover:bg-white/12">
                  <Flame size={13} className="text-glow-coral" /> {f.kudos}
                </button>
              </Glass>
            </motion.div>
          ))}
        </Stagger>
      )}
    </div>
  )
}
