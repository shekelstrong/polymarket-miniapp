/**
 * Domain types shared with the FastAPI backend.
 * Keep these in sync with backend/app/schemas.py
 */

export interface Market {
  id: number;
  question: string;
  slug: string;
  description?: string;
  endDate?: string;
  image?: string;
  volume?: number;
  liquidity?: number;
  outcomes: string[]; // e.g. ["Yes", "No"]
  outcomePrices: string[]; // e.g. ["0.62", "0.38"]
  clobTokenIds: string[]; // [yesTokenId, noTokenId]
  acceptingOrders: boolean;
  negRisk: boolean;
}

export interface OrderBookLevel {
  price: string;
  size: string;
}

export interface OrderBook {
  market: string;
  asset_id: string;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  midpoint?: string;
}

export interface TradeRequest {
  /** EOA private key. NEVER put this in the browser. Backend signs on behalf. */
  // (we keep this on the server only — but the type is here for completeness)
  tokenId: string;
  side: "BUY" | "SELL";
  /** Price in 0-1 range for LIMIT. Amount in USDC for MARKET. */
  price?: number;
  size?: number;
  amount?: number;
  orderType: "GTC" | "FOK" | "GTD";
  tickSize: "0.001" | "0.01" | "0.1";
  negRisk: boolean;
}

export interface TradeResponse {
  ok: boolean;
  orderId?: string;
  status?: string;
  error?: string;
}
