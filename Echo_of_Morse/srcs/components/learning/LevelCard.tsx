import Link from "next/link";
import type { MorseLevel, UserLearningProgress } from "@/types/learning";
import { getLevelStatus } from "@/lib/learning/levelAccess";
import styles from "@/components/learning/css/Learning.module.css";

type LevelCardProps = {
  level: MorseLevel;
  progress: UserLearningProgress;
};

export default function LevelCard({ level, progress }: LevelCardProps) {
  // TODO_BACKEND: 
  //! Liyuan: Level status depends on real user progress from the backend.
  // Required progress fields:
  // - currentLevel
  // - unlockedLevels
  // - completedLevels
  const status = getLevelStatus(level.level, progress);

  const isLocked = status === "locked";

  return (
    <article
      className={`${styles.levelCard} ${isLocked ? styles.levelCardLocked : ""}`}
      aria-labelledby={`level-${level.level}-title`}
    >
      <div>
        <div className={styles.levelTop}>
          <h2 id={`level-${level.level}-title`} className={styles.levelTitle}>
            {level.title}
          </h2>

          <span
            className={`${styles.statusBadge} ${
              isLocked ? styles.statusBadgeLocked : ""
            }`}
          >
            {status}
          </span>
        </div>

        <div className={styles.characterList} aria-label="New characters">
          {level.newCharacters.map((character) => (
            <span className={styles.characterPill} key={character}>
              {character}
            </span>
          ))}
        </div>

        <dl className={styles.levelMeta}>
          <div className={styles.metaBox}>
            <dt className={styles.metaLabel}>Questions</dt>
            <dd className={styles.metaValue}>{level.questionCount}</dd>
          </div>

          <div className={styles.metaBox}>
            <dt className={styles.metaLabel}>Pass</dt>
            <dd className={styles.metaValue}>{level.passCondition}</dd>
          </div>

          <div className={styles.metaBox}>
            <dt className={styles.metaLabel}>Review</dt>
            <dd className={styles.metaValue}>{level.reviewRatio}</dd>
          </div>
        </dl>
      </div>

      {isLocked ? (
        <button className={styles.disabledButton} type="button" disabled>
          Locked
        </button>
      ) : (
        <>
          {/*
            TODO_BACKEND / TODO_PRACTICE:
            //! Liyuan: The practice page should validate that this level is unlocked
            before starting the session.
            Route contract:
            /learning/levels/[levelId]/practice
          */}
          <Link
            className={styles.primaryButton}
            href={`/learning/levels/${level.level}/practice`}
          >
            Start practice
          </Link>
        </>
      )}
    </article>
  );
}