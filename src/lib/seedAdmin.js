import { doc, getDoc, setDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth, db } from '../firebase'

export const ADMIN_EMAIL = 'admin@gestioncine-scanio-tabuada.local'
// Firebase Auth exige mínimo 6 caracteres; el enunciado original pedía
// "123" pero eso no es aceptado por la plataforma (ver spec, Assumptions).
const ADMIN_PASSWORD = '123456'

const SEED_FLAG_REF = ['meta', 'adminSeeded']

// Corre una vez al montar la app, antes de que exista cualquier sesión.
// Usa un doc público mínimo (meta/adminSeeded) en vez de consultar la
// colección `users` directamente, porque esa consulta necesitaría lectura
// anónima sobre datos con emails — este flag no expone nada sensible.
export async function seedAdminIfMissing() {
  try {
    const flagDoc = doc(db, ...SEED_FLAG_REF)
    const flagSnap = await getDoc(flagDoc)
    if (flagSnap.exists() && flagSnap.data().seeded) return

    const credential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD)
    await setDoc(doc(db, 'users', credential.user.uid), {
      email: ADMIN_EMAIL,
      role: 'admin',
      nombre: 'Administrador',
      apellido: '',
      createdAt: new Date().toISOString(),
    })
    await setDoc(flagDoc, { seeded: true })
    await signOut(auth)
  } catch (err) {
    // Otra pestaña ya lo estaba creando al mismo tiempo: no es un error real.
    if (err.code === 'auth/email-already-in-use') return
    console.error('No se pudo crear el admin seed:', err)
  }
}
