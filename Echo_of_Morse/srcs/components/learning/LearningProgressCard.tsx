"use client";

import { useI18n } from "@/lib/i18n";
import type { UserLearningProgress } from "@/types/learning";
import styles from "@/components/learning/css/Learning.module.css";

type LearningProgressCardProps = {
  progress: UserLearningProgress;
  totalLevels: number;
};

export default function LearningProgressCard({
  progress,
  totalLevels,
}: LearningProgressCardProps) {
  const { dictionary } = useI18n();
  const t = dictionary.learning;

  const hasGlobalAccuracy = progress.globalAccuracy !== null;
  const hasPracticeSessions = progress.totalPracticeSessions !== null;
  const shouldShowStats = hasGlobalAccuracy || hasPracticeSessions;

  return (
    <section className={styles.progressCard} aria-labelledby="progress-title">
      <div>
        <p className={styles.cardLabel}>{t.yourProgress}</p>

        <h2 id="progress-title" className={styles.progressTitle}>
          {t.levelLabel.replace("{level}", String(progress.currentLevel))}
        </h2>

        <p className={styles.cardText}>
          {t.completedLevels
            .replace("{completed}", String(progress.completedLevels.length))
            .replace("{total}", String(totalLevels))}
        </p>
      </div>

      {shouldShowStats && (
        <dl className={styles.progressStats}>
          {hasGlobalAccuracy && (
            <div>
              <dt>{t.globalAccuracy}</dt>
              <dd>{progress.globalAccuracy}%</dd>
            </div>
          )}

          {hasPracticeSessions && (
            <div>
              <dt>{t.practiceSessions}</dt>
              <dd>{progress.totalPracticeSessions}</dd>
            </div>
          )}
        </dl>
      )}
    </section>
  );
}