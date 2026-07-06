// convert the full API user info to simpler UI user info.

export function toUserDTO(
  user: {
    id: string;
    username: string;
    email: string;
    image: string | null;
    bio: string | null;
    learningLevel: number;
    isOnline: boolean;
    createdAt: Date;
    lastSeen: Date | null;
    accounts: Array<{ provider: string }>;
  },
  friendCount?: number
) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    image: user.image,

    bio: user.bio,
    learningLevel: user.learningLevel,

    isOnline: user.isOnline,
    createdAt: user.createdAt,
    lastSeen: user.lastSeen,

    friendCount,

    providers: user.accounts.map(
      (acc: { provider: string }) => acc.provider
    ),
  };
}
