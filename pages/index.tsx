import { FormEvent, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'next/router'
import { auth, firebaseConfigured } from '@/lib/firebase'

export default function Home() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    if (!auth) return
    return onAuthStateChanged(auth, (user) => { if (user) void router.replace('/dashboard') })
  }, [router])

  async function entrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      if (!auth) throw new Error('Firebase não configurado.')
      await signInWithEmailAndPassword(auth, email.trim(), senha)
      await router.push('/dashboard')
    } catch (error) {
      const code = error instanceof Error && 'code' in error ? String((error as { code: string }).code) : ''
      setErro(code === 'auth/invalid-credential' ? 'E-mail ou senha inválidos.' : 'Não foi possível entrar. Verifique a configuração e tente novamente.')
    } finally { setCarregando(false) }
  }

  return <div className="page"><header className="header"><div className="container"><h1>Agendamento Escolar</h1><p>Escola Estadual Felício Roxo</p></div></header><main className="container"><div className="login-grid"><section><h2>Reserve recursos com organização</h2><p className="muted">Consulte a agenda e solicite horários para os recursos pedagógicos da escola.</p><ul className="features"><li>Agenda compartilhada</li><li>Controle de conflitos</li><li>Login seguro pelo Firebase</li></ul></section><section className="card"><h2>Entrar</h2>{!firebaseConfigured && <p className="error">Configure o arquivo .env.local antes de usar o login.</p>}{erro && <p className="error">{erro}</p>}<form className="form" onSubmit={entrar}><label>E-mail<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></label><label>Senha<input type="password" value={senha} onChange={(event) => setSenha(event.target.value)} required autoComplete="current-password" /></label><button className="primary" disabled={carregando || !firebaseConfigured}>{carregando ? 'Entrando...' : 'Entrar'}</button></form></section></div></main></div>
}
