/**
 * Thin client around our FastAPI backend.
 * Every call here is server-side proxyable; the API URL is public and read-only.
 */

import type { Market, OrderBook, TradeRequest, TradeResponse } from "./types";

const headers = { "Content-Type": "application/json" } as const;

export async function fetchTrendingMarkets(
  apiUrl: string,
  limit = 25,
): Promise<Market[]> {
  const r = await fetch(`${apiUrl}/markets/trending?limit=${limit}`, {
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`trending ${r.status}`);
  return r.json();
}

export async function fetchOrderBook(
  apiUrl: string,
  tokenId: string,
): Promise<OrderBook> {
  const r = await fetch(`${apiUrl}/markets/orderbook/${tokenId}`, {
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`orderbook ${r.status}`);
  return r.json();
}

export async function submitTrade(
  apiUrl: string,
  req: TradeRequest,
): Promise<TradeResponse> {
  const r = await fetch(`${apiUrl}/trades`, {
    method: "POST",
    headers,
    body: JSON.stringify(req),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`trade ${r.status}: ${t}`);
  }
  return r.json();
}
