import Link from "next/link";
import {
  RADIO_LOBBY_MAX_USERS,
  type RadioConfig,
} from "../mockData/competitionTypes";
import styles from "@/../app/competition/radio/[radioId]/radio-lobby.module.css";

type RadioHeaderProps = {
  radio: RadioConfig;
  usersCount: number;
};

export default function RadioHeader({ radio, usersCount }: RadioHeaderProps) {
  return (
    <header className={styles.header}>
      <div>
        <Link href="/competition" className={styles.backLink}>
          ← Back to Competition
        </Link>

        <p className={styles.kicker}>Radio Lobby</p>
        <h1 className={styles.title}>{radio.name}</h1>
        <p className={styles.description}>
          {radio.description} Players in this lobby can join the ready queue and
          start a real-time Morse decoding session together.
        </p>
      </div>

      <aside className={styles.metaBox} aria-label="Radio information">
        <div className={styles.metaGroup}>
          <p className={styles.metaLabel}>Speed</p>
          <p className={styles.metaValue}>{radio.wpm} WPM</p>
        </div>

        <div className={styles.metaGroup}>
          <p className={styles.metaLabel}>Users inside</p>
          <p className={styles.metaValue}>
            {usersCount}/{RADIO_LOBBY_MAX_USERS}
          </p>
        </div>
      </aside>
    </header>
  );
}
