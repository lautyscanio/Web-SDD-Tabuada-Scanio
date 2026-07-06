import { useEffect, useState } from 'react'
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../context/AuthContext'

export default function Usuarios() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pendingId, setPendingId] = useState(null)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'users'),
      (snap) => {
        setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      () => {
        setError('No se pudo cargar la lista de usuarios.')
        setLoading(false)
      },
    )
    return unsubscribe
  }, [])

  async function toggleRole(target) {
    if (target.id === user.uid) return
    setPendingId(target.id)
    setError('')
    try {
      await updateDoc(doc(db, 'users', target.id), {
        role: target.role === 'admin' ? 'cliente' : 'admin',
      })
    } catch {
      setError('No se pudo actualizar el rol. Intentá de nuevo.')
    } finally {
      setPendingId(null)
    }
  }

  async function toggleDisabled(target) {
    setPendingId(target.id)
    setError('')
    try {
      await updateDoc(doc(db, 'users', target.id), { disabled: !target.disabled })
    } catch {
      setError('No se pudo actualizar el estado. Intentá de nuevo.')
    } finally {
      setPendingId(null)
    }
  }

  if (loading) {
    return <p className="p-6 text-slate-400">Cargando usuarios…</p>
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <h2 className="mb-4 text-xl font-semibold text-slate-100">Usuarios</h2>

      {error && (
        <p className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      {users.length === 0 ? (
        <p className="text-slate-500">Todavía no hay usuarios.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.03] text-slate-400">
              <tr>
                <th className="px-4 py-2 font-medium">Email</th>
                <th className="px-4 py-2 font-medium">Rol</th>
                <th className="px-4 py-2 font-medium">Estado</th>
                <th className="px-4 py-2 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u.id} className="text-slate-200">
                  <td className="px-4 py-2">
                    {u.email}
                    {u.id === user.uid && (
                      <span className="ml-2 text-xs text-amber-400">(vos)</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        u.role === 'admin'
                          ? 'bg-amber-400/15 text-amber-400'
                          : 'bg-slate-500/15 text-slate-300'
                      }`}
                    >
                      {u.role ?? 'sin rol'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {u.disabled ? (
                      <span className="text-red-400">Deshabilitado</span>
                    ) : (
                      <span className="text-emerald-400">Activo</span>
                    )}
                  </td>
                  <td className="space-x-2 px-4 py-2 text-right">
                    <button
                      type="button"
                      disabled={u.id === user.uid || pendingId === u.id}
                      onClick={() => toggleRole(u)}
                      title={u.id === user.uid ? 'No podés cambiar tu propio rol' : ''}
                      className="rounded-md border border-white/10 px-2 py-1 text-xs text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {u.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                    </button>
                    <button
                      type="button"
                      disabled={pendingId === u.id}
                      onClick={() => toggleDisabled(u)}
                      className="rounded-md border border-white/10 px-2 py-1 text-xs text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {u.disabled ? 'Habilitar' : 'Deshabilitar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
