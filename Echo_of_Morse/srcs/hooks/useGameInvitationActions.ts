"use client";

import { useI18n } from "@/lib/i18n";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSocket } from "@/providers/socket-provider";
import { useNotifications } from "@/components/notifications/NotificationProvider";
import type { RadioId } from "@/types/competition";

type ApiRadio = {
  radioId?: string;
  name?: string;
} | null;

type SendGameInvitationResult = {
  id?: string;
  error?: string;
  radio?: ApiRadio;
  [key: string]: unknown;
};

type AnswerGameInvitationResult = {
  id?: string;
  status?: string;
  error?: string;
  radio?: ApiRadio;
  [key: string]: unknown;
};

type SendGameInvitationArgs = {
  toUserId: string;
  radioId: RadioId;
  joinLobbyBeforeSend?: boolean;
  redirectAfterSend?: boolean;
};

type AnswerGameInvitationArgs = {
  invitationId: string;
  action: "accept" | "decline";
  fallbackRadioId?: string;
  fromUserId?: string;
  redirectOnAccept?: boolean;
};

export class GameInvitationActionError extends Error {
  status?: number;
  body?: unknown;

  constructor(message: string, status?: number, body?: unknown) {
    super(message);
    this.name = "GameInvitationActionError";
    this.status = status;
    this.body = body;
  }
}

async function readJsonSafely<T>(response: Response): Promise<T> {
  try {
    return (await response.json()) as T;
  } catch {
    return {} as T;
  }
}

function getActionStatus(action: "accept" | "decline") {
  return action === "accept" ? "accepted" : "declined";
}

export function useGameInvitationActions() {
	const { dictionary } = useI18n();
	const t = dictionary.competitionRadio;

  const router = useRouter();
  const { data: session } = useSession();
  const { socket } = useSocket();
  const {
    removeGameInvitation,
    refreshNotifications,
  } = useNotifications();

  const currentUserId = session?.user?.id;

  const sendGameInvitation = useCallback(
    async ({
      toUserId,
      radioId,
      joinLobbyBeforeSend = false,
      redirectAfterSend = false,
    }: SendGameInvitationArgs) => {
      if (joinLobbyBeforeSend) {
        const joinResponse = await fetch(`/api/competition/radio/${radioId}`, {
          method: "POST",
        });

        const joinBody = await readJsonSafely<{ error?: string }>(
          joinResponse
        );

        if (!joinResponse.ok) {
          throw new GameInvitationActionError(
            joinBody.error || t.failedToJoinLobby,
            joinResponse.status,
            joinBody
          );
        }
      }

      const invitationResponse = await fetch("/api/game/invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toUserId,
          radioId,
        }),
      });

      const invitationBody =
        await readJsonSafely<SendGameInvitationResult>(invitationResponse);

      if (!invitationResponse.ok || !invitationBody.id) {
        throw new GameInvitationActionError(
          invitationBody.error || t.failedToSendInvitation,
          invitationResponse.status,
          invitationBody
        );
      }

      socket?.emit("game-invitation:send", {
        invitation: invitationBody,
        invitationId: invitationBody.id,
        toUserId,
        fromUserId: currentUserId,
      });

      await refreshNotifications();

      if (redirectAfterSend) {
        router.push(`/competition/radio/${radioId}`);
      }

      return invitationBody;
    },
    [currentUserId, refreshNotifications, router, socket]
  );

  const answerGameInvitation = useCallback(
    async ({
      invitationId,
      action,
      fallbackRadioId,
      fromUserId,
      redirectOnAccept = true,
    }: AnswerGameInvitationArgs) => {
      const response = await fetch(`/api/game/invitations/${invitationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
        }),
      });

      const body = await readJsonSafely<AnswerGameInvitationResult>(response);

      if (!response.ok) {
        // HTTP 410 means the pending invitation timed out.
        // Remove it locally and notify the sender-side UI to refresh.
        if (response.status === 410 || body.status === "expired") {
          removeGameInvitation(invitationId);
          await refreshNotifications();

          socket?.emit("game-invitation:answered", {
            toUserId: fromUserId,
            invitationId,
            status: "expired",
          });
        }

        throw new GameInvitationActionError(
          body.error || t.failedToAnswerInvitation,
          response.status,
          body
        );
      }

      removeGameInvitation(invitationId);
      await refreshNotifications();

      socket?.emit("game-invitation:answered", {
        toUserId: fromUserId,
        invitationId,
        status: getActionStatus(action),
      });

      if (action === "accept" && redirectOnAccept) {
        const radioId = body.radio?.radioId ?? fallbackRadioId;

        if (radioId) {
          router.push(`/competition/radio/${radioId}`);
        }
      }

      return body;
    },
    [refreshNotifications, removeGameInvitation, router, socket]
  );

  return {
    sendGameInvitation,
    answerGameInvitation,
  };
}
