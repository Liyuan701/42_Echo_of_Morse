// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { Card, Button } from "@/components/ui";
// import styles from "./online-friend.module.css";
// import { useI18n } from "@/lib/i18n";
// import { useSocket } from "@/providers/socket-provider";
// import RadioWavePickerModal from "@/components/competition/RadioLobbyPage/RadioWavePickerModal";
// import type { RadioId } from "@/types/competition";


// type ApiFriend = {
//   id: string;
//   username: string;
//   avatarUrl: string | null;
//   isOnline: boolean;
// };

// type OnlineFriend = {
//   id: string;
//   username: string;
//   avatarUrl: string | null;
//   isOnline: boolean;
// };

// export default function OnlineFriendsPreview() {
// 	const { dictionary } = useI18n();
// 	const t = dictionary.home;

//   const { data: session, status } = useSession();
//   const { socket } = useSocket();
//   const router = useRouter();

//   const currentUserId = (session?.user as { id?: string } | undefined)?.id;

//   const [onlineFriends, setOnlineFriends] = useState<OnlineFriend[]>([]);
//   const [isLoadingFriends, setIsLoadingFriends] = useState(false);
//   const [presenceRevision, setPresenceRevision] = useState(0);

//   const [pendingGameInviteFriendIds, setPendingGameInviteFriendIds] = useState<
//     string[]
//   >([]);
//   const [inviteTargetFriendId, setInviteTargetFriendId] = useState<
//     string | null
//   >(null);

//   useEffect(() => {
//     // ! auth: if the user is not logged in, this public home page must not show any private friend data.
//     // ! This prevents the "Online friends" panel from displaying mock or unrelated users before login.
//     if (status !== "authenticated" || !currentUserId) {
//       setOnlineFriends([]);
//       return;
//     }

//     async function fetchOnlineFriends() {
//       try {
//         setIsLoadingFriends(true);
//         const [friendsResponse, invitationsResponse] = await Promise.all([
//           fetch(`/api/friends?userId=${currentUserId}`),
//           fetch("/api/game/invitations?direction=sent"),
//         ]);

//         if (!friendsResponse.ok || !invitationsResponse.ok) {
//           throw new Error("Failed to fetch friends.");
//         }

//         const friends = (await friendsResponse.json()) as ApiFriend[];
//         const invitations = (await invitationsResponse.json()) as {
//           toUser: { id: string };
//         }[];
//         const onlineOnly = friends.filter((f) => f.isOnline);

//         setOnlineFriends(onlineOnly);
//         setPendingGameInviteFriendIds([
//           ...new Set(
//             invitations.map((invitation) => invitation.toUser.id)
//           ),
//         ]);
//       } catch (error) {
//         console.error(error);
//         setOnlineFriends([]);
//       } finally {
//         setIsLoadingFriends(false);
//       }
//     }

//     fetchOnlineFriends();
//   }, [status, currentUserId, presenceRevision]);

//   useEffect(() => {
//     if (!socket) {
//       return;
//     }

//     // Re-read online friends whenever the socket presence list changes.
//     const handleOnlineUsers = () => {
//       setPresenceRevision((revision) => revision + 1);
//     };

//     socket.on("online-users", handleOnlineUsers);

//     return () => {
//       socket.off("online-users", handleOnlineUsers);
//     };
//   }, [socket]);

//   function handleInviteFriendToGame(friendId: string) {
//     const alreadyPending = pendingGameInviteFriendIds.includes(friendId);

//     if (alreadyPending) {
//       window.alert(t.inviteAlreadyPending);
//       return;
//     }

//     setInviteTargetFriendId(friendId);
//   }

//   async function handleSelectInviteRadio(radioId: RadioId) {
//     const invited = onlineFriends.find(
//       (friend) => friend.id === inviteTargetFriendId
//     );

//     if (!invited) {
//       setInviteTargetFriendId(null);
//       return;
//     }

//     try {
//       const joinResponse = await fetch(
//         `/api/competition/radio/${radioId}`,
//         { method: "POST" }
//       );
//       const joinBody = (await joinResponse.json()) as { error?: string };

//       if (!joinResponse.ok) {
//         throw new Error(joinBody.error || "Failed to join the radio lobby.");
//       }

