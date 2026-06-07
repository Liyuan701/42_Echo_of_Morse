import type { GameSessionData, LoadGameSessionParams } from "./gameSessionType";

export const mockGameSessionData: GameSessionData = {
	duration: 900,
	sequences: ["HELLO", "WORLD", "MORSE", "CODE", "TEST"],
	players: [
		{ id: "me", username: "You", score: 0, correct: 0, total: 0, streak: 0 },
		{ id: "ana", username: "Ana", score: 120, correct: 2, total: 3, streak: 1 },
		{ id: "leo", username: "Leo", score: 80, correct: 1, total: 2, streak: 0 },
	],
};

//Partial<Type> : rend tous les champs d'un type optionnels
function normalizeGameSessionData(data: Partial<GameSessionData>): GameSessionData {
	return {
		duration: data.duration ?? mockGameSessionData.duration,
		sequences: data.sequences?.length ? data.sequences : mockGameSessionData.sequences,
		players: data.players?.length ? data.players : mockGameSessionData.players,
	};
}

export async function getGameSessionData({
	radioId,
	sessionId,
}: LoadGameSessionParams): Promise<GameSessionData> {
	try {
		const response = await fetch(`/api/competition/radio/${radioId}/session/${sessionId}`,
			{ cache: "no-store" }
		);

		if (!response.ok) {
			throw new Error("Failed to load game session");
		}

		const data = await response.json();
		return normalizeGameSessionData(data);

	} catch (error) {
		console.warn("Using mock game session data", error);
		return mockGameSessionData;
	}
}
