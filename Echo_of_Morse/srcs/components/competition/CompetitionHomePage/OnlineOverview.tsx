"use client";

import { useI18n } from "@/lib/i18n";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui";
import { useSocket } from "@/providers/socket-provider";
import styles from "@/../app/competition/competition.module.css";

type OnlineOverviewProps = {
  overview: {
    totalOnlineUsers: number;
    radioUsers: Record<string, number>;
  };
};

export default function OnlineOverview({ overview }: OnlineOverviewProps) {
	const { dictionary } = useI18n();
	const t = dictionary.competitionHome;
  const { socket, isConnected } = useSocket();

  const [onlineNow, setOnlineNow] = useState(overview.totalOnlineUsers);
  const [radioUsers, setRadioUsers] = useState(overview.radioUsers);

  useEffect(() => {
    if (!socket) return;

    function handleUsersCount(count: number) {
      setOnlineNow(count);
    }

    /**
     * optional: future event for live lobby updates
     */
    function handleRadioUpdate(data: {
      radioId: string;
      count: number;
    }) {
      setRadioUsers((prev) => ({
        ...prev,
        [data.radioId]: data.count,
      }));
    }

    socket.on("users-count", handleUsersCount);
    socket.on("radio-users-update", handleRadioUpdate);

    return () => {
      socket.off("users-count", handleUsersCount);
      socket.off("radio-users-update", handleRadioUpdate);
    };
  }, [socket]);

  return (
    <Card className={styles.overviewCard} aria-labelledby="online-overview">
      <h2 id="online-overview" className={styles.cardTitle}>
        {t.onlineOverview}
      </h2>

      <dl className={styles.statsList}>
        <div className={styles.statRow}>
          <dt>{t.onlineNow}</dt>
          <dd>{onlineNow}</dd>
        </div>

        <div className={styles.statRow}>
          <dt>{t.radioWave01}</dt>
          <dd>{radioUsers["01"] ?? 0}</dd>
        </div>

        <div className={styles.statRow}>
          <dt>{t.radioWave02}</dt>
          <dd>{radioUsers["02"] ?? 0}</dd>
        </div>

        <div className={styles.statRow}>
          <dt>{t.radioWave03}</dt>
          <dd>{radioUsers["03"] ?? 0}</dd>
        </div>
      </dl>

      <p className={styles.socketHint}>
        {isConnected? t.liveDataConnected : t.disconnectedSnapshot}
      </p>
    </Card>
  );
}

// Liyuan:real data-connected:
// authenticated online users count
// real competition overview data:
// onlineNow, currentlyPlaying, users per radio.