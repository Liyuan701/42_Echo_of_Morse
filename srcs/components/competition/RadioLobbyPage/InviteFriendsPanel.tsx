"use client";

import { useI18n } from "@/lib/i18n";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Button, Card } from "@/components/ui";
import type { RadioId } from "@/types/competition";
import { useSocket } from "@/providers/socket-provider";
import styles from "@/../app/competition/radio/[radioId]/radio-lobby.module.css";
import {
  GameInvitationActionError,
  useGameInvitationActions,
} from "@/hooks/useGameInvitationActions";
import { getInviteFriendState } from "./invite-friend-state";

type ApiFriend = {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl: string | null;
  isOnline: boolean;
  gameStatus?: "IDLE" | "READY" | "PLAYING" | null;
  lobbyStatus?: "IDLE" | "READY" | "PLAYING" | null;
  currentRadioId?: string | null;
  hasPendingGameInvitation?: boolean;
};

type InviteFriendsPanelProps = {
  radioId: RadioId;
  radioName: string;
  isLobbyFull: boolean;
  lobbyMembershipRevision: number;
};

type InviteFriendItem = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  gameStatus?: "IDLE" | "READY" | "PLAYING" | null;
  lobbyStatus?: "IDLE" | "READY" | "PLAYING" | null;
  currentRadioId?: string | null;
  hasPendingGameInvitation?: boolean;
};

type GameInvitationSocketPayload = {
  status?: string;
  invitation?: {
    status?: string;
    fromUser: { id: string };
    toUser: { id: string };
  };
};

