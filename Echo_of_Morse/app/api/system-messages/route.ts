//* Return persisted system-message history for the current user.
//*GET /api/system-messages get all historical sys messages.

import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session-user";
import { prisma } from "@/server/prisma";

const MAX_SYSTEM_MESSAGES = 100;


// make sure that one can only get his own sys messages.
// the most recent 100 (MAX_SYSTEM_MESSAGES)
export async function GET() {
  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const messages = await prisma.systemMessage.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: MAX_SYSTEM_MESSAGES,
  });

  return NextResponse.json(
    messages.map((message) => ({
      id: message.id,
      title: message.title,
      body: message.body,
      isRead: message.isRead,
      createdAt: message.createdAt,
      kind: message.kind,
      invitationId: message.invitationId,
      fromUserId: message.fromUserId,
      radioId: message.radioId,
      actionStatus: message.actionStatus,
    }))
  );
}
