# Pendências Frontend

## Drawers de edição (league/nationality/season/tournament/team)

- [x] Os `useQuery` (`useLeague`, `useNationality`, `useSeason`, `useTournament`, `useTeam`) devem usar `enabled: open && !!id` em vez de só `enabled: !!id`.
  Hoje cada linha da tabela já dispara a busca da entidade assim que renderiza (porque o drawer é sempre montado, só o `Sheet` é que fica fechado), gerando N requisições extras ao abrir a tela de listagem — uma por linha. Trocar para `enabled: open && !!id` evita isso, ao custo de um loading rápido na primeira abertura do drawer.

## Bugs de tipo pré-existentes (typecheck)

- [x] `src/features/season/clubs/clubs-screen.tsx` (linhas 83–86): o hook usado pela tela não expõe `draftName`, `setDraftName`, `leagueId`, `setLeagueId` que a tela espera. Provavelmente falta atualizar o hook (`useClubsScreen` ou equivalente) pra devolver esses campos, ou a tela está chamando o hook errado. Resposta: Deve criar os hooks necessários na feature de clubs, e deixar de utilizar os hooks das features de `@/features/admin/teams`
- [x] `src/features/season/tournaments/components/create-tournament-drawer.tsx` (linha ~95): o `Map` montado a partir de `seasonSquads` no `useEffect` de seed não bate com o tipo `SelectedTeamEntry` — falta `logoUrl` dentro de `team.league`. Ajustar o mapeamento pra incluir esse campo (provavelmente `squad.team.league.logoUrl` já vem da API e só não está sendo repassado).

## Bugs

- [x] na tela de detalhes de times, alterar para /clubs/:id
- [x] BUG: O PSG já jogou na season e mesmo assim não aparece as últimas partidas disputadas. 


## Outros Tópicos

- [ ] Corrigir a tela de edição de escalação, hoje está muito distante do que foi desenhado no artefato - precisa dos endpoints do backend também
- [x] Add em todas as telas que tem filtro mais avançado (barra de pesquisa + input - seja button ou select) um button de limpar filtros
- [ ] Verificar tela por tela, quantas requests são disparadas
- [x] Na tela de Ligas, toda vez que o drawer é aberto, a requisição de países é feita, deveria ser algo cacheado (talvez até no backend, pois não é um informação que deva mudar com frequência, assim como a liga)
- [ ] Existem mais configurações a serem feitas na tela de criação de torneio
  - [ ] Configurar tamanho de grupos
  - [ ] Configurar se é ida e volta (liga, mata-mata, grupo e mata-mata)
  - [ ] Configurar quantos times avançam por grupo no mata-mata
  - [ ] Criar variações de sorteio entre os potes
  - [ ] Criar outras opções para preencher os times no campeonato
  - [ ] Configurar se tem prorrogação
  - [ ] Configurar critério de desempate
- [x] Quando criar torneio, já deveria abrir a tela de detalhes
- [ ] Add avatar do usuário, quando disponível
    CreateUserUseCase,
- [x] Melhorar a tela de detalhes do jogador (box de gols, assistências e g+a está desproporcional, além dos atributos estarem feitos de uma maneira ruim)
- [x] Dentro da tela de detalhes de jogador e da listagem, precisa ter um button para negociar jogador
- [ ] Pensar na lógica que envolve a negociação entre os clubes, a negociação precisa ser isolada por temporada
- [ ] Temos que linkar sempre que possivel os jogadores e os times as telas de detalhes
- [x] Precisamos atualizar os dados com a atualização que saiu do dia 03

## Transferências

- [ ] Add regra de valor entre transferências
- [ ] Fluxo de proposta de troca com aceite do outro dono (hoje é unilateral — ver acima) - talvez com notificação
- [ ] Histórico de recusas/contrapropostas
- [ ] Janela de transferências com prazo, em vez de "sempre liberado enquanto não há torneio ativo"

## Dashboard

- [ ] apresentar próximos jogos dos torneios ativos, artilheiro geral da temporada, últimas trocas, ranking dos squads

## Temporada/ histórico

- [ ] Hall da Fama: Cruzando temporadas: campeões, artilheiros históricos

## Social

- [ ] Add notificações
- [ ] Add conquista e insignias por usuário
- [ ] Exportar resumo de rodada como imagem para compartilhar

## Jogadores
- [ ] Comparar jogadores lado a lado
- [x] Procurar jogadores semelhantes a jogadores que você curta (por exemplo: jogadores parecidos com o Gravenberch)

## Plataforma
- [ ] Busca global através do (Cmd + K) por jogador/time/usuário
- [ ] Exportar escalação como imagem

# Revisão e refatoração de features (em andamento)

Front (`andreaskruisen-front`):
- [x] `admin/*` — revisado/refatorado, exceto `admin/import`
- [ ] `admin/import`
- [ ] `auth` (todas as sub-features)
- [ ] `home` (todas as sub-features)
- [ ] `season` (todas as sub-features)

Backend (`andreuskruisen-backend`):
- [x] `users`
- [x] `leagues`
- [x] `me`
- [x] `transfer`
- [ ] Todos os outros pacotes (nationalities, seasons, teams, players, tournaments, transfers, squads, favorites, matches, import, etc.)
- [ ] Revisar lógica de transferência
