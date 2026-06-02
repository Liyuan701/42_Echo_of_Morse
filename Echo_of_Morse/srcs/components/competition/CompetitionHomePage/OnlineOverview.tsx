"use client";

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
        Online Overview
      </h2>

      <dl className={styles.statsList}>
        <div className={styles.statRow}>
          <dt>Online now</dt>
          <dd>{onlineNow}</dd>
        </div>

        <div className={styles.statRow}>
          <dt>Radio Wave 01</dt>
          <dd>{radioUsers["01"] ?? 0}</dd>
        </div>

        <div className={styles.statRow}>
          <dt>Radio Wave 02</dt>
          <dd>{radioUsers["02"] ?? 0}</dd>
        </div>

        <div className={styles.statRow}>
          <dt>Radio Wave 03</dt>
          <dd>{radioUsers["03"] ?? 0}</dd>
        </div>
      </dl>

      <p className={styles.socketHint}>
        {isConnected
          ? "Live data connected via socket."
          : "Disconnected. Showing database snapshot."}
      </p>
    </Card>
  );
}

{/* //! yongyue i18n: move Online Overview labels into the i18n dictionary. */}

// Liyuan:real data-connected:
// authenticated online users count
// real competition overview data:
// onlineNow, currentlyPlaying, users per radio.