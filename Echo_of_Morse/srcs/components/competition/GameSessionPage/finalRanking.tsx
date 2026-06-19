import Link from "next/link";
import Ranking from "./ranking";
import styles from "./css/finalRanking.module.css";
import type { Player } from "./gameSessionType";

type FinalRankingProps = {
	radioId: string;
	players: Player[];
	winners: Player[];
};

function getWinnerNames(winners: Player[]) {
	return winners.map((winner) => winner.username).join(" / ");
}

export default function FinalRanking({
	radioId,
	players,
	winners,
}: FinalRankingProps) {
	const isTie = winners.length > 1;

	return (
		<section className={styles.finalOverlay}>
			<div className={styles.winnerBlock}>
				<span>{isTie ? "Tie" : "Winner"}</span>
				<strong>{getWinnerNames(winners)}</strong>
			</div>

			<Ranking players={players} status="final" />

			<div className={styles.actions}>
				<Link href={`/competition/radio/${radioId}`}>
					Back to Radio Lobby
				</Link>
			</div>
		</section>
	);
}
