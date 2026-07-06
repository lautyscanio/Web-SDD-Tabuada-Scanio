import { useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const ERROR_MESSAGES = {
  'auth/email-already-in-use': 'Ese email ya está registrado. Iniciá sesión en cambio.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/invalid-email': 'El email no tiene un formato válido.',
  'auth/invalid-credential': 'Email o contraseña incorrectos.',
  'auth/wrong-password': 'Email o contraseña incorrectos.',
  'auth/user-not-found': 'Email o contraseña incorrectos.',
  'auth/too-many-requests': 'Demasiados intentos. Esperá un momento y volvé a intentar.',
  'auth/network-request-failed': 'Sin conexión. Revisá tu red e intentá de nuevo.',
}

function messageFor(err) {
  return ERROR_MESSAGES[err?.code] ?? 'Ocurrió un error inesperado. Intentá de nuevo.'
}

export default function Login() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (mode === 'signup') {
        const credential = await createUserWithEmailAndPassword(auth, email, password)
        await setDoc(doc(db, 'users', credential.user.uid), {
          email,
          role: 'cliente',
          createdAt: new Date().toISOString(),
        })
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (err) {
      setError(messageFor(err))
    } finally {
      setSubmitting(false)
    }
  }

  function toggleMode() {
    setMode((m) => (m === 'login' ? 'signup' : 'login'))
    setError('')
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b0d14] px-4">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 flex h-3 gap-2 px-4 opacity-30"
        aria-hidden="true"
      >
        {Array.from({ length: 48 }).map((_, i) => (
          <span key={i} className="h-3 w-2 shrink-0 rounded-[2px] bg-amber-400" />
        ))}
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 flex h-3 gap-2 px-4 opacity-30"
        aria-hidden="true"
      >
        {Array.from({ length: 48 }).map((_, i) => (
          <span key={i} className="h-3 w-2 shrink-0 rounded-[2px] bg-amber-400" />
        ))}
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-400/80">
            Gestión de Cine
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-50">
            {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/40 backdrop-blur"
        >
          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-medium text-slate-400">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vos@ejemplo.com"
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-slate-100 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-xs font-medium text-slate-400">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-slate-100 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-amber-400 py-2 font-medium text-slate-900 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Un momento…' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          {mode === 'login' ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
          <button
            type="button"
            onClick={toggleMode}
            className="font-medium text-amber-400 hover:text-amber-300"
          >
            {mode === 'login' ? 'Registrate' : 'Iniciá sesión'}
          </button>
        </p>
      </div>
    </div>
  )
}
