import { Card } from "@/components/ui";
import styles from "./home.module.css";

export default function HistorySection() {
  return (
    <Card className={styles.sectionBlock}>
      <h2 className={styles.sectionTitle}>History of Morse</h2>

      <p className={styles.sectionTextWithMargin}>
        Morse code was developed in the nineteenth century as a way to send
        messages over long distances through the electric telegraph. It
        transformed written language into short and long signals, now known as
        dots and dashes.
      </p>

      <p className={styles.sectionTextWithMargin}>
        The system is named after Samuel Morse, who worked with collaborators
        such as Alfred Vail to create a practical communication method for the
        telegraph. Each letter and number was represented by a different signal
        pattern.
      </p>

      <p className={styles.sectionTextWithMargin}>
        Morse code played an important role in railway networks, maritime
        communication, military operations, journalism, and emergency rescue. It
        allowed information to move faster than physical letters, messengers, or
        printed newspapers.
      </p>

      <p className={styles.sectionText}>
        Although it is no longer the main system of global communication, Morse
        code remains a powerful historical medium and a useful learning tool. It
        teaches how language can become rhythm, signal, and interaction.
      </p>
    </Card>
  );
}

// ! i18n: move home page titles, descriptive paragraphs, online-user labels, empty states, buttons, and alert messages into the i18n dictionary.
// ! i18n: keep dynamic values such as onlineCount and displayName as interpolation variables.