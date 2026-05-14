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
        },
      },
      receiver: {
        select: {
          id: true,
          username: true,
          image: true,
          isOnline: true,
        },
      },
    },
  });

  const map = new Map();

  for (const f of relations) {
    const user =
      f.senderId === userId ? f.receiver : f.sender;

    map.set(user.id, user);
  }

  return Array.from(map.values());
}