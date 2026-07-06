import { useEffect, useState } from 'react'
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../firebase'

const inputClass =
  'rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-sm text-slate-100 outline-none focus:border-amber-400/60'

function useLiveCollection(name, cineId) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, name), where('cineId', '==', cineId))
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      () => setLoading(false),
    )
    return unsubscribe
  }, [name, cineId])

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

function SalasSection({ cine, salas }) {
  const [nombre, setNombre] = useState('')
  const [filas, setFilas] = useState('8')
  const [columnas, setColumnas] = useState('10')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const f = Number(filas)
    const c = Number(columnas)
    if (!nombre.trim() || !Number.isInteger(f) || f <= 0 || !Number.isInteger(c) || c <= 0) {
      setError('Completá nombre y filas/columnas numéricas.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await addDoc(collection(db, 'salas'), { cineId: cine.id, nombre: nombre.trim(), filas: f, columnas: c })
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

  return (
    <Section title="Salas">
      <form onSubmit={handleSubmit} className="mb-3 flex flex-wrap gap-2">
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
          disabled={submitting}
          className="rounded-md bg-amber-400 px-3 py-1.5 text-sm font-medium text-slate-900 transition hover:bg-amber-300 disabled:opacity-50"
        >
          Agregar
        </button>
      </form>
      {error && <p className="mb-2 text-xs text-red-400">{error}</p>}
      {salas.length === 0 ? (
        <p className="text-sm text-slate-500">Sin salas todavía.</p>
      ) : (
        <ul>
          {salas.map((s) => (
            <ListRow
              key={s.id}
              label={s.nombre}
              sub={`${s.filas}x${s.columnas} butacas`}
              onDelete={() => handleDelete(s.id)}
            />
          ))}
        </ul>
      )}
    </Section>
  )
}

const IDIOMA_OPCIONES = [
  { value: '', label: 'Idioma (opcional)…' },
  { value: 'espanol', label: 'Doblada al español' },
  { value: 'subtitulada', label: 'Subtitulada' },
]

function FuncionesSection({ cine, salas, funciones }) {
  const [salaId, setSalaId] = useState('')
  const [pelicula, setPelicula] = useState('')
  const [horario, setHorario] = useState('')
  const [idioma, setIdioma] = useState('')
  const [imagen, setImagen] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!salaId || !pelicula.trim() || !horario) {
      setError('Completá sala, película y horario.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const data = {
        cineId: cine.id,
        salaId,
        pelicula: pelicula.trim(),
        horario,
      }
      if (idioma) data.idioma = idioma
      if (imagen.trim()) data.imagen = imagen.trim()
      await addDoc(collection(db, 'funciones'), data)
      setPelicula('')
      setHorario('')
      setIdioma('')
      setImagen('')
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

  function salaName(id) {
    return salas.find((s) => s.id === id)?.nombre ?? 'sala eliminada'
  }

  return (
    <Section title="Funciones">
      <form onSubmit={handleSubmit} className="mb-3 flex flex-wrap gap-2">
        <select value={salaId} onChange={(e) => setSalaId(e.target.value)} className={inputClass}>
          <option value="">Sala…</option>
          {salas.map((s) => (
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
        <select value={idioma} onChange={(e) => setIdioma(e.target.value)} className={inputClass}>
          {IDIOMA_OPCIONES.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <input
          value={imagen}
          onChange={(e) => setImagen(e.target.value)}
          placeholder="Imagen (ej: matrix.jpg)"
          className={`flex-1 min-w-[140px] ${inputClass}`}
        />
        <button
          type="submit"
          disabled={submitting || salas.length === 0}
          className="rounded-md bg-amber-400 px-3 py-1.5 text-sm font-medium text-slate-900 transition hover:bg-amber-300 disabled:opacity-50"
        >
          Agregar
        </button>
      </form>
      {salas.length === 0 && <p className="mb-2 text-xs text-slate-500">Cargá una sala primero.</p>}
      {error && <p className="mb-2 text-xs text-red-400">{error}</p>}
      {funciones.length === 0 ? (
        <p className="text-sm text-slate-500">Sin funciones todavía.</p>
      ) : (
        <ul>
          {funciones.map((f) => (
            <ListRow
              key={f.id}
              label={f.pelicula}
              sub={`${salaName(f.salaId)} · ${f.horario}${f.idioma ? ` · ${f.idioma === 'espanol' ? 'Doblada' : 'Subtitulada'}` : ''}${f.imagen ? ` · ${f.imagen}` : ''}`}
              onDelete={() => handleDelete(f.id)}
            />
          ))}
        </ul>
      )}
    </Section>
  )
}

export default function CineDetalle({ cine, onBack }) {
  const { items: salas, loading: loadingSalas } = useLiveCollection('salas', cine.id)
  const { items: funciones, loading: loadingFunciones } = useLiveCollection('funciones', cine.id)

  return (
    <div className="mx-auto max-w-3xl p-6">
      <button type="button" onClick={onBack} className="mb-4 text-sm text-slate-400 hover:text-slate-200">
        ← Volver a cines
      </button>
      <h2 className="mb-1 font-display text-3xl tracking-wide text-slate-100">{cine.nombre}</h2>
      <p className="mb-6 text-sm text-slate-500">{cine.ubicacion}</p>

      {loadingSalas || loadingFunciones ? (
        <p className="text-slate-400">Cargando…</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <SalasSection cine={cine} salas={salas} />
          <FuncionesSection cine={cine} salas={salas} funciones={funciones} />
        </div>
      )}
    </div>
  )
}
