export type Player = {
	id: string;
	username: string;
	score: number;
	correct: number;
	total: number;
	streak: number;
};

export type GameSessionData = {
	duration: number;
	sequences: string[];
	players: Player[];
};

export type LoadGameSessionParams = {
	radioId: string;
	sessionId: string;
};
