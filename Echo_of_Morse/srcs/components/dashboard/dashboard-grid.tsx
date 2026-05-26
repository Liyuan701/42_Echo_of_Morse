// import Link from "next/link";
// import styles from "./dashboard.module.css";

// type DashboardCardProps = {
//   title: string;
//   description: string;
//   href: string;
// };

// type PracticeProgress = {
//   completedLessons: number;
//   targetLessons: number;
//   accuracy: number;
//   streak: number;
// };

// function DashboardCard({ title, description, href }: DashboardCardProps) {
//   return (
//     <Link href={href} className={styles.card}>
//       <h2 className={styles.cardTitle}>{title}</h2>

//       <p className={styles.cardDescription}>{description}</p>
//     </Link>
//   );
// }

// // TODO: Liyuan : Replace this mock data with real data from the database.
// function TodayPracticeProgress() {
//   const progress: PracticeProgress = {
//     completedLessons: 3,
//     targetLessons: 5,
//     accuracy: 82,
//     streak: 4,
//   };

//   const percentage = Math.round(
//     (progress.completedLessons / progress.targetLessons) * 100
//   );

//   return (
//     <section className={styles.progressSection}>
//       <h2 className={styles.progressTitle}>Today’s Practice Progress</h2>

//       <p className={styles.progressDescription}>
//         Keep training every day to improve your Morse decoding speed and
//         consistency.
//       </p>

//       <div className={styles.progressBar}>
//         <div
//           className={styles.progressFill}
//           style={{ width: `${percentage}%` }}
//         />
//       </div>

//       <div className={styles.statsGrid}>
//         <div>
//           <h3 className={styles.statLabel}>Lessons</h3>
//           <p className={styles.statValue}>
//             {progress.completedLessons}/{progress.targetLessons}
//           </p>
//         </div>

//         <div>
//           <h3 className={styles.statLabel}>Accuracy</h3>
//           <p className={styles.statValue}>{progress.accuracy}%</p>
//         </div>

//         <div>
//           <h3 className={styles.statLabel}>Streak</h3>
//           <p className={styles.statValue}>{progress.streak} days</p>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default function DashboardGrid() {
//   const cards: DashboardCardProps[] = [
//     {
//       title: "Learning",
//       description: "Practice Morse code and improve your decoding skills.",
//       href: "/learning",
//     },
//     {
//       title: "Chat",
//       description: "Communicate with other users through real-time chat.",
//       href: "/chat",
//     },
//     {
//       title: "Competition",
//       description: "Join challenges and compare your performance.",
//       href: "/competition",
//     },
//   ];

//   return (
//     <section>
//       <TodayPracticeProgress />

//       <div className={styles.cardGrid}>
//         {cards.map((card) => (
//           <DashboardCard
//             key={card.title}
//             title={card.title}
//             description={card.description}
//             href={card.href}
//           />
//         ))}
//       </div>
//     </section>
//   );
// }

"use client";
import { useI18n } from "@/lib/i18n";

import Link from "next/link";
import styles from "./dashboard.module.css";
import { useEffect, useState } from "react";

type DashboardCardProps = {
  title: string;
  description: string;
  href: string;
  actionLabel: string;
};

function DashboardCard({ title, description, href, actionLabel }: DashboardCardProps) {
  return (
    <Link href={href} className={styles.card}>
      <div>
        <h2 className={styles.cardTitle}>{title}</h2>

        <p className={styles.cardDescription}>{description}</p>
      </div>

      <span className={styles.cardAction}>{actionLabel}</span>
    </Link>
  );
}

export default function DashboardGrid() {
	const { dictionary } = useI18n();
	const t = dictionary.dashboard;

  const cards = [
    {
      title: t.learningTitle,
      description: t.learningDescription,
      href: "/learning",
    },
    {
      title: t.chatTitle,
      description: t.chatDescription,
      href: "/chat",
    },
    {
      title: t.competitionTitle,
      description: t.competitionDescription,
      href: "/competition",
    },
  ];

  return (
    <section aria-label={t.modulesLabel}>
      <div className={styles.cardGrid}>
        {cards.map((card) => (
          <DashboardCard
            key={card.title}
            title={card.title}
            description={card.description}
            href={card.href}
			actionLabel={t.openModule}
          />
        ))}
      </div>
    </section>
  );
}
