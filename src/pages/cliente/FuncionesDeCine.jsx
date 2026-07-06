import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../firebase'

const IDIOMA_LABEL = {
  espanol: 'Doblada al español',
  subtitulada: 'Subtitulada',
}

export default function FuncionesDeCine({ cine, onBack, onSelect }) {
  const [funciones, setFunciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const funcionesQuery = query(collection(db, 'funciones'), where('cineId', '==', cine.id))
    const unsubscribe = onSnapshot(
      funcionesQuery,
      (snap) => {
        setFunciones(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      () => {
        setError('No se pudieron cargar las funciones.')
        setLoading(false)
      },
    )
    return unsubscribe
  }, [cine.id])

  if (loading) return <p className="p-6 text-slate-400">Cargando funciones…</p>

  return (
    <div className="mx-auto max-w-2xl p-6">
      <button type="button" onClick={onBack} className="mb-4 text-sm text-slate-400 hover:text-slate-200">
        ← Volver a cines
      </button>
      <h2 className="mb-1 font-display text-3xl tracking-wide text-slate-100">{cine.nombre}</h2>
      <p className="mb-6 text-sm text-slate-500">{cine.ubicacion}</p>

      {error && (
        <p className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      {funciones.length === 0 ? (
        <p className="text-slate-500">Este cine no tiene funciones cargadas todavía.</p>
      ) : (
        <ul className="space-y-3">
          {funciones.map((f) => (
            <li key={f.id}>
              <button
                type="button"
                onClick={() => onSelect(f)}
                className="flex w-full items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-left transition hover:border-amber-400/40 hover:bg-white/[0.04]"
              >
                {f.imagen ? (
                  <img
                    src={`/imagenes/${f.imagen}`}
                    alt={f.pelicula}
                    className="h-20 w-14 shrink-0 rounded-md object-cover"
                    onError={(e) => {
                      e.currentTarget.style.visibility = 'hidden'
                    }}
                  />
                ) : (
                  <div className="flex h-20 w-14 shrink-0 items-center justify-center rounded-md bg-white/5 text-[10px] text-slate-500">
                    Sin poster
                  </div>
                )}
                <div>
                  <p className="font-medium text-slate-100">{f.pelicula}</p>
                  <p className="text-sm text-slate-400">{f.horario}</p>
                  {f.idioma && (
                    <span className="mt-1 inline-block rounded-full bg-amber-400/10 px-2 py-0.5 text-xs text-amber-400">
                      {IDIOMA_LABEL[f.idioma] ?? f.idioma}
                    </span>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
