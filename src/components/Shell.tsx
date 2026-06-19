import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  Dumbbell,
  Heart,
  Home,
  Moon,
  Scale,
  Sparkles,
  Trophy,
  User,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { user } from '../data/mock'

const nav = [
  { to: '/', label: 'Oggi', icon: Home },
  { to: '/activities', label: 'Attività', icon: Activity },
  { to: '/health', label: 'Salute', icon: Heart },
  { to: '/sleep', label: 'Sonno', icon: Moon },
  { to: '/training', label: 'Allenamento', icon: Dumbbell },
  { to: '/challenges', label: 'Sfide', icon: Trophy },
  { to: '/body', label: 'Corpo', icon: Scale },
  { to: '/profile', label: 'Profilo', icon: User },
]

const primaryMobile = nav.filter((n) => ['/', '/activities', '/health', '/training', '/profile'].includes(n.to))

export function Shell({ children }: { children: ReactNode }) {
  const location = useLocation()

  return (
    <div className="min-h-full">
      <div className="aurora" />
      <div className="aurora-grain" />

      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-full w-[248px] flex-col p-4 lg:flex">
        <div className="glass glass-spec rounded-4xl flex h-full flex-col p-5">
          <div className="mb-8 flex items-center gap-3 px-1">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-glow-aqua to-glow-sky shadow-glow">
              <Sparkles size={20} className="text-ink-900" />
            </div>
            <div>
              <p className="text-lg font-bold leading-none text-gradient">Auralis</p>
              <p className="mt-1 text-[11px] text-white/40">Health & Performance</p>
            </div>
          </div>

          <nav className="flex flex-1 flex-col gap-1">
            {nav.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} end={to === '/'}>
                {({ isActive }) => (
                  <div className="relative">
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 rounded-2xl bg-white/10"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <div
                      className={`relative flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm transition-colors ${
                        isActive ? 'text-white' : 'text-white/55 hover:text-white/85'
                      }`}
                    >
                      <Icon size={18} strokeWidth={isActive ? 2.4 : 1.9} />
                      <span className="font-medium">{label}</span>
                    </div>
                  </div>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white/5 p-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-glow-violet to-glow-coral text-sm font-bold">
              {user.avatar}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-[11px] text-white/40">🔥 {user.streak} giorni di streak</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="mx-auto w-full max-w-[1180px] px-4 pb-28 pt-4 lg:pl-[268px] lg:pr-6 lg:pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 z-40 w-full p-3 safe-bottom lg:hidden">
        <div className="glass glass-spec strong rounded-4xl mx-auto flex max-w-md items-center justify-around px-2 py-2">
          {primaryMobile.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} className="relative flex-1">
              {({ isActive }) => (
                <div className="flex flex-col items-center gap-1 py-1.5">
                  {isActive && (
                    <motion.div
                      layoutId="mobile-active"
                      className="absolute -top-0.5 h-1 w-8 rounded-full bg-glow-aqua shadow-glow"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 1.9}
                    className={isActive ? 'text-white' : 'text-white/50'}
                  />
                  <span className={`text-[10px] ${isActive ? 'text-white' : 'text-white/45'}`}>{label}</span>
                </div>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
