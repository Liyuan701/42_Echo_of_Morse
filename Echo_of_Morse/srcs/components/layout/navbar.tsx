// "use client";

// import Link from "next/link";
// import LanguageSwitcher from "@/components/layout/language-switcher";
// import styles from "./navbar.module.css";

// import { signOut, useSession } from "next-auth/react";
// import { useI18n } from "@/lib/i18n";
// import { useNotifications } from "@/components/notifications/NotificationProvider";
// import type { NotificationFriendMessage } from "@/types/notifications";

// function formatBadgeCount(count: number) {
//   return count > 99 ? "99+" : String(count);
// }

// type GroupedFriendNotification = {
//   senderId: string;
//   senderUsername: string;
//   latestMessage: NotificationFriendMessage;
//   count: number;
// };

// function groupUnreadFriendMessagesBySender(
//   messages: NotificationFriendMessage[],
//   unreadCounts: Record<string, number>
// ): GroupedFriendNotification[] {
//   const grouped = new Map<string, GroupedFriendNotification>();

//   for (const message of messages) {
//     const unreadCount = unreadCounts[message.senderId] ?? 0;

//     if (unreadCount <= 0) {
//       continue;
//     }

//     const existing = grouped.get(message.senderId);

//     if (!existing) {
//       grouped.set(message.senderId, {
//         senderId: message.senderId,
//         senderUsername: message.senderUsername,
//         latestMessage: message,
//         count: unreadCount,
//       });

//       continue;
//     }

//     const existingTime = new Date(existing.latestMessage.createdAt).getTime();
//     const nextTime = new Date(message.createdAt).getTime();

//     if (nextTime > existingTime) {
//       grouped.set(message.senderId, {
//         ...existing,
//         latestMessage: message,
//       });
//     }
//   }

//   return Array.from(grouped.values()).sort((a, b) => {
//     const aTime = new Date(a.latestMessage.createdAt).getTime();
//     const bTime = new Date(b.latestMessage.createdAt).getTime();

//     return bTime - aTime;
//   });
// }

// export default function Navbar() {
//   const { data: session, status } = useSession();
//   const isLoggedIn = status === "authenticated";

//   const {
//     totalGlobalUnreadCount,
//     pendingGameInvitations,
//     recentFriendMessages,
//     friendUnreadCounts,
//     unreadSystemMessageCount,
//     markFriendAsRead,
//     markSystemNotificationsAsRead,
//   } = useNotifications();

//   const { dictionary } = useI18n();
//   const t = dictionary.layout;

//   const visibleGameInvitations = pendingGameInvitations.slice(0, 4);

//   const groupedFriendNotifications = groupUnreadFriendMessagesBySender(
//     recentFriendMessages,
//     friendUnreadCounts
//   ).slice(0, 4);

//   const hasVisibleNotifications =
//     visibleGameInvitations.length > 0 ||
//     groupedFriendNotifications.length > 0 ||
//     unreadSystemMessageCount > 0;

//   return (
//     <header className={styles.header}>
//       <Link href="/" className={styles.logo}>
//         {t.brand}
//       </Link>

//       <nav className={styles.nav} aria-label={t.mainNavigation}>
//         <Link href="/dashboard" className={styles.navLink}>
//           {t.dashboard}
//         </Link>

//         {isLoggedIn ? (
//           <>
//             <Link href="/profile" className={styles.navLink}>
//               {t.profile}
//             </Link>

//             <span className={styles.userName}>
//               {session.user?.name ?? session.user?.email ?? t.user}
//             </span>

//             <button
//               type="button"
//               className={styles.navButton}
//               onClick={() => signOut({ callbackUrl: "/" })}
//             >
//               {t.logout}
//             </button>

//             <div className={styles.notificationWrapper}>
//               <details className={styles.notificationDetails}>
//                 <summary
//                   className={styles.notificationTrigger}
//                   aria-label="Open notifications"
//                 >
//                   <span className={styles.notificationIcon}>🔔</span>

//                   {totalGlobalUnreadCount > 0 ? (
//                     <span className={styles.notificationBadge}>
//                       {formatBadgeCount(totalGlobalUnreadCount)}
//                     </span>
//                   ) : null}
//                 </summary>

//                 <div className={styles.notificationPanel}>
//                   <div className={styles.notificationHeader}>
//                     <strong>Notifications</strong>

//                     {totalGlobalUnreadCount > 0 ? (
//                       <span className={styles.notificationCount}>
//                         {formatBadgeCount(totalGlobalUnreadCount)}
//                       </span>
//                     ) : null}
//                   </div>

//                   {!hasVisibleNotifications ? (
//                     <p className={styles.emptyNotification}>
//                       No new notifications.
//                     </p>
//                   ) : null}

