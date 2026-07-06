import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Usuarios from './pages/admin/Usuarios'

function Header({ user, role, onLogout }) {
  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-6 py-3">
      <p className="text-xs uppercase tracking-[0.3em] text-amber-400/80">Gestión de Cine</p>
      <div className="flex items-center gap-3 text-sm text-slate-400">
        <span>
          {user.email} · <span className="text-amber-400">{role ?? 'sin rol'}</span>
        </span>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-md border border-white/10 px-3 py-1 text-xs text-slate-300 transition hover:bg-white/5"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}

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
    <div className="min-h-screen bg-[#0b0d14]">
      <Header user={user} role={role} onLogout={logout} />
      {role === 'admin' ? (
        <Usuarios />
      ) : (
        <div className="mx-auto max-w-md p-6 text-center text-slate-400">
          <p>La compra de entradas se agrega en el próximo módulo.</p>
        </div>
      )}
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
