// 负责一个好友条目

"use client";

import Link from "next/link";
import { useState } from "react";
import type { MouseEvent } from "react";
import type { Friend } from "@/types/chat";
import FriendContextMenu from "./FriendContextMenu";
import styles from "./css/FriendListItem.module.css";

type FriendListItemProps = {
  friend: Friend;
  isSelected: boolean;
  isGameInvitePending: boolean;
  onInviteFriendToGame: (friendId: string) => void;
  onSelectFriend: (friendId: string) => void;
  onRenameFriend: (friendId: string, nextDisplayName: string) => void;
  onDeleteFriend: (friendId: string) => void;
  onShareFriend: (friendId: string) => void;
};

export default function FriendListItem({
  friend,
  isSelected,
  isGameInvitePending,
  onSelectFriend,
  onRenameFriend,
  onDeleteFriend,
  onShareFriend,
  onInviteFriendToGame,
}: FriendListItemProps) {
  const [menuPosition, setMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const profileHref = `/users/${friend.id}`;
  const displayName = friend.displayName || friend.username || "Unknown user";
  const avatarLetter =
    friend.avatarInitial || displayName.charAt(0).toUpperCase();

  const inviteButtonLabel = isGameInvitePending ? "Pending" : "Invite";
  const isInviteDisabled = !friend.isOnline || isGameInvitePending;

  function handleContextMenu(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();

    setMenuPosition({
      x: event.clientX,
      y: event.clientY,
    });
  }

  function handleRename() {
    const nextDisplayName = window.prompt("New remark name", friend.displayName);

    if (!nextDisplayName?.trim()) {
      return;
    }

    onRenameFriend(friend.id, nextDisplayName.trim());
    setMenuPosition(null);
  }

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete ${friend.displayName} from friends?`
    );

    if (!confirmed) {
      return;
    }

    onDeleteFriend(friend.id);
    setMenuPosition(null);
  }

  function handleShare() {
    onShareFriend(friend.id);
    setMenuPosition(null);
  }

  function handleInviteToGame(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();

    if (isInviteDisabled) {
      return;
    }

    onInviteFriendToGame(friend.id);
  }

  function handleInviteToGameFromMenu() {
    if (isInviteDisabled) {
      setMenuPosition(null);
      return;
    }

    onInviteFriendToGame(friend.id);
    setMenuPosition(null);
  }

  return (
    <>
      <div
        onContextMenu={handleContextMenu}
        className={`${styles.item} ${isSelected ? styles.selected : ""}`}
      >
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
                  @{friend.username} · {friend.isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>

            <p className={styles.previewText}>
              Click the avatar or name to view the full profile.
            </p>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.row}>
            <Link href={profileHref} className={styles.nameLink}>
              {displayName}
            </Link>

            <span className={styles.time}>{friend.lastMessageAt}</span>
          </div>

          <button
            type="button"
            onClick={() => onSelectFriend(friend.id)}
            className={styles.previewButton}
          >
            <span className={styles.preview}>{friend.lastMessage}</span>

            <span
              className={`${styles.status} ${
                friend.isOnline ? styles.online : styles.offline
              }`}
              aria-label={friend.isOnline ? "Online" : "Offline"}
            />
          </button>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.inviteButton}
              disabled={isInviteDisabled}
              onClick={handleInviteToGame}
              title={
                isGameInvitePending
                    ? "A game invitation is already pending"
                    : friend.isOnline
                        ? "Invite this friend to play"
                        : "This friend is offline"
              }
            >
              {inviteButtonLabel}
            </button>
          </div>
        </div>
      </div>

      {menuPosition ? (
        <FriendContextMenu
          x={menuPosition.x}
          y={menuPosition.y}
          onClose={() => setMenuPosition(null)}
          onRename={handleRename}
          onDelete={handleDelete}
          onShare={handleShare}
          onInviteToGame={handleInviteToGameFromMenu}
          isGameInviteDisabled={isInviteDisabled}
        />
      ) : null}
    </>
  );
}

// ! i18n: move all chat UI labels, placeholders, aria-labels, empty states, mode names, prompt/confirm/alert messages, and button text into the i18n dictionary.
// ! i18n: keep real chat messages, usernames, display names, timestamps, and Morse-transformed content unchanged.
// ! i18n: dynamic strings such as "View ${displayName}'s profile" should use interpolation variables.
// ! i18n: move game invitation labels, tooltip text, disabled state text, and system messages into the i18n dictionary.