// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useSession } from "next-auth/react";
// import { Button, Card } from "@/components/ui";
// import type { RadioId } from "@/types/competition";
// import { useSocket } from "@/providers/socket-provider";
// import styles from "@/../app/competition/radio/[radioId]/radio-lobby.module.css";

// type ApiFriend = {
//   id: string;
//   username: string;
//   displayName?: string;
//   avatarUrl: string | null;
//   isOnline: boolean;
// };

// type InviteFriendsPanelProps = {
//   radioId: RadioId;
//   radioName: string;
//   isLobbyFull: boolean;
// };

// type InviteFriendItem = {
//   id: string;
//   username: string;
//   displayName: string;
//   avatarUrl: string | null;
// };

// export default function InviteFriendsPanel({
//   radioId,
//   radioName,
//   isLobbyFull,
// }: InviteFriendsPanelProps) {
//   const { data: session, status } = useSession();
//   const currentUserId = (session?.user as { id?: string } | undefined)?.id;
//   const { socket } = useSocket();

//   const [realOnlineFriends, setRealOnlineFriends] = useState<
//     InviteFriendItem[]
//   >([]);
//   const [isLoadingFriends, setIsLoadingFriends] = useState(false);
//   const [hasTriedRealFriends, setHasTriedRealFriends] = useState(false);
//   const [presenceRevision, setPresenceRevision] = useState(0);
//   const [pendingInviteFriendIds, setPendingInviteFriendIds] = useState<
//     string[]
//   >([]);

//   useEffect(() => {
//     if (status !== "authenticated" || !currentUserId) {
//       setRealOnlineFriends([]);
//       setHasTriedRealFriends(false);
//       return;
//     }

//     async function fetchOnlineFriends() {
//       try {
//         setIsLoadingFriends(true);
//         setHasTriedRealFriends(true);

//         const [friendsResponse, invitationsResponse] = await Promise.all([
//           fetch(`/api/friends?userId=${currentUserId}`),
//           fetch(
//             `/api/game/invitations?direction=sent&radioId=${encodeURIComponent(
//               radioId
//             )}`
//           ),
//         ]);

//         if (!friendsResponse.ok || !invitationsResponse.ok) {
//           throw new Error("Failed to fetch friends.");
//         }

//         const friends = (await friendsResponse.json()) as ApiFriend[];
//         const invitations = (await invitationsResponse.json()) as {
//           toUser: { id: string };
//         }[];

//         const onlineFriends = friends
//           .filter((friend) => friend.isOnline)
//           .map((friend) => ({
//             id: friend.id,
//             username: friend.username,
//             displayName: friend.displayName || friend.username,
//             avatarUrl: friend.avatarUrl,
//           }));

//         setRealOnlineFriends(onlineFriends);
//         setPendingInviteFriendIds(
//           invitations.map((invitation) => invitation.toUser.id)
//         );
//       } catch (error) {
//         console.error(error);
//         setRealOnlineFriends([]);
//       } finally {
//         setIsLoadingFriends(false);
//       }
//     }

//     fetchOnlineFriends();
//   }, [status, currentUserId, radioId, presenceRevision]);

//   useEffect(() => {
//     if (!socket) {
//       return;
//     }

//     // Re-read the API snapshot when the socket announces a presence change.
//     const handleOnlineUsers = () => {
//       setPresenceRevision((revision) => revision + 1);
//     };

//     socket.on("online-users", handleOnlineUsers);

//     return () => {
//       socket.off("online-users", handleOnlineUsers);
//     };
//   }, [socket]);

//   const friendsToDisplay = useMemo(() => {
//     return status === "authenticated" ? realOnlineFriends : [];
//   }, [status, realOnlineFriends]);

//   async function handleInviteFriend(friend: InviteFriendItem) {
//     if (isLobbyFull) {
//       return;
//     }

//     const alreadyPending = pendingInviteFriendIds.includes(friend.id);

//     if (alreadyPending) {
//       return;
//     }

//     try {
//       const response = await fetch("/api/game/invitations", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           toUserId: friend.id,
//           radioId,
//         }),
//       });
//       const body = (await response.json()) as {
//         id?: string;
//         error?: string;
//       };

//       if (!response.ok || !body.id) {
//         throw new Error(body.error || "Failed to send invitation.");
//       }

//       setPendingInviteFriendIds((previousIds) => [
//         ...previousIds,
//         friend.id,
//       ]);

//       socket?.emit("game-invitation:send", {
//         toUserId: friend.id,
//         invitationId: body.id,
//       });
//     } catch (error) {
//       window.alert(
//         error instanceof Error ? error.message : "Failed to send invitation."
//       );
//     }
//   }

//   return (
//     <Card
//       className={styles.panel}
//       role="complementary"
//       aria-labelledby="invite-friends"
//     >
//       <div className={styles.panelHeader}>
//         <div>
//           <h2 id="invite-friends" className={styles.panelTitle}>
//             Invite Friends
//           </h2>
//           <p className={styles.panelText}>
//             {isLobbyFull
//               ? `${radioName} is full, so new invitations are closed for now.`
//               : `Invite online friends to join ${radioName}. The invitation brings them to this lobby, not directly into a game session.`}
//           </p>
//         </div>
//       </div>

