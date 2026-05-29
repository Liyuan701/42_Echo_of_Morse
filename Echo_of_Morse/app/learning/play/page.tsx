import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserLearningProgress } from "@/lib/learning/progressService";
import PageShell from "@/components/layout/page-shell";
import styles from "@/components/learning/css/Learning.module.css";

export const dynamic = "force-dynamic";

function getRandomCompletedLevel(completedLevels: number[]): number | null {
  if (completedLevels.length === 0) return null;
  return completedLevels[Math.floor(Math.random() * completedLevels.length)];
}

export default async function LearningPlayPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const progress = await getUserLearningProgress(session.user.id);
  const selectedLevel = getRandomCompletedLevel(progress.completedLevels);

  if (selectedLevel) {
    redirect(`/learning/levels/${selectedLevel}/practice`);
  }

  return (
    <main id="main-content">
      <PageShell>
        <section className={styles.learningPage} aria-labelledby="play-title">
          <div className={styles.learningContainer}>
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link className={styles.link} href="/learning">Learning</Link>
              <span aria-hidden="true"> / </span>
              <span className={styles.breadcrumbCurrent}>Play</span>
            </nav>
            <section className={styles.hero}>
              <p className={styles.eyebrow}>Play</p>
              <h1 id="play-title" className={styles.title}>
                No completed level yet
              </h1>
              <p className={styles.description}>
                Play mode reviews levels you have already completed. Complete
                your current level first, then come back to practice one
                randomly.
              </p>
            </section>
            <section className={styles.entryGrid} aria-label="Play fallback options">
              <article className={styles.entryCard}>
                <div>
                  <p className={styles.cardLabel}>Current level</p>
                  <h2 className={styles.entryTitle}>
                    Start Level {progress.currentLevel}
                  </h2>
                  <p className={styles.cardText}>
                    Continue your current mixed practice session. Play mode will
                    be available after you complete at least one level.
                  </p>
                </div>
                <Link
                  className={styles.primaryButton}
                  href={`/learning/levels/${progress.currentLevel}/practice`}
                >
                  Start Level {progress.currentLevel}
                </Link>
              </article>
              <article className={styles.entryCard}>
                <div>
                  <p className={styles.cardLabel}>Levels</p>
                  <h2 className={styles.entryTitle}>Choose a level</h2>
                  <p className={styles.cardText}>
                    Go back to the level directory and choose an unlocked level
                    to continue your training.
                  </p>
                </div>
                <Link className={styles.primaryButton} href="/learning/levels">
                  Open levels
                </Link>
              </article>
            </section>
          </div>
        </section>
      </PageShell>
    </main>
  );
}