// // 负责右侧的系统消息详情窗口。
// // 用户从左侧 System notice 入口点击进入后，会看到所有系统消息。

// "use client";

// import type { SystemMessage } from "@/types/chat";
// import styles from "./css/SystemMessageWindow.module.css";

// type GameInvitationAction = "accepted" | "declined";

// type SystemMessageWindowProps = {
//   messages: SystemMessage[];
//   onClose: () => void;
//   onAnswerGameInvitation?: (
//     message: SystemMessage,
//     action: GameInvitationAction
//   ) => Promise<void>;
// };

// export default function SystemMessageWindow({
//   messages,
//   onClose,
//   onAnswerGameInvitation,
// }: SystemMessageWindowProps) {
//   async function handleAnswerInvitation(
//     message: SystemMessage,
//     action: GameInvitationAction
//   ) {
//     if (!onAnswerGameInvitation) {
//       return;
//     }

//     await onAnswerGameInvitation(message, action);
//   }

//   return (
//     <section className={styles.window}>
//       <header className={styles.header}>
//         <div>
//           <h2 className={styles.title}>System Messages</h2>
//           <p className={styles.subtitle}>
//             Game invitations, friend requests, and system notifications.
//           </p>
//         </div>

//         <button type="button" className={styles.closeButton} onClick={onClose}>
//           ×
//         </button>
//       </header>

//       <div className={styles.body}>
//         {messages.length === 0 ? (
//           <p className={styles.empty}>No system messages yet.</p>
//         ) : (
//           <ul className={styles.list}>
//             {messages.map((message) => {
//               const isGameInvitation = message.kind === "game-invitation";
//               const isUpdating = message.actionStatus === "updating";
//               const isAnswered =
//                 message.actionStatus === "accepted" ||
//                 message.actionStatus === "declined";

//               return (
//                 <li
//                   key={message.id}
//                   className={`${styles.item} ${
//                     message.isRead ? styles.read : styles.unread
//                   }`}
//                 >
//                   <div className={styles.itemMain}>
//                     <div className={styles.itemHeader}>
//                       <strong className={styles.itemTitle}>
//                         {message.title}
//                       </strong>

//                       <span className={styles.time}>{message.createdAt}</span>
//                     </div>

//                     <p className={styles.messageBody}>{message.body}</p>

//                     {isGameInvitation ? (
//                       <div className={styles.invitationArea}>
//                         {message.actionStatus === "accepted" ? (
//                           <span className={styles.acceptedBadge}>
//                             Accepted
//                           </span>
//                         ) : null}

//                         {message.actionStatus === "declined" ? (
//                           <span className={styles.declinedBadge}>
//                             Declined
//                           </span>
//                         ) : null}

//                         {message.actionStatus === "error" ? (
//                           <span className={styles.errorBadge}>
//                             Action failed
//                           </span>
//                         ) : null}

//                         {isUpdating ? (
//                           <span className={styles.pendingBadge}>
//                             Updating...
//                           </span>
//                         ) : null}

//                         {!isUpdating && !isAnswered ? (
//                           <div className={styles.actions}>
//                             <button
//                               type="button"
//                               className={styles.acceptButton}
//                               onClick={() =>
//                                 void handleAnswerInvitation(
//                                   message,
//                                   "accepted"
//                                 )
//                               }
//                             >
//                               Accept
//                             </button>

//                             <button
//                               type="button"
//                               className={styles.declineButton}
//                               onClick={() =>
//                                 void handleAnswerInvitation(
//                                   message,
//                                   "declined"
//                                 )
//                               }
//                             >
//                               Decline
//                             </button>
//                           </div>
//                         ) : null}
//                       </div>
//                     ) : null}
//                   </div>
//                 </li>
//               );
//             })}
//           </ul>
//         )}
//       </div>
//     </section>
//   );
// }

"use client";

import type { SystemMessage } from "@/types/chat";
import styles from "./css/SystemMessageWindow.module.css";

type GameInvitationAction = "accept" | "decline";

