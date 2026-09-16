export type PerfilProfessor = 'tecnico' | 'regular'
export type Recurso = 'video' | 'informatica' | 'pedagogico'
export type StatusReserva = 'confirmada' | 'cancelada'
export type Turno = 'matutino' | 'vespertino' | 'noturno'

export interface HorarioAula { id: string; numero: string; inicio: string; fim: string; label: string }

export const gradeHorarios: Record<Turno, HorarioAula[]> = {
  matutino: [
    { id: 'matutino-1', numero: '1ª aula', inicio: '07:00', fim: '07:50', label: '1ª aula · 07:00–07:50' },
    { id: 'matutino-2', numero: '2ª aula', inicio: '07:50', fim: '08:40', label: '2ª aula · 07:50–08:40' },
    { id: 'matutino-3', numero: '3ª aula', inicio: '08:40', fim: '09:30', label: '3ª aula · 08:40–09:30' },
    { id: 'matutino-4', numero: '4ª aula', inicio: '09:50', fim: '10:40', label: '4ª aula · 09:50–10:40' },
    { id: 'matutino-5', numero: '5ª aula', inicio: '10:40', fim: '11:30', label: '5ª aula · 10:40–11:30' },
    { id: 'matutino-6', numero: '6ª aula', inicio: '11:30', fim: '12:20', label: '6ª aula · 11:30–12:20' },
  ],
  vespertino: [
    { id: 'vespertino-1', numero: '1ª aula', inicio: '13:00', fim: '13:50', label: '1ª aula · 13:00–13:50' },
    { id: 'vespertino-2', numero: '2ª aula', inicio: '13:50', fim: '14:40', label: '2ª aula · 13:50–14:40' },
    { id: 'vespertino-3', numero: '3ª aula', inicio: '14:40', fim: '15:30', label: '3ª aula · 14:40–15:30' },
    { id: 'vespertino-4', numero: '4ª aula', inicio: '15:50', fim: '16:40', label: '4ª aula · 15:50–16:40' },
    { id: 'vespertino-5', numero: '5ª aula', inicio: '16:40', fim: '17:30', label: '5ª aula · 16:40–17:30' },
    { id: 'vespertino-6', numero: '6ª aula', inicio: '17:30', fim: '18:20', label: '6ª aula · 17:30–18:20' },
  ],
  noturno: [
    { id: 'noturno-pre', numero: 'Pré-horário', inicio: '17:50', fim: '18:40', label: 'Pré-horário · 17:50–18:40' },
    { id: 'noturno-1', numero: '1ª aula', inicio: '18:40', fim: '19:30', label: '1ª aula · 18:40–19:30' },
    { id: 'noturno-2', numero: '2ª aula', inicio: '19:30', fim: '20:30', label: '2ª aula · 19:30–20:30' },
    { id: 'noturno-3', numero: '3ª aula', inicio: '20:30', fim: '21:20', label: '3ª aula · 20:30–21:20' },
    { id: 'noturno-4', numero: '4ª aula', inicio: '21:20', fim: '22:10', label: '4ª aula · 21:20–22:10' },
  ],
}

export interface PerfilUsuario { uid: string; nome: string; email: string; perfil: PerfilProfessor; ativo: boolean }

export interface Reserva {
  id: string; usuarioId: string; nomeProfessor: string; emailProfessor: string; perfilProfessor: PerfilProfessor
  recurso: Recurso; data: string; turno: Turno; aulaId: string; aulaLabel: string; horario: string
  turma: string; finalidade: string; status: StatusReserva; criadoEm?: unknown
}

export interface NovaReserva {
  usuarioId: string; nomeProfessor: string; emailProfessor: string; perfilProfessor: PerfilProfessor
  recurso: Recurso; data: string; turno: Turno; aulaId: string; aulaLabel: string; horario: string
  turma: string; finalidade: string
}
