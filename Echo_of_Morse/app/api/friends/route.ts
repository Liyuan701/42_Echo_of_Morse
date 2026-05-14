// API Route: /api/friends
// This file handles friend requests between users.
// It allows users to send friend requests and retrieve their friend list.

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/server/prisma";

// GET /api/friends?userId=123 - Get friend list of a user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const friends = await prisma.friendship.findMany({
      where: {
        OR: [
          { senderId: userId, status: "ACCEPTED" },
          { receiverId: userId, status: "ACCEPTED" },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            image: true,
            isOnline: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            image: true,
            isOnline: true,
          },
        },
      },
    });

    const formatted = friends.map((f) => {
      const user = f.senderId === userId ? f.receiver : f.sender;

      return {
        id: user.id,
        username: user.username,
        displayName: user.username,
        avatarUrl: user.image,
        isOnline: user.isOnline,
        lastMessage: "",
        lastMessageAt: "",
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/friends - Send a friend request
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const senderId = (session.user as { id?: string } | undefined)?.id;

    if (!senderId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { receiverId } = body as { receiverId?: string };

    if (!receiverId) {
      return NextResponse.json(
        { error: "receiverId is required" },
        { status: 400 }
      );
    }

    if (receiverId === senderId) {
      return NextResponse.json(
        { error: "You cannot send a friend request to yourself" },
        { status: 400 }
      );
    }

    // Check if a friendship already exists in either direction.
    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Friendship already exists" },
        { status: 409 }
      );
    }

    // Create the friend request.
    const friendship = await prisma.friendship.create({
      data: {
        senderId,
        receiverId,
        status: "PENDING",
      },
    });

    return NextResponse.json(friendship, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
