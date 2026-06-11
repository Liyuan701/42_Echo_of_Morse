import Link from "next/link";
import Ranking from "./ranking";
import styles from "./css/finalRanking.module.css";
import type { Player } from "./gameSessionType";

type FinalRankingProps = {
	radioId: string;
	players: Player[];
	winner: Player;
};

export default function FinalRanking({
	radioId,
	players,
	winner,
}: FinalRankingProps) {
	return (
			<section className={styles.finalOverlay}>
				<div className={styles.winnerBlock}>
					<span>Winner</span>
					<strong>{winner.username}</strong>
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
