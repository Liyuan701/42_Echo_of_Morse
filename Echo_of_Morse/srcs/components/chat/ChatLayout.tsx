//* The layout for the entire chat page
//* Including the friend list, system messages, and the active chat window.

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  ChatMessage,
  ChatMode,
  ChatPanelView,
  Friend,
  SearchableUser,
  SystemMessage,
} from "@/types/chat";
import FriendList from "./FriendList";
import ChatWindow from "./ChatWindow";
import SystemMessageWindow from "./SystemMessageWindow";
import { transformChatMessage } from "@/lib/chat-transform";
import styles from "./css/ChatLayout.module.css";
import { useSession } from "next-auth/react";
import { mapChatModeToDB } from "@/lib/mappers/chat-mode";
import { useSocket } from "@/providers/socket-provider";
import { useRouter } from "next/navigation";
import RadioWavePickerModal from "@/components/competition/RadioLobbyPage/RadioWavePickerModal";
import type { RadioId } from "@/types/competition";

type ApiMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  rawText: string;
  translatedText: string | null;
  mode: ChatMessage["mode"];
  createdAt: string;
};

type ReceivedGameInvitation = {
  id: string;
  createdAt: string;
  fromUser: {
    username: string;
  };
  radio: {
    name: string;
  } | null;
};

