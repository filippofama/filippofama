import {
  Bell,
  ChevronRight,
  Download,
  Gauge,
  Heart,
  Moon,
  Share2,
  Shield,
  LogOut,
  Smartphone,
  Watch,
} from 'lucide-react'
import { Glass } from '../components/Glass'
import { PageHeader } from '../components/ui'
import { useData } from '../context/DataContext'

const buildSettings = (device: string) => [
  { icon: Watch, label: 'Dispositivo & sincronizzazione', value: device },
  { icon: Bell, label: 'Notifiche', value: 'Attive' },
  { icon: Heart, label: 'Zone di frequenza cardiaca', value: 'Personalizzate' },
  { icon: Moon, label: 'Finestra del sonno', value: '23:00 – 07:00' },
  { icon: Gauge, label: 'Unità di misura', value: 'Metrico (km)' },
  { icon: Shield, label: 'Privacy & dati', value: 'Solo io' },
  { icon: Download, label: 'Esporta i tuoi dati', value: 'GPX / CSV' },
]

export function Profile() {
  const { user, status, logout, syncing } = useData()
  const connected = status === 'connected'
  const settings = buildSettings(user.device)
  return (
    <div>
      <PageHeader title="Profilo" subtitle="Account, dispositivi e preferenze" />

      <Glass strong className="mb-4 flex flex-col items-center gap-4 p-7 sm:flex-row sm:items-center">
        <div className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-glow-violet to-glow-coral text-2xl font-extrabold shadow-glass">
          {user.avatar}
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-extrabold">{user.name}</h2>
          <p className="text-sm text-white/45">{user.handle} · Livello {user.level} · Iscritto {user.joined}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
            <Pill icon="🔥" text={`${user.streak} giorni di streak`} />
            <Pill icon="⌚" text={user.device} />
            <Pill icon="🏅" text={`Livello ${user.level}`} />
          </div>
        </div>
        <button className="ml-auto hidden rounded-2xl bg-white/8 p-3 transition-colors hover:bg-white/14 sm:block">
          <Share2 size={18} />
        </button>
      </Glass>

      {/* Garmin connection card */}
      <Glass className="mb-4 flex items-center gap-4 p-5">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-glow-aqua/30 to-glow-sky/20">
          <Smartphone size={22} className="text-glow-aqua" />
        </span>
        <div className="flex-1">
          <p className="font-semibold">{connected ? 'Garmin Connect' : 'Nessun account collegato'}</p>
          <p className="text-xs text-white/45">
            {connected
              ? syncing
                ? 'Sincronizzazione in corso…'
                : 'Dati reali sincronizzati'
              : 'Stai usando i dati dimostrativi'}
          </p>
        </div>
        {connected ? (
          <span className="flex items-center gap-1.5 rounded-full bg-glow-lime/15 px-3 py-1 text-xs text-glow-lime">
            <span className="h-1.5 w-1.5 rounded-full bg-glow-lime" /> Connesso
          </span>
        ) : (
          <span className="flex items-center gap-1.5 rounded-full bg-white/8 px-3 py-1 text-xs text-white/55">
            Demo
          </span>
        )}
      </Glass>

      <Glass className="divide-y divide-white/6 overflow-hidden p-2">
        {settings.map(({ icon: Icon, label, value }) => (
          <button key={label} className="flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-left transition-colors hover:bg-white/5">
            <Icon size={18} className="text-white/55" />
            <span className="flex-1 text-sm font-medium">{label}</span>
            <span className="text-sm text-white/40">{value}</span>
            <ChevronRight size={16} className="text-white/30" />
          </button>
        ))}
      </Glass>

      <button
        onClick={logout}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-glow-coral/25 bg-glow-coral/10 py-3.5 text-sm font-medium text-glow-coral transition-colors hover:bg-glow-coral/16"
      >
        <LogOut size={17} /> {connected ? 'Disconnetti account Garmin' : 'Torna alla schermata di accesso'}
      </button>

      <p className="mt-6 text-center text-xs text-white/30">Auralis v1.0 · Progettato con cura · Liquid Glass UI</p>
    </div>
  )
}

function Pill({ icon, text }: { icon: string; text: string }) {
  return <span className="rounded-full bg-white/8 px-3 py-1.5 text-xs text-white/65">{icon} {text}</span>
}
