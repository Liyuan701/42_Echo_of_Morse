// 负责输入框和发送按钮

"use client";

import { FormEvent, KeyboardEvent, useState } from "react";
import type { ChatMode } from "@/types/chat";
import { Button } from "@/components/ui";
import styles from "./css/MessageComposer.module.css";

type MessageComposerProps = {
  chatMode: ChatMode;
  error: string;
  // onSendMessage: (text: string) => boolean;
  onSendMessage: (text: string) => Promise<boolean>;
};

const placeholderByMode: Record<ChatMode, string> = {
  "language-to-morse": "Type text to show text and Morse...",
  "morse-to-language": "Enter Morse code to decode...",
  "LANGUAGE_ONLY": "Type a message...",
  "morse-only": "Type Morse code only...",
  "text-to-morse-only": "Type text to send as Morse only...",
};

export default function MessageComposer({
  chatMode,
  error,
  onSendMessage,
}: MessageComposerProps) {
  const [text, setText] = useState("");

  function submitMessage() {
    if (!text.trim()) {
      return;
    }

    const didSendMessage = onSendMessage(text);

    setText("");
    // if (didSendMessage) {
    //   setText("");
    // }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitMessage();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter") {
      return;
    }

    if (event.shiftKey) {
      return;
    }

    event.preventDefault();
    submitMessage();
  }

  return (
    <form className={styles.composer} onSubmit={handleSubmit}>
      <div className={styles.inputArea}>
        <textarea
          className={styles.textarea}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholderByMode[chatMode]}
          rows={2}
        />

        {error ? <p className={styles.error}>{error}</p> : null}
      </div>

      <Button type="submit" disabled={!text.trim()}>
        Send
      </Button>
    </form>
  );
}

// ! i18n: move all chat UI labels, placeholders, aria-labels, empty states, mode names, prompt/confirm/alert messages, and button text into the i18n dictionary.
// ! i18n: keep real chat messages, usernames, display names, timestamps, and Morse-transformed content unchanged.
// ! i18n: dynamic strings such as "View ${displayName}'s profile" should use interpolation variables.