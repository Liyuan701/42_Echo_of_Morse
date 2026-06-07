// Data sent to the API after a practice session
export type AnswerRecord = {
  char: string;    // the letter, e.g. "E"
  correct: boolean;
};

export type PracticeResultPayload = {
  levelId: number;
  correctCount: number;
  questionCount: number;
  accuracy: number;
  passed: boolean;
  answers: AnswerRecord[]; // one record per question
};

export async function submitPracticeResult(payload: PracticeResultPayload) {
	
	const response = await fetch("/api/learning/practice-result", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		throw new Error("Failed to save practice result");
	}
}