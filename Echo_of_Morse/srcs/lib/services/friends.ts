import { prisma } from "@/server/prisma";

// get friend list, without double.
export async function getFriends(userId: string) {
  const relations = await prisma.friendship.findMany({
    where: {
      OR: [
        { senderId: userId },
        { receiverId: userId },
      ],
      status: "ACCEPTED",
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          image: true,
          isOnline: true,
          radioLobbyPresences: {
            orderBy: { updatedAt: "desc" },
            take: 1,
            select: {
              status: true,
              room: {
                select: {
                  radioId: true,
                },
              },
            },
          },
          radioSessionPlayers: {
            where: {
              session: {
                status: { in: ["WAITING", "ACTIVE"] },
              },
            },
            orderBy: { joinedAt: "desc" },
            take: 1,
            select: {
              session: {
                select: {
                  room: {
                    select: {
                      radioId: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      receiver: {
        select: {
          id: true,
          username: true,
          image: true,
          isOnline: true,
          radioLobbyPresences: {
            orderBy: { updatedAt: "desc" },
            take: 1,
            select: {
              status: true,
              room: {
                select: {
                  radioId: true,
                },
              },
            },
          },
          radioSessionPlayers: {
            where: {
              session: {
                status: { in: ["WAITING", "ACTIVE"] },
              },
            },
            orderBy: { joinedAt: "desc" },
            take: 1,
            select: {
              session: {
                select: {
                  room: {
                    select: {
                      radioId: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  type FriendListUser = (typeof relations)[number]["sender"];
  const map = new Map<string, FriendListUser>();

  for (const f of relations) {
    const user =
      f.senderId === userId ? f.receiver : f.sender;

    map.set(user.id, user);
  }

  return Array.from(map.values());
}
