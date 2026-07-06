import { useEffect, useState } from 'react'
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../context/AuthContext'

export default function Perfil() {
  const { user, profile, displayName } = useAuth()
  const [boletos, setBoletos] = useState([])
  const [funciones, setFunciones] = useState({})
  const [cines, setCines] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const boletosQuery = query(collection(db, 'boletos'), where('userId', '==', user.uid))
    const unsubscribe = onSnapshot(
      boletosQuery,
      async (snap) => {
        const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        setBoletos(lista)

        try {
          const [funcionesSnap, cinesSnap] = await Promise.all([
            getDocs(collection(db, 'funciones')),
            getDocs(collection(db, 'cines')),
          ])
          setFunciones(Object.fromEntries(funcionesSnap.docs.map((d) => [d.id, d.data()])))
          setCines(Object.fromEntries(cinesSnap.docs.map((d) => [d.id, d.data()])))
        } catch {
          // si falla el cruce de datos, igual mostramos los boletos con lo que haya
        }
        setLoading(false)
      },
      () => {
        setError('No se pudo cargar tu historial de reservas.')
        setLoading(false)
      },
    )
    return unsubscribe
  }, [user.uid])

  if (loading) return <p className="p-6 text-slate-400">Cargando tu perfil…</p>

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h2 className="mb-1 font-display text-3xl tracking-wide text-slate-100">Mi perfil</h2>
      <p className="mb-6 text-sm text-slate-500">
        {displayName}
        {profile?.dni && <> · DNI {profile.dni}</>}
      </p>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-amber-400/80">
        Mis reservas
      </h3>

      {error && (
        <p className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      {boletos.length === 0 ? (
        <p className="text-slate-500">Todavía no compraste ninguna entrada.</p>
      ) : (
        <ul className="space-y-2">
          {boletos.map((b) => {
            const funcion = funciones[b.funcionId]
            const cine = funcion ? cines[funcion.cineId] : null
            return (
              <li
                key={b.id}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm"
              >
                <p className="font-medium text-slate-100">
                  {funcion?.pelicula ?? 'Función eliminada'}
                </p>
                <p className="text-slate-400">
                  {cine?.nombre ?? ''} {funcion?.horario ? `· ${funcion.horario}` : ''}
                </p>
                <p className="text-xs text-slate-500">
                  Butaca {b.fila}-{b.columna}
                </p>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
