import { Route, Routes } from 'react-router-dom'
import { Shell } from './components/Shell'
import { Dashboard } from './pages/Dashboard'
import { Activities, ActivityDetail } from './pages/Activities'
import { Health } from './pages/Health'
import { Sleep } from './pages/Sleep'
import { Training } from './pages/Training'
import { Challenges } from './pages/Challenges'
import { Body } from './pages/Body'
import { Profile } from './pages/Profile'

export default function App() {
  return (
    <Shell>
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
    </Shell>
  )
}
