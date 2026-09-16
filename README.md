# Agendamento Escolar

Versão reorganizada da plataforma de agendamento da Escola Estadual Felício Roxo.

## O que esta versão entrega

- login real por e-mail e senha com Firebase Authentication;
- agenda compartilhada;
- criação de reserva por recurso, data, turno e aula;
- grade fixa de horários, sem digitação de horários inválidos;
- verificação de conflito antes de gravar;
- cancelamento da própria reserva;
- dupla confirmação para cancelar uma reserva;
- limite inicial de antecedência;
- TypeScript sem `any` nos modelos principais;
- variáveis de ambiente fora do código;
- regras iniciais do Firestore;
- build que não quebra quando o `.env.local` ainda não foi configurado.

## Grade de horários

### Matutino

- 1ª aula: 07:00–07:50
- 2ª aula: 07:50–08:40
- 3ª aula: 08:40–09:30
- Intervalo: 09:30–09:50
- 4ª aula: 09:50–10:40
- 5ª aula: 10:40–11:30
- 6ª aula: 11:30–12:20

### Vespertino

- 1ª aula: 13:00–13:50
- 2ª aula: 13:50–14:40
- 3ª aula: 14:40–15:30
- Intervalo: 15:30–15:50
- 4ª aula: 15:50–16:40
- 5ª aula: 16:40–17:30
- 6ª aula: 17:30–18:20

### Noturno

- Pré-horário: 17:50–18:40
- 1ª aula: 18:40–19:30
- 2ª aula: 19:30–20:30
- 3ª aula: 20:30–21:20
- 4ª aula: 21:20–22:10

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

## Cancelamento seguro

O cancelamento exige duas confirmações no navegador: a confirmação da ação e a digitação de `CANCELAR`. Além disso, a regra do Firestore só permite apagar uma reserva quando `usuarioId` é igual ao usuário autenticado. Portanto, esconder ou alterar o botão no frontend não permite que um professor apague a reserva de outra pessoa.

As regras também impedem que o próprio professor altere seu perfil de `regular` para `tecnico`. Perfis devem ser criados ou alterados por um administrador em um fluxo protegido.

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

O projeto não usa calendário externo, biblioteca de calendário ou gerenciador de estado global. A grade de horários é uma constante TypeScript porque é uma regra fixa da escola e não precisa de banco. O Firestore armazena também `turno`, `aulaId`, `aulaLabel` e `horario` para facilitar consultas, relatórios e compatibilidade.
