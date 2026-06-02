import CompetitionIntro from "@/components/competition/CompetitionHomePage/CompetitionIntro";
import OnlineOverview from "@/components/competition/CompetitionHomePage/OnlineOverview";
import RadioWaveCard from "@/components/competition/CompetitionHomePage/RadioWaveCard";
import PageShell from "@/components/layout/page-shell";
import styles from "./competition.module.css";

import {
  getOnlineOverview,
  getRadioConfigs,
} from "@/lib/services/competition";

export default async function CompetitionPage() {
  const onlineOverview = await getOnlineOverview();
  const radioConfigs = await getRadioConfigs();

  return (
    <main id="main-content">
      <PageShell>
        <section className={styles.hero}>
          <h1 className={styles.title}>Morse Radio Duels</h1>
        </section>

        <section className={styles.topGrid}>
          <OnlineOverview overview={onlineOverview} />

          <CompetitionIntro />
        </section>

        <section className={styles.radioSection} aria-labelledby="radio-title">
          <div className={styles.sectionHeader}>
            <div>
              <h2 id="radio-title" className={styles.sectionTitle}>
                Choose your radio wave
              </h2>

              <p className={styles.sectionDescription}>
                Each radio is an independent lobby with its own Morse speed.
              </p>
            </div>
          </div>

          <div className={styles.radioGrid}>
            {radioConfigs.map((radio) => (
              <RadioWaveCard
                key={radio.id}
                radio={radio}
                usersCount={onlineOverview.radioUsers?.[radio.id] ?? 0}
              />
            ))}
          </div>
        </section>
      </PageShell>
    </main>
  );
}