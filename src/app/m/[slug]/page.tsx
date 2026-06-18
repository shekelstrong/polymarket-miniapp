"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { TopBar } from "@/components/TopBar";
import { OrderBookPanel } from "@/components/OrderBookPanel";
import { fetchTrendingMarkets } from "@/lib/api";
import { submitTrade } from "@/lib/api";
import { initTelegram } from "@/lib/telegram";

export default function MarketPage() {
  const { slug } = useParams<{ slug: string }>();
  const [apiUrl, setApiUrl] = useState("");
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [outcome, setOutcome] = useState<"YES" | "NO">("YES");
  const [amount, setAmount] = useState("25");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    setApiUrl(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080");
  }, []);

  const { data: markets } = useQuery({
    queryKey: ["all", "m"],
    queryFn: () => fetchTrendingMarkets(apiUrl, 200),
    enabled: Boolean(apiUrl),
  });
  const market = markets?.find((m) => String(m.id) === slug || m.slug === slug);

  if (!apiUrl) return null;
  if (!market) {
    return (
      <main className="mx-auto max-w-screen-sm px-4">
        <TopBar />
        <div className="card mt-4 text-sm text-white/70">Loading market…</div>
      </main>
    );
  }
  const tokenId =
    outcome === "YES" ? market.clobTokenIds[0] : market.clobTokenIds[1];

  async function onPlace() {
    if (!tokenId || !apiUrl) return;
    setBusy(true);
    setMsg(null);
    try {
      const tg = initTelegram();
      // Demo: trust local backend with stored funder/pk.
      // In production, user signs client-side via wagmi/MetaMask.
      const res = await submitTrade(apiUrl, {
        tokenId,
        side,
        outcome,
        amount: Number(amount),
        orderType: "FOK",
        tickSize: "0.01",
        negRisk: !!market?.negRisk,
      } as any);
      setMsg(res.ok ? `Order ${res.status} (${res.orderId})` : (res.error ?? "Failed"));
      // haptic feedback on Telegram
      try {
        tg?.HapticFeedback?.notificationOccurred?.(res.ok ? "success" : "error");
      } catch {
        /* noop */
      }
    } catch (e: any) {
      setMsg(e?.message ?? "Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-screen-sm px-4 pb-24">
      <TopBar />
      <h1 className="mt-4 text-xl font-bold leading-tight">{market.question}</h1>
      <p className="mt-1 text-sm text-white/60">
        Vol ${Math.round(market.volume ?? 0).toLocaleString()} · Liq $
        {Math.round(market.liquidity ?? 0).toLocaleString()}
      </p>

      <div className="mt-3 flex gap-2">
        <button
          className={`btn flex-1 ${outcome === "YES" ? "bg-yes text-black" : "btn-ghost"}`}
          onClick={() => setOutcome("YES")}
        >
          YES · {Math.round(Number(market.outcomePrices[0]) * 100)}¢
        </button>
        <button
          className={`btn flex-1 ${outcome === "NO" ? "bg-no text-black" : "btn-ghost"}`}
          onClick={() => setOutcome("NO")}
        >
          NO · {Math.round(Number(market.outcomePrices[1]) * 100)}¢
        </button>
      </div>

      <div className="mt-3">
        <OrderBookPanel apiUrl={apiUrl} tokenId={tokenId} />
      </div>

      <div className="card mt-3 space-y-3">
        <div>
          <label className="text-xs text-white/60">Amount (USDC)</label>
          <input
            type="number"
            inputMode="decimal"
            min={1}
            step={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-bg-700 px-3 py-2 text-lg"
          />
        </div>
        <div className="flex gap-2">
          <button
            className={`btn flex-1 ${side === "BUY" ? "bg-yes text-black" : "btn-ghost"}`}
            onClick={() => setSide("BUY")}
          >
            Buy
          </button>
          <button
            className={`btn flex-1 ${side === "SELL" ? "bg-no text-black" : "btn-ghost"}`}
            onClick={() => setSide("SELL")}
          >
            Sell
          </button>
        </div>
        <button
          className="btn-primary w-full disabled:opacity-50"
          onClick={onPlace}
          disabled={busy}
        >
          {busy ? "Placing…" : `Place ${side} ${outcome} · $${amount}`}
        </button>
        {msg && <div className="text-sm text-white/70">{msg}</div>}
        <p className="text-[11px] text-white/40">
          Demo flow: trades are routed through the backend, which signs on behalf of
          the platform wallet. In production, sign client-side with MetaMask/WalletConnect.
        </p>
      </div>
    </main>
  );
}
