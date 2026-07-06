import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Usuarios from './pages/admin/Usuarios'
import Cines from './pages/admin/Cines'
import CinesList from './pages/cliente/CinesList'
import FuncionesDeCine from './pages/cliente/FuncionesDeCine'
import Butacas from './pages/cliente/Butacas'
import Perfil from './pages/cliente/Perfil'

const ADMIN_TABS = [
  { id: 'usuarios', label: 'Usuarios' },
  { id: 'cines', label: 'Cines' },
]

function Header({ user, role, tab, onTabChange, onLogout }) {
  const tabs = role === 'admin' ? ADMIN_TABS : [{ id: 'catalogo', label: 'Cines' }, { id: 'perfil', label: 'Mi perfil' }]

  return (
    <header className="border-b border-white/10 bg-white/[0.02]">
      <div className="flex items-center justify-between px-6 py-3">
        <p className="font-display text-sm uppercase tracking-[0.35em] text-amber-400/80">
          Gestión de Cine
        </p>
        <div className="flex items-center gap-3 text-sm text-slate-400">
          {user ? (
            <>
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
            </>
          ) : (
            <span className="text-slate-500">Sin cuenta — podés navegar igual</span>
          )}
        </div>
      </div>
      {(role === 'admin' || user) && (
        <nav className="flex gap-1 px-6 pb-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onTabChange(t.id)}
              className={`rounded-md px-3 py-1.5 text-sm transition ${
                tab === t.id
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

function Root() {
  const { user, role, loading, logout } = useAuth()
  const [adminTab, setAdminTab] = useState('usuarios')
  const [clienteTab, setClienteTab] = useState('catalogo')

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0d14] text-slate-400">
        Cargando…
      </div>
    )
  }

  const isAdmin = role === 'admin'
  const tab = isAdmin ? adminTab : clienteTab
  const onTabChange = isAdmin ? setAdminTab : setClienteTab

  return (
    <div className="min-h-screen bg-[#0b0d14]">
      <Header user={user} role={role} tab={tab} onTabChange={onTabChange} onLogout={logout} />
      {isAdmin ? (
        adminTab === 'cines' ? (
          <Cines />
        ) : (
          <Usuarios />
        )
      ) : clienteTab === 'perfil' && user ? (
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
