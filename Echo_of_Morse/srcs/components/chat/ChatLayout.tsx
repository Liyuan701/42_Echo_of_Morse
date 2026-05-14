// 负责整个聊天页面的左右布局。
// 当前版本仍然是前端 prototype：
// 好友、消息、用户搜索、好友邀请、游戏邀请都使用 mock data 和 React local state。
// 刷新页面后，这些临时状态会消失。
// 后续需要由后端数据库、好友邀请 API、消息 API、游戏邀请 API 或 WebSocket 替换。

"use client";

import { useMemo, useState } from "react";
import type {
  ChatMessage,
  ChatMode,
  ChatPanelView,
  Friend,
  SearchableUser,
  SystemMessage,
} from "@/types/chat";
import {
  mockFriends,
  mockMessages,
  mockSearchableUsers,
} from "./faux-chat-data";
import FriendList from "./FriendList";
import ChatWindow from "./ChatWindow";
import SystemMessageWindow from "./SystemMessageWindow";
import { transformChatMessage } from "@/lib/chat-transform";
import styles from "./css/ChatLayout.module.css";

export default function ChatLayout() {
// ! Liyuan: replace mockFriends with friends loaded from the real database.
// ! Expected backend data: current user's friend list, including friendId,
// ! username, displayName / remarkName, avatarUrl, online status,
// ! last message preview, and last message time.
// ! Online status may later need WebSocket presence updates.
  const [friends, setFriends] = useState<Friend[]>(mockFriends);
  const [currentView, setCurrentView] = useState<ChatPanelView>({
    type: "none",
  });

  // ! Liyuan: replace mockMessages with messages loaded from the real database.
  // ! Expected backend data: messages for the selected conversation or friend.
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);

  const [chatMode, setChatMode] = useState<ChatMode>("language-to-morse");
  const [friendSearchQuery, setFriendSearchQuery] = useState("");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userSearchResults, setUserSearchResults] = useState<SearchableUser[]>([]);
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  // ! Liyuan: this is temporary local notification state.
  // ! Later, system messages should come from a notification API or WebSocket events.
  // ! Expected backend data: notification id, type, title, body, isRead, createdAt.
  const [systemMessages, setSystemMessages] = useState<SystemMessage[]>([]);
  // ! Liyuan: replace this local pending friend request state with backend data.
  // ! Expected backend data: pending outgoing friend requests for the current user.
  // ! This prevents sending duplicate requests after refresh or from another device.
  const [pendingFriendRequestUserIds, setPendingFriendRequestUserIds] = useState<string[]>([]);

  // ! game: temporary local state for game invitations.
  // ! Later, this should be replaced by real game invitation data from the backend.
  // ! Expected backend data: invitation id, senderId, receiverId, status, gameMode, createdAt.
  const [pendingGameInviteFriendIds, setPendingGameInviteFriendIds] = useState<string[]>([]);

  const [composerError, setComposerError] = useState("");

  const selectedFriendId =
    currentView.type === "friend" ? currentView.friendId : null;

  const selectedFriend = useMemo(() => {
    if (!selectedFriendId) {
      return null;
    }

    return friends.find((friend) => friend.id === selectedFriendId) ?? null;
  }, [friends, selectedFriendId]);

  const selectedMessages = useMemo(() => {
    if (!selectedFriendId) {
      return [];
    }

    return messages.filter((message) => message.friendId === selectedFriendId);
  }, [messages, selectedFriendId]);

  const filteredFriends = useMemo(() => {
    const query = friendSearchQuery.trim();

    if (!query) {
      return friends;
    }

    return friends.filter((friend) => {
      return (
        friend.displayName.includes(query) || friend.username.includes(query)
      );
    });
  }, [friends, friendSearchQuery]);

  const unreadSystemMessageCount = useMemo(() => {
    return systemMessages.filter((message) => !message.isRead).length;
  }, [systemMessages]);

  function getCurrentTime() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function addSystemMessage(title: string, body: string) {
    const nextMessage: SystemMessage = {
      id: crypto.randomUUID(),
      title,
      body,
      createdAt: getCurrentTime(),
      isRead: false,
    };

    setSystemMessages((prev) => [nextMessage, ...prev]);
  }

  function markSystemMessagesAsRead() {
    setSystemMessages((prev) =>
      prev.map((message) => ({
        ...message,
        isRead: true,
      }))
    );
  }

  function handleSelectSystemMessages() {
    setComposerError("");
    markSystemMessagesAsRead();
    setCurrentView({ type: "system" });
  }

  function handleChangeChatMode(mode: ChatMode) {
    setChatMode(mode);
    setComposerError("");
  }

  function handleSelectFriend(friendId: string) {
    setComposerError("");
    setCurrentView({
      type: "friend",
      friendId,
    });
  }

  function isDuplicateDisplayName(
    nextDisplayName: string,
    currentFriendId?: string
  ) {
    const trimmedName = nextDisplayName.trim();

    return friends.some((friend) => {
      if (friend.id === currentFriendId) {
        return false;
      }

      return friend.displayName.trim() === trimmedName;
    });
  }

  function handleSearchUsers(query: string) {
    setUserSearchQuery(query);

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setUserSearchResults([]);
      return;
    }

    // ! yren: TODO backend integration.
    // ! This currently searches mockSearchableUsers on the front-end.
    // ! Later, this should call a real user search endpoint, for example:
    // ! GET /api/users/search?query=...
    // ! This is different from searching inside the current friend list.
    const results = mockSearchableUsers.filter((user) => {
      return (
        user.username.includes(trimmedQuery) ||
        user.displayName.includes(trimmedQuery)
      );
    });

    setUserSearchResults(results);
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
    const alreadyFriend = friends.some((friend) => friend.id === user.id);

    if (alreadyFriend) {
      window.alert("This user is already in your friend list.");
      return false;
    }

    const alreadyPending = pendingFriendRequestUserIds.includes(user.id);

    if (alreadyPending) {
      window.alert("Friend request already sent.");
      return false;
    }

    // ! Liyuan: TODO backend integration.
    // ! Add friend should not directly create a friendship.
    // ! It should create a pending friend request first.
    // ! The target user must accept the request before both users become friends.
    // ! Later, this should call POST /api/friend-requests with targetUserId.
    // ! Backend should notify the receiver, persist the pending request,
    // ! and create the friendship only after acceptance.
    setPendingFriendRequestUserIds((prev) => [...prev, user.id]);

    addSystemMessage(
      "Friend request sent",
      `Friend request sent to ${user.displayName}. Waiting for acceptance.`
    );

    return true;
  }

  function handleRenameFriend(friendId: string, nextDisplayName: string) {
    const trimmedName = nextDisplayName.trim();

    if (!trimmedName) {
      window.alert("Friend remark name cannot be empty.");
      return;
    }

    if (isDuplicateDisplayName(trimmedName, friendId)) {
      window.alert("This remark name already exists in your friend list.");
      return;
    }

    const renamedFriend = friends.find((friend) => friend.id === friendId);

    // ! Liyuan: TODO backend integration.
    // ! This currently only updates the local displayName.
    // ! Later, this should call a real API endpoint, for example PATCH /api/friends/:friendshipId.
    // ! Backend should persist the remarkName / displayName for the current user.
    setFriends((prev) =>
      prev.map((friend) =>
        friend.id === friendId
          ? { ...friend, displayName: trimmedName }
          : friend
      )
    );

    if (renamedFriend) {
      addSystemMessage(
        "Friend remark updated",
        `${renamedFriend.displayName} was renamed to ${trimmedName}.`
      );
    }
  }

  function handleDeleteFriend(friendId: string) {
    const deletedFriend = friends.find((friend) => friend.id === friendId);

    // ! Liyuan: TODO backend integration.
    // ! This currently only removes the friend from local React state.
    // ! Later, this should call a real API endpoint, for example DELETE /api/friends/:friendshipId.
    // ! Backend should remove or deactivate the friendship relation in the database.
    setFriends((prev) => prev.filter((friend) => friend.id !== friendId));

    setMessages((prev) =>
      prev.filter((message) => message.friendId !== friendId)
    );

    setPendingGameInviteFriendIds((prev) =>
      prev.filter((id) => id !== friendId)
    );

    if (selectedFriendId === friendId) {
      setCurrentView({ type: "none" });
    }

    if (deletedFriend) {
      addSystemMessage(
        "Friend removed",
        `${deletedFriend.displayName} was removed locally.`
      );
    }
  }

  function handleShareFriend(friendId: string) {
    const targetFriend = friends.find((friend) => friend.id === friendId);

    if (!targetFriend) {
      return;
    }

    if (!selectedFriend) {
      window.alert("Please open a chat before sharing a friend.");
      return;
    }

    if (selectedFriend.id === targetFriend.id) {
      window.alert("You cannot share this friend to themselves.");
      return;
    }

    const sharedContactMessage: ChatMessage = {
      id: crypto.randomUUID(),
      friendId: selectedFriend.id,
      sender: "me",
      rawText: `Shared contact: ${targetFriend.displayName} (@${targetFriend.username})`,
      translatedText: undefined,
      mode: "language-only",
      createdAt: getCurrentTime(),
    };

    // ! Liyuan: TODO backend integration.
    // ! Share friend should mean sharing a contact card to an existing friend,
    // ! not only copying text to clipboard.
    // ! Later, backend should support a shared_contact message type,
    // ! including senderId, receiverId/conversationId, and sharedUserId.
    setMessages((prev) => [...prev, sharedContactMessage]);

    addSystemMessage(
      "Contact shared",
      `${targetFriend.displayName} was shared to ${selectedFriend.displayName}.`
    );
  }

  function handleInviteFriendToGame(friendId: string) {
    const invitedFriend = friends.find((friend) => friend.id === friendId);

    if (!invitedFriend) {
      return;
    }

    if (!invitedFriend.isOnline) {
        window.alert("This friend is offline.");
        return;
    }

    const alreadyPending = pendingGameInviteFriendIds.includes(friendId);

    if (alreadyPending) {
      window.alert("A game invitation is already pending.");
      return;
    }

    // ! game: TODO backend / WebSocket integration.
    // ! This currently only creates a local pending game invitation.
    // ! Later, this should call a real API endpoint or emit a WebSocket event, for example:
    // ! POST /api/game-invitations with targetFriendId and gameMode.
    // ! socket.emit("game_invitation:create", { toUserId: friendId, gameMode: "morse_duel" }).
    // ! Backend should persist the invitation, notify the receiver,
    // ! and create / join a game room only after the receiver accepts.
    setPendingGameInviteFriendIds((prev) => [...prev, friendId]);

    const gameInviteMessage: ChatMessage = {
      id: crypto.randomUUID(),
      friendId: invitedFriend.id,
      sender: "me",
      rawText: `Game invitation sent to ${invitedFriend.displayName}.`,
      translatedText: "Waiting for their response.",
      mode: "language-only",
      createdAt: getCurrentTime(),
    };

    setMessages((prev) => [...prev, gameInviteMessage]);

    addSystemMessage(
      "Game invitation sent",
      `Game invitation sent to ${invitedFriend.displayName}. Waiting for their response.`
    );

    setCurrentView({
      type: "friend",
      friendId: invitedFriend.id,
    });
  }

  function handleSendMessage(text: string): boolean {
    if (!selectedFriend) {
      return false;
    }

    const transformed = transformChatMessage(text, chatMode);

    if (transformed.error) {
      setComposerError(transformed.error);
      return false;
    }

    if (!transformed.rawText) {
      return false;
    }

    setComposerError("");

    const nextMessage: ChatMessage = {
      id: crypto.randomUUID(),
      friendId: selectedFriend.id,
      sender: "me",
      rawText: transformed.rawText,
      translatedText: transformed.translatedText,
      mode: chatMode,
      createdAt: getCurrentTime(),
    };

    // ! Liyuan: TODO backend integration.
    // ! This currently only appends the message to local React state.
    // ! Later, this should call a real API endpoint or WebSocket event.
    // ! Backend should persist the message with senderId, conversationId,
    // ! rawText, translatedText, mode, and createdAt.
    setMessages((prev) => [...prev, nextMessage]);

    return true;
  }

  function handleClosePanel() {
    setComposerError("");
    setCurrentView({ type: "none" });
  }

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
        <SystemMessageWindow
          messages={systemMessages}
          onClose={handleClosePanel}
        />
      ) : null}
    </section>
  );
}

// ! i18n: move all chat UI labels, placeholders, aria-labels, empty states, mode names, prompt/confirm/alert messages, and button text into the i18n dictionary.
// ! i18n: keep real chat messages, usernames, display names, timestamps, and Morse-transformed content unchanged.
// ! i18n: dynamic strings such as "View ${displayName}'s profile" should use interpolation variables.
// ! i18n: move game invitation labels and messages into the i18n dictionary.
// ! i18n: dynamic game invitation strings should use displayName as an interpolation variable.