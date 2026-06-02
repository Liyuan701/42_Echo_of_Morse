import { Card } from "@/components/ui";
import type { RadioUser } from "@/types/competition";
import styles from "@/../app/competition/radio/[radioId]/radio-lobby.module.css";

type ReadyPlayersListProps = {
  readyPlayers: RadioUser[];
};

export default function ReadyPlayersList({
  readyPlayers,
}: ReadyPlayersListProps) {
  return (
    <Card className={styles.panel} aria-labelledby="ready-players">
      <div className={styles.panelHeader}>
        <div>
          <h2 id="ready-players" className={styles.panelTitle}>
            Ready Players
          </h2>
          <p className={styles.panelText}>
            These players will enter the next game session together.
          </p>
        </div>
      </div>

      {readyPlayers.length === 0 ? (
        <p className={styles.emptyState}>
          No player is ready yet. Click Ready to join the queue.
        </p>
      ) : (
        <ul className={styles.readyList}>
          {readyPlayers.map((player, index) => (
            <li key={player.id} className={styles.readyItem}>
              <span>
                {index + 1}. {player.displayName}
                {player.isCurrentUser ? " (you)" : ""}
              </span>
              <strong>Ready</strong>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

{/* //! yongyue i18n: move ready players labels and empty state into the i18n dictionary. */}