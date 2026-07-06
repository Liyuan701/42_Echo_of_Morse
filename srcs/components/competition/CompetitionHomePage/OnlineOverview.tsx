"use client";

import { useI18n } from "@/lib/i18n";
import { useCallback, useEffect, useState } from "react";
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

  const refreshOverview = useCallback(async () => {
    const response = await fetch("/api/competition/overview", {
      cache: "no-store",
    });

    if (!response.ok) {
      return;
    }

    const data = (await response.json()) as {
      totalOnlineUsers: number;
      radioUsers: Record<string, number>;
    };

    setOnlineNow(data.totalOnlineUsers);
    setRadioUsers(data.radioUsers);
  }, []);

  useEffect(() => {
    if (!socket) return;

    function handleUsersCount(count: number) {
      setOnlineNow(count);
    }

    function handleRadioUpdate() {
      void refreshOverview();
    }

    socket.on("users-count", handleUsersCount);
    socket.on("radio:user-list-updated", handleRadioUpdate);
    socket.on("radio:ready-list-updated", handleRadioUpdate);
    socket.on("radio:game-created", handleRadioUpdate);
    socket.on("sync:required", handleRadioUpdate);
    socket.on("connect", handleRadioUpdate);
    socket.emit("get-users-count");

    return () => {
      socket.off("users-count", handleUsersCount);
      socket.off("radio:user-list-updated", handleRadioUpdate);
      socket.off("radio:ready-list-updated", handleRadioUpdate);
      socket.off("radio:game-created", handleRadioUpdate);
      socket.off("sync:required", handleRadioUpdate);
      socket.off("connect", handleRadioUpdate);
    };
  }, [refreshOverview, socket]);

  useEffect(() => {
    void refreshOverview().catch(() => undefined);

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        void refreshOverview().catch(() => undefined);
      }
    }

    window.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refreshOverview]);

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
