/**
 * Telegram WebApp bootstrap.
 * Returns the WebApp instance or null when not running inside Telegram.
 */
export function initTelegram(): any | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  const tg = w.Telegram?.WebApp;
  if (!tg) return null;
  try {
    tg.ready();
    tg.expand();
    // Match the dark Telegram theme we use in CSS
    tg.setHeaderColor?.("#0a0b0f");
    tg.setBackgroundColor?.("#0a0b0f");
  } catch {
    /* noop outside Telegram */
  }
  return tg;
}

/** Verify a Telegram initData string with the bot token via our backend. */
export async function verifyTelegram(
  apiUrl: string,
  initData: string,
): Promise<{ ok: boolean; userId?: number; username?: string }> {
  const r = await fetch(`${apiUrl}/auth/telegram`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData }),
  });
  if (!r.ok) return { ok: false };
  return r.json();
}
