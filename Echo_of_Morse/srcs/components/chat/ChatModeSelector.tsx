//负责选择聊天模式

import type { ChatMode } from "@/types/chat";
import { Button } from "@/components/ui";
import styles from "./css/ChatModeSelector.module.css";

type ChatModeSelectorProps = {
  value: ChatMode;
  onChange: (mode: ChatMode) => void;
};

const modes: Array<{
  value: ChatMode;
  label: string;
}> = [
  {
    value: "LANGUAGE_TO_MORSE",
    label: "Language -> Morse",
  },
  {
    value: "morse-to-language",
    label: "Morse -> Language",
  },
  {
    value: "LANGUAGE_ONLY",
    label: "Text only",
  },
  {
    value: "morse-only",
    label: "Morse only",
  },
  {
    value: "text-to-morse-only",
    label: "Encode only",
  },
];

export default function ChatModeSelector({
  value,
  onChange,
}: ChatModeSelectorProps) {
  return (
    <div className={styles.selector} aria-label="Chat mode selector">
      {modes.map((mode) => (
        <Button
          key={mode.value}
          type="button"
          size="sm"
          variant={value === mode.value ? "primary" : "secondary"}
          onClick={() => onChange(mode.value)}
        >
          {mode.label}
        </Button>
      ))}
    </div>
  );
}


// ! i18n: move all chat UI labels, placeholders, aria-labels, empty states, mode names, prompt/confirm/alert messages, and button text into the i18n dictionary.
// ! i18n: keep real chat messages, usernames, display names, timestamps, and Morse-transformed content unchanged.
// ! i18n: dynamic strings such as "View ${displayName}'s profile" should use interpolation variables.