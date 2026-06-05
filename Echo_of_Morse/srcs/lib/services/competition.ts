import { prisma } from "@/server/prisma";

// Radio configs from DB
export async function getRadioConfigs() {
  const radios = await prisma.radioRoom.findMany({
    orderBy: { radioId: "asc" },
  });

  return radios.map((r) => ({
    id: r.radioId,
    name: r.name,
    wpm: r.wpm,
    description: r.description,
    maxUsers: r.maxUsers,
  }));
}

// Online overview
export async function getOnlineOverview() {
  const totalOnlineUsers = await prisma.user.count({
    where: { isOnline: true },
  });

  const rooms = await prisma.radioRoom.findMany({
    include: {
      lobbyPresences: true,
    },
  });

  const radioUsers: Record<string, number> = {};

  for (const room of rooms) {
    radioUsers[room.radioId] = room.lobbyPresences.length;
  }

  return {
    totalOnlineUsers,
    radioUsers,
  };
}