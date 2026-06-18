"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTrendingMarkets } from "@/lib/api";
import { MarketCard } from "@/components/MarketCard";
import { TopBar } from "@/components/TopBar";

export default function HomePage() {
  const [apiUrl, setApiUrl] = useState<string>("");
  useEffect(() => {
    setApiUrl(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080");
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["markets", "trending"],
    queryFn: () => fetchTrendingMarkets(apiUrl, 25),
    enabled: Boolean(apiUrl),
    refetchInterval: 30_000,
  });

  return (
    <main className="mx-auto max-w-screen-sm px-4 pb-24">
      <TopBar />

      <section className="mt-4">
        <h1 className="text-2xl font-bold tracking-tight">Trending markets</h1>
        <p className="text-sm text-white/60">
          Live prediction markets from Polymarket. Tap a card to view the order book
          and place a trade.
        </p>
      </section>

      <section className="mt-4 space-y-3">
        {isLoading && (
          <div className="card animate-pulse-soft h-24" aria-label="Loading markets" />
        )}
        {error && (
          <div className="card border-no/40 text-sm text-no">
            Could not load markets. Check the backend at <code>{apiUrl}</code>.
          </div>
        )}
        {data?.map((m) => <MarketCard key={m.id} market={m} />)}
        {data && data.length === 0 && (
          <div className="card text-sm text-white/60">No active markets right now.</div>
        )}
      </section>
    </main>
  );
}
