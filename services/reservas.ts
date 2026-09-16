import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, where } from 'firebase/firestore'
import { requireFirebase } from '@/lib/firebase'
import type { NovaReserva, Reserva } from '@/types/agendamento'

const COLLECTION = 'reservas'

export async function listarReservas(): Promise<Reserva[]> {
  const { db } = requireFirebase()
  const snapshot = await getDocs(query(collection(db, COLLECTION), orderBy('data', 'asc')))
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Reserva))
}

export async function criarReserva(reserva: NovaReserva): Promise<void> {
  const { db } = requireFirebase()
  const conflito = await getDocs(query(
    collection(db, COLLECTION),
    where('recurso', '==', reserva.recurso),
    where('data', '==', reserva.data),
    where('horario', '==', reserva.horario),
    where('status', '==', 'confirmada'),
  ))

  if (!conflito.empty) {
    throw new Error('Este recurso já está reservado para o horário escolhido.')
  }

  await addDoc(collection(db, COLLECTION), { ...reserva, status: 'confirmada', criadoEm: serverTimestamp() })
}

export async function cancelarReserva(id: string): Promise<void> {
  const { db } = requireFirebase()
  await deleteDoc(doc(db, COLLECTION, id))
}
