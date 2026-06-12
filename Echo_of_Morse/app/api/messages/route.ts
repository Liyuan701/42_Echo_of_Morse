import { NextResponse } from "next/server";
import type { MessageMode } from "@prisma/client";
import { getSessionUserId } from "@/lib/session-user";
import { prisma } from "@/server/prisma";

const MESSAGE_MODES: MessageMode[] = [
  "LANGUAGE_TO_MORSE",
  "MORSE_TO_LANGUAGE",
  "LANGUAGE_ONLY",
];

export async function GET(request: Request) {
  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get("conversationId");

  if (!conversationId) {
    return NextResponse.json(
      { error: "Missing conversationId" },
      { status: 400 }
    );
  }

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [{ userAId: userId }, { userBId: userId }],
    },
    select: { id: true },
  });

  if (!conversation) {
    return NextResponse.json(
      { error: "Conversation not found" },
      { status: 404 }
    );
  }

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  const senderId = await getSessionUserId();

  if (!senderId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    conversationId?: string;
    rawText?: string;
    translatedText?: string;
    mode?: MessageMode;
  };

  if (
    !body.conversationId ||
    !body.rawText?.trim() ||
    !body.mode ||
    !MESSAGE_MODES.includes(body.mode)
  ) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: body.conversationId,
      OR: [{ userAId: senderId }, { userBId: senderId }],
    },
    select: {
      id: true,
      userAId: true,
      userBId: true,
    },
  });

  if (!conversation) {
    return NextResponse.json(
      { error: "Conversation not found" },
      { status: 404 }
    );
  }

  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId,
      rawText: body.rawText.trim(),
      translatedText: body.translatedText || null,
      mode: body.mode,
    },
  });

  const recipientId =
    conversation.userAId === senderId
      ? conversation.userBId
      : conversation.userAId;

  return NextResponse.json(
    {
      message,
      recipientId,
    },
    { status: 201 }
  );
}
