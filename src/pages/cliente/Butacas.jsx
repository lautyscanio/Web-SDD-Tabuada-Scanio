import { useEffect, useState } from 'react'
import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../context/AuthContext'
import { purchaseSeat } from '../../lib/purchaseSeat'

export default function Butacas({ funcion, onBack }) {
  const { user } = useAuth()
  const [sala, setSala] = useState(null)
  const [salaError, setSalaError] = useState(false)
  const [ocupadas, setOcupadas] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [purchasing, setPurchasing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    let cancelled = false
    getDoc(doc(db, 'salas', funcion.salaId))
      .then((snap) => {
        if (cancelled) return
        if (snap.exists()) setSala(snap.data())
        else setSalaError(true)
      })
      .catch(() => !cancelled && setSalaError(true))
    return () => {
      cancelled = true
    }
  }, [funcion.salaId])

  useEffect(() => {
    const seatsQuery = query(collection(db, 'boletos'), where('funcionId', '==', funcion.id))
    const unsubscribe = onSnapshot(
      seatsQuery,
      (snap) => {
        setOcupadas(new Set(snap.docs.map((d) => `${d.data().fila}-${d.data().columna}`)))
        setLoading(false)
      },
      () => {
        setError('No se pudo cargar el estado de las butacas.')
        setLoading(false)
      },
    )
    return unsubscribe
  }, [funcion.id])

  async function confirmarCompra() {
    if (!selected) return
    setPurchasing(true)
    setError('')
    try {
      await purchaseSeat({
        funcionId: funcion.id,
        fila: selected.fila,
        columna: selected.columna,
        userId: user.uid,
      })
      setSuccess(true)
      setSelected(null)
    } catch (err) {
      if (err.message === 'SEAT_TAKEN') {
        setError('Justo la agarraron — esa butaca ya no está libre. Elegí otra.')
      } else {
        setError('No se pudo confirmar la compra. Intentá de nuevo.')
      }
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) return <p className="p-6 text-slate-400">Cargando butacas…</p>
  if (salaError) {
    return (
      <div className="p-6">
        <button type="button" onClick={onBack} className="mb-4 text-sm text-slate-400 hover:text-slate-200">
          ← Volver a funciones
        </button>
        <p className="text-red-400">No se encontró la sala de esta función.</p>
      </div>
    )
  }

  const filas = Array.from({ length: sala.filas }, (_, i) => i + 1)
  const columnas = Array.from({ length: sala.columnas }, (_, i) => i + 1)

  return (
    <div className="mx-auto max-w-2xl p-6">
      <button type="button" onClick={onBack} className="mb-4 text-sm text-slate-400 hover:text-slate-200">
        ← Volver a funciones
      </button>
      <h2 className="mb-1 text-xl font-semibold text-slate-100">{funcion.pelicula}</h2>
      <p className="mb-4 text-sm text-slate-500">{funcion.horario}</p>

      {success && (
        <p className="mb-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
          ¡Entrada confirmada!
        </p>
      )}
      {error && (
        <p className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="mb-4 flex justify-center">
        <div className="rounded-b-full bg-white/10 px-16 py-1 text-center text-[10px] uppercase tracking-widest text-slate-400">
          Pantalla
        </div>
      </div>

      <div className="mb-6 space-y-1 overflow-x-auto">
        {filas.map((fila) => (
          <div key={fila} className="flex justify-center gap-1">
            {columnas.map((col) => {
              const key = `${fila}-${col}`
              const taken = ocupadas.has(key)
              const isSelected = selected?.fila === fila && selected?.columna === col
              return (
                <button
                  key={col}
                  type="button"
                  disabled={taken}
                  onClick={() => setSelected({ fila, columna: col })}
                  className={`h-6 w-6 shrink-0 rounded-[4px] text-[9px] transition ${
                    taken
                      ? 'cursor-not-allowed bg-red-500/70 text-red-950'
                      : isSelected
                        ? 'bg-amber-400 text-slate-900'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  {col}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-white/10" /> Libre
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-red-500/70" /> Ocupada
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-amber-400" /> Seleccionada
        </span>
      </div>

      <div className="text-center">
        <button
          type="button"
          disabled={!selected || purchasing}
          onClick={confirmarCompra}
          className="rounded-lg bg-amber-400 px-5 py-2 text-sm font-medium text-slate-900 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {purchasing
            ? 'Confirmando…'
            : selected
              ? `Confirmar butaca ${selected.fila}-${selected.columna}`
              : 'Elegí una butaca'}
        </button>
      </div>
    </div>
  )
}
