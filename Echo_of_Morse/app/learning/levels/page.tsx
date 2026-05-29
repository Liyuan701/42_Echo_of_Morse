import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getUserLearningProgress } from "@/lib/learning/progressService";
import PageShell from "@/components/layout/page-shell";
import { morseLevels } from "@/components/learning/data/morseLevels";
import LevelGrid from "@/components/learning/LevelGrid";
import styles from "@/components/learning/css/Learning.module.css";

export default async function LevelsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const progress = await getUserLearningProgress(session.user.id);

  return (
    <main id="main-content">
      <PageShell>
        <section className={styles.learningPage} aria-labelledby="levels-title">
          <div className={styles.learningContainer}>
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link className={styles.link} href="/learning">
                Learning
              </Link>
              <span aria-hidden="true"> / </span>
              <span className={styles.breadcrumbCurrent}>Levels</span>
            </nav>

            <section className={styles.hero}>
              <h1 id="levels-title" className={styles.title}>
                Morse Levels
              </h1>
              <p className={styles.description}>
                The path covers letters, numbers, and punctuation. Each level
                uses mixed practice: sometimes you decode Morse signals,
                sometimes you encode characters with the keyboard.
              </p>
            </section>

            <LevelGrid levels={morseLevels} progress={progress} />
          </div>
        </section>
      </PageShell>
    </main>
  );
}