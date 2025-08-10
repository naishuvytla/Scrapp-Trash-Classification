import { BASE_URL } from "./classifier";

export type ChatTurn = { role: "user" | "assistant"; content: string };

export async function sendDisposalChat(
  message: string,
  ctx: { label?: string; instructions?: string },
  history: ChatTurn[] = []
) {
  const res = await fetch(`${BASE_URL}/api/disposal-chat/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      label: ctx.label,
      instructions: ctx.instructions,
      history,
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Chat failed (${res.status}): ${t}`);
  }
  return (await res.json()) as { reply?: string };
}