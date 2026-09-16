# Agendamento Escolar

Versão reorganizada da plataforma de agendamento da Escola Estadual Felício Roxo.

## O que esta versão entrega

- login real por e-mail e senha com Firebase Authentication;
- agenda compartilhada;
- criação de reserva por recurso, data, horário, turma e finalidade;
- verificação de conflito antes de gravar;
- cancelamento da própria reserva;
- limite inicial de antecedência;
- TypeScript sem `any` nos modelos principais;
- variáveis de ambiente fora do código;
- regras iniciais do Firestore;
- build que não quebra quando o `.env.local` ainda não foi configurado.

## Instalação

```bash
npm install
cp .env.example .env.local
npm run dev
```

Preencha `.env.local` com a configuração do aplicativo Web do Firebase. Não publique `.env.local`.

## Firebase

No Firebase Console:

1. Ative Authentication > Sign-in method > E-mail/senha.
2. Crie os usuários autorizados em Authentication > Users.
3. Crie o Firestore Database.
4. Publique o conteúdo de `firestore.rules` nas regras do Firestore.
5. Para cada usuário, crie `users/{uid}` com os campos `nome`, `email`, `perfil` (`regular` ou `tecnico`) e `ativo: true`.

## Build

```bash
npm run typecheck
npm run build
npm run start
```

## Limitações conhecidas da primeira versão

O perfil do professor está temporariamente definido como `regular` no frontend para permitir uma primeira publicação segura. Antes de uso real, a leitura do perfil em `users/{uid}` deve ser ativada e a prioridade deve ser validada também no backend ou em uma Cloud Function.

A verificação de conflito no cliente evita o caso comum, mas concorrência simultânea exige uma transação ou uma Cloud Function para garantir exclusividade absoluta. O código atual é uma base funcional de autenticação e CRUD; não deve substituir as regras de produção sem esse endurecimento.

## Decisões

O projeto não usa calendário externo, biblioteca de calendário ou gerenciador de estado global. O formulário HTML e o Firestore são suficientes para a primeira versão. Recursos adicionais devem ser incluídos apenas quando houver necessidade comprovada.
