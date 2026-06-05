"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/providers/socket-provider";

import InviteFriendsPanel from "./InviteFriendsPanel";
import LobbyUserList from "./LobbyUserList";
import MatchmakingPanel from "./MatchmakingPanel";
import RadioHeader from "./RadioHeader";
import ReadyPlayersList from "./ReadyPlayersList";

import { RADIO_LOBBY_MAX_USERS } from "@/types/competition";
import type { RadioUser } from "@/types/competition";
import type { RadioRoom } from "@prisma/client";
import type { RadioConfig } from "@/types/competition";

import styles from "@/../app/competition/radio/[radioId]/radio-lobby.module.css";

export type RadioLobbyClientProps = {
  radio: RadioRoom;
  initialUsers: RadioUser[];
};

export default function RadioLobbyClient({
  radio,
  initialUsers,
}: RadioLobbyClientProps) {
  const router = useRouter();
  const { socket } = useSocket();

  const [users, setUsers] = useState<RadioUser[]>(initialUsers);
  const [message, setMessage] = useState("");

  const currentUser = users.find((u) => u.isCurrentUser);

  const readyPlayers = useMemo(
    () => users.filter((u) => u.status === "ready"),
    [users]
  );

  const mockFriends = useMemo(
    () => users.filter((u) => u.isFriend && !u.isCurrentUser),
    [users]
  );

  const isCurrentUserReady = currentUser?.status === "ready";
  const canStartGame = !!isCurrentUserReady && readyPlayers.length >= 2;
  const isLobbyFull = users.length >= RADIO_LOBBY_MAX_USERS;

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
  function handleToggleReady() {
    setMessage("");

    if (!socket) return;

    if (isCurrentUserReady) {
      socket.emit("radio:unready", { radioId: radio.radioId });
    } else {
      socket.emit("radio:ready", { radioId: radio.radioId });
    }
  }

  function handleStartGame() {
    if (!isCurrentUserReady) {
      setMessage("You need to click Ready before starting a game.");
      return;
    }

    if (readyPlayers.length < 2) {
      setMessage("Il faut au moins deux joueurs prêts pour commencer.");
      return;
    }

    if (!socket) return;

    socket.emit("radio:start-game", { radioId: radio.radioId });
  }

  /**
   * =========================================================
   * ADAPTER: Prisma RadioRoom -> UI RadioConfig
   * =========================================================
   */
  const radioConfig: RadioConfig = {
    id: radio.radioId as any,
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
          />

          <ReadyPlayersList readyPlayers={readyPlayers} />
        </div>

        <div className={styles.rightColumn}>
          <InviteFriendsPanel
            radioId={radio.radioId}
            radioName={radio.name}
            mockFriends={mockFriends}
            isLobbyFull={isLobbyFull}
          />
        </div>
      </section>
    </div>
  );
}