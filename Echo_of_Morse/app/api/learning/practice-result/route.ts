//update level after practice result

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/server/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { levelId, passed } = await req.json();
  const userId = session.user.id;

  if (passed) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { learningLevel: true },
    });

    if (user && user.learningLevel === levelId) {
      await prisma.user.update({
        where: { id: userId },
        data: { learningLevel: { increment: 1 } },
      });
    }
  }

  return Response.json({ ok: true });
}