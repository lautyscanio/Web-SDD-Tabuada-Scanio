import { useEffect, useState } from 'react'
import { addDoc, collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase'

function useLiveCollection(name) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, name),
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      () => setLoading(false),
    )
    return unsubscribe
  }, [name])

  return { items, loading }
}

function Section({ title, children }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-amber-400/80">
        {title}
      </h3>
      {children}
    </section>
  )
}

function ListRow({ label, sub, onDelete }) {
  return (
    <li className="flex items-center justify-between border-b border-white/5 py-2 text-sm last:border-0">
      <div>
        <p className="text-slate-200">{label}</p>
        {sub && <p className="text-xs text-slate-500">{sub}</p>}
      </div>
      <button
        type="button"
        onClick={onDelete}
        className="rounded-md border border-white/10 px-2 py-1 text-xs text-red-400 transition hover:bg-red-500/10"
      >
        Borrar
      </button>
    </li>
  )
}

const inputClass =
  'rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-sm text-slate-100 outline-none focus:border-amber-400/60'

function CinesSection({ cines }) {
  const [nombre, setNombre] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

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

  async function handleDelete(id) {
    try {
      await deleteDoc(doc(db, 'cines', id))
    } catch {
      setError('No se pudo borrar el cine.')
    }
  }

  return (
    <Section title="Cines">
      <form onSubmit={handleSubmit} className="mb-3 flex flex-wrap gap-2">
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
          className={`flex-1 min-w-[120px] ${inputClass}`}
        />
        <input
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
          placeholder="Ubicación"
          className={`flex-1 min-w-[120px] ${inputClass}`}
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-amber-400 px-3 py-1.5 text-sm font-medium text-slate-900 transition hover:bg-amber-300 disabled:opacity-50"
        >
          Agregar
        </button>
      </form>
      {error && <p className="mb-2 text-xs text-red-400">{error}</p>}
      {cines.length === 0 ? (
        <p className="text-sm text-slate-500">Sin cines todavía.</p>
      ) : (
        <ul>
          {cines.map((c) => (
            <ListRow key={c.id} label={c.nombre} sub={c.ubicacion} onDelete={() => handleDelete(c.id)} />
          ))}
        </ul>
      )}
    </Section>
  )
}

