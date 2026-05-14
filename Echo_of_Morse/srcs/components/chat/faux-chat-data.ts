// ! Liyuan / frontend note:
// ! This file contains temporary mock data for building the chat UI.
// ! It should be replaced by real backend data once the friendship,
// ! conversation, message, and online status APIs are available.
import type { ChatMessage, Friend, SearchableUser } from "@/types/chat";

export const mockFriends: Friend[] = [
  {
    id: "1",
    username: "alice",
    displayName: "Alice",
    avatarInitial: "A",
    avatarUrl: "/avatars/alice.png",
    lastMessage: "See you in the arena.",
    lastMessageAt: "12:30",
    isOnline: true,
  },
  {
    id: "2",
    username: "nancy",
    displayName: "Nancy",
    avatarInitial: "N",
    avatarUrl: "/avatars/nancy.png",
    lastMessage: "Can we test the chat module?",
    lastMessageAt: "11:48",
    isOnline: false,
  },
  {
    id: "3",
    username: "maria",
    displayName: "Maria",
    avatarInitial: "M",
    avatarUrl: "/avatars/maria.png",
    lastMessage: "... --- ...",
    lastMessageAt: "Yesterday",
    isOnline: true,
  },
];

export const mockSearchableUsers: SearchableUser[] = [
  {
    id: "1",
    username: "alice",
    displayName: "Alice",
    avatarInitial: "A",
    avatarUrl: "/avatars/alice.png",
  },
  {
    id: "2",
    username: "nancy",
    displayName: "Nancy",
    avatarInitial: "N",
    avatarUrl: "/avatars/nancy.png",
  },
  {
    id: "3",
    username: "maria",
    displayName: "Maria",
    avatarInitial: "M",
    avatarUrl: "/avatars/maria.png",
  },
  {
    id: "4",
    username: "testuser",
    displayName: "Test User",
    avatarInitial: "T",
  },
  {
    id: "5",
    username: "TestUser",
    displayName: "Test User Upper",
    avatarInitial: "T",
  },
  {
    id: "6",
    username: "morsefan",
    displayName: "Morse Fan",
    avatarInitial: "M",
  },
  {
    id: "7",
    username: "signal42",
    displayName: "Signal 42",
    avatarInitial: "S",
  },
];


export const mockMessages: ChatMessage[] = [
  {
    id: "m1",
    friendId: "1",
    sender: "friend",
    rawText: "Hello, are you ready?",
    translatedText:
      ".... . .-.. .-.. --- / .- .-. . / -.-- --- ..- / .-. . .- -.. -.-- ..--..",
    mode: "language-to-morse",
    createdAt: "12:25",
  },
  {
    id: "m2",
    friendId: "1",
    sender: "me",
    rawText: "Yes, I am ready.",
    translatedText: "-.-- . ... / .. / .- -- / .-. . .- -.. -.--",
    mode: "language-to-morse",
    createdAt: "12:27",
  },
];

// ! i18n: move all chat UI labels, placeholders, aria-labels, empty states, mode names, prompt/confirm/alert messages, and button text into the i18n dictionary.
// ! i18n: keep real chat messages, usernames, display names, timestamps, and Morse-transformed content unchanged.
// ! i18n: dynamic strings such as "View ${displayName}'s profile" should use interpolation variables.