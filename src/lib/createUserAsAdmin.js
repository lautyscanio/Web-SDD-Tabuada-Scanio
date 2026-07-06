import { deleteApp, getApps, initializeApp } from 'firebase/app'
import { createUserWithEmailAndPassword, getAuth, signOut } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { db, firebaseConfig } from '../firebase'

// Crear un usuario (cliente o admin) desde la pantalla de un admin ya
// logueado, SIN cerrar la sesión del admin actual. El SDK de Firebase
// Auth inicia sesión automáticamente con el usuario recién creado en la
// instancia donde se lo crea — por eso se usa una app secundaria
// descartable, en vez de la instancia principal que usa toda la app.
export async function createUserAsAdmin({ email, password, nombre, apellido, dni, role }) {
  const secondaryName = `admin-create-${Date.now()}`
  const secondaryApp = initializeApp(firebaseConfig, secondaryName)
  const secondaryAuth = getAuth(secondaryApp)

  try {
    const credential = await createUserWithEmailAndPassword(secondaryAuth, email, password)
    await setDoc(doc(db, 'users', credential.user.uid), {
      email,
      nombre,
      apellido,
      dni,
      role,
      createdAt: new Date().toISOString(),
    })
    await signOut(secondaryAuth)
    return credential.user.uid
  } finally {
    const app = getApps().find((a) => a.name === secondaryName)
    if (app) await deleteApp(app)
  }
}
