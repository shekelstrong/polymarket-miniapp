# Polybet — Polymarket on Telegram

A Telegram Mini App + responsive web frontend for trading on [Polymarket](https://polymarket.com) prediction markets.

## What this is

- **Web (Vercel-ready)**: Next.js 14 app that works both as a standalone webapp and as the Mini App that opens from inside Telegram.
- **Telegram Mini App**: same Next.js app, but with the Telegram WebApp SDK bootstrap so it renders inside the in-app browser, uses the user's Telegram theme, and supports the `MainButton` + `HapticFeedback`.
- **Backend (FastAPI on your VPS)**: this repo is the *frontend*. The trading/sign layer lives in a separate Python service that wraps `py-clob-client` and `py-order-utils`. See `../polymarket-trading-bot` (a single bot) or fork it for a multi-user backend.

## Architecture

```
┌──────────────────────┐    HTTPS    ┌────────────────────────┐
│  Telegram client     │  WebApp     │  Vercel (this repo)    │
│  (iOS / Android)     │ ──────────► │  Next.js 14 SPA        │
└──────────────────────┘             └──────────┬─────────────┘
┌──────────────────────┐                       │ /api or REST
│  Web (any browser)   │ ─────────────────────►│
└──────────────────────┘                       ▼
                                    ┌────────────────────────┐
                                    │  FastAPI on your VPS   │
                                    │  py-clob-client        │
                                    │  Polygon mainnet (137) │
                                    └──────────┬─────────────┘
                                               ▼
                                    ┌────────────────────────┐
                                    │  Polymarket CLOB       │
                                    │  clob.polymarket.com   │
                                    └────────────────────────┘
```

## Stack

- **Next.js 14** (App Router, server actions disabled, default SSR)
- **React 18**, **TypeScript 5.5**
- **TanStack Query** for data fetching
- **Tailwind CSS** for the dark/crypto look
- **viem + wagmi** (planned) for client-side wallet auth (MetaMask, WalletConnect)
- **Telegram WebApp SDK** for in-Telegram UX

## Run locally

```bash
npm install
cp .env.example .env.local
# point NEXT_PUBLIC_API_URL at your FastAPI backend
npm run dev
```

Open <http://localhost:3000>. To test the Telegram integration, use the [@BotFather Mini App flow](https://core.telegram.org/bots/webapps) with `ngrok` or a public URL.

## Deployment (Vercel)

1. Push this repo to GitHub.
2. Import the repo in Vercel.
3. Set `NEXT_PUBLIC_API_URL` to your backend URL.
4. Vercel auto-builds and deploys on every push to `main`.

## Telegram Mini App setup

1. In [@BotFather](https://t.me/BotFather), run `/setmenubutton` and set the URL to your Vercel deployment (or a custom domain).
2. Open the bot, hit the menu button — the Mini App opens full-screen inside Telegram.
3. `Telegram.WebApp.initData` is auto-forwarded to the backend `/auth/telegram` endpoint to verify the user.

## Project layout

```
src/
  app/
    layout.tsx         # Telegram theme + providers
    page.tsx           # Trending markets feed
    m/[slug]/page.tsx  # Single-market trade view
    providers.tsx      # TanStack Query
    globals.css        # Tailwind + design tokens
  components/
    TopBar.tsx
    MarketCard.tsx
    OrderBookPanel.tsx
  lib/
    api.ts             # backend client
    types.ts           # shared with FastAPI
    telegram.ts        # WebApp bootstrap + initData verify
```

## Status

Skeleton only — UI is wired against the backend contract. The FastAPI backend (next) implements `/markets/trending`, `/markets/orderbook/{tokenId}`, `/trades`, `/auth/telegram`.

## License

MIT
