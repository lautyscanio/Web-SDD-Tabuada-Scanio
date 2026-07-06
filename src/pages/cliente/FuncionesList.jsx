import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase'

export default function FuncionesList({ onSelect }) {
  const [cines, setCines] = useState([])
  const [funciones, setFunciones] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubCines = onSnapshot(collection(db, 'cines'), (snap) =>
      setCines(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    )
    const unsubFunciones = onSnapshot(collection(db, 'funciones'), (snap) => {
      setFunciones(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return () => {
      unsubCines()
      unsubFunciones()
    }
  }, [])

  function cineName(id) {
    return cines.find((c) => c.id === id)?.nombre ?? ''
  }

  if (loading) {
    return <p className="p-6 text-slate-400">Cargando funciones…</p>
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h2 className="mb-4 text-xl font-semibold text-slate-100">Elegí una función</h2>
      {funciones.length === 0 ? (
        <p className="text-slate-500">No hay funciones cargadas todavía.</p>
      ) : (
        <ul className="space-y-2">
          {funciones.map((f) => (
            <li key={f.id}>
              <button
                type="button"
                onClick={() => onSelect(f)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.02] p-4 text-left transition hover:border-amber-400/40 hover:bg-white/[0.04]"
              >
                <p className="font-medium text-slate-100">{f.pelicula}</p>
                <p className="text-sm text-slate-400">
                  {cineName(f.cineId)} · {f.horario}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
