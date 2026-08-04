# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

App web (Next.js) para gerenciar partidas de Counter-Strike entre amigos: jogadores, mapas, sorteios de times balanceados, placares por mapa e rankings. Idioma do projeto (UI, comentários, commits) é **português**.

## Comandos

```bash
npm run dev          # servidor de desenvolvimento (localhost:3000)
npm run build        # build de produção (next build --webpack)
npm run test         # todos os testes (vitest run)
npm run test:watch   # testes em watch
npx vitest run src/utils/balanceTeams.test.ts   # um arquivo de teste específico
npm run lint         # biome lint ./src
npm run lint:fix     # lint com auto-fix
npx tsc --noEmit     # typecheck (não há script dedicado)
```

Setup: `cp .env.example .env.local` e preencher `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `OPENAI_API_KEY` (OCR/comentários) e `SCRAPE_DO_TOKEN` (scraping do Premier). Node ≥ 24.

Testes são Vitest em ambiente `node`, apenas `src/**/*.test.ts` (utils puros — sem testes de componente). Alias de import `~/` → `src/` (tsconfig e vitest.config.ts).

## Arquitetura

**Stack**: Next.js 16 App Router + React 19 + TypeScript strict, Chakra UI v3, TanStack Query/Table, react-hook-form + yup (`yup-locale-pt`), Biome (2 espaços, aspas simples, 120 colunas). Preferir helpers de `@julianobazzi/utils` (ex.: `safeDivide`, `getLabelById`, `findOptionById`, `removeAccents`) a reimplementar.

**Dados — Supabase sem ORM e sem pipeline de migração**: o client anon fica em `src/services/supabase.ts`; nomes de tabelas/views/RPCs são constantes em `src/config/constants.ts`. A pasta `sql/` versiona as views (`v_ranking`, `v_map_ranking`, `v_sweepstake_ranking`) e functions (`get_player_scores_on_maps`, `get_ranking_by_year`), mas **alterações nesses arquivos precisam ser aplicadas manualmente no SQL Editor do Supabase** — avisar o usuário sempre que um arquivo de `sql/` mudar. O schema das tabelas não está versionado no repo. Em funções `language sql`, qualificar parâmetro homônimo de coluna (ex.: `get_player_scores_on_maps.user_id`), senão a coluna tem precedência; não renomear parâmetros de RPC (o Supabase chama por nome). Auth por e-mail/senha do Supabase, sessão no cookie `csm.token` (nookies, 7 dias).

**Padrão de páginas**: cada rota em `src/app/<área>/page.tsx` é um server component fino que injeta o `user` e delega para `components/form.tsx` (client component com toda a lógica); modais/alertas ficam ao lado em `components/`. Services em `src/services/hooks/use<Entidade>.ts` expõem funções `get*` (query Supabase) + hooks React Query; queryKey = nome da tabela, invalidação via `queryClient.invalidateQueries`. Models em `src/models/`: `I<Nome>` (formulário) vs `I<Nome>API` (registro do banco + campos `format_*` calculados nos hooks).

**Rotas de API** (todas dinâmicas, sem cache de servidor):
- `POST /api/read-scores` — OCR de print de placar via OpenAI Vision.
- `POST /api/comparative-messages` — comentários de comparativo via OpenAI.
- `POST /api/premier-rank` — pico do Premier por scraping do **csstats.gg via scrape.do** (lotes de 5, 2 tentativas). Não trocar a fonte por espelhos/cache (ex.: csst.at retorna dado desatualizado).
- `GET /api/sweepstakes/[id]` — pública, **consumida pelo plugin C# de servidor CS2 em `plugin/`** (CounterStrikeSharp; build via `plugin/build.sh`). Não mudar o shape da resposta sem atualizar o plugin.

**Domínio de sorteio (sweepstake)** — o coração do app:
- O sorteio usa **somente o motor Ranking** (decisão de produto; não reintroduzir o motor Premier). Score = dano médio do jogador nos mapas selecionados (RPC `get_player_scores_on_maps`, ponderado por nº de partidas, com fallback para a média geral).
- `src/utils/balanceTeams.ts` divide em 2 times: força = score + estrelas normalizados (50/50), imputação da média do grupo para quem não tem score, partição de soma ótima (exaustiva até 20 jogadores, heurística acima), dois melhores sempre separados, time 1 contém o mais forte. É determinístico e **retorna os mesmos objetos da entrada** — o chamador persiste `player.score` cru em `sweepstake_players` e nas somas `score_team_one/two`; não clonar nem gravar valores imputados.
- O campo `premier` do jogador continua existindo para a tela de jogadores/badges, e o enum `SeepstakeEngineEnum` (typo proposital mantido) permanece para renderizar sorteios antigos criados com o motor Premier.

**Convenções de UI**: não usar avatares/fotos (o sistema não tem foto de jogador — exibir nome + Steam); badges em `src/components/Badge/` (`StarBadge`, `PremierBadge`, `ScoreBadge`, `MapBadge`); feedback via `useFeedback()` (toasts em pt-BR).