//       {isLoadingFriends ? (
//         <p className={styles.emptyState}>Loading online friends...</p>
//       ) : friendsToDisplay.length === 0 ? (
//         <p className={styles.emptyState}>
//           {hasTriedRealFriends
//             ? "No online friend is available right now."
//             : "Sign in to invite online friends."}
//         </p>
//       ) : (
//         <div className={styles.friendList}>
//           {friendsToDisplay.map((friend) => {
//             const alreadyInvited = pendingInviteFriendIds.includes(friend.id);
//             const avatarLetter =
//               friend.displayName.charAt(0).toUpperCase() || "?";

//             return (
//               <article key={friend.id} className={styles.friendCard}>
//                 {friend.avatarUrl ? (
//                   <img
//                     className={styles.avatarImage}
//                     src={friend.avatarUrl}
//                     alt={`${friend.displayName} avatar`}
//                   />
//                 ) : (
//                   <span className={styles.avatarFallback} aria-hidden="true">
//                     {avatarLetter}
//                   </span>
//                 )}

//                 <div className={styles.friendMeta}>
//                   <p className={styles.username}>{friend.displayName}</p>
//                   <p className={styles.statusLabel}>Online friend</p>
//                 </div>

//                 <Button
//                   type="button"
//                   variant="secondary"
//                   size="sm"
//                   disabled={alreadyInvited || isLobbyFull}
//                   onClick={() => handleInviteFriend(friend)}
//                 >
//                   {isLobbyFull ? "Full" : alreadyInvited ? "Invited" : "Invite"}
//                 </Button>
//               </article>
//             );
//           })}
//         </div>
//       )}

//       <p className={styles.inviteHint}>
//         Invitations are stored in the database and lead to this radio lobby.
//       </p>
//     </Card>
//   );
// }

"use client";

import { useI18n } from "@/lib/i18n";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Button, Card } from "@/components/ui";
import type { RadioId } from "@/types/competition";
import { useSocket } from "@/providers/socket-provider";
import styles from "@/../app/competition/radio/[radioId]/radio-lobby.module.css";
import {
  GameInvitationActionError,
  useGameInvitationActions,
} from "@/hooks/useGameInvitationActions";

type ApiFriend = {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl: string | null;
  isOnline: boolean;
};

type InviteFriendsPanelProps = {
  radioId: RadioId;
  radioName: string;
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
  isLobbyFull,
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

        const [friendsResponse, invitationsResponse] = await Promise.all([
          fetch(`/api/friends?userId=${currentUserId}`),
          fetch(
            `/api/game/invitations?direction=sent&radioId=${encodeURIComponent(
              radioId
            )}`
          ),
        ]);

        if (!friendsResponse.ok || !invitationsResponse.ok) {
          throw new Error(t.failedToFetchFriends);
        }

        const friends = (await friendsResponse.json()) as ApiFriend[];
        const invitations = (await invitationsResponse.json()) as {
          toUser: { id: string };
        }[];

        const onlineFriends = friends
          .filter((friend) => friend.isOnline)
          .map((friend) => ({
            id: friend.id,
            username: friend.username,
            displayName: friend.displayName || friend.username,
            avatarUrl: friend.avatarUrl,
          }));

        setRealOnlineFriends(onlineFriends);
        setPendingInviteFriendIds(
          invitations.map((invitation) => invitation.toUser.id)
        );
      } catch (error) {
        console.error(error);
        setRealOnlineFriends([]);
      } finally {
        setIsLoadingFriends(false);
      }
    }

    void fetchOnlineFriends();
  }, [status, currentUserId, radioId, presenceRevision]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleOnlineUsers = () => {
      setPresenceRevision((revision) => revision + 1);
    };

    socket.on("online-users", handleOnlineUsers);

    return () => {
      socket.off("online-users", handleOnlineUsers);
    };
  }, [socket]);

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
    if (isLobbyFull) {
      return;
    }

    const alreadyPending = pendingInviteFriendIds.includes(friend.id);

    if (alreadyPending) {
      return;
    }

    try {
      await sendGameInvitation({
        toUserId: friend.id,
        radioId,
        joinLobbyBeforeSend: false,
        redirectAfterSend: false,
      });

      markFriendAsPending(friend.id);
    } catch (error) {
      if (error instanceof GameInvitationActionError && error.status === 409) {
        markFriendAsPending(friend.id);
      }

      window.alert(
        error instanceof Error ? error.message : t.failedToSendInvitation
      );
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
            const alreadyInvited = pendingInviteFriendIds.includes(friend.id);
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
                  disabled={alreadyInvited || isLobbyFull}
                  onClick={() => handleInviteFriend(friend)}
                >
                  {isLobbyFull ? t.lobbyFull : alreadyInvited ? t.invited : t.invite}
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