//* donnes pour envoyer au API
export type PracticeResultPayload = {
	levelId: number;
	correctCount: number;
	questionCount: number;
	accuracy: number;
	passed: boolean;
};

export async function submitPracticeResult(payload: PracticeResultPayload) {
	await fetch("/api/learning/practice-result", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
}