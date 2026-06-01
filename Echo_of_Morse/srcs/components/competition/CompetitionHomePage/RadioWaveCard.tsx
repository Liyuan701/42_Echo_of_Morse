import Link from "next/link";
import { Card } from "@/components/ui";
import {
  RADIO_LOBBY_MAX_USERS,
  type RadioConfig,
} from "../mockData/competitionTypes";
import styles from "@/../app/competition/competition.module.css";

type RadioWaveCardProps = {
  radio: RadioConfig;
  usersCount: number;
};

export default function RadioWaveCard({
  radio,
  usersCount,
}: RadioWaveCardProps) {
  const isLobbyFull = usersCount >= RADIO_LOBBY_MAX_USERS;
  const usersCapacityLabel = `${usersCount}/${RADIO_LOBBY_MAX_USERS} users inside`;

  const card = (
    <Card
      as="article"
      className={`${styles.radioCard} ${isLobbyFull ? styles.radioCardFull : ""}`}
    >
      <div className={styles.radioTopLine}>
        <span className={styles.radioName}>{radio.name}</span>
        <span className={styles.radioWpm}>{radio.wpm} WPM</span>
      </div>

      <p className={styles.radioDescription}>{radio.description}</p>

      <div className={styles.radioFooter}>
        <span>{usersCapacityLabel}</span>
        <span className={isLobbyFull ? styles.radioFullBadge : ""}>
          {isLobbyFull ? "Full" : "Enter"}
        </span>
      </div>
    </Card>
  );

  if (isLobbyFull) {
    return (
      <div
        className={styles.radioUnavailable}
        aria-label={`${radio.name}, ${radio.wpm} WPM, lobby full`}
      >
        {card}
      </div>
    );
  }

  return (
    <Link
      href={`/competition/radio/${radio.id}`}
      className={styles.radioLink}
      aria-label={`Enter ${radio.name}, ${radio.wpm} WPM, ${usersCapacityLabel}`}
    >
      {card}
    </Link>
  );
}
