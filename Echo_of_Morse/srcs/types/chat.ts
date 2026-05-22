// username 是真实用户名。
// displayName 是给好友设置的备注名。
// rawText 是用户输入的原始内容。
// translatedText 是自动转换后的内容。例如你输入英文，系统自动生成摩斯密码。
// mode 记录这条消息是在哪个聊天模式下发送的。

import type { MessageMode } from "@/lib/mappers/chat-mode";

export type ChatMode =
  | "LANGUAGE_TO_MORSE"
  | "morse-to-language"
  | "LANGUAGE_ONLY"
  | "morse-only"
  | "text-to-morse-only";
//"morse-only"->If the user enters "Morse" directly, the system will not convert it
//"text-to-morse-only"->When the user enters regular text, the system displays only Morse code

export type Friend = {
  id: string;
  username: string;
  displayName: string;
  avatarInitial: string;
  avatarUrl?: string;
  lastMessage: string;
  lastMessageAt: string;
  isOnline: boolean;
  image: string | null;
};

export type ChatMessage = {
  id: string;
  friendId: string;
  sender: "me" | "friend";
  rawText: string;
  translatedText?: string;
  mode: MessageMode;
  createdAt: string;
};

export type SearchableUser = {
  id: string;
  username: string;
  displayName: string;
  avatarInitial: string;
  avatarUrl?: string;
};

export type SystemMessage = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  isRead: boolean;
};

export type ChatPanelView =
  | { type: "none" }
  | { type: "friend"; friendId: string }
  | { type: "system" };