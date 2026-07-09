<br/>

<p align="center">
  <a href="https://github.com/JulianoBazzi">
    <img alt="Author Juliano Bazzi" src="https://img.shields.io/badge/author-Juliano%20Bazzi-%23ffb84d?color=01579b&style=for-the-badge">
  </a>
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/JulianoBazzi/CSManager?color=01579b&style=for-the-badge">
  <a href="https://github.com/JulianoBazzi/CSManager/stargazers">
    <img alt="Stargazers" src="https://img.shields.io/github/stars/JulianoBazzi/CSManager?color=01579b&style=for-the-badge">
  </a>
  <a href="https://github.com/JulianoBazzi/CSManager/blob/master/LICENSE.md">
    <img alt="License MIT" src="https://img.shields.io/badge/license-MIT-%2304D361?color=01579b&style=for-the-badge">
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

> 🌐 **English** | [Português](README.pt-BR.md)

A web app to manage Counter-Strike matches and communities: register players, run **sweepstakes** with automatic team balancing, track per-map scores, build rankings, and pull stats — including reading scoreboards straight from a screenshot.

## Demo

🔗 [csmanager.vercel.app](https://csmanager.vercel.app/)

## Features

- **Players** — manage players with name, Steam ID, 1–5★ rating and active status.
- **Maps** — catalog maps by game type (5v5, 2v2, …) and map type.
- **Sweepstakes** — create a draw with selected players and maps, **balance teams automatically** by player strength (star rating + average damage on the chosen maps), and track per-map scores for two teams across two halves, with automatic match status.
- **Rankings** — yearly ranking (`get_ranking_by_year` RPC), per-map ranking and per-sweepstake ranking, with kills/deaths/damage/headshot stats.
- **Scoreboard OCR** — extract player stats from a leaderboard screenshot via OpenAI Vision.
- **Premier rank** — fetch CS2 Premier peaks by scraping [csstats.gg](https://csstats.gg/).
- **Player comparison** — head-to-head stats between two players, with AI-generated commentary.
- **Auth** — Supabase email/password sessions stored in a `csm.token` cookie (nookies, 7-day TTL).

## API Routes

| Route | Description |
|-------|-------------|
| `POST /api/read-scores` | OCR a leaderboard screenshot into player stats (OpenAI Vision) |
| `POST /api/premier-rank` | Scrape csstats.gg (via scrape.do) for CS2 Premier peaks |
| `POST /api/comparative-messages` | AI-generated commentary for player comparisons |
| `GET /api/sweepstakes/[id]` | Fetch a sweepstake with all map scores and results |

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router) + [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Chakra UI 3](https://chakra-ui.com/) + [Recharts](https://recharts.org/)
- [Supabase](https://supabase.com/) (database + auth)
- [TanStack Query](https://tanstack.com/query) & [TanStack Table](https://tanstack.com/table)
- [React Hook Form](https://react-hook-form.com/) + [Yup](https://github.com/jquense/yup) (`yup-locale-pt`)
- [OpenAI](https://platform.openai.com/) (OCR, commentary)
- [@julianobazzi/utils](https://www.npmjs.com/package/@julianobazzi/utils) & [@julianobazzi/nextjs-utils](https://www.npmjs.com/package/@julianobazzi/nextjs-utils)
- [Biome](https://biomejs.dev/) (lint/format)

> Requires **Node ≥ 20.9**.

## Getting Started

```bash
# 1. Clone the repository
git clone git@github.com:JulianoBazzi/CSManager.git
cd CSManager

# 2. Install dependencies
npm install

# 3. Configure the environment
cp .env.example .env.local   # then fill in the values below

# 4. Run the dev server
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (client-side) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key (client-side) |
| `OPENAI_API_KEY` | OpenAI key for OCR and commentary |
| `SCRAPE_DO_TOKEN` | [scrape.do](https://scrape.do/) token for Premier rank scraping |
| `NODE_ENV` | Application environment (`development` / `production`) |

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | Lint with Biome |
| `npm run lint:fix` | Lint and auto-fix with Biome |

## License

Released under the MIT License. See [LICENSE.md](LICENSE.md).
