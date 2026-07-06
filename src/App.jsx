import { useEffect, useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Usuarios from './pages/admin/Usuarios'
import AdminCinesList from './pages/admin/CinesList'
import CineDetalle from './pages/admin/CineDetalle'
import CinesList from './pages/cliente/CinesList'
import FuncionesDeCine from './pages/cliente/FuncionesDeCine'
import Butacas from './pages/cliente/Butacas'
import Perfil from './pages/cliente/Perfil'

const ADMIN_TABS = [
  { id: 'usuarios', label: 'Usuarios' },
  { id: 'cines', label: 'Cines' },
]

function Header({ user, displayName, isAdmin, adminTab, onAdminTabChange, verPerfil, onTogglePerfil, onShowLogin, onLogout }) {
  return (
    <header className="border-b border-white/10 bg-white/[0.02]">
      <div className="flex items-center justify-between px-6 py-3">
        <p className="font-display text-sm uppercase tracking-[0.35em] text-amber-400/80">
          Gestión de Cine
        </p>
        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              {!isAdmin && (
                <button
                  type="button"
                  onClick={onTogglePerfil}
                  className="rounded-md px-3 py-1.5 text-sm text-slate-300 transition hover:bg-white/5"
                >
                  {verPerfil ? 'Ver cines' : 'Mi perfil'}
                </button>
              )}
              <span className="text-slate-300">{displayName}</span>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-md border border-white/10 px-3 py-1 text-xs text-slate-300 transition hover:bg-white/5"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onShowLogin}
              className="rounded-md bg-amber-400 px-3 py-1.5 text-xs font-medium text-slate-900 transition hover:bg-amber-300"
            >
              Iniciar sesión
            </button>
          )}
        </div>
      </div>
      {isAdmin && (
        <nav className="flex gap-1 px-6 pb-2">
          {ADMIN_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onAdminTabChange(t.id)}
              className={`rounded-md px-3 py-1.5 text-sm transition ${
                adminTab === t.id
                  ? 'bg-amber-400/15 text-amber-400'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  )
}

function CatalogoPublico() {
  const [cine, setCine] = useState(null)
  const [funcion, setFuncion] = useState(null)

  if (funcion) {
    return <Butacas funcion={funcion} onBack={() => setFuncion(null)} />
  }
  if (cine) {
    return <FuncionesDeCine cine={cine} onBack={() => setCine(null)} onSelect={setFuncion} />
  }
  return <CinesList onSelect={setCine} />
}

function AdminCines() {
  const [cine, setCine] = useState(null)

  if (cine) {
    return <CineDetalle cine={cine} onBack={() => setCine(null)} />
  }
  return <AdminCinesList onSelect={setCine} />
}

function Root() {
  const { user, role, displayName, loading, logout } = useAuth()
  const [adminTab, setAdminTab] = useState('usuarios')
  const [verPerfil, setVerPerfil] = useState(false)
  const [mostrarLogin, setMostrarLogin] = useState(false)

  useEffect(() => {
    if (user) setMostrarLogin(false)
  }, [user])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0d14] text-slate-400">
        Cargando…
      </div>
    )
  }

  const isAdmin = role === 'admin'

  return (
    <div className="min-h-screen bg-[#0b0d14]">
      <Header
        user={user}
        displayName={displayName}
        isAdmin={isAdmin}
        adminTab={adminTab}
        onAdminTabChange={setAdminTab}
        verPerfil={verPerfil}
        onTogglePerfil={() => setVerPerfil((v) => !v)}
        onShowLogin={() => setMostrarLogin(true)}
        onLogout={logout}
      />
      {isAdmin ? (
        adminTab === 'cines' ? (
          <AdminCines />
        ) : (
          <Usuarios />
        )
      ) : mostrarLogin && !user ? (
        <div>
          <p className="px-6 pt-6 text-center">
            <button
              type="button"
              onClick={() => setMostrarLogin(false)}
              className="text-sm text-slate-500 hover:text-slate-300"
            >
              ← Volver
            </button>
          </p>
          <Login />
        </div>
      ) : verPerfil && user ? (
        <Perfil />
      ) : (
        <CatalogoPublico />
      )}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  )
}

export default App
