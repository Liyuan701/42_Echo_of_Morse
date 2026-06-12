//* This API route handles accepting or declining game invitations.
//* PATCH to modify the status of an invitation.

import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session-user";
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

  if (body.action === "accept") {
    // Accepting requires the target radio room to still exist.
    if (!invitation.radioRoom) {
      return NextResponse.json(
        { error: "The invited radio room no longer exists" },
        { status: 409 }
      );
    }

    const existingPresence = await prisma.radioLobbyPresence.findUnique({
      where: {
        userId_roomId: {
          userId,
          roomId: invitation.radioRoom.id,
        },
      },
      select: { id: true },
    });

    // A user already inside keeps their seat even if the room is now full.
    if (
      !existingPresence &&
      invitation.radioRoom._count.lobbyPresences >=
        invitation.radioRoom.maxUsers
    ) {
      return NextResponse.json({ error: "Radio room is full" }, { status: 409 });
    }
  }

  // Convert the frontend action into the Prisma enum value.
  const updated = await prisma.gameInvitation.update({
    where: { id: invitation.id },
    data: {
      status: body.action === "accept" ? "ACCEPTED" : "DECLINED",
    },
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
    id: updated.id,
    status: updated.status.toLowerCase(),
    radio: updated.radioRoom,
  });
}
