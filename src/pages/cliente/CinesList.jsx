import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase'

export default function CinesList({ onSelect }) {
  const [cines, setCines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'cines'),
      (snap) => {
        setCines(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      () => {
        setError('No se pudieron cargar los cines.')
        setLoading(false)
      },
    )
    return unsubscribe
  }, [])

  if (loading) return <p className="p-6 text-slate-400">Cargando cines…</p>

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h2 className="mb-1 font-display text-3xl tracking-wide text-slate-100">Elegí un cine</h2>
      <p className="mb-6 text-sm text-slate-500">Explorá las funciones disponibles, sin necesidad de crear una cuenta.</p>

      {error && (
        <p className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      {cines.length === 0 ? (
        <p className="text-slate-500">No hay cines cargados todavía.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {cines.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onSelect(c)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.02] p-4 text-left transition hover:border-amber-400/40 hover:bg-white/[0.04]"
              >
                <p className="font-medium text-slate-100">{c.nombre}</p>
                <p className="text-sm text-slate-400">{c.ubicacion}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
