import { Card } from "@/components/ui";
import styles from "./home.module.css";

export default function IntroSection() {
  return (
    <Card className={styles.sectionBlock}>
      <h2 className={styles.sectionTitle}>A Project of Morse?</h2>

      <p className={styles.sectionText}>
        Morse code becomes here a way to learn signals, rhythm, communication,
        and interaction.
      </p>
    </Card>
  );
}

// ! i18n: move home page titles, descriptive paragraphs, online-user labels, empty states, buttons, and alert messages into the i18n dictionary.
// ! i18n: keep dynamic values such as onlineCount and displayName as interpolation variables.