"use client";

import type { Market } from "@/lib/types";

export function MarketCard({ market }: { market: Market }) {
  const yes = Number(market.outcomePrices?.[0] ?? 0);
  const no = Number(market.outcomePrices?.[1] ?? 1 - yes);
  const yesPct = Math.round(yes * 100);
  const noPct = 100 - yesPct;
  const vol = market.volume ? `$${Math.round(market.volume).toLocaleString()}` : "—";

  return (
    <a
      href={`/m/${market.slug ?? market.id}`}
      className="card block transition hover:border-accent-500/40"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[15px] font-semibold leading-snug">{market.question}</h3>
        <span className="shrink-0 text-xs text-white/40">{vol}</span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="pill-yes">YES {yesPct}¢</span>
        <span className="pill-no">NO {noPct}¢</span>
        {market.negRisk && (
          <span className="pill bg-white/5 text-white/60">neg-risk</span>
        )}
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-bg-700">
        <div
          className="h-full bg-yes"
          style={{ width: `${yesPct}%` }}
          aria-label={`Yes ${yesPct}%`}
        />
      </div>
    </a>
  );
}
