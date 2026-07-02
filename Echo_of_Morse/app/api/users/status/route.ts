import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/server/prisma";

function isInternalStatusUpdate(request: Request) {
  const sharedSecret = process.env.WS_SHARED_SECRET;
  const providedSecret = request.headers.get("x-ws-shared-secret");

  // ws-server uses this shared secret because it updates presence server-side.
  return Boolean(sharedSecret && providedSecret === sharedSecret);
}

export async function POST(request: Request) {
  const { userId, isOnline } = (await request.json()) as {
    userId?: string;
    isOnline?: boolean;
  };

  if (!userId || typeof isOnline !== "boolean") {
    return NextResponse.json(
      { error: "userId and isOnline are required" },
      { status: 400 }
    );
  }

  const isInternal = isInternalStatusUpdate(request);

  if (!isInternal) {
    const session = await getServerSession(authOptions);

    // Browser callers may only update their own presence, never another user.
    if (session?.user?.id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }
  
  await prisma.user.updateMany({
    where: { id: userId },
    data: { 
      isOnline,
      lastSeen: new Date()
    }
  });
  
  return NextResponse.json({ ok: true });
}
