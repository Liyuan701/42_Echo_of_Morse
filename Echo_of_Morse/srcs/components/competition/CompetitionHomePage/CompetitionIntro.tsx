import { Card } from "@/components/ui";
import styles from "@/../app/competition/competition.module.css";
const RADIO_LOBBY_MAX_USERS = 7;

export default function CompetitionIntro() {
  return (
    <Card className={styles.rulesCard} aria-labelledby="competition-rules">
      <h2 id="competition-rules" className={styles.cardTitle}>
        Rules
      </h2>

      {/* ! i18n: move competition rules into dictionary later. */}
      <ol className={styles.rulesList}>
        <li>Choose a radio lobby according to your Morse level.</li>
        <li>Each radio lobby can host up to {RADIO_LOBBY_MAX_USERS} players.</li>
        <li>Click Ready to join the matchmaking queue of this radio.</li>
        <li>When at least two players are ready, the session can start.</li>
        <li>All ready players receive the same Morse sequences in real time.</li>
        <li>The best score at the end of the timer wins the duel.</li>
      </ol>
    </Card>
  );
}
