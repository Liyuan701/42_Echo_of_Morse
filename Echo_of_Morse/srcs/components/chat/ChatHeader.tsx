// 显示当前好友头像、名称、状态和关闭按钮

import Link from "next/link";
import type { Friend } from "@/types/chat";
import styles from "./css/ChatHeader.module.css";

type ChatHeaderProps = {
  friend: Friend;
  onCloseChat: () => void;
};

export default function ChatHeader({ friend, onCloseChat }: ChatHeaderProps) {
  // ! Liyuan: confirm final public user profile route.
  // Current temporary route: /users/[userId].
  const profileHref = `/users/${friend.id}`;

  const displayName = friend.displayName || friend.username || "Unknown user";
  const avatarLetter =
    friend.avatarInitial || displayName.charAt(0).toUpperCase();

  const statusText = friend.isOnline ? "Online" : "Offline";

  return (
    <header className={styles.header}>
      <div className={styles.friendArea}>
        <div className={styles.profileTrigger}>
          <Link
            href={profileHref}
            className={styles.avatarLink}
            aria-label={`View ${displayName}'s profile`}
          >
            {friend.avatarUrl ? (
              <img
                className={styles.avatarImage}
                src={friend.avatarUrl}
                alt={`${displayName}'s avatar`}
              />
            ) : (
              <span className={styles.avatarFallback}>{avatarLetter}</span>
            )}
          </Link>

          <Link href={profileHref} className={styles.nameLink}>
            {displayName}
          </Link>

          <div className={styles.profilePreview}>
            {/* //! Liyuan: replace this friend preview with real friend profile data from auth/database */}
            <div className={styles.previewHeader}>
              {friend.avatarUrl ? (
                <img
                  className={styles.previewAvatar}
                  src={friend.avatarUrl}
                  alt={`${displayName}'s avatar`}
                />
              ) : (
                <span className={styles.previewAvatarFallback}>
                  {avatarLetter}
                </span>
              )}

              <div>
                <p className={styles.previewName}>{displayName}</p>
                <p className={styles.previewStatus}>
                  @{friend.username} · {statusText}
                </p>
              </div>
            </div>

            <p className={styles.previewText}>
              Click the name or avatar to open this profile.
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={styles.closeButton}
        onClick={onCloseChat}
        aria-label="Close chat"
      >
        ×
      </button>
    </header>
  );
}

// ! i18n: move all chat UI labels, placeholders, aria-labels, empty states, mode names, prompt/confirm/alert messages, and button text into the i18n dictionary.
// ! i18n: keep real chat messages, usernames, display names, timestamps, and Morse-transformed content unchanged.
// ! i18n: dynamic strings such as "View ${displayName}'s profile" should use interpolation variables.