export type NotificationFriendMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  senderUsername: string;
  senderImage: string | null;
  rawText: string;
  translatedText: string | null;
  mode: string;
  createdAt: string;
};

export type NotificationGameInvitation = {
  id: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
  fromUser: {
    id: string;
    username: string;
    image: string | null;
  };
  toUser: {
    id: string;
    username: string;
    image: string | null;
  };
  radio: {
    radioId: string;
    name: string;
  } | null;
};

export type NotificationsSnapshot = {
  unreadSystemMessages: number;
  pendingGameInvitations: NotificationGameInvitation[];
  recentFriendMessages: NotificationFriendMessage[];
};

export type FriendUnreadCounts = Record<string, number>;