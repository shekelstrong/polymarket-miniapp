# Polybet Mini App

Telegram Mini App + Web frontend for trading on [Polymarket](https://polymarket.com) prediction markets.

- **Stack:** Next.js 14 + TanStack Query + Tailwind + viem + @telegram-apps/sdk
- **Backend:** [polymarket-trading-bot](https://github.com/shekelstrong/polymarket-trading-bot) (FastAPI on VPS)
- **License:** MIT

## Features

- Trending markets feed (live, refetches every 30s)
- Single-market view with live order book (refetches every 5s)
- BUY/SELL form with USDC amount input
- Telegram theme + HapticFeedback + MainButton (when inside Telegram)
- Works in any browser as a normal webapp

## Run locally

```bash
npm install
cp .env.example .env.local
# point NEXT_PUBLIC_API_URL at your FastAPI backend
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel

1. Push to GitHub (already done).
2. Open <https://vercel.com/new>.
3. Import `shekelstrong/polymarket-miniapp`.
4. Add env: `NEXT_PUBLIC_API_URL=http://108.165.164.85:8080` (or your domain).
5. **Deploy** → done in ~60s.

Vercel auto-redeploys on every push to `main`.

## Telegram Mini App setup

1. Open [@BotFather](https://t.me/BotFather) → `/newbot` → create bot.
2. `/setmenubutton` → select your bot → button text `📊 Trade` → URL: Vercel URL.
3. Open your bot, hit Menu → Mini App opens.

## Telegram auth flow

Mini App calls `Telegram.WebApp.initData` and forwards to backend `/auth/telegram`. Backend verifies HMAC-SHA256 with bot token. User's `telegram_id` becomes tenant ID.

## Project layout

```
src/
  app/
    layout.tsx          # Telegram theme + providers
    page.tsx            # Trending markets feed
    m/[slug]/page.tsx   # Single market + order book + trade form
    providers.tsx       # TanStack Query
    globals.css         # Tailwind + design tokens
  components/
    TopBar.tsx
    MarketCard.tsx
    OrderBookPanel.tsx
  lib/
    api.ts              # Backend client
    types.ts            # Schemas shared with FastAPI
    telegram.ts         # WebApp bootstrap + initData verify
```

## License

MIT
