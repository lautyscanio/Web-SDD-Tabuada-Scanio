import { app } from './firebase'

function App() {
  const firebaseReady = Boolean(app.options.projectId)

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100 px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Sistema de Gestión de Cine
        </h1>
        <p className="text-slate-400">
          Setup inicial del proyecto en construcción.
        </p>
        <div
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${
            firebaseReady
              ? 'bg-emerald-500/15 text-emerald-400'
              : 'bg-red-500/15 text-red-400'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              firebaseReady ? 'bg-emerald-400' : 'bg-red-400'
            }`}
          />
          {firebaseReady
            ? `Firebase conectado (${app.options.projectId})`
            : 'Firebase sin configurar'}
        </div>
      </div>
    </div>
  )
}

export default App
