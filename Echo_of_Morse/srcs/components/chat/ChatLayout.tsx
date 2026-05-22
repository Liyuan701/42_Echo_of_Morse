// 负责整个聊天页面的左右布局。
// 当前版本仍然是前端 prototype：
// 好友、消息、用户搜索、好友邀请、游戏邀请都使用 mock data 和 React local state。
// 刷新页面后，这些临时状态会消失。
// 后续需要由后端数据库、好友邀请 API、消息 API、游戏邀请 API 或 WebSocket 替换。

"use client";

import { useEffect, useMemo, useState } from "react";
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

export default function ChatLayout() {
  // ── Session ────────────────────────────────────────────────────────────────
  // Must be declared before any useEffect that depends on userId.
  console.log("ChatLayout rendered");
  const { data: session } = useSession();
  const userId = session?.user?.id;

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

    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userAId: userId, userBId: friendId }),
    });
    const data = await res.json();
    console.log("conversation data:", data);  
    console.log("setting conversationId:", data.id);
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

  function handleSendFriendRequest(user: SearchableUser): boolean {
    if (friends.some((f) => f.id === user.id)) {
      window.alert("This user is already in your friend list.");
      return false;
    }
    if (pendingFriendRequestUserIds.includes(user.id)) {
      window.alert("Friend request already sent.");
      return false;
    }

    // TODO: POST /api/friend-requests { targetUserId }
    // Create a pending request; friendship is only established after acceptance.
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

    // TODO: POST /api/game-invitations { targetFriendId, gameMode }
    //       or socket.emit("game_invitation:create", { toUserId: friendId })
    setPendingGameInviteFriendIds((prev) => [...prev, friendId]);

    const inviteMsg: ChatMessage = {
      id: crypto.randomUUID(),
      friendId: invited.id,
      sender: "me",
      rawText: `Game invitation sent to ${invited.displayName}.`,
      translatedText: "Waiting for their response.",
      mode: "LANGUAGE_ONLY",
      createdAt: getCurrentTime(),
    };

    setMessages((prev) => [...prev, inviteMsg]);
    addSystemMessage(
      "Game invitation sent",
      `Game invitation sent to ${invited.displayName}. Waiting for their response.`
    );
    setCurrentView({ type: "friend", friendId: invited.id });
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

    // Persist to backend
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId,
        senderId: userId,
        rawText: transformed.rawText,
        translatedText: transformed.translatedText,
        mode: dbMode,
      }),
    });

    // Optimistic local update
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        friendId: selectedFriend.id,
        sender: "me",
        rawText: transformed.rawText,
        translatedText: transformed.translatedText,
        mode: dbMode,
        createdAt: getCurrentTime(),
      },
    ]);

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
    </section>
  );
}


// ! i18n: move all chat UI labels, placeholders, aria-labels, empty states, mode names, prompt/confirm/alert messages, and button text into the i18n dictionary.
// ! i18n: keep real chat messages, usernames, display names, timestamps, and Morse-transformed content unchanged.
// ! i18n: dynamic strings such as "View ${displayName}'s profile" should use interpolation variables.
// ! i18n: move game invitation labels and messages into the i18n dictionary.
// ! i18n: dynamic game invitation strings should use displayName as an interpolation variable.