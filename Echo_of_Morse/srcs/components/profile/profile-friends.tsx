import { Card } from "@/components/ui";
import styles from "./profile-form.module.css";

type ProfileFriendsProps = {
  name: string;
  username: string;
  image?: string | null;
  isOnline: boolean;
};

export default function ProfileFriends({
	name,
	username,
	image,
	isOnline,
}: ProfileFriendsProps) {
  const avatarLetter = name.charAt(0).toUpperCase();

  const user = {
    name,
    username,
    image,
    status: isOnline ? "Online" : "Offline",

	//! besoin de données réelles pour le profil
    bio: "Learning Morse one signal at a time.",
    accuracy: "84%",
    learningLevel: "Level 4",
    friendsCount: "12",
    joinedAt: "Jan 2026",
  };

  return (
    <Card className={styles.profileCard}>
      <div className={styles.heroHeader}>
		{/* =====================  avatar ===================== */}
        <div className={styles.avatarBlock}>
          <div className={styles.avatar}>
            {user.image ? (
              <img
                src={user.image}
                className={styles.avatarImage}
                alt={`${user.name}'s avatar`}
              />
            ) : (
              avatarLetter
            )}
          </div>
        </div>
		{/* ===================== info user pour profil ===================== */}
        <div className={styles.identity}>
          <p className={styles.status}>{user.status}</p>
          <h1 className={styles.title}>{user.name}</h1>
          <p className={styles.email}>@{user.username}</p>
        </div>
      </div>

		{/* ===================== bio ===================== */}
      <section className={styles.profileSection}>
        <h2 className={styles.sectionTitle}>Bio</h2>
        <p className={styles.bio}>{user.bio}</p>
      </section>

		{/* ===================== stats pour profil ===================== */}
      <section className={styles.profileSection}>
        <h2 className={styles.sectionTitle}>Stats</h2>

        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.metaLabel}>Accuracy</span>
            <strong className={styles.metaValue}>{user.accuracy}</strong>
          </div>

          <div className={styles.statItem}>
            <span className={styles.metaLabel}>Learning level</span>
            <strong className={styles.metaValue}>{user.learningLevel}</strong>
          </div>

          <div className={styles.statItem}>
            <span className={styles.metaLabel}>Friends</span>
            <strong className={styles.metaValue}>{user.friendsCount}</strong>
          </div>

          <div className={styles.statItem}>
            <span className={styles.metaLabel}>Joined</span>
            <strong className={styles.metaValue}>{user.joinedAt}</strong>
          </div>
        </div>
      </section>
    </Card>
  );
}
