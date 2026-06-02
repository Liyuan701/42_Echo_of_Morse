import { notFound } from "next/navigation";
import PageShell from "@/components/layout/page-shell";
import PracticeSession from "@/components/learning/Practice/practiceSession";
import styles from "@/components/learning/css/Learning.module.css";

type PracticePageProps = {
  params: {
    levelId: string;
  };
};

/**
 * Practice Page (Server Component)
 * This page is responsible for:
 * - Reading the dynamic route parameter (levelId)
 * - Validating the levelId
 * - Returning a 404 page if the level is invalid
 * - Rendering the PracticeSession component
 */
export default function PracticePage({ params }: PracticePageProps) {
  // Convert levelId from string to number
  const levelId = Number(params.levelId);

  /**
   * Validate levelId:
   * - Must be an integer
   * - Must be within allowed range (1–12)
   * If invalid, show Next.js 404 page
   */
  if (!Number.isInteger(levelId) || levelId < 1 || levelId > 12) {
    notFound();
  }

  return (
    <main id="main-content">
      <PageShell>
        <section className={styles.learningPage}>
          <div className={styles.learningContainer}>

            {/*
              PracticeSession handles the interactive learning logic:
              - Morse practice
              - user input handling
              - session state (client-side)
            */}
            <PracticeSession levelId={levelId} />

          </div>
        </section>
      </PageShell>
    </main>
  );
}
