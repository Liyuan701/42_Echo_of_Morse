"use client";
import { useI18n } from "@/lib/i18n";
import { Card } from "@/components/ui";
import styles from "./profile-form.module.css";

type ProfileFriends = {
  name: string;
  username: string;
  image?: string | null;
  isOnline: boolean;
  bio?: string | null;
  learningLevel?: number;
  friendCount?: number;
  createdAt?: string;
};

export default function ProfileFriends({
	name,
	username,
	image,
	isOnline,
	bio,
	learningLevel,
	friendCount,
	createdAt,
}: ProfileFriends) {
	const { dictionary } = useI18n();
	const t = dictionary.profile;
	const avatarLetter = name.charAt(0).toUpperCase();

	const user = {
		name,
		username,
		image,
		status: isOnline ? t.online : t.offline,
		bio: bio ?? "",
		accuracy: "84%",//! besoin de données réelles pour le profil
		learningLevel: `Level ${learningLevel ?? 1}`,
		friendsCount: String(friendCount ?? 0),
		joinedAt: createdAt ? new Date(createdAt).toLocaleDateString() : "-",
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
        <h2 className={styles.sectionTitle}>{t.bio}</h2>
        <p className={styles.bio}>{user.bio}</p>
      </section>

		{/* ===================== stats pour profil ===================== */}
      <section className={styles.profileSection}>
        <h2 className={styles.sectionTitle}>{t.stats}</h2>

        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.metaLabel}>{t.accuracy}</span>
            <strong className={styles.metaValue}>{user.accuracy}</strong>
          </div>

          <div className={styles.statItem}>
            <span className={styles.metaLabel}>{t.learningLevel}</span>
            <strong className={styles.metaValue}>{user.learningLevel}</strong>
          </div>

          <div className={styles.statItem}>
            <span className={styles.metaLabel}>{t.friends}</span>
            <strong className={styles.metaValue}>{user.friendsCount}</strong>
          </div>

          <div className={styles.statItem}>
            <span className={styles.metaLabel}>{t.joined}</span>
            <strong className={styles.metaValue}>{user.joinedAt}</strong>
          </div>
        </div>
      </section>
    </Card>
  );
}
