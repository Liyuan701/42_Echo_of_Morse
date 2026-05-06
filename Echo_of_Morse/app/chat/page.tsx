import PageShell from "@/components/layout/page-shell";
import { Card } from "@/components/ui";
import styles from "./chat.module.css";

export default function ChatPage() {
  return (
    <main id="main-content">
      <PageShell>
        <Card>
          <h1 className={styles.title}>Chat</h1>

          <p className={styles.description}>
            This page will host real-time chat and communication features.
          </p>
        </Card>
      </PageShell>
    </main>
  );
}