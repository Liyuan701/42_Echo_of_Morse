export type Player = {
	id: string;
	username: string;
	score: number;
	correct: number;
	total: number;
	streak: number;
};

export type GameSessionData = {
	id: string;
	status: "waiting" | "active" | "finished";
	duration: number;
	sequences: string[];
	speedWpm: number;
	players: Player[];
};

export type LoadGameSessionParams = {
	radioId: string;
	sessionId: string;
};
