import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'

function AuthGate() {
  const { user, role, loading, logout } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0d14] text-slate-400">
        Cargando…
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0d14] px-4 text-slate-100">
      <div className="w-full max-w-md space-y-4 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-amber-400/80">
          Gestión de Cine
        </p>
        <h1 className="text-2xl font-semibold">Sesión iniciada</h1>
        <p className="text-slate-400">
          {user.email} · rol <span className="text-amber-400">{role ?? 'sin asignar'}</span>
        </p>
        <p className="text-sm text-slate-500">
          Las pantallas de {role === 'admin' ? 'administración' : 'compra de entradas'} se
          agregan en los próximos módulos.
        </p>
        <button
          type="button"
          onClick={logout}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  )
}

export default App
