import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getUserLearningProgress } from "@/lib/learning/progressService";
import { useI18n } from "@/lib/i18n";
import PageShell from "@/components/layout/page-shell";
import LearningProgressCard from "@/components/learning/LearningProgressCard";
import LearningEntryCards from "@/components/learning/LearningEntryCards";
import { morseLevels } from "@/components/learning/data/morseLevels";
import styles from "@/components/learning/css/Learning.module.css";

export default async function LearningPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { dictionary } = useI18n();
  const t = dictionary.learning;

  const progress = await getUserLearningProgress(session.user.id);
  const totalLevels = morseLevels.length;

  return (
    <main id="main-content">
      <PageShell>
        <section className={styles.learningPage} aria-labelledby="learning-title">
          <div className={styles.learningContainer}>
            <section className={styles.hero}>
              <h1 id="learning-title" className={styles.title}>
                {t.pageTitle}
              </h1>
              <p className={styles.description}>
                {t.pageDescription}
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