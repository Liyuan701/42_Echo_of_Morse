"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui";
import { useSocket } from "@/providers/socket-provider";
import type { OnlineOverviewData } from "../mockData/competitionTypes";
import styles from "@/../app/competition/competition.module.css";

type OnlineOverviewProps = {
  overview: OnlineOverviewData;
};

export default function OnlineOverview({ overview }: OnlineOverviewProps) {
  const { socket, isConnected } = useSocket();
  const [onlineNow, setOnlineNow] = useState(overview.onlineNow);

  useEffect(() => {
    if (!socket) {
      return;
    }

    function handleUsersCount(count: number) {
      setOnlineNow(count);
    }

    socket.on("users-count", handleUsersCount);

    return () => {
      socket.off("users-count", handleUsersCount);
    };
  }, [socket]);

  return (
    <Card className={styles.overviewCard} aria-labelledby="online-overview">
      <h2 id="online-overview" className={styles.cardTitle}>
        Online Overview
      </h2>

      <dl className={styles.statsList}>
        <div className={styles.statRow}>
          <dt>Online now</dt>
          <dd>{onlineNow}</dd>
        </div>

        <div className={styles.statRow}>
          <dt>Currently playing</dt>
          <dd>{overview.currentlyPlaying}</dd>
        </div>

        <div className={styles.statRow}>
          <dt>Radio Wave 01</dt>
          <dd>{overview.radioUsers["01"]}</dd>
        </div>

        <div className={styles.statRow}>
          <dt>Radio Wave 02</dt>
          <dd>{overview.radioUsers["02"]}</dd>
        </div>

        <div className={styles.statRow}>
          <dt>Radio Wave 03</dt>
          <dd>{overview.radioUsers["03"]}</dd>
        </div>
      </dl>

      <p className={styles.socketHint}>
        {isConnected
          ? "Socket connected. Online count currently follows the temporary socket users-count event."
          : "Socket not connected. Showing mock online data."}
      </p>
    </Card>
  );
}

{/* //! yongyue i18n: move Online Overview labels into the i18n dictionary. */}

// //! Liyuan:real data:
// users-count currently comes from temporary socket connection count.
// Later it should be replaced by authenticated online users count
// and real competition overview data:
// onlineNow, currentlyPlaying, users per radio.