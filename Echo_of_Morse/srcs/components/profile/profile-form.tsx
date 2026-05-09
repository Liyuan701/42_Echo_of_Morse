"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button, Card } from "@/components/ui";
import styles from "./profile-form.module.css";
import { useI18n } from "@/lib/i18n";

export default function Profile() {
	const { dictionary } = useI18n();
  	const t = dictionary.profile;
	const { data: session, status } = useSession();

	if (status === "loading") {
		return (
		<Card>
			<p>{t.loading}</p>
		</Card>
		);
	}

	  if (status === "unauthenticated") {
		return (
		<Card>
			<p>{t.loginRequired}</p>
		</Card>
		);
	}

	const user = {
		name: session?.user?.name ?? t.defaultUser,
		email: session?.user?.email ?? t.noEmail,
		image: session?.user?.image,
		status: t.online,
		//! besoin de données réelles pour le profil
		level: "Intermediate",
		authProvider: "NextAuth",
		accuracy: "84%",
	};

	return (
		<section className={styles.profileHeader}>
			<Card className={styles.heroCard}>
				<div className={styles.heroHeader}>
					<div className={styles.avatarBlock}>
			{/* =====================  avatar ===================== */}
						<div className={styles.avatar}>
							{user.image ? (
								<img
									src={user.image}
									className={styles.avatarImage}
								/>
							) : (
								user.name.charAt(0) /* affiche la première lettre du nom */
							)}
						</div>

						<button type="button" className={styles.avatarButton}>
							{t.changeAvatar}
						</button>
					</div>

			{/* =====================  info user pour profil ===================== */}
					<div className={styles.identity}>
						<p className={styles.status}>{user.status}</p>
						<h1 className={styles.title}>{user.name}</h1>
						<p className={styles.email}>{user.email}</p>
					</div>

			{/* =====================  bouton éditer ===================== */}
					<Link href="/profile/edit" className={styles.editLink}>
						<Button type="button" variant="secondary">
							{t.editProfile}
						</Button>
					</Link>
					</div>

			{/* =====================  meta pour profil ===================== */}
					<div className={styles.profileMeta}>
					<div>
						<span className={styles.metaLabel}>{t.level}</span>
						<strong className={styles.metaValue}>{user.level}</strong>
					</div>

					<div>
						<span className={styles.metaLabel}>{t.account}</span>
						<strong className={styles.metaValue}>{user.authProvider}</strong>
					</div>

					<div>
						<span className={styles.metaLabel}>{t.accuracy}</span>
						<strong className={styles.metaValue}>{user.accuracy}</strong>
					</div>
				</div>
			</Card>
		</section>
	);
}
