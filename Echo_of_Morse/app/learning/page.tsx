import PageShell from "@/components/layout/page-shell";
import LearningProgressCard from "@/components/learning/LearningProgressCard";
import LearningEntryCards from "@/components/learning/LearningEntryCards";
import { morseLevels } from "@/components/learning/data/morseLevels";
import { mockLearningProgress } from "@/components/learning/data/mockLearningProgress";
import styles from "@/components/learning/css/Learning.module.css";

export default function LearningPage() {
  // TODO_BACKEND:
  //! Liyuan: Replace mockLearningProgress with the current user's real learning progress.
  // Suggested API: GET /api/learning/progress
  // Required fields:
  // - currentLevel
  // - unlockedLevels
  // - completedLevels
  // - globalAccuracy
  // - averageReactionTime
  // - totalSessions
  // - todayLearningMinutes
  // - weakCharacters
  const progress = mockLearningProgress;

  // TODO_BACKEND:
  //! Liyuan: morseLevels can stay as frontend static data for now.
  // If levels are modeled in the database later, replace this with:
  // GET /api/learning/levels
  const totalLevels = morseLevels.length;

  return (
    <main id="main-content">
      <PageShell>
        <section className={styles.learningPage} aria-labelledby="learning-title">
          <div className={styles.learningContainer}>
            <section className={styles.hero}>

              <h1 id="learning-title" className={styles.title}>
                Learn Morse Code
              </h1>

              <p className={styles.description}>
                Continue your Morse training through mixed practice levels.
              </p>
            </section>

            <LearningProgressCard progress={progress} totalLevels={totalLevels} />

            <LearningEntryCards progress={progress} />
          </div>
        </section>
      </PageShell>
    </main>
  );
}