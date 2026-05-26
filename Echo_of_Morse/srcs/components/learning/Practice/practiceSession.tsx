//* Session de pratique Morse : gere les questions, les reponses, le son et la lumiere.
"use client";

import { useI18n } from "@/lib/i18n";
import { useEffect, useState } from "react";
import styles from "@/components/learning/css/PracticeSession.module.css";

import PracticeResult from "./practiceResult";
import type { Question } from "./practiceTypes";
import PracticeSettings from "./practiceSettings";
import { LEVEL_RULES, type LevelId } from "./practiceData";
import { createQuestionList, toDisplayMorse, wait } from "./practiceUtils";
import { submitPracticeResult } from "./practiceApi";

// typeof ==> prendre le type d’une variable déjà existante
// AudioContext ==> une API du navigateur pour créer et jouer du son.
// webkitAudioContext est l'ancien nom pour Safari
type BrowserWindow = Window & {webkitAudioContext?: typeof AudioContext;};

export default function PracticeSession({ levelId }: { levelId: number }) {
	//========================================== init ==========================================
	// --------- i8n --------- 
	const { dictionary } = useI18n();
	const t = dictionary.learningPractice;

	// --------- Valeurs de base pour la pratique ---------
	// Math.max(levelId, 1) ==> Si c’est trop petit, on prend 1
	// Math.min(Math.max(levelId, 1), 12) ==> Si c’est trop grand, on prend 12.
	//but: limite levelId entre 1 et 12
	const safeLevelId = Math.min(Math.max(levelId, 1), 12) as LevelId;
	const rule = LEVEL_RULES[safeLevelId];

	// --------- useState --------- 
	// Avec () =>, il est appele seulement au debut
	// Sans () =>, createQuestionList est appele a chaque rendu
	//useState<le type de retour>(valeur init)
	//questions est la liste de toutes les questions
	const [questions, setQuestions] = useState<Question[]>(() => createQuestionList(safeLevelId));
	const [questionIndex, setQuestionIndex] = useState(1);
	// question = la question actuelle
	const question = questions[questionIndex - 1];

	const [correctCount, setCorrectCount] = useState(0);
	const [answer, setAnswer] = useState("");
	//msg de resultat lorsqu'on appuye pour fini
	const [feedback, setFeedback] = useState("");
	const [isFinished, setIsFinished] = useState(false);

	const [audioEnabled, setAudioEnabled] = useState(true);
	const [visualEnabled, setVisualEnabled] = useState(true);
	//buld=灯泡
	const [bulbOn, setBulbOn] = useState(false);

	//en train de jouer ou non
	//eviter de joue plusieur fois, controle les bouton et image
	const [isPlaying, setIsPlaying] = useState(false);

	const progressText = `${questionIndex} / ${rule.questionCount}`;

	const finalAccuracy = Math.round((correctCount / rule.questionCount) * 100);
	const hasPassed = correctCount >= rule.passCount;

	//il y a deux conditions : d’abord si question existe, puis si le mode est decode ou encode
	const expectedAnswer = question //(=false) --> expectedAnswer = ""
		? question.mode === "decode" //(=false) --> question.morse
			? question.character
			: question.morse
		: "";

	//========================================== function ==========================================
	// --------- set audio ---------
	// joue un son court ou long selon la duree donnee
	async function playTone(duration: number) {
		// Si le son est desactive, on attend quand meme.
		// Cela garde le rythme pour la lumiere.
		if (!audioEnabled) {
			await wait(duration);
			return;
		}

		const browserWindow = window as BrowserWindow;
		const AudioContextClass = browserWindow.AudioContext || browserWindow.webkitAudioContext;

		// Si le navigateur ne supporte pas l'audio, on garde quand meme le rythme.
		if (!AudioContextClass) {
			await wait(duration);
			return;
		}

		//creer un env d'audio
		const context = new AudioContextClass();
		// le generateur du son
		const oscillator = context.createOscillator();
		//le controle du volume
		const gain = context.createGain();

		//Type du son : sine donne un son plus doux
		oscillator.type = "sine";
		// Frequence du son.
		oscillator.frequency.value = 650;
		// Volume du son.
		gain.gain.value = 0.12;

		//chemin du son : generateur -> volume -> haut-parleurs
		oscillator.connect(gain);
		gain.connect(context.destination);

		oscillator.start();
		await wait(duration);
		oscillator.stop();
		await context.close();
	}

	// --------- joue avec le son et la lumière ---------
	async function playSignal() {
		if (!question) {
			return;
		}
		if (isPlaying) {
			return;
		}

		setIsPlaying(true);

		//for...of --> prendre chaque valeur une par une
		//lit un char dans str
		for (const symbol of question.morse) {
			const duration = (symbol === "." ? 160 : 420);

			if (visualEnabled) {
				setBulbOn(true);
			}

			await playTone(duration);

			setBulbOn(false);
			await wait(160);
		}

		setIsPlaying(false);
	}

	//--------- pass à la prochaine exo, si fini, envoie les resulta au api ---------
	function goToNextQuestion(wasCorrect: boolean) {
		if (wasCorrect) {
			//ici count peut avoir la dernière valeur donnée par React
			//si utilise directement (correctCount + 1), peut etre on voit pas la valeur plus recent
			//car React recoit la demande, mais met a jour a la prochaine execution
			setCorrectCount((count) => count + 1);
		}

		//setTimeout --> executer le code plus tard, ici on attend 700ms
		//si fini de faire tous les exo
		window.setTimeout(async () => {
			if (questionIndex >= rule.questionCount) {
				//ajoute le résultat de la dernière question
				//setCorrectCount ne met pas à jour tout de suite
				const finalCorrectCount = correctCount + (wasCorrect ? 1 : 0);
				const accuracy = Math.round((finalCorrectCount / rule.questionCount) * 100);
				const passed = finalCorrectCount >= rule.passCount;

				try {
					await submitPracticeResult({
						levelId: safeLevelId,
						correctCount: finalCorrectCount,
						questionCount: rule.questionCount,
						accuracy,
						passed,
					});
				} catch (error)
				{
					console.error("Failed to save practice result", error);
				}

				setIsFinished(true);
				return;
			}

			setQuestionIndex((index) => index + 1);
			setAnswer("");
			setFeedback("");
		}, 700);
	}

	//--------- verifier la reponse(character) pour la mode decode ---------
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

	//--------- verifier la reponse(morse) pour la mode encode ---------
	function submitEncodeAnswer() {
		if (!question) {
			return;
		}
		if (question.mode !== "encode" || feedback || !answer) {
			return;
		}

		const wasCorrect = answer === expectedAnswer;

		setFeedback(wasCorrect ? t.correct : `${t.wrong}: ${toDisplayMorse(question.morse)}`);
		goToNextQuestion(wasCorrect);
	}

	useEffect(() => {
		if (!question) {
			return;
		}

		//event: KeyboardEvent ==> le type de l’objet événement clavier
		function handleKeyDown(event: KeyboardEvent) {
			if (isFinished) {
				return;
			}

			//--------- la mode encode(morse) ---------
			if (question.mode === "encode") {
				if (event.key === "ArrowLeft") {
					event.preventDefault();  // bloque l’action normale du navigateur
					setAnswer((value) => value + ".");
				}

				if (event.key === "ArrowRight") {
					event.preventDefault();
					setAnswer((value) => value + "-");
				}

				//pour supp
				//slice(index_start, index_end) ici garde tout sauf le dernier caractère
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

			//--------- la mode encode(morse) ---------
			//lettre, chiffre: a-z A-Z 0-9, ou signe autorisé: .,?!/()&:;=+_$@"-
			// /^...&/ ==> pour prend qu'un seul element
			//test() retourne true/false, pour verifier un text respecte la regle
			// regle.test(string)
			if (/^[a-zA-Z0-9]$/.test(event.key) || /^[.,?!/()&:;=+_$@"-]$/.test(event.key)) {
				submitDecodeAnswer(event.key);
			}
		}

		// ajoute l’ecoute du clavier
		window.addEventListener("keydown", handleKeyDown);
		//enlève cette ecoute，evite d’avoir plusieurs ecoutes en meme temps
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
		return <Card><h1>{t.userNotFound}</h1></Card>;
	}

	//========================================== page affiche ==========================================
	//------------------ page resultat(PracticeResult) ------------------
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
				{/*======================== en haut ========================*/}
			<div className={styles.practiceHeader}>
				{/*------------ affiche le niveau en haut ------------*/}
				<div>
					<h1 id="practice-title" className={styles.practiceTitle}> {t.level} {safeLevelId} </h1>
				</div>
				{/*------------ nb d'exo correct et progression  ------------*/}
				<div className={styles.scoreBox}>
					<span>{progressText}</span>
					<strong>{correctCount} {t.correctCount}</strong>
				</div>
			</div>

			{/*======================== carte d'exo ========================*/}
			<div className={styles.practiceGrid}>
				<section className={styles.promptPanel}>
					{/*------------ affiche pour la mode: encode/decode ------------*/}
					<div className={styles.modeBadge}>
						{question.mode === "decode" ? t.decodeSignal : t.encodeCharacter}
					</div>

					{question.mode === "decode" ? (
						<>
							{/*------------ ampoule ------------*/}
							<div
								className={`${styles.bulb} ${bulbOn ? styles.bulbOn : ""} ${!visualEnabled ? styles.bulbHidden : "" }`}
							>
								💡
							</div>

							{/*------------ text pour la facon de reponse ------------*/}
							<p className={styles.promptText}>{t.listenPrompt}</p>

							{/*------------ bouton pour rejouer le signa ------------*/}
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
							{/* ------------ la mode encode: la lettre et text ------------ */}
							<div className={styles.characterPrompt}>{question.character}</div>
							<p className={styles.promptText}>{t.encodePrompt}</p>
						</>
					)}
				</section>

				{/*======================== carte de reponse ========================*/}
				<section className={styles.answerPanel}>
					{/* ------------ la partie reponse (decode) ------------ */}
					<div className={styles.answerBox}>
						<span>{t.yourAnswer}</span>
						<strong>
							{question.mode === "decode"
								? answer
								: toDisplayMorse(answer)}
						</strong>
					</div>

					{/* ------------ la partie reponse (encode) ------------ */}
					{question.mode === "encode" ? (
						<div className={styles.keyGrid}>
							<button
								type="button"
								onClick={() => setAnswer((value) =>  value + ".")}
							>
								{t.leftDot}
							</button>

							<button
								type="button"
								onClick={() => setAnswer((value) =>  value + "-")}
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

					{/* ------------ la partie resultat ------------ */}
					{feedback ? (
						<p
							className={`${styles.feedback} ${feedback === t.correct ? styles.feedbackGood : styles.feedbackBad}`}
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
