import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getUserLearningProgress } from "@/lib/learning/progressService";
import PageShell from "@/components/layout/page-shell";
import { morseLevels } from "@/components/learning/data/morseLevels";
import LevelGrid from "@/components/learning/LevelGrid";
import styles from "@/components/learning/css/Learning.module.css";
import { useI18n } from "@/lib/i18n";

export default async function LevelsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { dictionary } = useI18n();
  const t = dictionary.learning;

  const progress = await getUserLearningProgress(session.user.id);

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

            <LevelGrid levels={morseLevels} progress={progress} />
          </div>
        </section>
      </PageShell>
    </main>
  );
}