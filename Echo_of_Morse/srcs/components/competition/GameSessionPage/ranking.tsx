import styles from "./css/ranking.module.css";

type Player = {
	id: string;
	username: string;
	score: number;
	correct: number;
	total: number;
};

type RankingProps = {
	players: Player[];
	status?: "live" | "final";
};

function getAccuracy(player: Player) {
	if (player.total === 0) {
		return "0%";
	}

	return `${Math.round((player.correct / player.total) * 100)}%`;
}

export default function Ranking({ players, status = "live" }: RankingProps) {
	const highestScore = players[0]?.score ?? 0;

	return (
		<aside
			className={`${styles.ranking} ${ status === "final" ? styles.finalranking : styles.liveRanking}`}
		>
			<h2 className={styles.title}>Ranking</h2>

			<div className={styles.rankingTable}>
				{/*----------- titre du tableau -----------*/}
					<div className={styles.rankingHeader}>
						<span>Rank</span>
						<span>Player</span>
						<span>Score</span>
						<span>%</span>
					</div>
				{/*----------- données du tableau -----------*/}
				<ol className={styles.rankList}>
					{players.map((player, index) => {
						const rank = index + 1;
						//avec couleur et 👑, meme si 0
						const isWinner = player.score === highestScore;
						//supp couleur et 👑, lorsque = 0
						// const isWinner = highestScore > 0 && player.score === highestScore;

						return (
							<li
								key={player.id}
								className={`${styles.rankItem} ${isWinner ? styles.rankWinner : ""}`}
							>
								<span className={styles.rank}>
									{isWinner ? "👑" : rank}
								</span>

								<strong>{player.username}</strong>

								<span className={styles.score}>{player.score}</span>
								<span className={styles.accuracy}>{getAccuracy(player)}</span>
							</li>
						);
					})}
				</ol>
			</div>
		</aside>
	);
}
