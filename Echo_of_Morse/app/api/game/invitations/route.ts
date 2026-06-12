//* The API route for managing game invitations.
//* This route supports two operations:
//* GET: query pending invitations for the current user.
//* POST: create a new game invitation to invite a friend.

import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session-user";
import { prisma } from "@/server/prisma";

// Get pending invitations sent or received by the current user.
export async function GET(request: NextRequest) {
  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const direction = searchParams.get("direction") ?? "received";
  const radioId = searchParams.get("radioId");

  // Only the supported query directions are accepted.
  if (direction !== "sent" && direction !== "received") {
    return NextResponse.json(
      { error: "direction must be sent or received" },
      { status: 400 }
    );
  }

  const invitations = await prisma.gameInvitation.findMany({
    where: {
      status: "PENDING",
      // Filter by sender or receiver according to the requested direction.
      ...(direction === "sent"
        ? { fromUserId: userId }
        : { toUserId: userId }),
      // radioId is an optional filter.
      ...(radioId ? { radioRoom: { radioId } } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      fromUser: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
      toUser: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
      radioRoom: {
        select: {
          radioId: true,
          name: true,
        },
      },
    },
  });

  return NextResponse.json(
    invitations.map((invitation) => ({
      id: invitation.id,
      status: invitation.status.toLowerCase(),
      createdAt: invitation.createdAt,
      fromUser: invitation.fromUser,
      toUser: invitation.toUser,
      radio: invitation.radioRoom,
    }))
  );
}

// Create a new invitation to join a radio lobby.
export async function POST(request: NextRequest) {
  // The sender identity always comes from the authenticated session.
  const fromUserId = await getSessionUserId();

  if (!fromUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    toUserId?: string;
    radioId?: string;
  };

  if (!body.toUserId || !body.radioId) {
    return NextResponse.json(
      { error: "toUserId and radioId are required" },
      { status: 400 }
    );
  }

  if (body.toUserId === fromUserId) {
    return NextResponse.json(
      { error: "Cannot invite yourself" },
      { status: 400 }
    );
  }

  // These independent checks can run in parallel.
  const [room, friendship, targetUser] = await Promise.all([
    prisma.radioRoom.findUnique({
      where: { radioId: body.radioId },
      include: {
        _count: {
          select: { lobbyPresences: true },
        },
      },
    }),
    prisma.friendship.findFirst({
      where: {
        status: "ACCEPTED",
        OR: [
          { senderId: fromUserId, receiverId: body.toUserId },
          { senderId: body.toUserId, receiverId: fromUserId },
        ],
      },
      select: { id: true },
    }),
    prisma.user.findUnique({
      where: { id: body.toUserId },
      select: { id: true, isOnline: true },
    }),
  ]);

  if (!room) {
    return NextResponse.json({ error: "Radio room not found" }, { status: 404 });
  }

  if (room._count.lobbyPresences >= room.maxUsers) {
    return NextResponse.json({ error: "Radio room is full" }, { status: 409 });
  }

  if (!friendship) {
    return NextResponse.json(
      { error: "Only accepted friends can be invited" },
      { status: 403 }
    );
  }

  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!targetUser.isOnline) {
    return NextResponse.json({ error: "Friend is offline" }, { status: 409 });
  }

  // The sender must be inside the room, and the target must not be there yet.
  const [senderPresence, targetPresence] = await Promise.all([
    prisma.radioLobbyPresence.findUnique({
      where: {
        userId_roomId: {
          userId: fromUserId,
          roomId: room.id,
        },
      },
      select: { id: true },
    }),
    prisma.radioLobbyPresence.findUnique({
      where: {
        userId_roomId: {
          userId: body.toUserId,
          roomId: room.id,
        },
      },
      select: { id: true },
    }),
  ]);

  if (!senderPresence) {
    return NextResponse.json(
      { error: "Join the radio room before inviting friends" },
      { status: 409 }
    );
  }

  if (targetPresence) {
    return NextResponse.json(
      { error: "Friend is already in this radio room" },
      { status: 409 }
    );
  }

  // Prevent duplicate pending invitations for the same users and room.
  const existingInvitation = await prisma.gameInvitation.findFirst({
    where: {
      fromUserId,
      toUserId: body.toUserId,
      radioRoomId: room.id,
      status: "PENDING",
    },
    select: { id: true },
  });

  if (existingInvitation) {
    return NextResponse.json(
      { error: "Invitation already pending" },
      { status: 409 }
    );
  }

  // The Prisma schema gives new invitations the default PENDING status.
  const invitation = await prisma.gameInvitation.create({
    data: {
      fromUserId,
      toUserId: body.toUserId,
      radioRoomId: room.id,
    },
    select: {
      id: true,
      status: true,
      createdAt: true,
    },
  });

  return NextResponse.json(invitation, { status: 201 });
}
