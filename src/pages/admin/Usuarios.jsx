import { useEffect, useState } from 'react'
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../context/AuthContext'
import { createUserAsAdmin } from '../../lib/createUserAsAdmin'
import { ADMIN_EMAIL } from '../../lib/seedAdmin'

const inputClass =
  'rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-sm text-slate-100 outline-none focus:border-amber-400/60'

const soloLetras = (v) => v.replace(/[^a-zA-ZáéíóúñÁÉÍÓÚÑüÜ\s]/g, '')
const soloNumeros = (v) => v.replace(/\D/g, '')

function NuevoAdminForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [dni, setDni] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (!nombre.trim() || !apellido.trim() || !email.trim()) {
      setError('Completá nombre, apellido y email.')
      return
    }
    if (dni.trim().length < 7 || dni.trim().length > 8) {
      setError('El DNI debe tener 7 u 8 dígitos.')
      return
    }
    setSubmitting(true)
    try {
      await createUserAsAdmin({
        email: email.trim(),
        password,
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        dni: dni.trim(),
        role: 'admin',
      })
      setSuccess(`Admin ${nombre} ${apellido} creado correctamente.`)
      setEmail('')
      setPassword('')
      setNombre('')
      setApellido('')
      setDni('')
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Ese email ya está registrado.')
      } else {
        setError('No se pudo crear el admin. Intentá de nuevo.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-amber-400/80">
        Registrar nuevo admin
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
        <input
          value={nombre}
          onChange={(e) => setNombre(soloLetras(e.target.value))}
          placeholder="Nombre"
          className={`w-28 ${inputClass}`}
        />
        <input
          value={apellido}
          onChange={(e) => setApellido(soloLetras(e.target.value))}
          placeholder="Apellido"
          className={`w-28 ${inputClass}`}
        />
        <input
          value={dni}
          onChange={(e) => setDni(soloNumeros(e.target.value))}
          placeholder="DNI"
          inputMode="numeric"
          maxLength={8}
          className={`w-24 ${inputClass}`}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className={`flex-1 min-w-[160px] ${inputClass}`}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className={`w-32 ${inputClass}`}
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-amber-400 px-3 py-1.5 text-sm font-medium text-slate-900 transition hover:bg-amber-300 disabled:opacity-50"
        >
          Crear admin
        </button>
      </form>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      {success && <p className="mt-2 text-xs text-emerald-400">{success}</p>}
    </div>
  )
}

export default function Usuarios() {
  const { user } = useAuth()
  const isAdminSeed = user.email === ADMIN_EMAIL
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
    if (target.role === 'admin' && !isAdminSeed) return
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

  async function borrarUsuario(target) {
    if (target.id === user.uid) return
    if (target.role === 'admin' && !isAdminSeed) return
    const nombreCompleto = target.nombre ? `${target.nombre} ${target.apellido ?? ''}`.trim() : target.email
    if (!window.confirm(`¿Borrar a ${nombreCompleto}? Esta acción no se puede deshacer.`)) return
    setPendingId(target.id)
    setError('')
    try {
      await deleteDoc(doc(db, 'users', target.id))
    } catch {
      setError('No se pudo borrar el usuario. Intentá de nuevo.')
    } finally {
      setPendingId(null)
    }
  }

  if (loading) {
    return <p className="p-6 text-slate-400">Cargando usuarios…</p>
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <h2 className="mb-4 font-display text-3xl tracking-wide text-slate-100">Usuarios</h2>

      <NuevoAdminForm />

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
                <th className="px-4 py-2 font-medium">Nombre</th>
                <th className="px-4 py-2 font-medium">Email</th>
                <th className="px-4 py-2 font-medium">DNI</th>
                <th className="px-4 py-2 font-medium">Rol</th>
                <th className="px-4 py-2 font-medium">Estado</th>
                <th className="px-4 py-2 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => {
                const esOtroAdminProtegido = u.role === 'admin' && !isAdminSeed
                return (
                  <tr key={u.id} className="text-slate-200">
                    <td className="px-4 py-2">
                      {u.nombre ? `${u.nombre} ${u.apellido ?? ''}`.trim() : '—'}
                      {u.id === user.uid && (
                        <span className="ml-2 text-xs text-amber-400">(vos)</span>
                      )}
                    </td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2">{u.dni ?? '—'}</td>
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
                        disabled={u.id === user.uid || esOtroAdminProtegido || pendingId === u.id}
                        onClick={() => toggleRole(u)}
                        title={
                          u.id === user.uid
                            ? 'No podés cambiar tu propio rol'
                            : esOtroAdminProtegido
                              ? 'Solo el admin por defecto puede quitarle el admin a otro admin'
                              : ''
                        }
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
                      <button
                        type="button"
                        disabled={u.id === user.uid || esOtroAdminProtegido || pendingId === u.id}
                        onClick={() => borrarUsuario(u)}
                        title={
                          u.id === user.uid
                            ? 'No podés borrarte a vos mismo'
                            : esOtroAdminProtegido
                              ? 'Solo el admin por defecto puede borrar a otro admin'
                              : ''
                        }
                        className="rounded-md border border-white/10 px-2 py-1 text-xs text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Borrar
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
