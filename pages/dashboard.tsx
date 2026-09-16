import { FormEvent, useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { useRouter } from 'next/router'
import { auth, firebaseConfigured } from '@/lib/firebase'
import { cancelarReserva, criarReserva, listarReservas } from '@/services/reservas'
import type { PerfilProfessor, Recurso, Reserva, Turno } from '@/types/agendamento'
import { gradeHorarios } from '@/types/agendamento'

const recursos: Record<Recurso, string> = { video: 'Sala de vídeo', informatica: 'Laboratório de informática', pedagogico: 'Recursos pedagógicos' }
const turnos: Record<Turno, string> = { matutino: 'Matutino', vespertino: 'Vespertino', noturno: 'Noturno' }

function dataLocal(days = 0) { const date = new Date(); date.setDate(date.getDate() + days); return date.toISOString().slice(0, 10) }

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [perfil] = useState<PerfilProfessor>('regular')
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [form, setForm] = useState({ recurso: 'video' as Recurso, data: dataLocal(1), turno: 'matutino' as Turno, aulaId: 'matutino-1', turma: '', finalidade: '' })

  const aulas = gradeHorarios[form.turno]
  const aulaSelecionada = aulas.find((aula) => aula.id === form.aulaId) || aulas[0]
  const limiteDias = perfil === 'tecnico' ? 14 : 7
  const maxDate = useMemo(() => dataLocal(limiteDias), [limiteDias])

  async function carregar() { try { setReservas(await listarReservas()) } catch (error) { setErro(error instanceof Error ? error.message : 'Não foi possível carregar a agenda.') } finally { setCarregando(false) } }

  useEffect(() => {
    if (!auth) { setCarregando(false); return }
    return onAuthStateChanged(auth, (currentUser) => { if (!currentUser) void router.replace('/'); else { setUser(currentUser); void carregar() } })
  }, [router])

  function mudarTurno(turno: Turno) { const primeiraAula = gradeHorarios[turno][0]; setForm({ ...form, turno, aulaId: primeiraAula.id }) }

  async function salvar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!user || !aulaSelecionada) return
    setErro(''); setMensagem(''); setEnviando(true)
    try {
      await criarReserva({ usuarioId: user.uid, nomeProfessor: user.displayName || user.email?.split('@')[0] || 'Professor', emailProfessor: user.email || '', perfilProfessor: perfil, recurso: form.recurso, data: form.data, turno: form.turno, aulaId: aulaSelecionada.id, aulaLabel: aulaSelecionada.label, horario: `${aulaSelecionada.inicio}-${aulaSelecionada.fim}`, turma: form.turma, finalidade: form.finalidade })
      setMensagem('Reserva criada com sucesso.'); setForm({ ...form, turma: '', finalidade: '' }); await carregar()
    } catch (error) { setErro(error instanceof Error ? error.message : 'Não foi possível criar a reserva.') } finally { setEnviando(false) }
  }

  async function sair() { if (auth) await signOut(auth); await router.push('/') }
  async function cancelar(id: string) {
    if (!window.confirm('Você realmente deseja cancelar esta reserva?')) return
    const confirmacao = window.prompt('Para confirmar pela segunda vez, digite CANCELAR:')
    if (confirmacao?.trim().toUpperCase() !== 'CANCELAR') {
      setMensagem('Cancelamento interrompido.')
      return
    }
    try { await cancelarReserva(id); setMensagem('Reserva cancelada.'); await carregar() } catch { setErro('Não foi possível cancelar a reserva.') }
  }

  return <div className="page"><header className="header"><div className="container header-content"><div><h1>Agenda escolar</h1><p>{user?.email}</p></div><button className="secondary" onClick={sair}>Sair</button></div></header><main className="container"><p className="muted">Perfil atual: <strong>{perfil === 'tecnico' ? 'Professor técnico' : 'Professor regular'}</strong> · Reservas até {limiteDias} dias à frente.</p>{mensagem && <p className="success">{mensagem}</p>}{erro && <p className="error">{erro}</p>}<section className="card"><h2>Nova reserva</h2><form className="form" onSubmit={salvar}><div className="reservation-grid"><label>Recurso<select value={form.recurso} onChange={(e) => setForm({ ...form, recurso: e.target.value as Recurso })}>{Object.entries(recursos).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><label>Data<input type="date" min={dataLocal(0)} max={maxDate} value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} required /></label><label>Turno<select value={form.turno} onChange={(e) => mudarTurno(e.target.value as Turno)}>{Object.entries(turnos).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><label>Aula<select value={form.aulaId} onChange={(e) => setForm({ ...form, aulaId: e.target.value })}>{aulas.map((aula) => <option value={aula.id} key={aula.id}>{aula.label}</option>)}</select></label><label>Turma<input value={form.turma} onChange={(e) => setForm({ ...form, turma: e.target.value })} required maxLength={30} placeholder="Ex.: 2º ano A" /></label></div><label>Finalidade<input value={form.finalidade} onChange={(e) => setForm({ ...form, finalidade: e.target.value })} required maxLength={120} placeholder="Ex.: Aula de Biologia" /></label><button className="primary" disabled={enviando || !firebaseConfigured}>{enviando ? 'Salvando...' : 'Solicitar reserva'}</button></form></section><section className="card"><h2>Agenda compartilhada</h2>{carregando ? <p>Carregando...</p> : reservas.length === 0 ? <p className="muted">Nenhuma reserva encontrada.</p> : <div className="reservation-list">{reservas.map((item) => <article className="reservation" key={item.id}><div><strong>{recursos[item.recurso] || item.recurso}</strong><div>{item.data} · {turnos[item.turno] || item.turno} · {item.aulaLabel || item.horario}</div><div>{item.turma} · {item.nomeProfessor}</div><div className="muted">{item.finalidade}</div></div>{item.usuarioId === user?.uid && <button className="danger" onClick={() => cancelar(item.id)}>Cancelar</button>}</article>)}</div>}</section></main></div>
}
