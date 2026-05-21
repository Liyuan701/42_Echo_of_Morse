"use client";

import { useI18n } from "@/lib/i18n";
import { useEffect, useMemo, useState } from "react";
import styles from "@/components/learning/css/PracticeSession.module.css";

import PracticeResult from "./practiceResult";
import type { Question } from "./practiceTypes";
import PracticeSettings from "./practiceSettings";
import { LEVEL_RULES, type LevelId } from "./practiceData";
import { createQuestionList, toDisplayMorse, wait } from "./practiceUtils";

type BrowserWindow = Window & typeof globalThis & {webkitAudioContext?: typeof AudioContext;};

export default function PracticeSession({ levelId }: { levelId: number }) {
	const { dictionary } = useI18n();
	const t = dictionary.learningPractice;

	const safeLevelId = Math.min(Math.max(levelId, 1), 12) as LevelId;
	const rule = LEVEL_RULES[safeLevelId];

	const [questions, setQuestions] = useState<Question[]>(() =>
		createQuestionList(safeLevelId)
	);

	const [questionIndex, setQuestionIndex] = useState(1);
	const question = questions[questionIndex - 1];


	const [correctCount, setCorrectCount] = useState(0);
	const [answer, setAnswer] = useState("");
	const [feedback, setFeedback] = useState("");
	const [isFinished, setIsFinished] = useState(false);
	const [audioEnabled, setAudioEnabled] = useState(true);
	const [visualEnabled, setVisualEnabled] = useState(true);
	const [bulbOn, setBulbOn] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);

	const progressText = `${questionIndex} / ${rule.questionCount}`;

	const finalAccuracy = Math.round((correctCount / rule.questionCount) * 100);
	const hasPassed = correctCount >= rule.passCount;

	const expectedAnswer = useMemo(() => {
		if (!question) {
			return "";
		}
		if (question.mode === "decode") {
			return question.character;
		}

		return question.morse;
	}, [question]);

	async function playTone(duration: number) {
		if (!audioEnabled) {
			await wait(duration);
			return;
		}

		const browserWindow = window as BrowserWindow;
		const AudioContextClass =
			browserWindow.AudioContext || browserWindow.webkitAudioContext;

		if (!AudioContextClass) {
			await wait(duration);
			return;
		}

		const context = new AudioContextClass();
		const oscillator = context.createOscillator();
		const gain = context.createGain();

		oscillator.type = "sine";
		oscillator.frequency.value = 650;
		gain.gain.value = 0.12;

		oscillator.connect(gain);
		gain.connect(context.destination);

		oscillator.start();
		await wait(duration);
		oscillator.stop();
		await context.close();
	}

	async function playSignal() {
		if (!question) {
			return;
		}
		if (isPlaying) {
			return;
		}

		setIsPlaying(true);

		for (const symbol of question.morse) {
			const duration = symbol === "." ? 160 : 420;

			if (visualEnabled) {
				setBulbOn(true);
			}

			await playTone(duration);

			setBulbOn(false);
			await wait(160);
		}

		setIsPlaying(false);
	}

	async function submitPracticeResult(finalCorrectCount: number) {
		const accuracy = Math.round((finalCorrectCount / rule.questionCount) * 100);
		const passed = finalCorrectCount >= rule.passCount;

		await fetch("/api/learning/practice-result", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				levelId: safeLevelId,
				correctCount: finalCorrectCount,
				questionCount: rule.questionCount,
				accuracy,
				passed,
			}),
		});
	}

	function goToNextQuestion(wasCorrect: boolean) {
		if (wasCorrect) {
			setCorrectCount((count) => count + 1);
		}

		window.setTimeout(async () => {
			if (questionIndex >= rule.questionCount) {
				const finalCorrectCount = correctCount + (wasCorrect ? 1 : 0);

				try {
					await submitPracticeResult(finalCorrectCount);
				} catch {
				}

				setIsFinished(true);
				return;
			}

			setQuestionIndex((index) => index + 1);
			setAnswer("");
			setFeedback("");
		}, 700);
	}

	function submitDecodeAnswer(value: string) {
		if (!question) {
			return;
		}

		if (question.mode !== "decode" || feedback) {
			return;
		}

		const normalized = value.toUpperCase();
		const wasCorrect = normalized === expectedAnswer;

		setAnswer(normalized);
		setFeedback(wasCorrect ? t.correct : `${t.wrong}: ${question.character}`);
		goToNextQuestion(wasCorrect);
	}

	function submitEncodeAnswer() {
		if (!question) {
			return;
		}
		if (question.mode !== "encode" || feedback || !answer) {
			return;
		}

		const wasCorrect = answer === expectedAnswer;

		setFeedback(
			wasCorrect ? t.correct : `${t.wrong}: ${toDisplayMorse(question.morse)}`
		);
		goToNextQuestion(wasCorrect);
	}

	useEffect(() => {
		if (!question) {
			return;
		}
		function handleKeyDown(event: KeyboardEvent) {
			if (isFinished) {
				return;
			}

			if (question.mode === "encode") {
				if (event.key === "ArrowLeft") {
					event.preventDefault();
					setAnswer((value) => `${value}.`);
				}

				if (event.key === "ArrowRight") {
					event.preventDefault();
					setAnswer((value) => `${value}-`);
				}

				if (event.key === "Backspace") {
					event.preventDefault();
					setAnswer((value) => value.slice(0, -1));
				}

				if (event.key === "Enter") {
					event.preventDefault();
					submitEncodeAnswer();
				}

				return;
			}

			// if (/^[a-zA-Z0-9]$/.test(event.key) || /^[.,?!/()&:;=+_$@-]$/.test(event.key)) {
			if (/^[a-zA-Z0-9]$/.test(event.key) || /^[.,?!/()&:;=+_$@"-]$/.test(event.key)) {
				submitDecodeAnswer(event.key);
			}
		}

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [answer, expectedAnswer, feedback, isFinished, question, questionIndex, t]);

	useEffect(() => {
		if (!question) {
			return;
		}
		if (question.mode === "decode") {
			playSignal();
		}
	}, [question]);

	if (!question) {
		return null;
	}
	if (isFinished) {
		return (
			<PracticeResult
				levelId={safeLevelId}
				correctCount={correctCount}
				questionCount={rule.questionCount}
				passCount={rule.passCount}
				finalAccuracy={finalAccuracy}
				hasPassed={hasPassed}
				t={t}
				onRestart={() => {
					setQuestions(createQuestionList(safeLevelId));
					setQuestionIndex(1);
					setCorrectCount(0);
					setAnswer("");
					setFeedback("");
					setIsFinished(false);
				}}
			/>
		);
	}

	return (
		<section className={styles.practiceShell} aria-labelledby="practice-title">
			<div className={styles.practiceHeader}>
				<div>
					<p className={styles.kicker}>{t.mixedPractice}</p>
					<h1 id="practice-title" className={styles.practiceTitle}>
						{t.level} {safeLevelId}
					</h1>
				</div>
			{/* 右上角 */}
			<div className={styles.scoreBox}>
				<span>{progressText}</span>
				<strong>{correctCount} {t.correctCount}</strong>
			</div>

			</div>

			<div className={styles.practiceGrid}>
				<section className={styles.promptPanel}>
					<div className={styles.modeBadge}>
						{question.mode === "decode" ? t.decodeSignal : t.encodeCharacter}
					</div>

					{question.mode === "decode" ? (
						<>
							<div
								className={`${styles.bulb} ${bulbOn ? styles.bulbOn : ""} ${
									!visualEnabled ? styles.bulbHidden : ""
								}`}
								aria-label={bulbOn ? t.signalOn : t.signalOff}
							>
								💡
							</div>

							<p className={styles.promptText}>{t.listenPrompt}</p>

							<button
								type="button"
								className={styles.secondaryAction}
								onClick={playSignal}
								disabled={isPlaying}
							>
								{isPlaying ? t.playing : t.replaySignal}
							</button>
						</>
					) : (
						<>
							<div className={styles.characterPrompt}>{question.character}</div>
							<p className={styles.promptText}>{t.encodePrompt}</p>
						</>
					)}
				</section>

				<section className={styles.answerPanel}>
					<div className={styles.answerBox}>
						<span>{t.yourAnswer}</span>
						<strong>
							{question.mode === "decode"
								? answer || "-"
								: toDisplayMorse(answer)}
						</strong>
					</div>

					{question.mode === "encode" ? (
						<div className={styles.keyGrid}>
							<button
								type="button"
								onClick={() => setAnswer((value) => `${value}.`)}
							>
								{t.leftDot}
							</button>

							<button
								type="button"
								onClick={() => setAnswer((value) => `${value}-`)}
							>
								{t.rightDash}
							</button>

							<button
								type="button"
								onClick={() => setAnswer((value) => value.slice(0, -1))}
							>
								{t.delete}
							</button>

							<button type="button" onClick={submitEncodeAnswer}>
								{t.submit}
							</button>
						</div>
					) : null}

					{feedback ? (
						<p
							className={`${styles.feedback} ${
								feedback === t.correct ? styles.feedbackGood : styles.feedbackBad
							}`}
						>
							{feedback}
						</p>
					) : (
						<p className={styles.hint}>
							{question.mode === "decode" ? t.pressMatching : t.buildMorse}
						</p>
					)}
				</section>
			</div>

			<PracticeSettings
				label={t.signalSettings}
				audioLabel={t.audio}
				lightLabel={t.light}
				audioEnabled={audioEnabled}
				visualEnabled={visualEnabled}
				onAudioChange={setAudioEnabled}
				onVisualChange={setVisualEnabled}
			/>
		</section>
	);
}
