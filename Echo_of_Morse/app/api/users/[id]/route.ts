// API Route: /api/users/[id]
// This file handles all HTTP requests for a specific user by their id.
// It allows the frontend to retrieve and update user information.
// The [id] in the path is a dynamic parameter.
// Example: GET /api/users/abc123 will return the information of user with id abc123.

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/server/prisma";
import { authOptions } from "@/lib/auth";
import { toUserDTO } from "@/lib/mappers/user";

// GET /api/users/[id] - Get user information.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        image: true,

        bio: true,
        learningLevel: true,

        isOnline: true,
        createdAt: true,
        lastSeen: true,

        accounts: {
          select: {
            provider: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // we can get a friend by receving and sending the invitation.
    // so count the sender and receiver.
    const friendCount = await prisma.friendship.count({
      where: {
        status: "ACCEPTED",
        OR: [
          { senderId: id },
          { receiverId: id },
        ],
      },
    });

    return NextResponse.json(toUserDTO(user));
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update user information.
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionUserId = (session.user as { id?: string } | undefined)?.id;

    if (!sessionUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = id;

    if (sessionUserId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { username, email, image } = body as {
      username?: string;
      email?: string;
      image?: string;
    };

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(username && { username }),
        ...(email && { email }),
        ...(image && { image }),
      },
      select: {
        id: true,
        username: true,
        email: true,
        image: true,

        bio: true,
        learningLevel: true,

        isOnline: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
