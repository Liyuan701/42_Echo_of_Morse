//* Morse practice session: handles questions, answers, sound and light.
"use client";

import { useI18n } from "@/lib/i18n";
import { useEffect, useState } from "react";
import styles from "@/components/learning/css/PracticeSession.module.css";
import Link from "next/link";

import PracticeResult from "./practiceResult";
import type { Question } from "./practiceTypes";
import PracticeSettings from "./practiceSettings";
import { createQuestionList, getCharactersForLevel, wait } from "./practiceUtils";
import { submitPracticeResult } from "./practiceApi";
import type { AnswerRecord } from "./practiceApi";
import PracticeCheatSheet from "./practiceCheatSheet";
import { LEVEL_RULES, type LevelId } from "./practiceData";
import PracticePrompt from "./practicePrompt";
import PracticeAnswer from "./practiceAnswer";

// typeof ==> get the type of an existing variable
// AudioContext ==> a browser API to create and play sound
// webkitAudioContext is the old name for Safari
type BrowserWindow = Window & { webkitAudioContext?: typeof AudioContext };

export default function PracticeSession({ levelId }: { levelId: number }) {
	//========================================== init ==========================================
	// --------- i18n ---------
	const { dictionary } = useI18n();
	const t = dictionary.learningPractice;

	// --------- Base values for practice ---------
	// Math.max(levelId, 1) ==> If too small, use 1
	// Math.min(Math.max(levelId, 1), 12) ==> If too large, use 12
	// Goal: clamp levelId between 1 and 12
	const safeLevelId = Math.min(Math.max(levelId, 1), 12) as LevelId;
	const rule = LEVEL_RULES[safeLevelId];

	// --------- useState ---------
	// With () =>, it is called only on first render
	// Without () =>, createQuestionList would be called on every render
	// useState<return type>(initial value)
	// questions is the full list of questions for this session
	const [questions, setQuestions] = useState<Question[]>(() => createQuestionList(safeLevelId));
	const [questionIndex, setQuestionIndex] = useState(1);
	// question = the current question
	const question = questions[questionIndex - 1];

	const [correctCount, setCorrectCount] = useState(0);
	const [answer, setAnswer] = useState("");
	// result message shown when the user finishes
	const [feedback, setFeedback] = useState("");
	const [isFinished, setIsFinished] = useState(false);

	const [audioEnabled, setAudioEnabled] = useState(true);
	const [visualEnabled, setVisualEnabled] = useState(true);
	// bulb = light indicator
	const [bulbOn, setBulbOn] = useState(false);

	// whether audio/signal is currently playing
	// prevents playing multiple times, controls buttons and visuals
	const [questionPlaying, setQuestionPlaying] = useState(false);
	const [cheatSheetPlaying, setCheatSheetPlaying] = useState(false);

	// --------- Answer history: one record per question answered ---------
	const [answerHistory, setAnswerHistory] = useState<AnswerRecord[]>([]);

	const progressText = `${questionIndex} / ${rule.questionCount}`;

	const finalAccuracy = Math.round((correctCount / rule.questionCount) * 100);
	const hasPassed = correctCount >= rule.passCount;

	// Two conditions: first check if question exists, then check mode (decode or encode)
	const expectedAnswer = question // (=false) --> expectedAnswer = ""
		? question.mode === "decode" // (=false) --> question.morse
			? question.character
			: question.morse
		: "";

	const { newCharacters, reviewCharacters } = getCharactersForLevel(safeLevelId);
	const cheatSheetItems = [...reviewCharacters, ...newCharacters];

	//========================================== functions ==========================================
	// --------- Play a short or long tone based on the given duration ---------
	async function playTone(duration: number) {
		// If audio is disabled, still wait to keep the rhythm for the light.
		if (!audioEnabled) {
			await wait(duration);
			return;
		}

		const browserWindow = window as BrowserWindow;
		const AudioContextClass = browserWindow.AudioContext || browserWindow.webkitAudioContext;

		// If the browser does not support audio, still keep the rhythm.
		if (!AudioContextClass) {
			await wait(duration);
			return;
		}

		// Create audio environment
		const context = new AudioContextClass();
		// Sound generator
		const oscillator = context.createOscillator();
		// Volume control
		const gain = context.createGain();

		// Sound type: sine gives a softer tone
		oscillator.type = "sine";
		// Sound frequency
		oscillator.frequency.value = 650;
		// Volume
		gain.gain.value = 0.12;

		// Audio path: generator -> volume -> speakers
		oscillator.connect(gain);
		gain.connect(context.destination);

		oscillator.start();
		await wait(duration);
		oscillator.stop();
		await context.close();
	}

	// --------- Play a Morse signal with sound and optional light ---------
	async function playMorse(
		morse: string,
		useLight: boolean,
		isBusy: boolean,
		setBusy: (setBusyParam: boolean) => void
	) {
		if (isBusy) {
			return;
		}

		setBusy(true);

		// for...of --> take each value one by one
		// reads one char from the string
		for (const symbol of morse) {
			const duration = symbol === "." ? 160 : 420;

			// turn on
			if (useLight && visualEnabled) {
				setBulbOn(true);
			}

			// wait
			await playTone(duration);

			// turn off
			if (useLight) {
				setBulbOn(false);
			}

			// wait (separator between symbols)
			await wait(160);
		}

		setBusy(false);
	}

	// --------- Play the signal for the current question ---------
	async function playSignal() {
		if (!question) {
			return;
		}

		await playMorse(question.morse, true, questionPlaying, setQuestionPlaying);
	}

	async function playCheatSheetMorse(morse: string) {
		await playMorse(morse, false, cheatSheetPlaying, setCheatSheetPlaying);
	}

	// --------- Move to the next question; if finished, send results to API ---------
	function goToNextQuestion(wasCorrect: boolean, delay = 700) {
		// Record this answer in history
		const newRecord: AnswerRecord = { char: question.character, correct: wasCorrect };
		setAnswerHistory((prev) => [...prev, newRecord]);

		if (wasCorrect) {
			// React may not have the latest value if we use correctCount directly,
			// so we use the functional updater to get the most recent count
			setCorrectCount((count) => count + 1);
		}

		// setTimeout --> run code later, here we wait 700ms
		// if all questions are done
		window.setTimeout(async () => {
			if (questionIndex >= rule.questionCount) {
				// Add the result of the last question
				// setCorrectCount does not update immediately
				const finalCorrectCount = correctCount + (wasCorrect ? 1 : 0);
				const accuracy = Math.round((finalCorrectCount / rule.questionCount) * 100);
				const passed = finalCorrectCount >= rule.passCount;

				// Build the full answer list including the last question
				// (answerHistory state may not include it yet due to async setState)
				const fullAnswers = [...answerHistory, newRecord];

				try {
					await submitPracticeResult({
						levelId: safeLevelId,
						correctCount: finalCorrectCount,
						questionCount: rule.questionCount,
						accuracy,
						passed,
						answers: fullAnswers,
					});
				} catch (error) {
					console.error("Failed to save practice result", error);
				}

				setIsFinished(true);
				return;
			}

			setQuestionIndex((index) => index + 1);
			setAnswer("");
			setFeedback("");
		}, delay);
	}

	// --------- Check the answer (character) for decode mode ---------
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
		setFeedback(wasCorrect ? t.correct : t.wrong);
		if (wasCorrect) {
			goToNextQuestion(true);
		}
	}

	// --------- Check the answer (morse) for encode mode ---------
	function submitEncodeAnswer() {
		if (!question) {
			return;
		}
		if (question.mode !== "encode" || feedback || !answer) {
			return;
		}

		const wasCorrect = answer === expectedAnswer;

		setFeedback(wasCorrect ? t.correct : t.wrong);
		if (wasCorrect) {
			goToNextQuestion(true);
		}
	}

	function handleNextQuestion() {
		goToNextQuestion(false, 0);
	}

	useEffect(() => {
		if (!question) {
			return;
		}

		// event: KeyboardEvent ==> the type of the keyboard event object
		function handleKeyDown(event: KeyboardEvent) {
			if (isFinished) {
				return;
			}

			// --------- when feedback shows an error ----------
			if (feedback && feedback !== t.correct && event.key === "Enter") {
				event.preventDefault();
				handleNextQuestion();
				return;
			}

			// --------- encode mode (morse) ---------
			if (question.mode === "encode") {
				if (event.key === "ArrowLeft") {
					event.preventDefault(); // prevent default browser action
					setAnswer((value) => value + ".");
				}

				if (event.key === "ArrowRight") {
					event.preventDefault();
					setAnswer((value) => value + "-");
				}

				// delete last character
				// slice(start, end) here keeps everything except the last char
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

			// --------- decode mode (character) ---------
			// letters, digits: a-z A-Z 0-9, or allowed symbols: .,?!/()&:;=+_$@"-
			// /^...$/  ==> matches exactly one character
			// test() returns true/false to check if a string matches the rule
			if (/^[a-zA-Z0-9]$/.test(event.key) || /^[.,?!/()&:;=+_$@"-]$/.test(event.key)) {
				submitDecodeAnswer(event.key);
			}
		}

		// attach keyboard listener
		window.addEventListener("keydown", handleKeyDown);
		// remove listener to avoid stacking multiple listeners
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
		return <div><h1>{t.noQuestion}</h1></div>;
	}

	//========================================== rendered page ==========================================
	// ------------------ result page (PracticeResult) ------------------
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
					setAnswerHistory([]);
				}}
			/>
		);
	}

	return (
		<section className={styles.practiceShell} aria-labelledby="practice-title">
			{/* ======================== header ======================== */}
			<div className={styles.practiceHeader}>
				{/* ------------ level title ------------ */}
				<div className={styles.practiceTitleBlock}>
					<Link className={styles.backToLevelsButton} href="/learning/levels">
						‹
					</Link>

					<h1 id="practice-title" className={styles.practiceTitle}>
						{t.level} {safeLevelId}
					</h1>
				</div>
				{/* ------------ correct count and progress ------------ */}
				<div className={styles.scoreBox}>
					<span>{progressText}</span>
					<strong>{correctCount} {t.correctCount}</strong>
				</div>
			</div>

			<div className={styles.practiceGrid}>
				{/* ======================== question card ======================== */}
				<PracticePrompt
					question={question}
					bulbOn={bulbOn}
					visualEnabled={visualEnabled}
					isPlaying={questionPlaying}
					t={t}
					onReplaySignal={playSignal}
				/>

				{/* ======================== answer card ======================== */}
				<PracticeAnswer
					question={question}
					answer={answer}
					feedback={feedback}
					t={t}
					onAddDot={() => setAnswer((value) => value + ".")}
					onAddDash={() => setAnswer((value) => value + "-")}
					onDelete={() => setAnswer((value) => value.slice(0, -1))}
					onSubmitEncode={submitEncodeAnswer}
					onNextQuestion={handleNextQuestion}
				/>
			</div>

			<PracticeCheatSheet
				items={cheatSheetItems}
				title={t.cheatSheetTitle}
				playLabel={t.playSound}
				onPlay={playCheatSheetMorse}
			/>

			<PracticeSettings
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
