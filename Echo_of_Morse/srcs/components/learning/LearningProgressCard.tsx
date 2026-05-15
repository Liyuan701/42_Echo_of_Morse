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
  return (
    <section className={styles.progressCard} aria-labelledby="progress-title">
      <div>
        <p className={styles.cardLabel}>Your progress</p>

        <h2 id="progress-title" className={styles.progressTitle}>
          Level {progress.currentLevel}
        </h2>

        <p className={styles.cardText}>
          You have completed {progress.completedLevels.length} of {totalLevels} levels.
        </p>
      </div>

      <dl className={styles.progressStats}>
        <div>
          <dt>Today</dt>
          <dd>{formatLearningTime(progress.todayLearningMinutes)}</dd>
        </div>

        <div>
          <dt>Accuracy</dt>
          <dd>{progress.globalAccuracy}%</dd>
        </div>

        <div>
          <dt>Reaction</dt>
          <dd>{progress.averageReactionTime}s</dd>
        </div>

        <div>
          <dt>Sessions</dt>
          <dd>{progress.totalSessions}</dd>
        </div>
      </dl>
    </section>
  );
}