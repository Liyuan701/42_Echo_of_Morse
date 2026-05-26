"use client";
import { useI18n } from "@/lib/i18n";

import Link from "next/link";
import PageShell from "@/components/layout/page-shell";
import { morseLevels } from "@/components/learning/data/morseLevels";
import { mockLearningProgress } from "@/components/learning/data/mockLearningProgress";
import LevelGrid from "@/components/learning/LevelGrid";
import styles from "@/components/learning/css/Learning.module.css";

export default function LevelsPage() {

	const { dictionary } = useI18n();
	const t = dictionary.learning;

  // TODO_BACKEND:
  //! Liyuan: Replace mockLearningProgress with the current user's real progress.
  // This data is used to decide whether each level is completed, current,
  // unlocked, or locked.
  // Suggested API: GET /api/learning/progress
  const progress = mockLearningProgress;

  // TODO_BACKEND:
  //! Liyuan: Keep morseLevels as static frontend data for the first version.
  // If the backend stores level configuration later, replace this with:
  // GET /api/learning/levels
  const levels = morseLevels;

  return (
    <main id="main-content">
      <PageShell>
        <section className={styles.learningPage} aria-labelledby="levels-title">
          <div className={styles.learningContainer}>
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link className={styles.link} href="/learning">
                {t.breadcrumbLearning}
              </Link>
              <span aria-hidden="true"> / </span>
              <span className={styles.breadcrumbCurrent}>{t.breadcrumbLevels}</span>
            </nav>
            
            <section className={styles.hero}>

              <h1 id="levels-title" className={styles.title}>
                {t.breadcrumbLevels}
              </h1>

              <p className={styles.description}>
                {t.levelsPageDescription}
              </p>
            </section>

            <LevelGrid levels={levels} progress={progress} />
          </div>
        </section>
      </PageShell>
    </main>
  );
}