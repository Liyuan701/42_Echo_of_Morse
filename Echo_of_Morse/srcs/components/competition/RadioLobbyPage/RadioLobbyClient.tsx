"use client";

import { useI18n } from "@/lib/i18n";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/providers/socket-provider";

import InviteFriendsPanel from "./InviteFriendsPanel";
import LobbyUserList from "./LobbyUserList";
import MatchmakingPanel from "./MatchmakingPanel";
import RadioHeader from "./RadioHeader";
import ReadyPlayersList from "./ReadyPlayersList";
import { createLobbyLeaveScheduler } from "./lobby-leave-scheduler";

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
  const { socket, isConnected } = useSocket();

  const [users, setUsers] = useState<RadioUser[]>(initialUsers);
  const [message, setMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [lobbyMembershipRevision, setLobbyMembershipRevision] = useState(0);
  const memberIdsRef = useRef(
    initialUsers.map((user) => user.id).sort().join(",")
  );

  const sendLeaveRequest = useCallback(() => {
    void fetch(`/api/competition/radio/${radio.radioId}`, {
      method: "DELETE",
      keepalive: true,
    }).catch(() => undefined);
  }, [radio.radioId]);

  const leaveScheduler = useMemo(
    () => createLobbyLeaveScheduler(sendLeaveRequest),
    [sendLeaveRequest]
  );

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
      const nextMemberIds = lobby.users
        .map((user) => user.id)
        .sort()
        .join(",");

      if (nextMemberIds !== memberIdsRef.current) {
        memberIdsRef.current = nextMemberIds;
        setLobbyMembershipRevision((revision) => revision + 1);
      }

      setUsers(lobby.users);

      if (lobby.activeSessionId) {
        router.push(
          `/competition/radio/${radio.radioId}/session/${lobby.activeSessionId}`
        );
      }
    },
    [radio.radioId, router]
  );

  const fetchLobby = useCallback(
    async (method: "GET" | "POST") => {
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
        console.error(body?.error);
        throw new Error(t.failedToLoadLobby);
      }

      const lobby = (await response.json()) as {
        users: RadioUser[];
        activeSessionId: string | null;
      };

      return lobby;
    },
    [radio.radioId, t.failedToLoadLobby]
  );

  const requestLobby = useCallback(
    async (method: "GET" | "POST") => {
      applyLobbyResponse(await fetchLobby(method));
    },
    [applyLobbyResponse, fetchLobby]
  );

  useEffect(() => {
    let cancelled = false;
    leaveScheduler.cancelLeave();

    fetchLobby("POST")
      .then((lobby) => {
        if (!cancelled) {
          applyLobbyResponse(lobby);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          console.error(error);
          setMessage(t.failedToJoinLobby);
        }
      });

    // Socket events drive normal updates; polling is only a slower safety net.
    const intervalMs = isConnected ? 30000 : 5000;
    const intervalId = window.setInterval(() => {
      fetchLobby("GET")
        .then((lobby) => {
          if (!cancelled) {
            applyLobbyResponse(lobby);
          }
        })
        .catch(() => {
          // Keep the last database snapshot during a temporary network failure.
        });
    }, intervalMs);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      leaveScheduler.scheduleLeave();
    };
  }, [
    applyLobbyResponse,
    fetchLobby,
    isConnected,
    leaveScheduler,
    t.failedToJoinLobby,
  ]);

  useEffect(() => {
    function handlePageHide() {
      leaveScheduler.cancelLeave();
      sendLeaveRequest();
    }

    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [leaveScheduler, sendLeaveRequest]);

  /**
   * =========================================================
   * SOCKET SYNC LAYER
   * =========================================================
   */
  useEffect(() => {
    if (!socket) return;

    // Join the Socket.IO room used by server-side radio lobby broadcasts.
    socket.emit("radio:join", { radioId: radio.radioId });

    function handleUserListUpdated() {
      void requestLobby("GET");
    }

    function handleReadyListUpdated() {
      void requestLobby("GET");
    }

    function handleGameCreated(payload: {
      radioId?: string;
      sessionId: string;
    }) {
      router.push(
        `/competition/radio/${payload.radioId ?? radio.radioId}/session/${payload.sessionId}`
      );
    }

    socket.on("radio:user-list-updated", handleUserListUpdated);
    socket.on("radio:ready-list-updated", handleReadyListUpdated);
    socket.on("radio:game-created", handleGameCreated);

    return () => {
      socket.emit("radio:leave", { radioId: radio.radioId });
      socket.off("radio:user-list-updated", handleUserListUpdated);
      socket.off("radio:ready-list-updated", handleReadyListUpdated);
      socket.off("radio:game-created", handleGameCreated);
    };
  }, [radio.radioId, requestLobby, socket, router]);

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
        	console.error(body.error);
			throw new Error(t.failedToUpdateReadyStatus);
      }

      applyLobbyResponse({
        users: body.users,
        activeSessionId: body.activeSessionId ?? null,
      });
    } catch (error) {
		console.error(error);
		setMessage(t.failedToUpdateReadyStatus);
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
        	console.error(body.error);
			throw new Error(t.failedToStartGame);
      }

      router.push(
        `/competition/radio/${radio.radioId}/session/${body.sessionId}`
      );
    } catch (error) {
    	console.error(error);
		setMessage(t.failedToStartGame);
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleLeaveLobby() {
    setMessage("");
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/competition/radio/${radio.radioId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;

        throw new Error(body?.error || t.failedToLeaveLobby);
      }

      router.push("/competition");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t.failedToLeaveLobby);
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
            onLeaveLobby={handleLeaveLobby}
            isUpdating={isUpdating}
          />

          <ReadyPlayersList readyPlayers={readyPlayers} />
        </div>

        <div className={styles.rightColumn}>
          <InviteFriendsPanel
            radioId={radio.radioId}
            radioName={radioName}
            isLobbyFull={isLobbyFull}
            lobbyMembershipRevision={lobbyMembershipRevision}
          />
        </div>
      </section>
    </div>
  );
}
