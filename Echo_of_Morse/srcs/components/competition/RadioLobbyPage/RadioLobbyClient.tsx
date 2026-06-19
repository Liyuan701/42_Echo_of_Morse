"use client";

import { useI18n } from "@/lib/i18n";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/providers/socket-provider";

import InviteFriendsPanel from "./InviteFriendsPanel";
import LobbyUserList from "./LobbyUserList";
import MatchmakingPanel from "./MatchmakingPanel";
import RadioHeader from "./RadioHeader";
import ReadyPlayersList from "./ReadyPlayersList";

import type { RadioUser } from "@/types/competition";
import type { RadioConfig } from "@/types/competition";

import styles from "@/../app/competition/radio/[radioId]/radio-lobby.module.css";

export type RadioLobbyClientProps = {
  radio: {
    id: string;
    radioId: string;
    name: string;
    wpm: number;
    description: string;
    maxUsers: number;
  };
  initialUsers: RadioUser[];
};

export default function RadioLobbyClient({
  radio,
  initialUsers,
}: RadioLobbyClientProps) {
	const { dictionary } = useI18n();
	const t = dictionary.competitionRadio;

	const radioNameById: Record<string, string> = {
		"01": t.radioWave01,
		"02": t.radioWave02,
		"03": t.radioWave03,
	};

	const radioName = radioNameById[radio.radioId];

  const router = useRouter();
  const { socket } = useSocket();

  const [users, setUsers] = useState<RadioUser[]>(initialUsers);
  const [message, setMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const currentUser = users.find((u) => u.isCurrentUser);

  const readyPlayers = useMemo(
    () => users.filter((u) => u.status === "ready"),
    [users]
  );

  const isCurrentUserReady = currentUser?.status === "ready";
  const canStartGame = !!isCurrentUserReady && readyPlayers.length >= 2;
  const isLobbyFull = users.length >= radio.maxUsers;

  const applyLobbyResponse = useCallback(
    (lobby: { users: RadioUser[]; activeSessionId: string | null }) => {
      setUsers(lobby.users);

      if (lobby.activeSessionId) {
        router.push(
          `/competition/radio/${radio.radioId}/session/${lobby.activeSessionId}`
        );
      }
    },
    [radio.radioId, router]
  );

  // TODO modify after socket notifications are reliable.
  // Temporary polling fallback. Lobby users, ready states, and newly created
  // sessions are refreshed from PostgreSQL every 2 seconds because the radio
  // Socket.IO events are not implemented/reliable yet. After radio socket
  // synchronization works, remove the repeated GET interval. Keep the POST
  // used to join the lobby and the DELETE cleanup used when leaving the page.
  useEffect(() => {
    let cancelled = false;

    async function requestLobby(method: "GET" | "POST") {
      const response = await fetch(
        `/api/competition/radio/${radio.radioId}`,
        {
          method,
          cache: "no-store",
        }
      );

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error || t.failedToLoadLobby);
      }

      const lobby = (await response.json()) as {
        users: RadioUser[];
        activeSessionId: string | null;
      };

      if (!cancelled) {
        applyLobbyResponse(lobby);
      }
    }

    requestLobby("POST").catch((error: unknown) => {
      if (!cancelled) {
        setMessage(
          error instanceof Error ? error.message : t.failedToJoinLobby
        );
      }
    });

    const intervalId = window.setInterval(() => {
      requestLobby("GET").catch(() => {
        // Keep the last database snapshot during a temporary network failure.
      });
    }, 2000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      fetch(`/api/competition/radio/${radio.radioId}`, {
        method: "DELETE",
        keepalive: true,
      }).catch(() => undefined);
    };
  }, [applyLobbyResponse, radio.radioId]);

  /**
   * =========================================================
   * SOCKET SYNC LAYER
   * =========================================================
   */
  useEffect(() => {
    if (!socket) return;

    function handleUserListUpdated(updatedUsers: RadioUser[]) {
      setUsers(updatedUsers);
    }

    function handleReadyListUpdated(updatedUsers: RadioUser[]) {
      setUsers(updatedUsers);
    }

    function handleGameCreated(payload: {
      radioId: string;
      sessionId: string;
    }) {
      router.push(
        `/competition/radio/${payload.radioId}/session/${payload.sessionId}`
      );
    }

    socket.on("radio:user-list-updated", handleUserListUpdated);
    socket.on("radio:ready-list-updated", handleReadyListUpdated);
    socket.on("radio:game-created", handleGameCreated);

    return () => {
      socket.off("radio:user-list-updated", handleUserListUpdated);
      socket.off("radio:ready-list-updated", handleReadyListUpdated);
      socket.off("radio:game-created", handleGameCreated);
    };
  }, [socket, router]);

  /**
   * =========================================================
   * ACTIONS (socket emit)
   * =========================================================
   */
  async function handleToggleReady() {
    setMessage("");
    setIsUpdating(true);

    try {
      const response = await fetch(
        `/api/competition/radio/${radio.radioId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ready: !isCurrentUserReady }),
        }
      );

      const body = (await response.json()) as {
        users?: RadioUser[];
        activeSessionId?: string | null;
        error?: string;
      };

      if (!response.ok || !body.users) {
        throw new Error(body.error || t.failedToUpdateReadyStatus);
      }

      applyLobbyResponse({
        users: body.users,
        activeSessionId: body.activeSessionId ?? null,
      });
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : t.failedToUpdateReadyStatus
      );
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleStartGame() {
    if (!isCurrentUserReady) {
      setMessage(t.needReadyBeforeStart);
      return;
    }

    if (readyPlayers.length < 2) {
      setMessage(t.needTwoPlayers);
      return;
    }

    setMessage("");
    setIsUpdating(true);

    try {
      const response = await fetch(
        `/api/competition/radio/${radio.radioId}/session`,
        { method: "POST" }
      );
      const body = (await response.json()) as {
        sessionId?: string;
        error?: string;
      };

      if (!response.ok || !body.sessionId) {
        throw new Error(body.error || t.failedToStartGame);
      }

      router.push(
        `/competition/radio/${radio.radioId}/session/${body.sessionId}`
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : t.failedToStartGame
      );
    } finally {
      setIsUpdating(false);
    }
  }

  /**
   * =========================================================
   * ADAPTER: Prisma RadioRoom -> UI RadioConfig
   * =========================================================
   */
  const radioConfig: RadioConfig = {
    id: radio.radioId,
    name: radio.name,
    wpm: radio.wpm,
    description: radio.description,
  };

  return (
    <div className={styles.page}>
      <RadioHeader radio={radioConfig} usersCount={users.length} />

      <section className={styles.layout}>
        <div className={styles.leftColumn}>
          <LobbyUserList users={users} />

          <MatchmakingPanel
            isCurrentUserReady={!!isCurrentUserReady}
            readyPlayersCount={readyPlayers.length}
            canStartGame={canStartGame}
            message={message}
            onToggleReady={handleToggleReady}
            onStartGame={handleStartGame}
            isUpdating={isUpdating}
          />

          <ReadyPlayersList readyPlayers={readyPlayers} />
        </div>

        <div className={styles.rightColumn}>
          <InviteFriendsPanel
            radioId={radio.radioId}
            radioName={radioName}
            isLobbyFull={isLobbyFull}
          />
        </div>
      </section>
    </div>
  );
}
