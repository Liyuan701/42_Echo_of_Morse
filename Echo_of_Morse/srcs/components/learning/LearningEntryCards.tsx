import Link from "next/link";
import type { UserLearningProgress } from "@/types/learning";
import styles from "@/components/learning/css/Learning.module.css";

type LearningEntryCardsProps = {
  progress: UserLearningProgress;
};

export default function LearningEntryCards({
  progress,
}: LearningEntryCardsProps) {
  return (
    <section className={styles.entryGrid} aria-label="Learning options">
      <article className={styles.entryCard}>
        <div>
          <p className={styles.cardLabel}>Levels</p>

          <h2 className={styles.entryTitle}>Choose a level</h2>

          <p className={styles.cardText}>
            View all Morse levels and continue with an unlocked level.
          </p>
        </div>

        <Link className={styles.primaryButton} href="/learning/levels">
          Open levels
        </Link>
      </article>

      <article className={styles.entryCard}>
        <div>
          <p className={styles.cardLabel}>Play</p>

          <h2 className={styles.entryTitle}>Review completed levels</h2>

          <p className={styles.cardText}>
            Practice a random level you have already completed.
          </p>
        </div>

        {/*
          TODO_PLAY:
          //! Liyuan: This button uses a stable route.
          The random selection should happen inside /learning/play,
          not inside this home page component.
          Final behavior:
          - /learning/play reads the current user's completedLevels.
          - It randomly selects one completed level.
          - It redirects to /learning/levels/[selectedLevel]/practice.
          - If no level has been completed yet, it should show an empty state
            or redirect to the current level.
        */}
        <Link className={styles.primaryButton} href="/learning/play">
          Play
        </Link>
      </article>
    </section>
  );
}