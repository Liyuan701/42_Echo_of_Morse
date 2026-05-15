import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";

//GET messages by conversationId
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json(
        { error: "Missing conversationId" },
        { status: 400 }
      );
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(messages);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST new message
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      conversationId,
      senderId,
      rawText,
      translatedText,
      mode,
    } = body;

    if (!conversationId || !senderId || !rawText || !mode) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        rawText,
        translatedText,
        mode,
      },
    });

    return NextResponse.json(message);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}