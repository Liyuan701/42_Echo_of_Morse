import { prisma } from "@/server/prisma";
import type { RadioId, RadioConfig } from "@/types/competition";

// strict valid ids
const validIds = ["01", "02", "03"] as const;

function isRadioId(id: string): id is RadioId {
  return (validIds as readonly string[]).includes(id);
}

// Radio configs from DB
export async function getRadioConfigs(): Promise<RadioConfig[]> {
  const radios = await prisma.radioRoom.findMany({
    orderBy: { radioId: "asc" },
  });

  return radios
    .filter((r) => isRadioId(r.radioId))
    .map((r) => ({
      id: r.radioId,
      name: r.name,
      wpm: r.wpm,
      description: r.description,
      maxUsers: r.maxUsers,
    }));
}

// Online overview
export async function getOnlineOverview(): Promise<{
  totalOnlineUsers: number;
  radioUsers: Partial<Record<RadioId, number>>;
}> {
  const totalOnlineUsers = await prisma.user.count({
    where: { isOnline: true },
  });

  const rooms = await prisma.radioRoom.findMany({
    include: {
      lobbyPresences: true,
    },
  });

  const radioUsers: Partial<Record<RadioId, number>> = {};

  for (const room of rooms) {
    if (isRadioId(room.radioId)) {
      radioUsers[room.radioId] = room.lobbyPresences.length;
    }
  }

  return {
    totalOnlineUsers,
    radioUsers,
  };
}