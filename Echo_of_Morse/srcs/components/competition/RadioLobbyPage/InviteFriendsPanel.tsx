"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Button, Card } from "@/components/ui";
import type {
  ApiFriend,
  RadioId,
  RadioUser,
} from "../mockData/competitionTypes";
import styles from "@/../app/competition/radio/[radioId]/radio-lobby.module.css";

type InviteFriendsPanelProps = {
  radioId: RadioId;
  radioName: string;
  mockFriends: RadioUser[];
  isLobbyFull: boolean;
};

type InviteFriendItem = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
};

export default function InviteFriendsPanel({
  radioId,
  radioName,
  mockFriends,
  isLobbyFull,
}: InviteFriendsPanelProps) {
  const { data: session, status } = useSession();
  const currentUserId = (session?.user as { id?: string } | undefined)?.id;

  const [realOnlineFriends, setRealOnlineFriends] = useState<
    InviteFriendItem[]
  >([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);
  const [hasTriedRealFriends, setHasTriedRealFriends] = useState(false);
  const [pendingInviteFriendIds, setPendingInviteFriendIds] = useState<
    string[]
  >([]);

  useEffect(() => {
    if (status !== "authenticated" || !currentUserId) {
      setRealOnlineFriends([]);
      setHasTriedRealFriends(false);
      return;
    }

    async function fetchOnlineFriends() {
      try {
        setIsLoadingFriends(true);
        setHasTriedRealFriends(true);

        const response = await fetch(`/api/friends?userId=${currentUserId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch friends.");
        }

        const friends = (await response.json()) as ApiFriend[];

        const onlineFriends = friends
          .filter((friend) => friend.isOnline)
          .map((friend) => ({
            id: friend.id,
            username: friend.username,
            displayName: friend.displayName || friend.username,
            avatarUrl: friend.avatarUrl,
          }));

        setRealOnlineFriends(onlineFriends);
      } catch (error) {
        console.error(error);
        setRealOnlineFriends([]);
      } finally {
        setIsLoadingFriends(false);
      }
    }

    fetchOnlineFriends();
  }, [status, currentUserId]);

  const mockFriendItems = useMemo<InviteFriendItem[]>(
    () =>
      mockFriends.map((friend) => ({
        id: friend.id,
        username: friend.username,
        displayName: friend.displayName,
        avatarUrl: friend.avatarUrl,
      })),
    [mockFriends]
  );

  const friendsToDisplay = useMemo(() => {
    if (status === "authenticated") {
      return realOnlineFriends;
    }

    return mockFriendItems;
  }, [status, realOnlineFriends, mockFriendItems]);

  function handleInviteFriend(friend: InviteFriendItem) {
    if (isLobbyFull) {
      return;
    }

    const alreadyPending = pendingInviteFriendIds.includes(friend.id);

    if (alreadyPending) {
      return;
    }

    setPendingInviteFriendIds((previousIds) => [...previousIds, friend.id]);

    // TODO backend / socket:
    //! Liyuan
    // Backend/socket note:
    // This is only a local pending state for the frontend prototype. No API
    // request is sent and no socket event is emitted yet, so the receiver will
    // not actually be notified until the backend/socket integration is added.
    //
    // This invitation should invite a friend to the current radio lobby,
    // not directly into a game session.
    //
    // Expected payload:
    // {
    //   targetFriendId: friend.id,
    //   radioId,
    //   inviteType: "radio-lobby"
    // }
    //
    // Possible future API:
    // POST /api/game-invitations
    //
    // Possible future socket event:
    // socket.emit("radio:invite-friend", {
    //   toUserId: friend.id,
    //   radioId,
    // });
  }

  return (
    <Card
      className={styles.panel}
      role="complementary"
      aria-labelledby="invite-friends"
    >
      <div className={styles.panelHeader}>
        <div>
          <h2 id="invite-friends" className={styles.panelTitle}>
            Invite Friends
          </h2>
          <p className={styles.panelText}>
            {isLobbyFull
              ? `${radioName} is full, so new invitations are closed for now.`
              : `Invite online friends to join ${radioName}. The invitation brings them to this lobby, not directly into a game session.`}
          </p>
        </div>
      </div>

      {isLoadingFriends ? (
        <p className={styles.emptyState}>Loading online friends...</p>
      ) : friendsToDisplay.length === 0 ? (
        <p className={styles.emptyState}>
          {hasTriedRealFriends
            ? "No online friend is available right now."
            : "No mock friend is available in this lobby."}
        </p>
      ) : (
        <div className={styles.friendList}>
          {friendsToDisplay.map((friend) => {
            const alreadyInvited = pendingInviteFriendIds.includes(friend.id);
            const avatarLetter =
              friend.displayName.charAt(0).toUpperCase() || "?";

            return (
              <article key={friend.id} className={styles.friendCard}>
                {friend.avatarUrl ? (
                  <img
                    className={styles.avatarImage}
                    src={friend.avatarUrl}
                    alt={`${friend.displayName} avatar`}
                  />
                ) : (
                  <span className={styles.avatarFallback} aria-hidden="true">
                    {avatarLetter}
                  </span>
                )}

                <div className={styles.friendMeta}>
                  <p className={styles.username}>{friend.displayName}</p>
                  <p className={styles.statusLabel}>Online friend</p>
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={alreadyInvited || isLobbyFull}
                  onClick={() => handleInviteFriend(friend)}
                >
                  {isLobbyFull ? "Full" : alreadyInvited ? "Invited" : "Invite"}
                </Button>
              </article>
            );
          })}
        </div>
      )}

      <p className={styles.inviteHint}>
        Temporary logic: authenticated users try to load real online friends
        from /api/friends. Visitors see mock friends from the radio lobby.
      </p>
    </Card>
  );
}
