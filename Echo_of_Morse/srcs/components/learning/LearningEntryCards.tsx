"use client";
import { useI18n } from "@/lib/i18n";

import Link from "next/link";
import type { UserLearningProgress } from "@/types/learning";
import styles from "@/components/learning/css/Learning.module.css";

type LearningEntryCardsProps = {
  progress: UserLearningProgress;
};

export default function LearningEntryCards({
  progress,
}: LearningEntryCardsProps) {
	const { dictionary } = useI18n();
	const t = dictionary.learning;

  return (
    <section className={styles.entryGrid} aria-label={t.learningOptions}>
      <article className={styles.entryCard}>
        <div>
          <p className={styles.cardLabel}>{t.levels}</p>

          <h2 className={styles.entryTitle}>{t.chooseLevel}</h2>

          <p className={styles.cardText}>
           	{t.levelsDescription}
          </p>
        </div>

        <Link className={styles.primaryButton} href="/learning/levels">
          {t.openLevels}
        </Link>
      </article>

      <article className={styles.entryCard}>
        <div>
          <p className={styles.cardLabel}>{t.play}</p>

          <h2 className={styles.entryTitle}>{t.reviewCompletedLevels}</h2>

          <p className={styles.cardText}>
            {t.playDescription}
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
          {t.play}
        </Link>
      </article>
    </section>
  );
}