//       const invitationResponse = await fetch("/api/game/invitations", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           toUserId: invited.id,
//           radioId,
//         }),
//       });
//       const invitation = (await invitationResponse.json()) as {
//         id?: string;
//         error?: string;
//       };

//       if (!invitationResponse.ok || !invitation.id) {
//         throw new Error(invitation.error || "Failed to send invitation.");
//       }

//       setPendingGameInviteFriendIds((current) => [
//         ...current,
//         invited.id,
//       ]);

//       socket?.emit("game-invitation:send", {
//         toUserId: invited.id,
//         invitationId: invitation.id,
//       });

//       setInviteTargetFriendId(null);
//       router.push(`/competition/radio/${radioId}`);
//     } catch (error) {
//       window.alert(
//         error instanceof Error ? error.message : "Failed to send invitation."
//       );
//     }
//   }

//   if (status === "loading") {
//     return (
//       <Card className={styles.card}>
//         <h2 className={styles.title}>{t.onlineFriends}</h2>
//         <p className={styles.description}>{t.checkingSession}</p>
//       </Card>
//     );
//   }

//   if (status !== "authenticated") {
//     return null;
//   }

//   return (
//     <Card className={styles.card}>
//       <div className={styles.header}>
//         <div>
//           <h2 className={styles.title}>{t.onlineFriends}</h2>
//           <p className={styles.description}>
//             {t.onlineFriendsDescription}
//           </p>
//         </div>
//       </div>

//       {isLoadingFriends ? (
//         <p className={styles.empty}>{t.loadingOnlineFriends}</p>
//       ) : onlineFriends.length > 0 ? (
//         <ul className={styles.list}>
//           {onlineFriends.map((friend) => {
//             const profileHref = `/users/${friend.id}`;
//             const displayName = friend.username || t.unknownUser;
//             const avatarLetter = displayName.charAt(0).toUpperCase();

//             const isGameInvitePending = pendingGameInviteFriendIds.includes(
//               friend.id
//             );

//             const inviteButtonLabel = isGameInvitePending
//               ? t.pending 
// 			  : t.invite;

//             return (
//               <li key={friend.id} className={styles.item}>
//                 <Link href={profileHref} className={styles.profileLink}>
//                   {friend.avatarUrl ? (
//                     <img
//                       className={styles.avatar}
//                       src={friend.avatarUrl}
//                       alt={`${displayName}'s avatar`}
//                     />
//                   ) : (
//                     <span className={styles.avatarFallback}>
//                       {avatarLetter}
//                     </span>
//                   )}

//                   <span className={styles.identity}>
//                     <span className={styles.name}>{displayName}</span>
//                     <span className={styles.username}>@{friend.username}</span>
//                   </span>
//                 </Link>

//                 <div className={styles.actions}>
//                   <Link
//                     href={`/chat?friendId=${encodeURIComponent(friend.id)}`}
//                     className={styles.chatLink}
//                   >
//                     {t.chat}
//                   </Link>

//                   <Button
//                     type="button"
//                     variant="secondary"
//                     disabled={isGameInvitePending}
//                     onClick={() => handleInviteFriendToGame(friend.id)}
//                   >
//                     {inviteButtonLabel}
//                   </Button>
//                 </div>
//               </li>
//             );
//           })}
//         </ul>
//       ) : (
//         <p className={styles.empty}>{t.noFriendsOnline}</p>
//       )}

//       <Link href="/chat" className={styles.viewAllLink}>
//         {t.viewAllFriends}
//       </Link>

//       <RadioWavePickerModal
//         isOpen={inviteTargetFriendId !== null}
//         targetDisplayName={
//           onlineFriends.find(
//             (friend) => friend.id === inviteTargetFriendId
//           )?.username ?? ""
//         }
//         onClose={() => setInviteTargetFriendId(null)}
//         onSelectRadio={handleSelectInviteRadio}
//       />
//     </Card>
//   );
// }

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, Button } from "@/components/ui";
import styles from "./online-friend.module.css";
import { useI18n } from "@/lib/i18n";
import { useSocket } from "@/providers/socket-provider";
import RadioWavePickerModal from "@/components/competition/RadioLobbyPage/RadioWavePickerModal";
import type { RadioId } from "@/types/competition";
import {
  GameInvitationActionError,
  useGameInvitationActions,
} from "@/hooks/useGameInvitationActions";

