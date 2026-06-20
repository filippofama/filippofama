import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Shell } from './components/Shell'
import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/Login'
import { useData } from './context/DataContext'

const Activities = lazy(() => import('./pages/Activities').then((m) => ({ default: m.Activities })))
const ActivityDetail = lazy(() => import('./pages/Activities').then((m) => ({ default: m.ActivityDetail })))
const Health = lazy(() => import('./pages/Health').then((m) => ({ default: m.Health })))
const Sleep = lazy(() => import('./pages/Sleep').then((m) => ({ default: m.Sleep })))
const Training = lazy(() => import('./pages/Training').then((m) => ({ default: m.Training })))
const Challenges = lazy(() => import('./pages/Challenges').then((m) => ({ default: m.Challenges })))
const Body = lazy(() => import('./pages/Body').then((m) => ({ default: m.Body })))
const Profile = lazy(() => import('./pages/Profile').then((m) => ({ default: m.Profile })))

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="glass glass-spec flex items-center gap-3 rounded-3xl px-6 py-4">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-glow-aqua" />
        <span className="text-sm text-white/55">Caricamento…</span>
      </div>
    </div>
  )
}

function Splash() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-5">
      <div className="aurora" />
      <div className="aurora-grain" />
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-glow-aqua to-glow-sky shadow-glow"
      >
        <Sparkles size={28} className="text-ink-900" />
      </motion.div>
      <div className="flex items-center gap-2 text-sm text-white/55">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-glow-aqua" />
        Sincronizzazione con Garmin…
      </div>
    </div>
  )
}

export default function App() {
  const { status } = useData()

  if (status === 'login') return <Login />
  if (status === 'connecting') return <Splash />

  return (
    <Shell>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/activities/:id" element={<ActivityDetail />} />
          <Route path="/health" element={<Health />} />
          <Route path="/sleep" element={<Sleep />} />
          <Route path="/training" element={<Training />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/body" element={<Body />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Suspense>
    </Shell>
  )
}
