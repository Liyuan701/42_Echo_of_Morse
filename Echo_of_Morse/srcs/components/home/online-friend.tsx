"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, Button } from "@/components/ui";
import { mockFriends } from "@/components/chat/faux-chat-data";
import styles from "./online-friend.module.css";

export default function OnlineFriendsPreview() {
  const onlineFriends = mockFriends.filter((friend) => friend.isOnline);

  // ! game: temporary local state for home page game invitations.
  // ! This only controls the "Pending" state on the home page.
  // ! Later, this should be replaced by real game invitation data from the backend.
  // ! Expected backend data: invitation id, senderId, receiverId, status, gameMode, createdAt.
  const [pendingGameInviteFriendIds, setPendingGameInviteFriendIds] = useState<
    string[]
  >([]);

  function handleInviteFriendToGame(friendId: string, displayName: string) {
    const alreadyPending = pendingGameInviteFriendIds.includes(friendId);

    if (alreadyPending) {
      window.alert("A game invitation is already pending.");
      return;
    }

    // ! game: TODO backend / WebSocket integration.
    // ! This currently only creates a local pending game invitation on the home page.
    // ! Later, this should call the same real API or WebSocket event as the chat module, for example:
    // ! POST /api/game-invitations with targetFriendId and gameMode.
    // ! socket.emit("game_invitation:create", { toUserId: friendId, gameMode: "morse_duel" }).
    // ! Backend should persist the invitation, notify the receiver,
    // ! and create / join a game room only after the receiver accepts.
    setPendingGameInviteFriendIds((prev) => [...prev, friendId]);

    window.alert(
      `Game invitation sent to ${displayName}. Waiting for their response.`
    );
  }

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Online friends</h2>
          <p className={styles.description}>
            Friends currently available for chat or competition.
          </p>
        </div>
      </div>

      {/* //! yren: replace mock online friends with real current user's online friends from auth/database */}
      {onlineFriends.length > 0 ? (
        <ul className={styles.list}>
          {onlineFriends.map((friend) => {
            const profileHref = `/users/${friend.id}`;
            const displayName =
              friend.displayName || friend.username || "Unknown user";
            const avatarLetter =
              friend.avatarInitial || displayName.charAt(0).toUpperCase();

            const isGameInvitePending = pendingGameInviteFriendIds.includes(
              friend.id
            );

            const inviteButtonLabel = isGameInvitePending
              ? "Pending"
              : "Invite";

            return (
              <li key={friend.id} className={styles.item}>
                <Link href={profileHref} className={styles.profileLink}>
                  {friend.avatarUrl ? (
                    <img
                      className={styles.avatar}
                      src={friend.avatarUrl}
                      alt={`${displayName}'s avatar`}
                    />
                  ) : (
                    <span className={styles.avatarFallback}>
                      {avatarLetter}
                    </span>
                  )}

                  <span className={styles.identity}>
                    <span className={styles.name}>{displayName}</span>
                    <span className={styles.username}>@{friend.username}</span>
                  </span>
                </Link>

                <div className={styles.actions}>
                  <Link href="/chat" className={styles.chatLink}>
                    Chat
                  </Link>

                  <Button
                    type="button"
                    variant="secondary"
                    disabled={isGameInvitePending}
                    onClick={() =>
                      handleInviteFriendToGame(friend.id, displayName)
                    }
                  >
                    {inviteButtonLabel}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className={styles.empty}>No friends online for now.</p>
      )}

      <Link href="/chat" className={styles.viewAllLink}>
        View all friends
      </Link>
    </Card>
  );
}

// ! i18n: move home page titles, descriptive paragraphs, online-user labels, empty states, buttons, and alert messages into the i18n dictionary.
// ! i18n: keep dynamic values such as onlineCount and displayName as interpolation variables.
// ! i18n: move game invitation labels and messages into the i18n dictionary.
// ! i18n: dynamic game invitation strings should use displayName as an interpolation variable.