//                   {visibleGameInvitations.length > 0 ? (
//                     <div className={styles.notificationSection}>
//                       <p className={styles.notificationSectionTitle}>
//                         Game invitations
//                       </p>

//                       {visibleGameInvitations.map((invitation) => (
//                         <Link
//                           key={invitation.id}
//                           href="/chat"
//                           className={styles.notificationItem}
//                         >
//                           <span className={styles.notificationItemMain}>
//                             <strong>{invitation.fromUser.username}</strong>
//                             <span>
//                               invited you to{" "}
//                               {invitation.radio?.name ?? "a radio lobby"}.
//                             </span>
//                           </span>

//                           <span className={styles.notificationItemAction}>
//                             View
//                           </span>
//                         </Link>
//                       ))}
//                     </div>
//                   ) : null}

//                   {groupedFriendNotifications.length > 0 ? (
//                     <div className={styles.notificationSection}>
//                       <p className={styles.notificationSectionTitle}>
//                         Messages
//                       </p>

//                       {groupedFriendNotifications.map((group) => (
//                         <Link
//                           key={group.senderId}
//                           href={`/chat?friendId=${group.senderId}`}
//                           className={styles.notificationItem}
//                           onClick={() => markFriendAsRead(group.senderId)}
//                         >
//                           <span className={styles.notificationItemMain}>
//                             <span className={styles.notificationSenderRow}>
//                               <strong>{group.senderUsername}</strong>

//                               <span className={styles.messageCountBadge}>
//                                 {formatBadgeCount(group.count)}
//                               </span>
//                             </span>

//                             <span>{group.latestMessage.rawText}</span>
//                           </span>

//                           <span className={styles.notificationItemAction}>
//                             View
//                           </span>
//                         </Link>
//                       ))}
//                     </div>
//                   ) : null}

//                   {unreadSystemMessageCount > 0 ? (
//                     <div className={styles.notificationSection}>
//                       <p className={styles.notificationSectionTitle}>
//                         System
//                       </p>

//                       <Link
//                         href="/chat"
//                         className={styles.notificationItem}
//                         onClick={markSystemNotificationsAsRead}
//                       >
//                         <span className={styles.notificationItemMain}>
//                           <strong>System messages</strong>
//                           <span>
//                             You have {unreadSystemMessageCount} unread system
//                             notification
//                             {unreadSystemMessageCount > 1 ? "s" : ""}.
//                           </span>
//                         </span>

//                         <span className={styles.notificationItemAction}>
//                           View
//                         </span>
//                       </Link>
//                     </div>
//                   ) : null}
//                 </div>
//               </details>
//             </div>
//           </>
//         ) : (
//           <Link href="/login" className={styles.navLink}>
//             {t.login}
//           </Link>
//         )}

//         <LanguageSwitcher />
//       </nav>
//     </header>
//   );
// }

"use client";

import Link from "next/link";
import LanguageSwitcher from "@/components/layout/language-switcher";
import styles from "./navbar.module.css";

import { signOut, useSession } from "next-auth/react";
import { useI18n } from "@/lib/i18n";
import { useNotifications } from "@/components/notifications/NotificationProvider";
import type { NotificationFriendMessage } from "@/types/notifications";

function formatBadgeCount(count: number) {
  return count > 99 ? "99+" : String(count);
}

type GroupedFriendNotification = {
  senderId: string;
  senderUsername: string;
  latestMessage: NotificationFriendMessage;
  count: number;
};

