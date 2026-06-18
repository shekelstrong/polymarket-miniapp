"use client";

import { useEffect, useState } from "react";
import { initTelegram } from "@/lib/telegram";

export function TopBar() {
  const [username, setUsername] = useState<string | null>(null);
  useEffect(() => {
    const tg = initTelegram();
    const u = tg?.initDataUnsafe?.user?.username;
    if (u) setUsername(u);
  }, []);
  return (
    <header className="sticky top-0 z-10 -mx-4 mb-2 flex items-center justify-between border-b border-line bg-bg-900/80 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-accent-500 to-purple-600" />
        <span className="font-semibold">Polybet</span>
      </div>
      <div className="text-xs text-white/50">
        {username ? `@${username}` : "Polymarket via Telegram"}
      </div>
    </header>
  );
}
