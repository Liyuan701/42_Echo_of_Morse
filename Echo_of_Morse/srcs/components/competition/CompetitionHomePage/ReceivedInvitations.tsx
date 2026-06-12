"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button, Card } from "@/components/ui";
import { useSocket } from "@/providers/socket-provider";
import styles from "@/../app/competition/competition.module.css";

type GameInvitation = {
  id: string;
  fromUser: {
    id: string;
    username: string;
    image: string | null;
  };
  radio: {
    radioId: string;
    name: string;
  } | null;
};

export default function ReceivedInvitations() {
  const router = useRouter();
  const { status } = useSession();
  const { socket } = useSocket();
  const [invitations, setInvitations] = useState<GameInvitation[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadInvitations = useCallback(async () => {
    if (status !== "authenticated") {
      setInvitations([]);
      return;
    }

    const response = await fetch(
      "/api/game/invitations?direction=received",
      { cache: "no-store" }
    );

    if (!response.ok) {
      return;
    }

    setInvitations((await response.json()) as GameInvitation[]);
  }, [status]);

  // TODO Modify after socket notifications are reliable.
  // Temporary polling fallback. The Competition page checks PostgreSQL every
  // 5 seconds because game invitation socket notifications are not reliable.
  // Once "game-invitation:new" works consistently, remove this interval and
  // keep only the initial load plus the socket listener below.
  useEffect(() => {
    loadInvitations();

    const intervalId = window.setInterval(loadInvitations, 5000);
    return () => window.clearInterval(intervalId);
  }, [loadInvitations]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    function handleNewInvitation() {
      loadInvitations();
    }

    socket.on("game-invitation:new", handleNewInvitation);
    return () => {
      socket.off("game-invitation:new", handleNewInvitation);
    };
  }, [loadInvitations, socket]);

  async function answerInvitation(
    invitation: GameInvitation,
    action: "accept" | "decline"
  ) {
    setUpdatingId(invitation.id);

    try {
      const response = await fetch(
        `/api/game/invitations/${invitation.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        }
      );
      const body = (await response.json()) as {
        error?: string;
        radio?: { radioId: string } | null;
      };

      if (!response.ok) {
        throw new Error(body.error || "Failed to answer invitation.");
      }

      setInvitations((current) =>
        current.filter((item) => item.id !== invitation.id)
      );

      if (action === "accept" && body.radio) {
        router.push(`/competition/radio/${body.radio.radioId}`);
      }

      socket?.emit("game-invitation:answered", {
        toUserId: invitation.fromUser.id,
        invitationId: invitation.id,
        status: action === "accept" ? "accepted" : "declined",
      });
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to answer invitation."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  if (status !== "authenticated" || invitations.length === 0) {
    return null;
  }

  return (
    <Card className={styles.invitationPanel} aria-labelledby="game-invitations">
      <h2 id="game-invitations" className={styles.cardTitle}>
        Game Invitations
      </h2>

      <div className={styles.invitationList}>
        {invitations.map((invitation) => (
          <article key={invitation.id} className={styles.invitationItem}>
            <div>
              <strong>{invitation.fromUser.username}</strong>
              <p>
                invited you to{" "}
                {invitation.radio?.name ?? "a radio lobby"}.
              </p>
            </div>

            <div className={styles.invitationActions}>
              <Button
                type="button"
                size="sm"
                disabled={updatingId === invitation.id || !invitation.radio}
                onClick={() => answerInvitation(invitation, "accept")}
              >
                Accept
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={updatingId === invitation.id}
                onClick={() => answerInvitation(invitation, "decline")}
              >
                Decline
              </Button>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}
