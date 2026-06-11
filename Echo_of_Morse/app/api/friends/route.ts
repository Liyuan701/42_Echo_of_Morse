// API Route: /api/friends
// GET: check query param userId, only allow fetching own friends list
// POST: send friend request
 
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/server/prisma";
import { getFriends } from "@/lib/services/friends";
 
// GET /api/friends?userId=123 - get friends list for userId
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
 
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
 
  const sessionUserId = (session.user as { id?: string } | undefined)?.id;
 
  if (!sessionUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
 
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
 
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }
 
  // only allow fetching own friends list
  if (userId !== sessionUserId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
 
  const friends = await getFriends(userId);
 
  const formatted = friends.map((user) => ({
    id: user.id,
    username: user.username,
    displayName: user.username,
    avatarUrl: user.image,
    isOnline: user.isOnline,
    lastMessage: "",
    lastMessageAt: "",
  }));
 
  return NextResponse.json(formatted);
}
 
// POST /api/friends - send friend request with body { receiverId: string }
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
 
    // check if friendship already exists in either direction
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
 
    // create friendship with status PENDING
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