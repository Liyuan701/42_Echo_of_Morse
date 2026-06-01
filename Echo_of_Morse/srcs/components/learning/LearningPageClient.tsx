"use client";

import { useI18n } from "@/lib/i18n";

import PageShell from "@/components/layout/page-shell";
import LearningProgressCard from "@/components/learning/LearningProgressCard";
import LearningEntryCards from "@/components/learning/LearningEntryCards";
import styles from "@/components/learning/css/Learning.module.css";

/**
 * Client Component
 * Responsible for:
 * - UI rendering
 * - Using i18n hook
 * - Displaying learning progress and entry cards
 */
export default function LearningPageClient({
  progress,
  totalLevels,
}) {
  // Load translation dictionary from i18n context
  const { dictionary } = useI18n();
  const t = dictionary.learning;

  return (
    <main id="main-content">
      <PageShell>
        <section
          className={styles.learningPage}
          aria-labelledby="learning-title"
        >
          <div className={styles.learningContainer}>

            {/* Hero section (title + description) */}
            <section className={styles.hero}>
              <h1 id="learning-title" className={styles.title}>
                {t.pageTitle}
              </h1>

              <p className={styles.description}>
                {t.pageDescription}
              </p>
            </section>

            {/* Learning progress overview */}
            <LearningProgressCard
              progress={progress}
              totalLevels={totalLevels}
            />

            {/* Learning entry / navigation cards */}
            <LearningEntryCards progress={progress} />

          </div>
        </section>
      </PageShell>
    </main>
  );
}