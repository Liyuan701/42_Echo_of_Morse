//这是不同用户的页面
import PageShell from "@/components/layout/page-shell";
import { Card } from "@/components/ui";
import { prisma } from "@/server/prisma";
import styles from "./user-profile.module.css";

type UserProfilePageProps = {
  params: {
    userId: string;
  };
};

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const friend = await prisma.user.findUnique({
  where: {
    id: params.userId,
  },
});
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
            {friend.image ? (
              <img
                className={styles.avatar}
                src={friend.image}
                alt={`${friend.username}'s avatar`}
              />
            ) : (
              <div className={styles.avatarFallback}>
                {friend.username[0].toUpperCase()}
              </div>
            )}

            <div className={styles.content}>
              <h1 className={styles.title}>{friend.username}</h1>
              <p className={styles.username}>@{friend.username}</p>

              <p className={styles.status}>
                {friend.isOnline ? "Online" : "Offline"}
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