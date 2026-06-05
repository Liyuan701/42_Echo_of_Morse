import CompetitionIntro from "@/components/competition/CompetitionHomePage/CompetitionIntro";
import OnlineOverview from "@/components/competition/CompetitionHomePage/OnlineOverview";
import RadioWaveCard from "@/components/competition/CompetitionHomePage/RadioWaveCard";
import PageShell from "@/components/layout/page-shell";
import styles from "./competition.module.css";

import {
  getOnlineOverview,
  getRadioConfigs,
} from "@/lib/services/competition";

import type { RadioId } from "@/types/competition";

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

        <section className={styles.radioSection}>
          <div className={styles.radioGrid}>
            {radioConfigs.map((radio) => {
              const count =
                onlineOverview.radioUsers?.[radio.id as RadioId] ?? 0;

              return (
                <RadioWaveCard
                  key={radio.id}
                  radio={radio}
                  usersCount={count}
                />
              );
            })}
          </div>
        </section>
      </PageShell>
    </main>
  );
}