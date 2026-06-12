import type { GameSessionData, LoadGameSessionParams } from "./gameSessionType";

export async function getGameSessionData({
	radioId,
	sessionId,
}: LoadGameSessionParams): Promise<GameSessionData> {
	const response = await fetch(
		`/api/competition/radio/${radioId}/session/${sessionId}`,
		{ cache: "no-store" }
	);

	const data = (await response.json()) as GameSessionData & { error?: string };

	if (!response.ok) {
		throw new Error(data.error || "Failed to load game session");
	}

	return data;
}

export async function submitGameSessionResult({
	radioId,
	sessionId,
	score,
	timeMs,
}: LoadGameSessionParams & {
	score: number;
	timeMs: number;
}): Promise<GameSessionData> {
	const response = await fetch(
		`/api/competition/radio/${radioId}/session/${sessionId}`,
		{
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ score, timeMs }),
		}
	);
	const data = (await response.json()) as GameSessionData & { error?: string };

	if (!response.ok) {
		throw new Error(data.error || "Failed to save game result");
	}

	return data;
}
