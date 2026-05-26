"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, Button } from "@/components/ui";
import styles from "./online-friend.module.css";
import { useI18n } from "@/lib/i18n";


type ApiFriendship = {
  id: number;
  sender: {
    id: string;
    username: string;
    image: string | null;
    isOnline: boolean;
  };
  receiver: {
    id: string;
    username: string;
    image: string | null;
    isOnline: boolean;
  };
};

type OnlineFriend = {
  id: string;
  username: string;
  image: string | null;
  isOnline: boolean;
};

export default function OnlineFriendsPreview() {
	const { dictionary } = useI18n();
	const t = dictionary.home;

  const { data: session, status } = useSession();

  const currentUserId = (session?.user as { id?: string } | undefined)?.id;

  const [onlineFriends, setOnlineFriends] = useState<OnlineFriend[]>([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);

  // ! game: temporary local state for home page game invitations.
  // ! This only controls the "Pending" state on the home page.
  // ! Later, this should be replaced by real game invitation data from the backend.
  // ! Expected backend data: invitation id, senderId, receiverId, status, gameMode, createdAt.
  const [pendingGameInviteFriendIds, setPendingGameInviteFriendIds] = useState<
    string[]
  >([]);

  useEffect(() => {
    // ! auth: if the user is not logged in, this public home page must not show any private friend data.
    // ! This prevents the "Online friends" panel from displaying mock or unrelated users before login.
    if (status !== "authenticated" || !currentUserId) {
      setOnlineFriends([]);
      return;
    }

    async function fetchOnlineFriends() {
      try {
        setIsLoadingFriends(true);

        // ! Liyuan : replace this endpoint if the final friends API uses another route.
        // ! Expected response shape: an array of friendships containing sender and receiver.
        // ! The current user can be either sender or receiver, so the UI must extract the opposite user.
        const response = await fetch(`/api/friends?userId=${currentUserId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch friends.");
        }

        const friendships = (await response.json()) as ApiFriendship[];

        const friends = friendships
          .map((friendship) => {
            if (friendship.sender.id === currentUserId) {
              return friendship.receiver;
            }

            return friendship.sender;
          })
          .filter((friend) => friend.isOnline);

        setOnlineFriends(friends);
      } catch (error) {
        console.error(error);
        setOnlineFriends([]);
      } finally {
        setIsLoadingFriends(false);
      }
    }

    fetchOnlineFriends();
  }, [status, currentUserId]);

  function handleInviteFriendToGame(friendId: string, displayName: string) {
    const alreadyPending = pendingGameInviteFriendIds.includes(friendId);

    if (alreadyPending) {
      window.alert(t.inviteAlreadyPending);
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

    window.alert(t.inviteSent.replace("{displayName}", displayName));
  }

  if (status === "loading") {
    return (
      <Card className={styles.card}>
        <h2 className={styles.title}>{t.onlineFriends}</h2>
        <p className={styles.description}>{t.checkingSession}</p>
      </Card>
    );
  }

  if (status !== "authenticated") {
    return null;
  }

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>{t.onlineFriends}</h2>
          <p className={styles.description}>
            {t.onlineFriendsDescription}
          </p>
        </div>
      </div>

      {/* //! Liyuan: replace mock online friends with real current user's online friends from auth/database */}
      {/* //! current version: this component now uses session.user.id and /api/friends instead of mockFriends */}
      {isLoadingFriends ? (
        <p className={styles.empty}>{t.loadingOnlineFriends}</p>
      ) : onlineFriends.length > 0 ? (
        <ul className={styles.list}>
          {onlineFriends.map((friend) => {
            const profileHref = `/users/${friend.id}`;
            const displayName = friend.username || t.unknownUser;
            const avatarLetter = displayName.charAt(0).toUpperCase();

            const isGameInvitePending = pendingGameInviteFriendIds.includes(
              friend.id
            );

            const inviteButtonLabel = isGameInvitePending
              ? t.pending 
			  : t.invite;

            return (
              <li key={friend.id} className={styles.item}>
                <Link href={profileHref} className={styles.profileLink}>
                  {friend.image ? (
                    <img
                      className={styles.avatar}
                      src={friend.image}
                      alt={t.avatarAlt.replace("{displayName}", displayName)}
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
                    {t.chat}
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
        <p className={styles.empty}>{t.noFriendsOnline}</p>
      )}

      <Link href="/chat" className={styles.viewAllLink}>
        {t.viewAllFriends}
      </Link>
    </Card>
  );
}
