import styles from "@/components/learning/css/PracticeSession.module.css";

type PracticeResultProps = {
	levelId: number;
	correctCount: number;
	questionCount: number;
	passCount: number;
	finalAccuracy: number;
	hasPassed: boolean;
	t: {
		level: string;
		complete: string;
		levelPassed: string;
		tryAgain: string;
		resultSummary: string;
		passConditionText: string;
		accuracy: string;
		status: string;
		unlockedNext: string;
		needsReview: string;
		practiceAgain: string;
	};
	//recevoir une fonction onRestart qui retourne rien et pas besoin d'avoir param
	onRestart: () => void;
};

export default function PracticeResult({
	levelId,
	correctCount,
	questionCount,
	passCount,
	finalAccuracy,
	hasPassed,
	t,
	onRestart,
}: PracticeResultProps) {
	return (
		<section className={styles.practiceShell}>
			<div className={styles.resultPanel}>
				<p className={styles.kicker}>
					{t.level} {levelId} {t.complete}
				</p>
				{/*------------------ une phrase pour resultat ------------------*/}
				<h1 className={styles.resultTitle}>
					{hasPassed ? t.levelPassed : t.tryAgain}
				</h1>

				{/*------------------ des donnees pour resultat ------------------*/}
				<p className={styles.resultText}>
					{t.resultSummary
						.replace("{correctCount}", String(correctCount))
						.replace("{questionCount}", String(questionCount))}
					{" "}
					{t.passConditionText
						.replace("{passCount}", String(passCount))
						.replace("{questionCount}", String(questionCount))}
				</p>

				<div className={styles.resultStats}>
					<div>
						<span>{t.accuracy}</span>
						<strong>{finalAccuracy}%</strong>
					</div>

					<div>
						<span>{t.status}</span>
						<strong>{hasPassed ? t.unlockedNext : t.needsReview}</strong>
					</div>
				</div>

				<button
					type="button"
					className={styles.primaryAction}
					onClick={onRestart}
				>
					{t.practiceAgain}
				</button>
			</div>
		</section>
	);
}
