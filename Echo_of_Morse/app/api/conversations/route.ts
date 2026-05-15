import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userAId, userBId } = body;

    if (!userAId || !userBId) {
      return NextResponse.json(
        { error: "Missing user ids" },
        { status: 400 }
      );
    }

    // 1. 保证顺序一致（避免 A-B / B-A 重复）
    const [a, b] =
      userAId < userBId ? [userAId, userBId] : [userBId, userAId];

    // 2. 查是否已存在 conversation
    const existing = await prisma.conversation.findUnique({
      where: {
        userAId_userBId: {
          userAId: a,
          userBId: b,
        },
      },
    });

    if (existing) {
      return NextResponse.json(existing);
    }

    // 3. 创建 conversation
    const conversation = await prisma.conversation.create({
      data: {
        userAId: a,
        userBId: b,
      },
    });

    return NextResponse.json(conversation);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}