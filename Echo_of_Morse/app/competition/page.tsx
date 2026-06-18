import PageShell from "@/components/layout/page-shell";
import CompetitionIntro from "@/components/competition/CompetitionHomePage/CompetitionIntro";
import OnlineOverview from "@/components/competition/CompetitionHomePage/OnlineOverview";
import RadioWaveCard from "@/components/competition/CompetitionHomePage/RadioWaveCard";
import ReceivedInvitations from "@/components/competition/CompetitionHomePage/ReceivedInvitations";
import {
  getOnlineOverview,
  getRadioConfigs,
} from "@/lib/services/competition";
import styles from "./competition.module.css";

// Render this page at request time because it reads live Prisma data.
// Static prerendering during Docker build cannot access the database.
export const dynamic = "force-dynamic";

export default async function CompetitionPage() {
  const [radios, overview] = await Promise.all([
    getRadioConfigs(),
    getOnlineOverview(),
  ]);

  return (
    <main id="main-content">
      <PageShell>
        <header className={styles.hero}>
          <h1 className={styles.title}>Competition</h1>
        </header>

        <section className={styles.topGrid}>
          <OnlineOverview overview={overview} />
          <CompetitionIntro />
        </section>

        <ReceivedInvitations />

        <section className={styles.radioSection} aria-labelledby="radio-waves">
          <div className={styles.sectionHeader}>
            <div>
              <h2 id="radio-waves" className={styles.sectionTitle}>
                Radio Waves
              </h2>
              <p className={styles.sectionDescription}>
                Choose a transmission speed and join its live lobby.
              </p>
            </div>
          </div>

          <div className={styles.radioGrid}>
            {radios.map((radio) => (
              <RadioWaveCard
                key={radio.id}
                radio={radio}
                usersCount={overview.radioUsers[radio.id] ?? 0}
              />
            ))}
          </div>
        </section>
      </PageShell>
    </main>
  );
}