export default function ChatLayout() {
  // ── Session ────────────────────────────────────────────────────────────────
  // Must be declared before any useEffect that depends on userId.
  console.log("ChatLayout rendered");
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { socket } = useSocket();
  const router = useRouter();

  // ── Core state ─────────────────────────────────────────────────────────────
  const [friends, setFriends] = useState<Friend[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentView, setCurrentView] = useState<ChatPanelView>({ type: "none" });
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [chatMode, setChatMode] = useState<ChatMode>("LANGUAGE_TO_MORSE");
  const [friendSearchQuery, setFriendSearchQuery] = useState("");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userSearchResults, setUserSearchResults] = useState<SearchableUser[]>([]);
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [systemMessages, setSystemMessages] = useState<SystemMessage[]>([]);
  const [pendingFriendRequestUserIds, setPendingFriendRequestUserIds] = useState<string[]>([]);
  const [pendingGameInviteFriendIds, setPendingGameInviteFriendIds] = useState<string[]>([]);
  const [composerError, setComposerError] = useState("");
  const [inviteTargetFriendId, setInviteTargetFriendId] = useState<
    string | null
  >(null);

  // ── Load friends whenever the logged-in user is known ─────────────────────
  useEffect(() => {
    if (!userId) return;

    const loadFriends = async () => {
      try {
        const res = await fetch(`/api/friends?userId=${userId}`);
        const data = await res.json();
        setFriends(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setFriends([]);
      }
    };

    loadFriends();
  }, [userId]);

  // ── Derived / memoised values ──────────────────────────────────────────────
  const selectedFriendId =
    currentView.type === "friend" ? currentView.friendId : null;

    // ── Load messages whenever the active conversation changes ─────────────────
  // conversationId is now declared above, so this effect is safe to reference it.
  useEffect(() => {
  if (!conversationId || !selectedFriendId) return;

  const loadMessages = async () => {
    try {
      const res = await fetch(`/api/messages?conversationId=${conversationId}`);
      const data = await res.json();
      setMessages(
        Array.isArray(data)
          ? data.map((m: any) => ({
              id: m.id,
              friendId: selectedFriendId,
              sender: m.senderId === userId ? "me" : "friend",
              rawText: m.rawText,
              translatedText: m.translatedText,
              mode: m.mode,
              createdAt: new Date(m.createdAt).toLocaleTimeString(),
            }))
          : []
      );
    } catch (err) {
      console.error(err);
      setMessages([]);
    }
  };

  loadMessages();
}, [conversationId, userId, selectedFriendId]);

  useEffect(() => {
    if (!socket || !userId) {
      return;
    }

    function handleNewMessage(message: ApiMessage) {
      if (message.senderId === userId) {
        return;
      }

      setMessages((current) => {
        if (current.some((item) => item.id === message.id)) {
          return current;
        }

        return [
          ...current,
          {
            id: message.id,
            friendId: message.senderId,
            sender: "friend",
            rawText: message.rawText,
            translatedText: message.translatedText ?? undefined,
            mode: message.mode,
            createdAt: new Date(message.createdAt).toLocaleTimeString(),
          },
        ];
      });

      setFriends((current) =>
        current.map((friend) =>
          friend.id === message.senderId
            ? {
                ...friend,
                lastMessage: message.rawText,
                lastMessageAt: new Date(
                  message.createdAt
                ).toLocaleTimeString(),
              }
            : friend
        )
      );
    }

    socket.on("chat:message:new", handleNewMessage);
    return () => {
      socket.off("chat:message:new", handleNewMessage);
    };
  }, [socket, userId]);

  const loadReceivedGameInvitations = useCallback(async () => {
    if (!userId) {
      return;
    }

    const response = await fetch(
      "/api/game/invitations?direction=received",
      { cache: "no-store" }
    );

    if (!response.ok) {
      return;
    }

    const invitations =
      (await response.json()) as ReceivedGameInvitation[];

    setSystemMessages((current) => {
      const knownIds = new Set(current.map((message) => message.id));
      const newMessages = invitations
        .filter(
          (invitation) =>
            !knownIds.has(`game-invitation:${invitation.id}`)
        )
        .map<SystemMessage>((invitation) => ({
          id: `game-invitation:${invitation.id}`,
          title: "New game invitation",
          body: `${invitation.fromUser.username} invited you to ${
            invitation.radio?.name ?? "a radio lobby"
          }. Open Competition to accept or decline.`,
          createdAt: new Date(invitation.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isRead: false,
        }));

      return newMessages.length > 0
        ? [...newMessages, ...current]
        : current;
    });
  }, [userId]);

  // TODO: modify after socket delivery is stable.
  // The current implementation relies on polling every 3 seconds to fetch.
  // the Socket.IO "game-invitation:new" event is not reliably delivered yet.
  // Remove this interval after socket delivery and reconnection are stable.
  // Keep loadReceivedGameInvitations() for the initial page load and for the
  // socket event handler below, but the repeated database polling should go.
  useEffect(() => {
    loadReceivedGameInvitations();

    const intervalId = window.setInterval(
      loadReceivedGameInvitations,
      3000
    );

    return () => window.clearInterval(intervalId);
  }, [loadReceivedGameInvitations]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("game-invitation:new", loadReceivedGameInvitations);
    return () => {
      socket.off("game-invitation:new", loadReceivedGameInvitations);
    };
  }, [loadReceivedGameInvitations, socket]);

  const selectedFriend = useMemo(() => {
    if (!selectedFriendId) return null;
    return friends.find((f) => f.id === selectedFriendId) ?? null;
  }, [friends, selectedFriendId]);

  const selectedMessages = useMemo(() => {
    if (!selectedFriendId) return [];
    return messages.filter((m) => m.friendId === selectedFriendId);
  }, [messages, selectedFriendId]);

  const filteredFriends = useMemo(() => {
    const query = friendSearchQuery.trim();
    if (!query) return friends;
    return friends.filter(
      (f) => f.displayName.includes(query) || f.username.includes(query)
    );
  }, [friends, friendSearchQuery]);

  const unreadSystemMessageCount = useMemo(
    () => systemMessages.filter((m) => !m.isRead).length,
    [systemMessages]
  );

  // ── Helpers
  function getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function addSystemMessage(title: string, body: string) {
    const next: SystemMessage = {
      id: crypto.randomUUID(),
      title,
      body,
      createdAt: getCurrentTime(),
      isRead: false,
    };
    setSystemMessages((prev) => [next, ...prev]);
  }

  function markSystemMessagesAsRead() {
    setSystemMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
  }

  function isDuplicateDisplayName(nextDisplayName: string, currentFriendId?: string) {
    const trimmed = nextDisplayName.trim();
    return friends.some((f) => {
      if (f.id === currentFriendId) return false;
      return f.displayName.trim() === trimmed;
    });
  }

  // ── Event handlers ──────────────────
  function handleSelectSystemMessages() {
    setComposerError("");
    markSystemMessagesAsRead();
    setCurrentView({ type: "system" });
  }

  function handleChangeChatMode(mode: ChatMode) {
    setChatMode(mode);
    setComposerError("");
  }

  async function handleSelectFriend(friendId: string) {
    setComposerError("");
    setCurrentView({ type: "friend", friendId });
    setConversationId(null);

    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userBId: friendId }),
    });
    const data = await res.json();

    if (!res.ok || !data.id) {
      setComposerError(data.error || "Failed to open the conversation.");
      return;
    }

    setConversationId(data.id);
  }

  function handleSearchUsers(query: string) {
    setUserSearchQuery(query);
    const trimmed = query.trim();
    if (!trimmed) {
      setUserSearchResults([]);
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/users/search?query=${trimmed}`);
        const data = await res.json();
        setUserSearchResults(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Search failed:", err);
        setUserSearchResults([]);
      }
    };

    fetchUsers();
  }

  function handleToggleAddFriend() {
    const nextIsOpen = !isAddFriendOpen;
    setIsAddFriendOpen(nextIsOpen);
    if (!nextIsOpen) {
      setUserSearchQuery("");
      setUserSearchResults([]);
    }
  }


  //Friend request logic: checks for duplicates and pending requests before sending. Adds a system message for feedback.
  async function handleSendFriendRequest(user: SearchableUser): Promise<boolean> {
    if (friends.some((f) => f.id === user.id)) {
      window.alert("This user is already in your friend list.");
      return false;
    }
    if (pendingFriendRequestUserIds.includes(user.id)) {
      window.alert("Friend request already sent.");
      return false;
    }

    try {
      const res = await fetch("/api/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: user.id }),
      });

      if (res.status === 409) {
        window.alert("A friend request already exists with this user.");
        return false;
      }

      if (!res.ok) {
        window.alert("Failed to send friend request. Please try again.");
        return false;
      }
    } catch {
      window.alert("Network error. Please try again.");
      return false;
    }

    setPendingFriendRequestUserIds((prev) => [...prev, user.id]);
    addSystemMessage(
      "Friend request sent",
      `Friend request sent to ${user.displayName}. Waiting for acceptance.`
    );
    return true;
  }




  function handleRenameFriend(friendId: string, nextDisplayName: string) {
    const trimmed = nextDisplayName.trim();
    if (!trimmed) {
      window.alert("Friend remark name cannot be empty.");
      return;
    }
    if (isDuplicateDisplayName(trimmed, friendId)) {
      window.alert("This remark name already exists in your friend list.");
      return;
    }

    const target = friends.find((f) => f.id === friendId);

    // TODO: PATCH /api/friends/:friendshipId { remarkName }
    setFriends((prev) =>
      prev.map((f) => (f.id === friendId ? { ...f, displayName: trimmed } : f))
    );

    if (target) {
      addSystemMessage(
        "Friend remark updated",
        `${target.displayName} was renamed to ${trimmed}.`
      );
    }
  }

  function handleDeleteFriend(friendId: string) {
    const target = friends.find((f) => f.id === friendId);

    // TODO: DELETE /api/friends/:friendshipId
    setFriends((prev) => prev.filter((f) => f.id !== friendId));
    setMessages((prev) => prev.filter((m) => m.friendId !== friendId));
    setPendingGameInviteFriendIds((prev) => prev.filter((id) => id !== friendId));

    if (selectedFriendId === friendId) {
      setCurrentView({ type: "none" });
    }

    if (target) {
      addSystemMessage("Friend removed", `${target.displayName} was removed locally.`);
    }
  }

  function handleShareFriend(friendId: string) {
    const target = friends.find((f) => f.id === friendId);
    if (!target) return;

    if (!selectedFriend) {
      window.alert("Please open a chat before sharing a friend.");
      return;
    }
    if (selectedFriend.id === target.id) {
      window.alert("You cannot share this friend to themselves.");
      return;
    }

    // TODO: Send a shared_contact message type via POST /api/messages
    const sharedMsg: ChatMessage = {
      id: crypto.randomUUID(),
      friendId: selectedFriend.id,
      sender: "me",
      rawText: `Shared contact: ${target.displayName} (@${target.username})`,
      translatedText: undefined,
      mode: "LANGUAGE_ONLY",
      createdAt: getCurrentTime(),
    };

    setMessages((prev) => [...prev, sharedMsg]);
    addSystemMessage(
      "Contact shared",
      `${target.displayName} was shared to ${selectedFriend.displayName}.`
    );
  }

  function handleInviteFriendToGame(friendId: string) {
    const invited = friends.find((f) => f.id === friendId);
    if (!invited) return;

    if (!invited.isOnline) {
      window.alert("This friend is offline.");
      return;
    }
    if (pendingGameInviteFriendIds.includes(friendId)) {
      window.alert("A game invitation is already pending.");
      return;
    }

    setInviteTargetFriendId(friendId);
  }

  async function handleSelectInviteRadio(radioId: RadioId) {
    const invited = friends.find((friend) => friend.id === inviteTargetFriendId);

    if (!invited) {
      setInviteTargetFriendId(null);
      return;
    }

    try {
      const joinResponse = await fetch(`/api/competition/radio/${radioId}`, {
        method: "POST",
      });
      const joinBody = (await joinResponse.json()) as { error?: string };

      if (!joinResponse.ok) {
        throw new Error(joinBody.error || "Failed to join the radio lobby.");
      }

      const invitationResponse = await fetch("/api/game/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toUserId: invited.id,
          radioId,
        }),
      });
      const invitation = (await invitationResponse.json()) as {
        id?: string;
        error?: string;
      };

      if (!invitationResponse.ok || !invitation.id) {
        throw new Error(invitation.error || "Failed to send invitation.");
      }

      setPendingGameInviteFriendIds((current) => [...current, invited.id]);
      addSystemMessage(
        "Game invitation sent",
        `Game invitation sent to ${invited.displayName}. Waiting for their response.`
      );

      socket?.emit("game-invitation:send", {
        toUserId: invited.id,
        invitationId: invitation.id,
      });

      setInviteTargetFriendId(null);
      router.push(`/competition/radio/${radioId}`);
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "Failed to send invitation."
      );
    }
  }

  // Fix: was a sync function using `await` — must be async.
  // Return type is now Promise<boolean> to match the async boundary.
  async function handleSendMessage(text: string): Promise<boolean> {
    if (!selectedFriend) return false;

    const transformed = transformChatMessage(text, chatMode);
    if (transformed.error) {
      setComposerError(transformed.error);
      return false;
    }
    if (!transformed.rawText) return false;

    setComposerError("");

    const dbMode = mapChatModeToDB(chatMode);

    if (!conversationId || !userId) {
      setComposerError("The conversation is not ready yet.");
      return false;
    }

    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId,
        rawText: transformed.rawText,
        translatedText: transformed.translatedText,
        mode: dbMode,
      }),
    });

    const result = (await response.json()) as {
      message?: ApiMessage;
      recipientId?: string;
      error?: string;
    };

    if (!response.ok || !result.message || !result.recipientId) {
      setComposerError(result.error || "Failed to send the message.");
      return false;
    }

    setMessages((prev) => {
      if (prev.some((message) => message.id === result.message!.id)) {
        return prev;
      }

      return [
        ...prev,
        {
          id: result.message!.id,
          friendId: selectedFriend.id,
          sender: "me",
          rawText: result.message!.rawText,
          translatedText: result.message!.translatedText ?? undefined,
          mode: result.message!.mode,
          createdAt: new Date(
            result.message!.createdAt
          ).toLocaleTimeString(),
        },
      ];
    });

    socket?.emit("chat:message:send", {
      senderId: userId,
      toUserId: result.recipientId,
      message: result.message,
    });

    return true;
  }

  function handleClosePanel() {
    setComposerError("");
    setCurrentView({ type: "none" });
  }

  // ── Render 
  const hasOpenPanel = currentView.type !== "none";

  return (
    <section
      className={`${styles.layout} ${
        hasOpenPanel ? styles.withChat : styles.onlyFriendList
      }`}
    >
      <FriendList
        friends={filteredFriends}
        allFriends={friends}
        selectedFriendId={selectedFriendId ?? ""}
        systemMessages={systemMessages}
        unreadSystemMessageCount={unreadSystemMessageCount}
        isSystemPanelSelected={currentView.type === "system"}
        friendSearchQuery={friendSearchQuery}
        userSearchQuery={userSearchQuery}
        userSearchResults={userSearchResults}
        isAddFriendOpen={isAddFriendOpen}
        pendingFriendRequestUserIds={pendingFriendRequestUserIds}
        pendingGameInviteFriendIds={pendingGameInviteFriendIds}
        onSelectFriend={handleSelectFriend}
        onSelectSystemMessages={handleSelectSystemMessages}
        onChangeFriendSearchQuery={setFriendSearchQuery}
        onChangeUserSearchQuery={handleSearchUsers}
        onToggleAddFriend={handleToggleAddFriend}
        onSendFriendRequest={handleSendFriendRequest}
        onRenameFriend={handleRenameFriend}
        onDeleteFriend={handleDeleteFriend}
        onShareFriend={handleShareFriend}
        onInviteFriendToGame={handleInviteFriendToGame}
      />

      {currentView.type === "friend" && selectedFriend ? (
        <ChatWindow
          friend={selectedFriend}
          messages={selectedMessages}
          chatMode={chatMode}
          composerError={composerError}
          onChangeChatMode={handleChangeChatMode}
          onSendMessage={handleSendMessage}
          onCloseChat={handleClosePanel}
        />
      ) : null}

      {currentView.type === "system" ? (
        <SystemMessageWindow messages={systemMessages} onClose={handleClosePanel} />
      ) : null}

      <RadioWavePickerModal
        isOpen={inviteTargetFriendId !== null}
        targetDisplayName={
          friends.find((friend) => friend.id === inviteTargetFriendId)
            ?.displayName ?? ""
        }
        onClose={() => setInviteTargetFriendId(null)}
        onSelectRadio={handleSelectInviteRadio}
      />
    </section>
  );
}


// ! i18n: move all chat UI labels, placeholders, aria-labels, empty states, mode names, prompt/confirm/alert messages, and button text into the i18n dictionary.
// ! i18n: keep real chat messages, usernames, display names, timestamps, and Morse-transformed content unchanged.
// ! i18n: dynamic strings such as "View ${displayName}'s profile" should use interpolation variables.
// ! i18n: move game invitation labels and messages into the i18n dictionary.
// ! i18n: dynamic game invitation strings should use displayName as an interpolation variable.
