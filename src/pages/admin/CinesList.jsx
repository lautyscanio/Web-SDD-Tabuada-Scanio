import { useEffect, useState } from 'react'
import { addDoc, collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase'

export default function CinesList({ onSelect }) {
  const [cines, setCines] = useState([])
  const [loading, setLoading] = useState(true)
  const [nombre, setNombre] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'cines'),
      (snap) => {
        setCines(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      () => setLoading(false),
    )
    return unsubscribe
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!nombre.trim() || !ubicacion.trim()) {
      setError('Completá nombre y ubicación.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await addDoc(collection(db, 'cines'), { nombre: nombre.trim(), ubicacion: ubicacion.trim() })
      setNombre('')
      setUbicacion('')
    } catch {
      setError('No se pudo crear el cine.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id, e) {
    e.stopPropagation()
    try {
      await deleteDoc(doc(db, 'cines', id))
    } catch {
      setError('No se pudo borrar el cine.')
    }
  }

  if (loading) return <p className="p-6 text-slate-400">Cargando cines…</p>

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h2 className="mb-4 font-display text-3xl tracking-wide text-slate-100">Cines</h2>

      <form onSubmit={handleSubmit} className="mb-4 flex flex-wrap gap-2">
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
          className="flex-1 min-w-[120px] rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-sm text-slate-100 outline-none focus:border-amber-400/60"
        />
        <input
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
          placeholder="Ubicación"
          className="flex-1 min-w-[120px] rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-sm text-slate-100 outline-none focus:border-amber-400/60"
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-amber-400 px-3 py-1.5 text-sm font-medium text-slate-900 transition hover:bg-amber-300 disabled:opacity-50"
        >
          Agregar
        </button>
      </form>
      {error && <p className="mb-3 text-xs text-red-400">{error}</p>}

      {cines.length === 0 ? (
        <p className="text-sm text-slate-500">Sin cines todavía.</p>
      ) : (
        <ul className="space-y-2">
          {cines.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onSelect(c)}
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 text-left transition hover:border-amber-400/40 hover:bg-white/[0.04]"
              >
                <div>
                  <p className="font-medium text-slate-100">{c.nombre}</p>
                  <p className="text-sm text-slate-400">{c.ubicacion}</p>
                </div>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => handleDelete(c.id, e)}
                  className="rounded-md border border-white/10 px-2 py-1 text-xs text-red-400 transition hover:bg-red-500/10"
                >
                  Borrar
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