type SystemMessageWindowProps = {
  messages: SystemMessage[];
  onClose: () => void;
  onAnswerGameInvitation?: (
    message: SystemMessage,
    action: GameInvitationAction
  ) => Promise<void>;
  onJoinRadioLobby?: (message: SystemMessage) => Promise<void>;
};

export default function SystemMessageWindow({
  messages,
  onClose,
  onAnswerGameInvitation,
  onJoinRadioLobby,
}: SystemMessageWindowProps) {
  async function handleAnswerInvitation(
    message: SystemMessage,
    action: GameInvitationAction
  ) {
    if (!onAnswerGameInvitation) {
      return;
    }

    await onAnswerGameInvitation(message, action);
  }

  async function handleJoinRadioLobby(message: SystemMessage) {
    if (!onJoinRadioLobby) {
      return;
    }

    await onJoinRadioLobby(message);
  }

  return (
    <section className={styles.window}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>System Messages</h2>
          <p className={styles.subtitle}>
            Game invitations, friend requests, and system notifications.
          </p>
        </div>

        <button type="button" className={styles.closeButton} onClick={onClose}>
          ×
        </button>
      </header>

      <div className={styles.body}>
        {messages.length === 0 ? (
          <p className={styles.empty}>No system messages yet.</p>
        ) : (
          <ul className={styles.list}>
            {messages.map((message) => {
              const isGameInvitation = message.kind === "game-invitation";
              const isJoinLobby = message.kind === "join-lobby";
              const isUpdating = message.actionStatus === "updating";
              const isAnswered =
                message.actionStatus === "accepted" ||
                message.actionStatus === "declined" ||
                message.actionStatus === "expired";

              return (
                <li
                  key={message.id}
                  className={`${styles.item} ${
                    message.isRead ? styles.read : styles.unread
                  }`}
                >
                  <div className={styles.itemMain}>
                    <div className={styles.itemHeader}>
                      <strong className={styles.itemTitle}>
                        {message.title}
                      </strong>

                      <span className={styles.time}>{message.createdAt}</span>
                    </div>

                    <p className={styles.messageBody}>{message.body}</p>

                    {isGameInvitation ? (
                      <div className={styles.invitationArea}>
                        {message.actionStatus === "accepted" ? (
                          <span className={styles.acceptedBadge}>
                            Accepted
                          </span>
                        ) : null}

                        {message.actionStatus === "declined" ? (
                          <span className={styles.declinedBadge}>
                            Declined
                          </span>
                        ) : null}

                        {message.actionStatus === "expired" ? (
                          <span className={styles.declinedBadge}>
                            Expired
                          </span>
                        ) : null}

                        {message.actionStatus === "error" ? (
                          <span className={styles.errorBadge}>
                            Action failed
                          </span>
                        ) : null}

                        {isUpdating ? (
                          <span className={styles.pendingBadge}>
                            Updating...
                          </span>
                        ) : null}

                        {!isUpdating && !isAnswered ? (
                          <div className={styles.actions}>
                            <button
                              type="button"
                              className={styles.acceptButton}
                              onClick={() =>
                                void handleAnswerInvitation(
                                  message,
                                  "accept"
                                )
                              }
                            >
                              Accept
                            </button>

                            <button
                              type="button"
                              className={styles.declineButton}
                              onClick={() =>
                                void handleAnswerInvitation(
                                  message,
                                  "decline"
                                )
                              }
                            >
                              Decline
                            </button>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    {isJoinLobby ? (
                      <div className={styles.invitationArea}>
                        {message.actionStatus === "error" ? (
                          <span className={styles.errorBadge}>
                            Action failed
                          </span>
                        ) : null}

                        {isUpdating ? (
                          <span className={styles.pendingBadge}>
                            Joining...
                          </span>
                        ) : null}

                        {!isUpdating ? (
                          <div className={styles.actions}>
                            {/* //! TODO jdu: Extend this action area with a Leave/switch lobby option when needed. */}
                            <button
                              type="button"
                              className={styles.acceptButton}
                              onClick={() =>
                                void handleJoinRadioLobby(message)
                              }
                            >
                              Join lobby
                            </button>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