function SalasSection({ cines, salas }) {
  const [cineId, setCineId] = useState('')
  const [nombre, setNombre] = useState('')
  const [filas, setFilas] = useState('8')
  const [columnas, setColumnas] = useState('10')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const f = Number(filas)
    const c = Number(columnas)
    if (!cineId) {
      setError('Elegí un cine.')
      return
    }
    if (!nombre.trim() || !Number.isInteger(f) || f <= 0 || !Number.isInteger(c) || c <= 0) {
      setError('Completá nombre y filas/columnas numéricas.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await addDoc(collection(db, 'salas'), { cineId, nombre: nombre.trim(), filas: f, columnas: c })
      setNombre('')
    } catch {
      setError('No se pudo crear la sala.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteDoc(doc(db, 'salas', id))
    } catch {
      setError('No se pudo borrar la sala.')
    }
  }

  function cineName(id) {
    return cines.find((c) => c.id === id)?.nombre ?? 'cine eliminado'
  }

  return (
    <Section title="Salas">
      <form onSubmit={handleSubmit} className="mb-3 flex flex-wrap gap-2">
        <select value={cineId} onChange={(e) => setCineId(e.target.value)} className={inputClass}>
          <option value="">Cine…</option>
          {cines.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de sala"
          className={`flex-1 min-w-[100px] ${inputClass}`}
        />
        <input
          type="number"
          value={filas}
          onChange={(e) => setFilas(e.target.value)}
          placeholder="Filas"
          className={`w-20 ${inputClass}`}
        />
        <input
          type="number"
          value={columnas}
          onChange={(e) => setColumnas(e.target.value)}
          placeholder="Columnas"
          className={`w-24 ${inputClass}`}
        />
        <button
          type="submit"
          disabled={submitting || cines.length === 0}
          className="rounded-md bg-amber-400 px-3 py-1.5 text-sm font-medium text-slate-900 transition hover:bg-amber-300 disabled:opacity-50"
        >
          Agregar
        </button>
      </form>
      {cines.length === 0 && <p className="mb-2 text-xs text-slate-500">Cargá un cine primero.</p>}
      {error && <p className="mb-2 text-xs text-red-400">{error}</p>}
      {salas.length === 0 ? (
        <p className="text-sm text-slate-500">Sin salas todavía.</p>
      ) : (
        <ul>
          {salas.map((s) => (
            <ListRow
              key={s.id}
              label={`${s.nombre} · ${cineName(s.cineId)}`}
              sub={`${s.filas}x${s.columnas} butacas`}
              onDelete={() => handleDelete(s.id)}
            />
          ))}
        </ul>
      )}
    </Section>
  )
}

function FuncionesSection({ cines, salas, funciones }) {
  const [cineId, setCineId] = useState('')
  const [salaId, setSalaId] = useState('')
  const [pelicula, setPelicula] = useState('')
  const [horario, setHorario] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const salasDelCine = salas.filter((s) => s.cineId === cineId)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!cineId || !salaId || !pelicula.trim() || !horario) {
      setError('Completá cine, sala, película y horario.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await addDoc(collection(db, 'funciones'), {
        cineId,
        salaId,
        pelicula: pelicula.trim(),
        horario,
      })
      setPelicula('')
      setHorario('')
    } catch {
      setError('No se pudo crear la función.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteDoc(doc(db, 'funciones', id))
    } catch {
      setError('No se pudo borrar la función.')
    }
  }

  function cineName(id) {
    return cines.find((c) => c.id === id)?.nombre ?? 'cine eliminado'
  }
  function salaName(id) {
    return salas.find((s) => s.id === id)?.nombre ?? 'sala eliminada'
  }

  return (
    <Section title="Funciones">
      <form onSubmit={handleSubmit} className="mb-3 flex flex-wrap gap-2">
        <select
          value={cineId}
          onChange={(e) => {
            setCineId(e.target.value)
            setSalaId('')
          }}
          className={inputClass}
        >
          <option value="">Cine…</option>
          {cines.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
        <select
          value={salaId}
          onChange={(e) => setSalaId(e.target.value)}
          disabled={!cineId}
          className={`${inputClass} disabled:opacity-40`}
        >
          <option value="">Sala…</option>
          {salasDelCine.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre}
            </option>
          ))}
        </select>
        <input
          value={pelicula}
          onChange={(e) => setPelicula(e.target.value)}
          placeholder="Película"
          className={`flex-1 min-w-[120px] ${inputClass}`}
        />
        <input
          type="datetime-local"
          value={horario}
          onChange={(e) => setHorario(e.target.value)}
          className={inputClass}
        />
        <button
          type="submit"
          disabled={submitting || cines.length === 0}
          className="rounded-md bg-amber-400 px-3 py-1.5 text-sm font-medium text-slate-900 transition hover:bg-amber-300 disabled:opacity-50"
        >
          Agregar
        </button>
      </form>
      {error && <p className="mb-2 text-xs text-red-400">{error}</p>}
      {funciones.length === 0 ? (
        <p className="text-sm text-slate-500">Sin funciones todavía.</p>
      ) : (
        <ul>
          {funciones.map((f) => (
            <ListRow
              key={f.id}
              label={`${f.pelicula} · ${cineName(f.cineId)} (${salaName(f.salaId)})`}
              sub={f.horario}
              onDelete={() => handleDelete(f.id)}
            />
          ))}
        </ul>
      )}
    </Section>
  )
}

export default function Cines() {
  const { items: cines, loading: loadingCines } = useLiveCollection('cines')
  const { items: salas, loading: loadingSalas } = useLiveCollection('salas')
  const { items: funciones, loading: loadingFunciones } = useLiveCollection('funciones')

  if (loadingCines || loadingSalas || loadingFunciones) {
    return <p className="p-6 text-slate-400">Cargando…</p>
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-4 p-6 md:grid-cols-2">
      <div className="md:col-span-2">
        <CinesSection cines={cines} />
      </div>
      <SalasSection cines={cines} salas={salas} />
      <FuncionesSection cines={cines} salas={salas} funciones={funciones} />
    </div>
  )
}
