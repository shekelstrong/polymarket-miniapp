# Polybet

A Telegram Mini App + web frontend for trading on [Polymarket](https://polymarket.com) prediction markets.

- **Web**: Next.js 14 (App Router) — runs on Vercel.
- **Mini App**: same code, opens full-screen inside Telegram.
- **Backend**: FastAPI on your VPS that signs and submits orders via [`py-clob-client`](https://github.com/Polymarket/py-clob-client).

See [`README.md`](./README.md) for the full architecture and setup.

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```
