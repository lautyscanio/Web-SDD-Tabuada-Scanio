import { doc, runTransaction, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

// Compra atómica de una o más butacas: dentro de una única transacción,
// lee TODOS los docs de butaca primero. Si alguno ya existe, aborta sin
// escribir ninguno (todo o nada) y devuelve cuál butaca fue la que falló.
// Si todos están libres, crea todos los docs en la misma transacción.
export async function purchaseSeats({ funcionId, seats, userId }) {
  const refs = seats.map((seat) => ({
    seat,
    ref: doc(db, 'boletos', `${funcionId}_${seat.fila}_${seat.columna}`),
  }))

  await runTransaction(db, async (tx) => {
    const snaps = await Promise.all(refs.map(({ ref }) => tx.get(ref)))

    const takenIndex = snaps.findIndex((snap) => snap.exists())
    if (takenIndex !== -1) {
      const error = new Error('SEAT_TAKEN')
      error.seat = refs[takenIndex].seat
      throw error
    }

    for (const { ref, seat } of refs) {
      tx.set(ref, {
        funcionId,
        fila: seat.fila,
        columna: seat.columna,
        userId,
        createdAt: serverTimestamp(),
      })
    }
  })
}
