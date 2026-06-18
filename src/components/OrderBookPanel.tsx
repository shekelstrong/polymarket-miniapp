import { useQuery } from "@tanstack/react-query";
import { fetchOrderBook } from "@/lib/api";
import { useState } from "react";

export function OrderBookPanel({ apiUrl, tokenId }: { apiUrl: string; tokenId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["ob", tokenId],
    queryFn: () => fetchOrderBook(apiUrl, tokenId),
    refetchInterval: 5_000,
  });
  if (isLoading) return <div className="card animate-pulse-soft h-32" />;
  if (error || !data) return <div className="card text-sm text-no">No order book.</div>;

  const max = Math.max(
    1,
    ...data.bids.map((l) => Number(l.size)),
    ...data.asks.map((l) => Number(l.size)),
  );

  return (
    <div className="card">
      <div className="mb-2 text-xs text-white/50">
        Order book · midpoint <span className="text-white/80">{data.midpoint ?? "—"}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="mb-1 text-yes/80">Bids</div>
          {data.bids.slice(0, 6).map((l, i) => (
            <Bar key={`b${i}`} side="bid" price={l.price} size={l.size} max={max} />
          ))}
        </div>
        <div>
          <div className="mb-1 text-no/80">Asks</div>
          {data.asks.slice(0, 6).map((l, i) => (
            <Bar key={`a${i}`} side="ask" price={l.price} size={l.size} max={max} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Bar({
  side,
  price,
  size,
  max,
}: {
  side: "bid" | "ask";
  price: string;
  size: string;
  max: number;
}) {
  const pct = Math.min(100, Math.round((Number(size) / max) * 100));
  const isBid = side === "bid";
  return (
    <div className="relative my-0.5 flex items-center justify-between rounded px-1 py-0.5">
      <div
        className={`absolute inset-y-0 ${isBid ? "right-0 bg-yes/15" : "left-0 bg-no/15"}`}
        style={{ width: `${pct}%` }}
      />
      <span className={`relative ${isBid ? "text-yes" : "text-no"}`}>{price}</span>
      <span className="relative text-white/70">{size}</span>
    </div>
  );
}