type ApiFriend = {
  id: string;
  username: string;
  avatarUrl: string | null;
  isOnline: boolean;
};

type OnlineFriend = {
  id: string;
  username: string;
  avatarUrl: string | null;
  isOnline: boolean;
};

type SentGameInvitation = {
  toUser: { id: string };
};

type ReceivedGameInvitation = {
  fromUser: { id: string };
};

export default function OnlineFriendsPreview() {
  const { dictionary } = useI18n();
  const t = dictionary.home;

  const { data: session, status } = useSession();
  const { socket } = useSocket();
  const { sendGameInvitation } = useGameInvitationActions();

  const currentUserId = (session?.user as { id?: string } | undefined)?.id;

  const [onlineFriends, setOnlineFriends] = useState<OnlineFriend[]>([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);
  const [presenceRevision, setPresenceRevision] = useState(0);

  const [pendingGameInviteFriendIds, setPendingGameInviteFriendIds] = useState<
    string[]
  >([]);
  const [inviteTargetFriendId, setInviteTargetFriendId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (status !== "authenticated" || !currentUserId) {
      setOnlineFriends([]);
      setPendingGameInviteFriendIds([]);
      return;
    }

    async function fetchOnlineFriends() {
      try {
        setIsLoadingFriends(true);

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
          throw new Error("Failed to fetch friends.");
        }

        const friends = (await friendsResponse.json()) as ApiFriend[];
        const sentInvitations =
          (await sentInvitationsResponse.json()) as SentGameInvitation[];
        const receivedInvitations =
          (await receivedInvitationsResponse.json()) as ReceivedGameInvitation[];

        const onlineOnly = friends.filter((friend) => friend.isOnline);

        setOnlineFriends(onlineOnly);
        setPendingGameInviteFriendIds([
          ...new Set([
            ...sentInvitations.map((invitation) => invitation.toUser.id),
            ...receivedInvitations.map(
              (invitation) => invitation.fromUser.id
            ),
          ]),
        ]);
      } catch (error) {
        console.error(error);
        setOnlineFriends([]);
      } finally {
        setIsLoadingFriends(false);
      }
    }

    void fetchOnlineFriends();
  }, [status, currentUserId, presenceRevision]);

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

  function markFriendAsPending(friendId: string) {
    setPendingGameInviteFriendIds((current) =>
      current.includes(friendId) ? current : [...current, friendId]
    );
  }

  function handleInviteFriendToGame(friendId: string) {
    const alreadyPending = pendingGameInviteFriendIds.includes(friendId);

    if (alreadyPending) {
      window.alert(t.inviteAlreadyPending);
      return;
    }

    setInviteTargetFriendId(friendId);
  }

  async function handleSelectInviteRadio(radioId: RadioId) {
    const invited = onlineFriends.find(
      (friend) => friend.id === inviteTargetFriendId
    );

    if (!invited) {
      setInviteTargetFriendId(null);
      return;
    }

    try {
      await sendGameInvitation({
        toUserId: invited.id,
        radioId,
        joinLobbyBeforeSend: false,
        redirectAfterSend: false,
      });

      markFriendAsPending(invited.id);
      setInviteTargetFriendId(null);
    } catch (error) {
      if (error instanceof GameInvitationActionError && error.status === 409) {
        markFriendAsPending(invited.id);
      }

      window.alert(
        error instanceof Error ? error.message : "Failed to send invitation."
      );
    }
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
          <p className={styles.description}>{t.onlineFriendsDescription}</p>
        </div>
      </div>

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
                  <Link
                    href={`/chat?friendId=${encodeURIComponent(friend.id)}`}
                    className={styles.chatLink}
                  >
                    {t.chat}
                  </Link>

                  <Button
                    type="button"
                    variant="secondary"
                    disabled={isGameInvitePending}
                    onClick={() => handleInviteFriendToGame(friend.id)}
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

      <RadioWavePickerModal
        isOpen={inviteTargetFriendId !== null}
        targetDisplayName={
          onlineFriends.find((friend) => friend.id === inviteTargetFriendId)
            ?.username ?? ""
        }
        onClose={() => setInviteTargetFriendId(null)}
        onSelectRadio={handleSelectInviteRadio}
      />
    </Card>
  );
}
