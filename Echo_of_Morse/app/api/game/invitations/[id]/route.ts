//* This API route handles accepting or declining game invitations.
//* PATCH to modify the status of an invitation.

import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session-user";
import { getRadioUserState } from "@/lib/services/radio-user-state";
import { prisma } from "@/server/prisma";

type RouteContext = {
  params: {
    // [id] is the invitation ID from the URL.
    id: string;
  };
};

// Accept or decline an existing game invitation.
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    action?: "accept" | "decline";
  };

  // Only the two supported invitation actions are accepted.
  if (body.action !== "accept" && body.action !== "decline") {
    return NextResponse.json(
      { error: "action must be accept or decline" },
      { status: 400 }
    );
  }

  // Fetch the invitation along with the radio room and count of current presences
  const invitation = await prisma.gameInvitation.findUnique({
    where: { id: params.id },
    include: {
      radioRoom: {
        include: {
          _count: {
            select: { lobbyPresences: true },
          },
        },
      },
    },
  });

  if (!invitation) {
    return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  }

  // Only the invited user can answer this invitation.
  if (invitation.toUserId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // An invitation can only be answered once.
  if (invitation.status !== "PENDING") {
    return NextResponse.json(
      { error: "Invitation has already been answered" },
      { status: 409 }
    );
  }

  // if have multiple invitation, change it to declined.
  if (body.action === "decline") {
    const declined = await prisma.gameInvitation.update({
      where: { id: invitation.id },
      data: { status: "DECLINED" },
      include: {
        radioRoom: {
          select: {
            radioId: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      id: declined.id,
      status: declined.status.toLowerCase(),
      radio: declined.radioRoom,
    });
  }

  if (!invitation.radioRoom) {
    return NextResponse.json(
      { error: "The invited radio room no longer exists" },
      { status: 409 }
    );
  }

  try {
    const updated = await prisma.$transaction(async (transaction) => {
      const freshInvitation = await transaction.gameInvitation.findUnique({
        where: { id: invitation.id },
        include: {
          radioRoom: {
            include: {
              _count: {
                select: { lobbyPresences: true },
              },
            },
          },
        },
      });

      if (!freshInvitation || freshInvitation.toUserId !== userId) {
        throw new Error("INVITATION_NOT_AVAILABLE");
      }

      if (freshInvitation.status !== "PENDING") {
        throw new Error("INVITATION_ALREADY_ANSWERED");
      }

      if (!freshInvitation.radioRoom) {
        throw new Error("ROOM_NOT_FOUND");
      }

      const [targetState, senderState] = await Promise.all([
        getRadioUserState(transaction, userId),
        getRadioUserState(transaction, freshInvitation.fromUserId),
      ]);

      if (targetState.isPlaying) {
        throw new Error("TARGET_PLAYING");
      }

      if (targetState.isReady) {
        throw new Error("TARGET_READY");
      }

      if (
        targetState.presence &&
        targetState.presence.roomId !== freshInvitation.radioRoom.id
      ) {
        throw new Error("TARGET_IN_OTHER_ROOM");
      }

      if (senderState.isPlaying) {
        throw new Error("SENDER_PLAYING");
      }

      if (senderState.isReady) {
        throw new Error("SENDER_READY");
      }

      if (
        senderState.presence &&
        senderState.presence.roomId !== freshInvitation.radioRoom.id
      ) {
        throw new Error("SENDER_IN_OTHER_ROOM");
      }

      const existingPresence =
        targetState.presence?.roomId === freshInvitation.radioRoom.id;

      if (
        !existingPresence &&
        freshInvitation.radioRoom._count.lobbyPresences >=
          freshInvitation.radioRoom.maxUsers
      ) {
        throw new Error("ROOM_FULL");
      }

      await transaction.radioReadyQueue.deleteMany({
        where: {
          userId,
          roomId: { not: freshInvitation.radioRoom.id },
        },
      });

      // Accept and join the lobby.
      await transaction.radioLobbyPresence.upsert({
        where: {
          userId_roomId: {
            userId,
            roomId: freshInvitation.radioRoom.id,
          },
        },
        create: {
          userId,
          roomId: freshInvitation.radioRoom.id,
          status: "IDLE",
        },
        update: {
          status: "IDLE",
        },
      });

      return transaction.gameInvitation.update({
        where: { id: freshInvitation.id },
        data: { status: "ACCEPTED" },
        include: {
          radioRoom: {
            select: {
              radioId: true,
              name: true,
            },
          },
        },
      });
    });

    return NextResponse.json({
      id: updated.id,
      status: updated.status.toLowerCase(),
      radio: updated.radioRoom,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "INVITATION_ACCEPT_FAILED";

    const errors: Record<string, { error: string; status: number }> = {
      INVITATION_NOT_AVAILABLE: {
        error: "Invitation not found",
        status: 404,
      },
      INVITATION_ALREADY_ANSWERED: {
        error: "Invitation has already been answered",
        status: 409,
      },
      ROOM_NOT_FOUND: {
        error: "The invited radio room no longer exists",
        status: 409,
      },
      TARGET_PLAYING: {
        error: "You are currently in a game",
        status: 409,
      },
      TARGET_READY: {
        error: "You are already ready in a lobby",
        status: 409,
      },
      TARGET_IN_OTHER_ROOM: {
        error:
          "Leave your current radio room before accepting an invitation to another one",
        status: 409,
      },
      SENDER_PLAYING: {
        error: "The inviter is currently in a game",
        status: 409,
      },
      SENDER_READY: {
        error: "The inviter is already ready in a lobby",
        status: 409,
      },
      SENDER_IN_OTHER_ROOM: {
        error: "The inviter is now in another radio room",
        status: 409,
      },
      ROOM_FULL: {
        error: "Radio room is full",
        status: 409,
      },
    };

    if (errors[message]) {
      return NextResponse.json(
        { error: errors[message].error },
        { status: errors[message].status }
      );
    }

    throw error;
  }
}
