import { Card } from "@/components/ui";
import type { RadioUser } from "@/types/competition";
import styles from "@/../app/competition/radio/[radioId]/radio-lobby.module.css";

type LobbyUserListProps = {
  users: RadioUser[];
};

// //! yongyue i18n:
// Move status labels "In lobby", "Ready", "Playing" into the i18n dictionary.
const statusLabelByStatus: Record<RadioUserStatus, string> = {
  idle: "In lobby",
  ready: "Ready",
  playing: "Playing",
};

const statusClassByStatus: Record<RadioUserStatus, string> = {
  idle: styles.statusIdle,
  ready: styles.statusReady,
  playing: styles.statusPlaying,
};

export default function LobbyUserList({ users }: LobbyUserListProps) {
  const isLobbyFull = users.length >= RADIO_LOBBY_MAX_USERS;

  return (
    <Card className={styles.panel} aria-labelledby="lobby-users">
      <div className={styles.panelHeader}>
        <div>
          <h2 id="lobby-users" className={styles.panelTitle}>
            Users in this radio
          </h2>
          <p className={styles.panelText}>
            {users.length}/{RADIO_LOBBY_MAX_USERS} seats taken.{" "}
            {isLobbyFull
              ? "This lobby is full."
              : "Gray means idle, green means ready, yellow means already playing."}
          </p>
        </div>
      </div>

      <div className={styles.userGrid}>
        {users.map((user) => (
          <article key={user.id} className={styles.userCard}>
            <span
              className={`${styles.statusDot} ${
                statusClassByStatus[user.status]
              }`}
              aria-label={statusLabelByStatus[user.status]}
              title={statusLabelByStatus[user.status]}
            />

            {user.avatarUrl ? (
              <img
                className={styles.avatarImage}
                src={user.avatarUrl}
                alt={`${user.displayName} avatar`}
              />
            ) : (
              <span className={styles.avatarFallback} aria-hidden="true">
                {user.avatarInitial}
              </span>
            )}

            <div className={styles.userInfo}>
              <p className={styles.username}>
                {user.displayName}
                {user.isCurrentUser ? " (you)" : ""}
              </p>
              <p className={styles.statusLabel}>
                {statusLabelByStatus[user.status]}
              </p>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}
