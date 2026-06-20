import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles, Watch } from 'lucide-react'
import { useData } from '../context/DataContext'

export function Login() {
  const { login, continueDemo, error } = useData()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      await login(email.trim(), password)
    } catch {
      /* error surfaced via context */
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <div className="aurora" />
      <div className="aurora-grain" />

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="glass glass-spec glass-strong w-full max-w-md rounded-5xl p-8 sm:p-10"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.6, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.15 }}
            className="mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-glow-aqua to-glow-sky shadow-glow"
          >
            <Sparkles size={28} className="text-ink-900" />
          </motion.div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gradient">Benvenuto in Auralis</h1>
          <p className="mt-2 text-sm text-white/50">Accedi con il tuo account Garmin per collegare i tuoi dati reali.</p>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <Field icon={Mail}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Garmin Connect"
              autoComplete="username"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none"
            />
          </Field>
          <Field icon={Lock}>
            <input
              type={show ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none"
            />
            <button type="button" onClick={() => setShow((s) => !s)} className="text-white/40 hover:text-white/70">
              {show ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </Field>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-glow-coral/12 px-3 py-2 text-xs text-glow-coral"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={busy}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-glow-aqua to-glow-sky py-3.5 text-sm font-semibold text-ink-900 shadow-glow transition-opacity disabled:opacity-60"
          >
            {busy ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-900/30 border-t-ink-900" />
                Connessione a Garmin…
              </>
            ) : (
              <>
                Accedi e collega <ArrowRight size={17} />
              </>
            )}
          </motion.button>
        </form>

        <button
          onClick={continueDemo}
          className="mt-4 w-full rounded-2xl border border-white/10 bg-white/4 py-3 text-sm text-white/60 transition-colors hover:bg-white/8"
        >
          Continua in modalità demo
        </button>

        <div className="mt-6 space-y-2 text-[11px] leading-relaxed text-white/35">
          <p className="flex items-start gap-2">
            <ShieldCheck size={14} className="mt-0.5 shrink-0 text-glow-lime" />
            Le credenziali vengono usate solo per il login a Garmin e <strong className="text-white/55">non vengono mai salvate</strong>: si conserva solo il token di sessione.
          </p>
          <p className="flex items-start gap-2">
            <Watch size={14} className="mt-0.5 shrink-0 text-white/40" />
            Garmin non offre un login pubblico: questo accesso emula il flusso ufficiale di Garmin Connect. La verifica a due fattori non è ancora supportata.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

function Field({ icon: Icon, children }: { icon: typeof Mail; children: React.ReactNode }) {
  return (
    <div className="glass glass-spec flex items-center gap-3 rounded-2xl px-4 py-3.5">
      <Icon size={17} className="shrink-0 text-white/40" />
      {children}
    </div>
  )
}
