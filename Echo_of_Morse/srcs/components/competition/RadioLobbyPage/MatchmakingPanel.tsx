import { Button, Card } from "@/components/ui";
import styles from "@/../app/competition/radio/[radioId]/radio-lobby.module.css";

type MatchmakingPanelProps = {
  isCurrentUserReady: boolean;
  readyPlayersCount: number;
  canStartGame: boolean;
  message: string;
  isUpdating: boolean;
  onToggleReady: () => void;
  onStartGame: () => void;
};

export default function MatchmakingPanel({
  isCurrentUserReady,
  readyPlayersCount,
  canStartGame,
  message,
  isUpdating,
  onToggleReady,
  onStartGame,
}: MatchmakingPanelProps) {
  return (
    <Card className={styles.panel} aria-labelledby="matchmaking-panel">
      <div className={styles.panelHeader}>
        <div>
          <h2 id="matchmaking-panel" className={styles.panelTitle}>
            Matchmaking Queue
          </h2>

          <p className={styles.panelText}>
            Join this radio queue. When at least two players are ready, one
            ready player can start the decoding session.
          </p>
        </div>
      </div>

      <div className={styles.matchmakingActions}>
        <Button
          type="button"
          variant="secondary"
          disabled={isUpdating}
          onClick={onToggleReady}
        >
          {isCurrentUserReady ? "Cancel Ready" : "Ready"}
        </Button>

        <Button
          type="button"
          variant={canStartGame ? "primary" : "secondary"}
          className={canStartGame ? "" : styles.startButtonBlocked}
          aria-disabled={!canStartGame}
          disabled={isUpdating}
          onClick={onStartGame}
        >
          Commencer le déchiffrement
        </Button>
      </div>

      <p className={styles.queueInfo}>
        Current ready players: <strong>{readyPlayersCount}</strong>. At least{" "}
        <strong>2</strong> ready players are required to start.
      </p>

      {message ? <p className={styles.message}>{message}</p> : null}
    </Card>
  );
}

{/* //! yongyue i18n: move matchmaking texts and button labels into the i18n dictionary. */}

// Liyuan: real data for button - connected
// canStartGame currently comes from local mock readyPlayers.
// Later it should come from the server-confirmed ready queue.
