export type PerfilProfessor = 'tecnico' | 'regular'
export type Recurso = 'video' | 'informatica' | 'pedagogico'
export type StatusReserva = 'confirmada' | 'cancelada'

export interface PerfilUsuario {
  uid: string
  nome: string
  email: string
  perfil: PerfilProfessor
  ativo: boolean
}

export interface Reserva {
  id: string
  usuarioId: string
  nomeProfessor: string
  emailProfessor: string
  perfilProfessor: PerfilProfessor
  recurso: Recurso
  data: string
  horario: string
  turma: string
  finalidade: string
  status: StatusReserva
  criadoEm?: unknown
}

export interface NovaReserva {
  usuarioId: string
  nomeProfessor: string
  emailProfessor: string
  perfilProfessor: PerfilProfessor
  recurso: Recurso
  data: string
  horario: string
  turma: string
  finalidade: string
}
