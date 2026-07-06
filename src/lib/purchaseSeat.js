import { doc, runTransaction, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

// Transacción de Firestore: si dos clientes intentan comprar la misma
// butaca a la vez, Firestore serializa las transacciones sobre el mismo
// documento — la segunda relee después de que la primera confirmó, ve que
// ya existe, y lanza SEAT_TAKEN. No hace falta ningún lock manual.
export async function purchaseSeat({ funcionId, fila, columna, userId }) {
  const seatId = `${funcionId}_${fila}_${columna}`
  const seatRef = doc(db, 'boletos', seatId)

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(seatRef)
    if (snap.exists()) {
      throw new Error('SEAT_TAKEN')
    }
    tx.set(seatRef, {
      funcionId,
      fila,
      columna,
      userId,
      createdAt: serverTimestamp(),
    })
  })
}
