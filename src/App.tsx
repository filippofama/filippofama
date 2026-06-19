import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Shell } from './components/Shell'
import { Dashboard } from './pages/Dashboard'

// Dashboard ships in the main chunk (it's the landing route); the rest are
// lazily loaded so the first paint stays light.
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

export default function App() {
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
