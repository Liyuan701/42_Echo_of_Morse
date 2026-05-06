import { Card } from "@/components/ui";
import styles from "./home.module.css";

export default function HistorySection() {
  return (
    <Card className={styles.sectionBlock}>
      <h2 className={styles.sectionTitle}>History of Morse</h2>

      <p className={styles.sectionTextWithMargin}>
        Morse code was developed in the nineteenth century as a communication
        system closely linked to telegraphy and long-distance transmission.
      </p>

      <p className={styles.sectionText}>
        It later played an important role in military, maritime, and emergency
        communication, and today it remains both a historical medium and a
        valuable learning tool.
      </p>
    </Card>
  );
}