//负责鼠标右键：修改备注、删除好友、分享好友、邀请好友进行游戏

"use client";

import { useEffect } from "react";
import styles from "./css/FriendContextMenu.module.css";

type FriendContextMenuProps = {
  x: number;
  y: number;
  onClose: () => void;
  onRename: () => void;
  onDelete: () => void;
  onShare: () => void;
  onInviteToGame: () => void;
  isGameInviteDisabled: boolean;
};

export default function FriendContextMenu({
  x,
  y,
  onClose,
  onRename,
  onDelete,
  onShare,
  onInviteToGame,
  isGameInviteDisabled,
}: FriendContextMenuProps) {
  useEffect(() => {
    function handleClick() {
      onClose();
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div
      className={styles.menu}
      style={{
        left: x,
        top: y,
      }}
      role="menu"
      onClick={(event) => event.stopPropagation()}
    >
      <button type="button" onClick={onRename} className={styles.item}>
        Rename remark
      </button>

      <button type="button" onClick={onShare} className={styles.item}>
        Share friend
      </button>

      <button
        type="button"
        onClick={onInviteToGame}
        className={styles.item}
        disabled={isGameInviteDisabled}
        title={
          isGameInviteDisabled
            ? "This friend is offline or already has a pending invitation."
            : "Invite this friend to play."
        }
      >
        Invite to game
      </button>

      <button type="button" onClick={onDelete} className={styles.deleteItem}>
        Delete friend
      </button>
    </div>
  );
}

// ! i18n: move context menu labels, title text, and game invitation disabled message into the i18n dictionary.