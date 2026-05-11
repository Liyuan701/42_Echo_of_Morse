//这是不同用户的页面
import PageShell from "@/components/layout/page-shell";
import { Card } from "@/components/ui";
import { mockFriends } from "@/components/chat/faux-chat-data";
import styles from "./user-profile.module.css";

type UserProfilePageProps = {
  params: {
    userId: string;
  };
};

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const friend = mockFriends.find((item) => item.id === params.userId);

  if (!friend) {
    return (
      <main id="main-content">
        <PageShell>
          <Card>
            <h1 className={styles.title}>User not found</h1>
            <p className={styles.description}>
              We could not find this user profile.
            </p>
          </Card>
        </PageShell>
      </main>
    );
  }

  return (
    <main id="main-content">
      <PageShell>
        <Card>
          <section className={styles.profile}>
            {friend.avatarUrl ? (
              <img
                className={styles.avatar}
                src={friend.avatarUrl}
                alt={`${friend.displayName}'s avatar`}
              />
            ) : (
              <div className={styles.avatarFallback}>
                {friend.avatarInitial}
              </div>
            )}

            <div className={styles.content}>
              <h1 className={styles.title}>{friend.displayName}</h1>
              <p className={styles.username}>@{friend.username}</p>

              <p className={styles.status}>
                {friend.isOnline ? "Online" : "Offline"}
              </p>

              {/* //! Liyuan: replace this mock friend profile with real user profile data from auth/database */}
              <p className={styles.description}>
                This is a temporary public user profile page. Later, this page
                should display the real user profile from the database.
              </p>
            </div>
          </section>
        </Card>
      </PageShell>
    </main>
  );
}

// ! i18n: move public profile fallback text, online/offline labels, avatar alt text, and temporary description into the i18n dictionary.
// ! i18n: keep friend.displayName and friend.username as dynamic user data.