function groupUnreadFriendMessagesBySender(
  messages: NotificationFriendMessage[],
  unreadCounts: Record<string, number>
): GroupedFriendNotification[] {
  const grouped = new Map<string, GroupedFriendNotification>();

  for (const message of messages) {
    const unreadCount = unreadCounts[message.senderId] ?? 0;

    if (unreadCount <= 0) {
      continue;
    }

    const existing = grouped.get(message.senderId);

    if (!existing) {
      grouped.set(message.senderId, {
        senderId: message.senderId,
        senderUsername: message.senderUsername,
        latestMessage: message,
        count: unreadCount,
      });

      continue;
    }

    const existingTime = new Date(existing.latestMessage.createdAt).getTime();
    const nextTime = new Date(message.createdAt).getTime();

    if (nextTime > existingTime) {
      grouped.set(message.senderId, {
        ...existing,
        latestMessage: message,
      });
    }
  }

  return Array.from(grouped.values()).sort((a, b) => {
    const aTime = new Date(a.latestMessage.createdAt).getTime();
    const bTime = new Date(b.latestMessage.createdAt).getTime();

    return bTime - aTime;
  });
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";

  const {
    totalGlobalUnreadCount,
    pendingGameInvitations,
    recentFriendMessages,
    friendUnreadCounts,
    unreadSystemMessageCount,
    markFriendAsRead,
    markSystemNotificationsAsRead,
  } = useNotifications();

  const { dictionary } = useI18n();
  const t = dictionary.layout;

  const visibleGameInvitations = pendingGameInvitations.slice(0, 4);

  const groupedFriendNotifications = groupUnreadFriendMessagesBySender(
    recentFriendMessages,
    friendUnreadCounts
  ).slice(0, 4);

  const hasVisibleNotifications =
    visibleGameInvitations.length > 0 ||
    groupedFriendNotifications.length > 0 ||
    unreadSystemMessageCount > 0;

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        {t.brand}
      </Link>

      <nav className={styles.nav} aria-label={t.mainNavigation}>
        <Link href="/dashboard" className={styles.navLink}>
          {t.dashboard}
        </Link>

        {isLoggedIn ? (
          <>
            <Link href="/profile" className={styles.navLink}>
              {t.profile}
            </Link>

            <span className={styles.userName}>
              {session.user?.name ?? session.user?.email ?? t.user}
            </span>

            <button
              type="button"
              className={styles.navButton}
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              {t.logout}
            </button>

            <div className={styles.notificationWrapper}>
              <details className={styles.notificationDetails}>
                <summary
                  className={styles.notificationTrigger}
                  aria-label="Open notifications"
                >
                  <span className={styles.notificationIcon}>🔔</span>

                  {totalGlobalUnreadCount > 0 ? (
                    <span className={styles.notificationBadge}>
                      {formatBadgeCount(totalGlobalUnreadCount)}
                    </span>
                  ) : null}
                </summary>

                <div className={styles.notificationPanel}>
                  <div className={styles.notificationHeader}>
                    <strong>Notifications</strong>

                    {totalGlobalUnreadCount > 0 ? (
                      <span className={styles.notificationCount}>
                        {formatBadgeCount(totalGlobalUnreadCount)}
                      </span>
                    ) : null}
                  </div>

                  {!hasVisibleNotifications ? (
                    <p className={styles.emptyNotification}>
                      No new notifications.
                    </p>
                  ) : null}

                  {visibleGameInvitations.length > 0 ? (
                    <div className={styles.notificationSection}>
                      <p className={styles.notificationSectionTitle}>
                        Game invitations
                      </p>

                      {visibleGameInvitations.map((invitation) => (
                        <Link
                          key={invitation.id}
                          href="/chat?panel=system"
                          className={styles.notificationItem}
                        >
                          <span className={styles.notificationItemMain}>
                            <strong>{invitation.fromUser.username}</strong>
                            <span>
                              invited you to{" "}
                              {invitation.radio?.name ?? "a radio lobby"}. You
                              have 1 minute to accept.
                            </span>
                          </span>

                          <span className={styles.notificationItemAction}>
                            View
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : null}

                  {groupedFriendNotifications.length > 0 ? (
                    <div className={styles.notificationSection}>
                      <p className={styles.notificationSectionTitle}>
                        Messages
                      </p>

                      {groupedFriendNotifications.map((group) => (
                        <Link
                          key={group.senderId}
                          href={`/chat?friendId=${group.senderId}`}
                          className={styles.notificationItem}
                          onClick={() => markFriendAsRead(group.senderId)}
                        >
                          <span className={styles.notificationItemMain}>
                            <span className={styles.notificationSenderRow}>
                              <strong>{group.senderUsername}</strong>

                              <span className={styles.messageCountBadge}>
                                {formatBadgeCount(group.count)}
                              </span>
                            </span>

                            <span>{group.latestMessage.rawText}</span>
                          </span>

                          <span className={styles.notificationItemAction}>
                            View
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : null}

                  {unreadSystemMessageCount > 0 ? (
                    <div className={styles.notificationSection}>
                      <p className={styles.notificationSectionTitle}>
                        System
                      </p>

                      <Link
                        href="/chat?panel=system"
                        className={styles.notificationItem}
                        onClick={markSystemNotificationsAsRead}
                      >
                        <span className={styles.notificationItemMain}>
                          <strong>System messages</strong>
                          <span>
                            You have {unreadSystemMessageCount} unread system
                            notification
                            {unreadSystemMessageCount > 1 ? "s" : ""}.
                          </span>
                        </span>

                        <span className={styles.notificationItemAction}>
                          View
                        </span>
                      </Link>
                    </div>
                  ) : null}
                </div>
              </details>
            </div>
          </>
        ) : (
          <Link href="/login" className={styles.navLink}>
            {t.login}
          </Link>
        )}

        <LanguageSwitcher />
      </nav>
    </header>
  );
}

/*
  Notification model:
  - Chat messages are cleared by friend read state.
  - System messages are cleared by read state.
  - Game invitations are cleared only by invitation status updates.
*/
