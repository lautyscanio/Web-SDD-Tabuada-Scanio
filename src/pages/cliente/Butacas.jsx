import { useEffect, useState } from 'react'
import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../context/AuthContext'
import { purchaseSeats } from '../../lib/purchaseSeats'
import Login from '../Login'

function seatKey(fila, columna) {
  return `${fila}-${columna}`
}

export default function Butacas({ funcion, onBack }) {
  const { user } = useAuth()
  const [sala, setSala] = useState(null)
  const [salaError, setSalaError] = useState(false)
  const [ocupadas, setOcupadas] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [seleccionadas, setSeleccionadas] = useState([])
  const [purchasing, setPurchasing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

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
        setOcupadas(new Set(snap.docs.map((d) => seatKey(d.data().fila, d.data().columna))))
        setLoading(false)
      },
      () => {
        setError('No se pudo cargar el estado de las butacas.')
        setLoading(false)
      },
    )
    return unsubscribe
  }, [funcion.id])

  // Si vuelve a haber sesión (se logueó/registró durante el gate), volver
  // al mapa de butacas manteniendo la selección — un clic más confirma.
  useEffect(() => {
    if (user && showLogin) setShowLogin(false)
  }, [user, showLogin])

  function toggleSeat(fila, columna) {
    const key = seatKey(fila, columna)
    setSeleccionadas((prev) =>
      prev.some((s) => seatKey(s.fila, s.columna) === key)
        ? prev.filter((s) => seatKey(s.fila, s.columna) !== key)
        : [...prev, { fila, columna }],
    )
  }

  function handleConfirmarClick() {
    if (seleccionadas.length === 0) return
    if (!user) {
      setShowLogin(true)
      return
    }
    confirmarCompra()
  }

  async function confirmarCompra() {
    setPurchasing(true)
    setError('')
    try {
      await purchaseSeats({ funcionId: funcion.id, seats: seleccionadas, userId: user.uid })
      setSuccess(true)
      setSeleccionadas([])
    } catch (err) {
      if (err.message === 'SEAT_TAKEN') {
        setError(
          `Justo agarraron la butaca ${err.seat.fila}-${err.seat.columna} — no se reservó ninguna. Elegí otra combinación.`,
        )
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
          ← Volver
        </button>
        <p className="text-red-400">No se encontró la sala de esta función.</p>
      </div>
    )
  }

  if (showLogin) {
    return (
      <div>
        <p className="mx-auto max-w-sm px-6 pt-6 text-center text-sm text-slate-400">
          Iniciá sesión o registrate para confirmar {seleccionadas.length}{' '}
          {seleccionadas.length === 1 ? 'butaca' : 'butacas'} — tu selección queda guardada.
        </p>
        <Login />
        <p className="pb-6 text-center">
          <button
            type="button"
            onClick={() => setShowLogin(false)}
            className="text-sm text-slate-500 hover:text-slate-300"
          >
            ← Volver al mapa de butacas
          </button>
        </p>
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
      <h2 className="mb-1 font-display text-3xl tracking-wide text-slate-100">{funcion.pelicula}</h2>
      <p className="mb-4 text-sm text-slate-500">{funcion.horario}</p>

      {success && (
        <p className="mb-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
          ¡Entrada(s) confirmada(s)!
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
              const key = seatKey(fila, col)
              const taken = ocupadas.has(key)
              const isSelected = seleccionadas.some((s) => seatKey(s.fila, s.columna) === key)
              return (
                <button
                  key={col}
                  type="button"
                  disabled={taken}
                  onClick={() => toggleSeat(fila, col)}
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
          disabled={seleccionadas.length === 0 || purchasing}
          onClick={handleConfirmarClick}
          className="rounded-lg bg-amber-400 px-5 py-2 text-sm font-medium text-slate-900 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {purchasing
            ? 'Confirmando…'
            : seleccionadas.length === 0
              ? 'Elegí una o más butacas'
              : `Confirmar ${seleccionadas.length} ${seleccionadas.length === 1 ? 'butaca' : 'butacas'}`}
        </button>
      </div>
    </div>
  )
}