export default function InviteFriendsPanel({
  radioId,
  radioName,
  isLobbyFull,
  lobbyMembershipRevision,
}: InviteFriendsPanelProps) {
	const { dictionary } = useI18n();
	const t = dictionary.competitionRadio;

  const { data: session, status } = useSession();
  const currentUserId = (session?.user as { id?: string } | undefined)?.id;
  const { socket } = useSocket();
  const { sendGameInvitation } = useGameInvitationActions();

  const [realOnlineFriends, setRealOnlineFriends] = useState<
    InviteFriendItem[]
  >([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);
  const [hasTriedRealFriends, setHasTriedRealFriends] = useState(false);
  const [presenceRevision, setPresenceRevision] = useState(0);
  const hasLoadedFriendsRef = useRef(false);
  const [pendingInviteFriendIds, setPendingInviteFriendIds] = useState<
    string[]
  >([]);

  useEffect(() => {
    if (status !== "authenticated" || !currentUserId) {
      setRealOnlineFriends([]);
      setPendingInviteFriendIds([]);
      setHasTriedRealFriends(false);
      hasLoadedFriendsRef.current = false;
      return;
    }

    async function fetchOnlineFriends() {
      try {
        if (!hasLoadedFriendsRef.current) {
          setIsLoadingFriends(true);
        }
        setHasTriedRealFriends(true);

        const [
          friendsResponse,
          sentInvitationsResponse,
          receivedInvitationsResponse,
        ] = await Promise.all([
          fetch(`/api/friends?userId=${currentUserId}`),
          fetch("/api/game/invitations?direction=sent"),
          fetch("/api/game/invitations?direction=received"),
        ]);

        if (
          !friendsResponse.ok ||
          !sentInvitationsResponse.ok ||
          !receivedInvitationsResponse.ok
        ) {
          setRealOnlineFriends([]);
          setPendingInviteFriendIds([]);
          return;
        }

        const friends = (await friendsResponse.json()) as ApiFriend[];
        const sentInvitations = (await sentInvitationsResponse.json()) as {
          toUser: { id: string };
        }[];
        const receivedInvitations =
          (await receivedInvitationsResponse.json()) as {
            fromUser: { id: string };
          }[];

        const onlineFriends = friends
          .filter((friend) => friend.isOnline)
          .map((friend) => ({
            id: friend.id,
            username: friend.username,
            displayName: friend.displayName || friend.username,
            avatarUrl: friend.avatarUrl,
            gameStatus: friend.gameStatus,
            lobbyStatus: friend.lobbyStatus,
            currentRadioId: friend.currentRadioId,
            hasPendingGameInvitation: friend.hasPendingGameInvitation,
          }));

        setRealOnlineFriends(onlineFriends);
        setPendingInviteFriendIds(
          Array.from(
            new Set([
              ...sentInvitations.map((invitation) => invitation.toUser.id),
              ...receivedInvitations.map(
                (invitation) => invitation.fromUser.id
              ),
              ...friends
                .filter((friend) => friend.hasPendingGameInvitation)
                .map((friend) => friend.id),
            ])
          )
        );
      } catch (error) {
        setRealOnlineFriends([]);
      } finally {
        hasLoadedFriendsRef.current = true;
        setIsLoadingFriends(false);
      }
    }

    void fetchOnlineFriends();
  }, [
    status,
    currentUserId,
    radioId,
    presenceRevision,
    lobbyMembershipRevision,
  ]);

  const applyInvitationSocketEvent = useCallback(
    (payload?: GameInvitationSocketPayload) => {
      const invitation = payload?.invitation;

      if (!invitation || !currentUserId) {
        setPresenceRevision((revision) => revision + 1);
        return;
      }

      const otherUserId =
        invitation.fromUser.id === currentUserId
          ? invitation.toUser.id
          : invitation.toUser.id === currentUserId
            ? invitation.fromUser.id
            : null;

      if (!otherUserId) {
        return;
      }

      const invitationStatus = payload?.status ?? invitation.status;

      if (invitationStatus === "pending") {
        setPendingInviteFriendIds((previousIds) =>
          previousIds.includes(otherUserId)
            ? previousIds
            : [...previousIds, otherUserId]
        );
        return;
      }

      setPendingInviteFriendIds((previousIds) =>
        previousIds.filter((id) => id !== otherUserId)
      );
    },
    [currentUserId]
  );

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleStateChange = () => {
      setPresenceRevision((revision) => revision + 1);
    };

    socket.on("connect", handleStateChange);
    socket.on("sync:required", handleStateChange);
    socket.on("online-users", handleStateChange);
    socket.on("game-invitation:new", applyInvitationSocketEvent);
    socket.on("game-invitation:updated", applyInvitationSocketEvent);
    socket.on("game-invitation:answered", applyInvitationSocketEvent);
    socket.on("friend:presence-updated", handleStateChange);
    socket.on("radio:user-list-updated", handleStateChange);
    socket.on("radio:ready-list-updated", handleStateChange);

    return () => {
      socket.off("connect", handleStateChange);
      socket.off("sync:required", handleStateChange);
      socket.off("online-users", handleStateChange);
      socket.off("game-invitation:new", applyInvitationSocketEvent);
      socket.off("game-invitation:updated", applyInvitationSocketEvent);
      socket.off("game-invitation:answered", applyInvitationSocketEvent);
      socket.off("friend:presence-updated", handleStateChange);
      socket.off("radio:user-list-updated", handleStateChange);
      socket.off("radio:ready-list-updated", handleStateChange);
    };
  }, [applyInvitationSocketEvent, socket]);

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        setPresenceRevision((revision) => revision + 1);
      }
    }

    window.addEventListener("visibilitychange", handleVisibilityChange);

    return () => window.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [status]);

  const friendsToDisplay = useMemo(() => {
    return status === "authenticated" ? realOnlineFriends : [];
  }, [status, realOnlineFriends]);

  function markFriendAsPending(friendId: string) {
    setPendingInviteFriendIds((previousIds) =>
      previousIds.includes(friendId)
        ? previousIds
        : [...previousIds, friendId]
    );
  }

  async function handleInviteFriend(friend: InviteFriendItem) {
    const inviteState = getInviteFriendState({
      isLobbyFull,
      isPending: pendingInviteFriendIds.includes(friend.id),
      currentRadioId: friend.currentRadioId,
      targetRadioId: radioId,
      gameStatus: friend.gameStatus,
      lobbyStatus: friend.lobbyStatus,
    });

    if (inviteState.disabled) {
      return;
    }

    try {
      await sendGameInvitation({
        toUserId: friend.id,
        radioId,
        redirectAfterSend: false,
      });

      markFriendAsPending(friend.id);
    } catch (error) {
      if (error instanceof GameInvitationActionError && error.status === 409) {
        setPresenceRevision((revision) => revision + 1);
        window.alert(error.message);
        return;
      }
		window.alert(t.failedToSendInvitation);
    }
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
            {t.inviteFriends}
          </h2>
          <p className={styles.panelText}>
            {isLobbyFull
				? t.lobbyFullInviteClosed.replace("{radioName}", radioName)
				: t.inviteFriendsDescription.replace("{radioName}", radioName)}
          </p>
        </div>
      </div>

      {isLoadingFriends ? (
        <p className={styles.emptyState}>{t.loadingOnlineFriends}</p>
      ) : friendsToDisplay.length === 0 ? (
        <p className={styles.emptyState}>
          {hasTriedRealFriends
            ? t.noOnlineFriend
			: t.signInToInvite
			}
        </p>
      ) : (
        <div className={styles.friendList}>
          {friendsToDisplay.map((friend) => {
            const inviteState = getInviteFriendState({
              isLobbyFull,
              isPending: pendingInviteFriendIds.includes(friend.id),
              currentRadioId: friend.currentRadioId,
              targetRadioId: radioId,
              gameStatus: friend.gameStatus,
              lobbyStatus: friend.lobbyStatus,
            });
            const avatarLetter =
              friend.displayName.charAt(0).toUpperCase() || "?";

            return (
              <article key={friend.id} className={styles.friendCard}>
                {friend.avatarUrl ? (
                  <img
                    className={styles.avatarImage}
                    src={friend.avatarUrl}
                    alt={t.avatarAlt.replace("{displayName}", friend.displayName)}
                  />
                ) : (
                  <span className={styles.avatarFallback} aria-hidden="true">
                    {avatarLetter}
                  </span>
                )}

                <div className={styles.friendMeta}>
                  <p className={styles.username}>{friend.displayName}</p>
                  <p className={styles.statusLabel}>{t.onlineFriend}</p>
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={inviteState.disabled}
                  onClick={() => handleInviteFriend(friend)}
                >
                  {inviteState.reason === "lobby-full"
                    ? t.lobbyFull
                    : inviteState.reason === "in-lobby"
                      ? t.inLobby
                      : inviteState.reason === "pending"
                        ? t.invited
                        : t.invite}
                </Button>
              </article>
            );
          })}
        </div>
      )}

      <p className={styles.inviteHint}>
        {t.inviteHint}
      </p>
    </Card>
  );
}
