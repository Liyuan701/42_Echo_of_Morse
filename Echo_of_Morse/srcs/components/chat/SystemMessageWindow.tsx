// 负责右侧的系统消息详情窗口。
// 用户从左侧 System notice 入口点击进入后，会看到所有系统消息。

import type { SystemMessage } from "@/types/chat";
import styles from "./css/SystemMessageWindow.module.css";

type SystemMessageWindowProps = {
  messages: SystemMessage[];
  onClose: () => void;
};

export default function SystemMessageWindow({
  messages,
  onClose,
}: SystemMessageWindowProps) {
  return (
    <section className={styles.window}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>System messages</h1>
          <p className={styles.description}>
            Notifications about friend requests, shared contacts, and local chat
            actions.
          </p>
        </div>

        <button type="button" className={styles.closeButton} onClick={onClose}>
          ×
        </button>
      </header>

      <div className={styles.list}>
        {messages.length > 0 ? (
          messages.map((message) => (
            <article key={message.id} className={styles.message}>
              <div className={styles.messageHeader}>
                <h2 className={styles.messageTitle}>{message.title}</h2>
                <time className={styles.time}>{message.createdAt}</time>
              </div>

              <p className={styles.body}>{message.body}</p>
            </article>
          ))
        ) : (
          <p className={styles.empty}>No system messages yet.</p>
        )}
      </div>
    </section>
  );
}