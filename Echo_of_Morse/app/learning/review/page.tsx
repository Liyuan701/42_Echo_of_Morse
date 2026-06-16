//!!! yren
// Page de révision : vérifie la session de l'utilisateur, puis affiche le module de révision.
// Si l'utilisateur n'est pas connecté, il est redirigé vers la page de connexion ???
// 按照之前的那个模式改就好。

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import PageShell from "@/components/layout/page-shell";
import ReviewSession from "@/components/learning/Review/reviewSession";
import { authOptions } from "@/lib/auth";
import styles from "@/components/learning/css/Learning.module.css";

export default async function ReviewPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <main id="main-content">
      <PageShell>
        <section className={styles.learningPage}>
          <div className={styles.learningContainer}>
            <ReviewSession />
          </div>
        </section>
      </PageShell>
    </main>
  );
}
