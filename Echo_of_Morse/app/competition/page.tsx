import PageShell from "@/components/layout/page-shell";
import { Card } from "@/components/ui";
import styles from "./competition.module.css";

export default function CompetitionPage() {
  return (
    <main id="main-content">
      <PageShell>
        <Card>
          <h1 className={styles.title}>Competition</h1>

          <p className={styles.description}>
            This page will contain competition modes and performance challenges.
          </p>
        </Card>
      </PageShell>
    </main>
  );
}