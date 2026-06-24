import type {
	GameSessionData,
	LoadGameSessionParams,
	PlayerStatus,
} from "./gameSessionType";

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
	playerStatus,
}: LoadGameSessionParams & {
	score: number;
	timeMs: number;
	playerStatus: PlayerStatus;
}): Promise<GameSessionData> {
	const response = await fetch(
		`/api/competition/radio/${radioId}/session/${sessionId}`,
		{
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			//Abandon feature: add playerStatus
			body: JSON.stringify({ score, timeMs, playerStatus }),
		}
	);
	const data = (await response.json()) as GameSessionData & { error?: string };

	if (!response.ok) {
		throw new Error(data.error || "Failed to save game result");
	}

	return data;
}

export function updateGameSessionProgress({
	radioId,
	sessionId,
	score,
	timeMs,
}: LoadGameSessionParams & {
	score: number;
	timeMs: number;
}): Promise<GameSessionData> {
	return submitGameSessionResult({
		radioId,
		sessionId,
		score,
		timeMs,
		playerStatus: "playing",
	});
}
