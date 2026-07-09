<br/>

<p align="center">
  <a href="https://github.com/JulianoBazzi">
    <img alt="Autor Juliano Bazzi" src="https://img.shields.io/badge/author-Juliano%20Bazzi-%23ffb84d?color=01579b&style=for-the-badge">
  </a>
  <img alt="Contagem de linguagens no GitHub" src="https://img.shields.io/github/languages/count/JulianoBazzi/CSManager?color=01579b&style=for-the-badge">
  <a href="https://github.com/JulianoBazzi/CSManager/stargazers">
    <img alt="Stargazers" src="https://img.shields.io/github/stars/JulianoBazzi/CSManager?color=01579b&style=for-the-badge">
  </a>
  <a href="https://github.com/JulianoBazzi/CSManager/blob/master/LICENSE.md">
    <img alt="Licença MIT" src="https://img.shields.io/badge/license-MIT-%2304D361?color=01579b&style=for-the-badge">
  </a>
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-01579b?style=for-the-badge&logo=nextdotjs">
  <img alt="React" src="https://img.shields.io/badge/React-19-01579b?style=for-the-badge&logo=react">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6-01579b?style=for-the-badge&logo=typescript">
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-01579b?style=for-the-badge&logo=supabase">
</p>

<br/>

# Counter-Strike Manager

> [English](README.md) | 🌐 **Português**

Aplicação web para gerenciar partidas e comunidades de Counter-Strike: cadastre jogadores, faça **sorteios** com balanceamento automático de times, registre o placar por mapa, monte rankings e extraia estatísticas — inclusive lendo o placar direto de um print.

## Demo

🔗 [csmanager.vercel.app](https://csmanager.vercel.app/)

## Funcionalidades

- **Jogadores** — gerencie jogadores com nome, Steam ID, nota de 1 a 5★ e status ativo.
- **Mapas** — catálogo de mapas por tipo de jogo (5v5, 2v2, …) e tipo de mapa.
- **Sorteios** — crie um sorteio com os jogadores e mapas selecionados, **balanceie os times automaticamente** pela força de cada jogador (estrelas + dano médio nos mapas escolhidos) e acompanhe o placar por mapa de dois times em dois tempos, com status da partida automático.
- **Rankings** — ranking anual (RPC `get_ranking_by_year`), ranking por mapa e por sorteio, com estatísticas de kills/mortes/dano/headshot.
- **Leitura de placar (OCR)** — extraia as estatísticas dos jogadores a partir de um print do placar via OpenAI Vision.
- **Premier rank** — busca o pico do Premier no CS2 via scrape do [csstats.gg](https://csstats.gg/).
- **Comparativo de jogadores** — estatísticas head-to-head entre dois jogadores, com comentários gerados por IA.
- **Autenticação** — sessões Supabase (e-mail/senha) guardadas no cookie `csm.token` (nookies, validade de 7 dias).

## Rotas da API

| Rota | Descrição |
|------|-----------|
| `POST /api/read-scores` | OCR de um print do placar em estatísticas (OpenAI Vision) |
| `POST /api/premier-rank` | Scrape do csstats.gg (via scrape.do) para o pico do Premier no CS2 |
| `POST /api/comparative-messages` | Comentários gerados por IA para o comparativo de jogadores |
| `GET /api/sweepstakes/[id]` | Retorna um sorteio com todos os placares e resultados por mapa |

## Tecnologias

- [Next.js 16](https://nextjs.org/) (App Router) + [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Chakra UI 3](https://chakra-ui.com/) + [Recharts](https://recharts.org/)
- [Supabase](https://supabase.com/) (banco de dados + autenticação)
- [TanStack Query](https://tanstack.com/query) e [TanStack Table](https://tanstack.com/table)
- [React Hook Form](https://react-hook-form.com/) + [Yup](https://github.com/jquense/yup) (`yup-locale-pt`)
- [OpenAI](https://platform.openai.com/) (OCR, comentários)
- [@julianobazzi/utils](https://www.npmjs.com/package/@julianobazzi/utils) e [@julianobazzi/nextjs-utils](https://www.npmjs.com/package/@julianobazzi/nextjs-utils)
- [Biome](https://biomejs.dev/) (lint/format)

> Requer **Node ≥ 20.9**.

## Como Rodar

```bash
# 1. Clone o repositório
git clone git@github.com:JulianoBazzi/CSManager.git
cd CSManager

# 2. Instale as dependências
npm install

# 3. Configure o ambiente
cp .env.example .env.local   # depois preencha os valores abaixo

# 4. Rode o servidor de desenvolvimento
npm run dev
```

A aplicação roda em [http://localhost:3000](http://localhost:3000).

### Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase (lado cliente) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima do Supabase (lado cliente) |
| `OPENAI_API_KEY` | Chave da OpenAI para OCR e comentários |
| `SCRAPE_DO_TOKEN` | Token do [scrape.do](https://scrape.do/) para o scrape do Premier rank |
| `NODE_ENV` | Ambiente da aplicação (`development` / `production`) |

## Scripts

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Inicia o servidor de produção |
| `npm run lint` | Lint com Biome |
| `npm run lint:fix` | Lint com correção automática (Biome) |

## Licença

Distribuído sob a Licença MIT. Veja [LICENSE.md](LICENSE.md).
