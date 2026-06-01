import CompetitionIntro from "@/components/competition/CompetitionHomePage/CompetitionIntro";
import OnlineOverview from "@/components/competition/CompetitionHomePage/OnlineOverview";
import RadioWaveCard from "@/components/competition/CompetitionHomePage/RadioWaveCard";
import PageShell from "@/components/layout/page-shell";
import {
  onlineOverviewMock,
  radioConfigs,
} from "@/components/competition/mockData/mockCompetitionData";
import styles from "./competition.module.css";

export default function CompetitionPage() {
  return (
    <main id="main-content">
      <PageShell>
        <section className={styles.hero}>
          {/* //! yongyue i18n: move this page title into the i18n dictionary. */}
          <h1 className={styles.title}>Morse Radio Duels</h1>
        </section>

        <section className={styles.topGrid}>
          {/* //! Liyuan real data: OnlineOverview currently uses mock data for radio counts and temporary socket count for online users. */}
          <OnlineOverview overview={onlineOverviewMock} />

          {/* //! yongyue i18n: rules text inside this component should be moved into the i18n dictionary. */}
          <CompetitionIntro />
        </section>

        <section className={styles.radioSection} aria-labelledby="radio-title">
          <div className={styles.sectionHeader}>
            <div>
              {/* //! yongyue i18n: move this section title into the i18n dictionary. */}
              <h2 id="radio-title" className={styles.sectionTitle}>
                Choose your radio wave
              </h2>

              {/* //! yongyue i18n: move this helper text into the i18n dictionary. */}
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
                usersCount={onlineOverviewMock.radioUsers[radio.id]}
              />
            ))}
          </div>
        </section>
      </PageShell>
    </main>
  );
}