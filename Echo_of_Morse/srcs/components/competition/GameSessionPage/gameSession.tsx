"use client";

import { useI18n } from "@/lib/i18n";
import { useEffect, useRef, useState } from "react";
import { encode } from "@/lib/morse";

import styles from "./css/gameSession.module.css";
import Answer from "./answer";
import Ranking from "./ranking";
import GameTimer from "./gameTimer";
import FinalRanking from "./finalRanking";
import MorseStream, { getSequenceDuration } from "./morseStream";
import type { GameSessionData, Player } from "./gameSessionType";
import {
	getGameSessionData,
	submitGameSessionResult,
	updateGameSessionProgress,
} from "./gameSessionData";

type GameSessionProps = {
	radioId: string;
	sessionId: string;
	speedWpm: number;
};

export default function GameSession({
	radioId,
	sessionId,
	speedWpm,
}: GameSessionProps) {

	const { dictionary } = useI18n();
	const t = dictionary.competitionGame;

	//arder une valeur sans relancer l’affichage de la page
	const sequenceIndexRef = useRef(1);
	//Date.now() ==> obtenir le temps actel en ms
	const sequenceStartRef = useRef(Date.now());
	const sequenceStreakRef = useRef(false);
	const sessionStartedAtRef = useRef(Date.now());
	const hasSubmittedResultRef = useRef(false);

	//-------------------- données de la session -------------------- 
	const [sessionData, setSessionData] = useState<GameSessionData | null>(null);
	const [players, setPlayers] = useState<Player[]>([]);
	const [secondsLeft, setSecondsLeft] = useState(0);
	const [currentText, setCurrentText] = useState("");
	const [currentMorse, setCurrentMorse] = useState("");
	const [loadError, setLoadError] = useState("");

	//-------------------- données de la réponse -------------------- 
	const [answer, setAnswer] = useState("");
	const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
	const [showMorseText, setShowMorseText] = useState(true);
	const [isAnswerLocked, setIsAnswerLocked] = useState(false);

	//-------------------- données pour aider à la gestion --------------------
	const isFinished = secondsLeft <= 0;
	const sequence = sessionData?.sequences ?? [];

	//ranking: 
	// Abandon Feature: the abandon palyer don't show in ranking.
	const leaderboard = players
		.filter((player) => !player.abandoned)
		.sort((a, b) => b.score - a.score);
	const highestScore = leaderboard[0]?.score ?? 0;
	//filter = garder seulement les elements qui respectent une condition
	const winners = leaderboard.filter((player) => player.score === highestScore);


	//-------------------- fonction tool --------------------
	//
	async function abandonGame() {
		const currentPlayer = players.find((player) => player.id === "me");

		if (!currentPlayer || hasSubmittedResultRef.current) {
			return;
		}

		hasSubmittedResultRef.current = true;

		try {
			const data = await submitGameSessionResult({
				radioId,
				sessionId,
				score: currentPlayer.score,
				timeMs: Date.now() - sessionStartedAtRef.current,
				playerStatus: "abandoned",
			});

			//mettre a jour les donnes pour afficher FinalRanking
			setSessionData(data);
			setPlayers(data.players);
			setSecondsLeft(0);
		} catch (error) {
			hasSubmittedResultRef.current = false;
			console.error(t.failedToSaveGameResult, error);
		}
	}

	function resetStreak() {
		setPlayers((currentPlayers) =>
			currentPlayers.map((player) => {
				if (player.id !== "me") {
					return player;
				}

				return {
					...player,
					streak: 0,
				};
			})
		);
	}

	//-------------------- 1e : obtention des données de la session --------------------
	useEffect(() => {
		let cancelled = false;

		async function loadSessionData() {
			try {
				const data = await getGameSessionData({ radioId, sessionId });
				const firstSequence = data.sequences[0];

				if (!firstSequence) {
					throw new Error(t.noChallengeSequences);
				}

				if (cancelled) {
					return;
				}

				const now = Date.now();
				sequenceIndexRef.current = 1;
				sequenceStartRef.current = now;
				sessionStartedAtRef.current = now;
				sequenceStreakRef.current = false;
				hasSubmittedResultRef.current = false;
				setSessionData(data);
				setPlayers(data.players);
				setSecondsLeft(data.duration);
				setCurrentText(firstSequence);
				setCurrentMorse(encode(firstSequence));
				setLoadError("");

				setAnswer("");
				setIsAnswerCorrect(false);
				setIsAnswerLocked(false);
			} catch (error) {
				if (!cancelled) {
					setLoadError(t.failedToLoadGameSession);
				}
			}
		}

		loadSessionData();

		return () => {
			cancelled = true;
		};
	}, [radioId, sessionId]);

	useEffect(() => {
		if (!sessionData || !isFinished || hasSubmittedResultRef.current) {
			return;
		}

		const currentPlayer = players.find((player) => player.id === "me");

		if (!currentPlayer) {
			return;
		}

		hasSubmittedResultRef.current = true;

		submitGameSessionResult({
			radioId,
			sessionId,
			score: currentPlayer.score,
			timeMs: Date.now() - sessionStartedAtRef.current,
			playerStatus: "completed",
		})
			.then((data) => {
				const localPlayer = players.find((player) => player.id === "me");
				setSessionData(data);
				setPlayers(
					data.players.map((player) =>
						player.id === "me" && localPlayer
							? {
									...player,
									correct: localPlayer.correct,
									total: localPlayer.total,
									streak: localPlayer.streak,
							  }
							: player
					)
				);
			})
			.catch((error: unknown) => {
				hasSubmittedResultRef.current = false;
				console.error(t.failedToSaveGameResult, error);
			});
	}, [isFinished, players, radioId, sessionData, sessionId]);

	const currentPlayerScore = players.find(
		(player) => player.id === "me"
	)?.score;

	useEffect(() => {
		if (
			currentPlayerScore === undefined ||
			isFinished ||
			sessionData?.status !== "active" ||
			hasSubmittedResultRef.current
		) {
			return;
		}

		updateGameSessionProgress({
			radioId,
			sessionId,
			score: currentPlayerScore,
			timeMs: Date.now() - sessionStartedAtRef.current,
		}).catch((error: unknown) => {
			console.error(t.failedToSaveGameResult, error);
		});
	}, [
		currentPlayerScore,
		isFinished,
		radioId,
		sessionData?.status,
		sessionId,
		t.failedToSaveGameResult,
	]);

	// TODO modify after socket notifications are reliable.
	// Temporary polling fallback. While the game is active, it detects an early
	// finish caused by an abandonment. Afterward, it waits for the remaining
	// player's final score. Replace this with a Socket.IO session update event.
	useEffect(() => {
		const hasPendingEligiblePlayers = sessionData?.players.some(
			(player) => !player.abandoned && !player.completed
		);

		if (sessionData?.status === "finished" && !hasPendingEligiblePlayers) {
			return;
		}

		const intervalId = window.setInterval(() => {
			getGameSessionData({ radioId, sessionId })
				.then((data) => {
					setSessionData((currentData) =>
						currentData
							? {
									...currentData,
									status: data.status,
									duration: data.duration,
									players: data.players,
							  }
							: data
					);
					if (data.status === "finished") {
						setSecondsLeft(0);
					}
					setPlayers((currentPlayers) => {
						const localPlayer = currentPlayers.find(
							(player) => player.id === "me"
						);

						return data.players.map((player) =>
							player.id === "me" && localPlayer
								? {
										...player,
										score: localPlayer.score,
										correct: localPlayer.correct,
										total: localPlayer.total,
										streak: localPlayer.streak,
								  }
								: player
						);
					});
				})
				.catch(() => undefined);
		}, 2000);

		return () => window.clearInterval(intervalId);
	}, [radioId, sessionData, sessionId]);

	//-------------------- gestion du timer --------------------
	useEffect(() => {
		if (isFinished) {
			return;
		}

		//window.setInterval ==> excuter une fonction à intervalle régulier, selon le temps défini (ici 1000ms = 1s)
		//diminuer le temps restant chaque seconde
		//Math.max(value - 1, 0) ==> éviter que le temps restant devienne négatif
		const timer = window.setInterval(() => {
			setSecondsLeft((value) => Math.max(value - 1, 0));
		}, 1000);

		//window.clearInterval ==> arrêter l’exécution d’une fonction à intervalle régulier， sinon elle continuerait même après la fin du jeu
		return () => window.clearInterval(timer);
	}, [isFinished]);

	//-------------------- 2e: pass à la prochaine --------------------
	useEffect(() => {
		if (isFinished || !sequence.length) {
				return;
		}

		let timeoutId: number;

		function nextSequence(delay: number) {
			//window.setTimeout ==> exécuter une fonction après un délai défini (en ms)
			timeoutId = window.setTimeout(() => {
				//ici sequenceIndexRef.current % sequence.length ==> permet de revenir au debut
				const nextText = sequence[sequenceIndexRef.current % sequence.length];
				const nextMorse = encode(nextText);

				sequenceIndexRef.current += 1;
				sequenceStartRef.current = Date.now();
				if (!sequenceStreakRef.current) {
					resetStreak();
				}
				sequenceStreakRef.current = false;
				setCurrentText(nextText);
				setCurrentMorse(nextMorse);
				setAnswer("");
				setIsAnswerCorrect(false);
				setIsAnswerLocked(false);

				nextSequence(getSequenceDuration(nextMorse, speedWpm));
			}, delay);
		}

		//1e execution
		nextSequence(getSequenceDuration(currentMorse, speedWpm));

		return () => window.clearTimeout(timeoutId);
	}, [currentMorse, isFinished, sequence, speedWpm]);

	//-------------------- 3e: vérifier la réponse --------------------
	function checkAnswer(nextAnswer: string) {
		if (isFinished || isAnswerLocked) {
			return;
		}

		const answerForCheck = nextAnswer.toUpperCase();
		setAnswer(answerForCheck);

		//quand vide
		if (!answerForCheck.trim()) {
			setIsAnswerCorrect(false);
			return;
		}

		if (answerForCheck === currentText.toUpperCase()) {
			setIsAnswerCorrect(true);
			setIsAnswerLocked(true);
			sequenceStreakRef.current = true;

			setPlayers((currentPlayers) => currentPlayers.map((player) => {
				// mettre à jour seulement le joueur actuel
				if (player.id !== "me") {
					return player;
				}

				//successivement
				const nextStreak = player.streak + 1;
				//points de base
				const sequencePoints = currentText.replace(/\s/g, "").length;
				//vitesse de réponse
				const sequenceTime = Math.floor((Date.now() - sequenceStartRef.current) / 1000);
				const speedBonus = Math.max(10 - sequenceTime, 0);

				return {
					...player,
					total: player.total + 1,
					correct: player.correct + 1,
					streak: nextStreak,
					score: player.score + sequencePoints + speedBonus + nextStreak,
				};
			}));
			return;
		}

		setIsAnswerCorrect(false);
	}

	if (loadError) {
		return (
			<section className={styles.shell}>
				<section className={styles.gameArea}>{loadError}</section>
			</section>
		);
	}

    if (!sessionData) {
		return (
			<section className={styles.shell}>
				<section className={styles.gameArea}>
					{t.loadingGameSession}
				</section>
			</section>
		);
	}

	if (isFinished) {
		return (
		<section className={styles.finalShell}>
			<FinalRanking
				radioId={radioId}
				players={leaderboard}
				winners={winners}
			/>
		</section>
		);
	}

  return (

    <section className={styles.shell}>
    	<Ranking 
			players={leaderboard}
		/>

		<section className={styles.gameArea}>
			{/* -------------------- titre -------------------- */}
			<header className={styles.header}>
				<div>
					<p className={styles.eyebrow}>{t.radioWaveTitle.replace("{radioId}", radioId)}</p>
					<h1 className={styles.title}>{t.decodeSessionTitle.replace("{wpm}", String(speedWpm))}</h1>
				</div>

			{/* -------------------- temps -------------------- */}
				<GameTimer secondsLeft={secondsLeft} />
			</header>

			{/* -------------------- case morse -------------------- */}
			<label className={styles.soundToggle}>
				<input
					type="checkbox"
					checked={showMorseText}
					onChange={(event) => setShowMorseText(event.target.checked)}
				/>
				{t.showMorseText}
			</label>

			<MorseStream
				morse={currentMorse}
				showMorseText={showMorseText}
				speedWpm={sessionData.speedWpm || speedWpm}
				disabled={isFinished}
			/>

			<Answer
				value={answer}
				target={currentText}
				disabled={isFinished || isAnswerLocked}
				isCorrect={isAnswerCorrect}
				onChange={checkAnswer}
			/>

			<div className={styles.footerActions}>
				<button
					type="button"
					className={styles.abandonButton}
					onClick={abandonGame}
					disabled={isFinished}
				>
					{t.abandonGame}
				</button>
			</div>
		</section>
    </section>
  );
}
