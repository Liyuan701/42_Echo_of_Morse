"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

import PageShell from "@/components/layout/page-shell";
import LevelGrid from "@/components/learning/LevelGrid";
import { morseLevels } from "@/components/learning/data/morseLevels";

import styles from "@/components/learning/css/Learning.module.css";

export default function LevelsPageClient({ progress }) {
  const { dictionary } = useI18n();
  const t = dictionary.learning;

  return (
    <main id="main-content">
      <PageShell>
        <section className={styles.learningPage} aria-labelledby="levels-title">
          <div className={styles.learningContainer}>

            {/* Breadcrumb */}
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link className={styles.link} href="/learning">
                {t.breadcrumbLearning}
              </Link>
              <span aria-hidden="true"> / </span>
              <span className={styles.breadcrumbCurrent}>
                {t.breadcrumbLevels}
              </span>
            </nav>

            {/* Title */}
            <section className={styles.hero}>
              <h1 id="levels-title" className={styles.title}>
                {t.breadcrumbLevels}
              </h1>

              <p className={styles.description}>
                {t.levelsPageDescription}
              </p>
            </section>

            {/* Grid */}
            <LevelGrid levels={morseLevels} progress={progress} />

          </div>
        </section>
      </PageShell>
    </main>
  );
}