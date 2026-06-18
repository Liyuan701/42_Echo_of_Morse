//* Return persisted system-message history for the current user.
//* GET /api/system-messages get all historical sys messages.
//* Add Lazy-cleanup for the exprired invitation.

import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session-user";
import { expirePendingGameInvitationsForUser } from "@/lib/services/game-invitations";
import { prisma } from "@/server/prisma";

const MAX_SYSTEM_MESSAGES = 100;


// make sure that one can only get his own sys messages.
// the most recent 100 (MAX_SYSTEM_MESSAGES)
export async function GET() {
  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const messages = await prisma.$transaction(async (transaction) => {
    // Opening system messages should surface any 
    // invitation expirations that happened while the user was away.
    await expirePendingGameInvitationsForUser(transaction, userId);

    return transaction.systemMessage.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: MAX_SYSTEM_MESSAGES,
    });
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
