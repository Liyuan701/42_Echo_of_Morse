"use client";
import { useI18n } from "@/lib/i18n";

import type { UserLearningProgress } from "@/types/learning";
import styles from "@/components/learning/css/Learning.module.css";

type LearningProgressCardProps = {
  progress: UserLearningProgress;
  totalLevels: number;
};

function formatLearningTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}min`;
}

export default function LearningProgressCard({
  progress,
  totalLevels,
}: LearningProgressCardProps) {

	const { dictionary } = useI18n();
	const t = dictionary.learning;

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

      <dl className={styles.progressStats}>
        <div>
          <dt>{t.today}</dt>
          <dd>{formatLearningTime(progress.todayLearningMinutes)}</dd>
        </div>

        <div>
          <dt>{t.accuracy}</dt>
          <dd>{progress.globalAccuracy}%</dd>
        </div>

        <div>
          <dt>{t.reaction}</dt>
          <dd>{progress.averageReactionTime}s</dd>
        </div>

        <div>
          <dt>{t.sessions}</dt>
          <dd>{progress.totalSessions}</dd>
        </div>
      </dl>
    </section>
  );
}