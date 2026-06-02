"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import InviteFriendsPanel from "./InviteFriendsPanel";
import LobbyUserList from "./LobbyUserList";
import MatchmakingPanel from "./MatchmakingPanel";
import RadioHeader from "./RadioHeader";
import ReadyPlayersList from "./ReadyPlayersList";
import { mockRadioUsersByRadioId } from "@/components/competition/mockData/mockCompetitionData";
import {
  RADIO_LOBBY_MAX_USERS,
  type RadioConfig,
  type RadioUser,
} from "@/components/competition/mockData/competitionTypes";
import styles from "@/../app/competition/radio/[radioId]/radio-lobby.module.css";

type RadioLobbyClientProps = {
  radio: RadioConfig;
};

export default function RadioLobbyClient({ radio }: RadioLobbyClientProps) {
  const router = useRouter();

  // //! Liyuan real data:
  // This is temporary mock lobby data.
  // Backend/socket note:
  // The lobby user list is still mock data. It does not represent real users
  // currently connected to this radio lobby yet.
  // Later it should come from socket events such as:
  // radio:join, radio:leave, radio:user-list-updated.
  const [users, setUsers] = useState<RadioUser[]>(
    mockRadioUsersByRadioId[radio.id]
  );

  const [message, setMessage] = useState("");

  const currentUser = users.find((user) => user.isCurrentUser);

  const readyPlayers = useMemo(
    () => users.filter((user) => user.status === "ready"),
    [users]
  );

  // Backend/socket note:
  // The ready queue is derived from local React state for the frontend
  // prototype. It is not a server-confirmed queue yet, so it cannot be used as
  // the source of truth for real matchmaking.

  const mockFriends = useMemo(
    () => users.filter((user) => user.isFriend && !user.isCurrentUser),
    [users]
  );

  const isCurrentUserReady = currentUser?.status === "ready";
  const canStartGame = isCurrentUserReady && readyPlayers.length >= 2;
  const isLobbyFull = users.length >= RADIO_LOBBY_MAX_USERS;

  function handleToggleReady() {
    setMessage("");

    setUsers((previousUsers) =>
      previousUsers.map((user) => {
        if (!user.isCurrentUser) {
          return user;
        }

        return {
          ...user,
          status: user.status === "ready" ? "idle" : "ready",
        };
      })
    );

    // //! Liyuan：real data:
    // Replace local state update with socket events.
    // Expected events:
    // socket.emit("radio:ready", { radioId: radio.id })
    // socket.emit("radio:unready", { radioId: radio.id })
    // Server should broadcast:
    // socket.on("radio:user-list-updated", users)
    // socket.on("radio:ready-list-updated", readyPlayers)
  }

  function handleStartGame() {
    if (!isCurrentUserReady) {
      // //! yongyue i18n: move this message into the i18n dictionary.
      setMessage("You need to click Ready before starting a game.");
      return;
    }

    if (readyPlayers.length < 2) {
      // //! yongyue i18n: move this message into the i18n dictionary.
      setMessage("Il faut au moins deux joueurs prêts pour commencer.");
      return;
    }

    const mockSessionId = `mock-session-${Date.now()}`;

    // //! Liyuan：real data:
    // This mock sessionId should be replaced by a real game session created by backend/socket.
    // Backend/socket note:
    // At the moment, Start Game only redirects the current browser to the
    // session route. It does not move every ready player into the same session.
    // The backend/socket layer must create the session, choose all server-ready
    // players, and broadcast the sessionId so every participant redirects
    // together.
    // Expected flow:
    // socket.emit("radio:start-game", { radioId: radio.id })
    // Server creates a session with all ready players.
    // Server broadcasts:
    // socket.on("radio:game-created", { radioId, sessionId })
    // Then all ready players should be redirected to:
    // /competition/radio/[radioId]/session/[sessionId]

    router.push(`/competition/radio/${radio.id}/session/${mockSessionId}`);
  }

  return (
    <div className={styles.page}>
      <RadioHeader radio={radio} usersCount={users.length} />

      <section className={styles.layout}>
        <div className={styles.leftColumn}>
          <LobbyUserList users={users} />

          <MatchmakingPanel
            isCurrentUserReady={isCurrentUserReady}
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
            radioId={radio.id}
            radioName={radio.name}
            mockFriends={mockFriends}
            isLobbyFull={isLobbyFull}
          />
        </div>
      </section>
    </div>
  );
}
