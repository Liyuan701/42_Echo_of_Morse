"use client";
import { Button, Card } from "@/components/ui";
import Link from "next/link";
import styles from "./profile-form.module.css";
import { useI18n } from "@/lib/i18n";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Profile() {
	const { dictionary } = useI18n();
  	const t = dictionary.profile;
	const { data: session, status } = useSession();

	// ===================== Données du profil =====================
	//creer un type pour les données du profil pour les stocker
	type ProfileUser = {
		id: string;
		username: string;
		email: string | null;
		image: string | null;
		isOnline: boolean;
	};
	//setprofileUser avec un type ProfileUser ou null au début
	//ici useState<type de la variable>(valeur initiale)
	const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);

	// ===================== Charger les données du profil =====================
	//useEffect pour charger les données du profil quand le composant est monté
	useEffect(() => {
		//récupérer l'info depuis la session

		//recuperer id 
		// | signifie "ou" pour les types : session.user peut être un objet avec id, ou undefined
		const userId = (session?.user as { id?: string } | undefined)?.id;

		if (status !== "authenticated" || !userId) {
			return;
		}

		async function loadProfile() {
			try {
				const response = await fetch(`/api/users/${userId}`);

				if (!response.ok) {
					return;
				}

				const data = await response.json();
				setProfileUser(data);
			} catch (error) {
				console.error(error);
			}
		}
		loadProfile();
}, [session, status]);//si session ou status change, on recharge le profil

	// ===================== cas: n'a encore connecté ou charge =====================
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

	// ===================== mettre à jour les info du user =====================
	const user = {
		name: profileUser?.username ?? session?.user?.name ?? t.defaultUser,
		email: profileUser?.email ?? session?.user?.email ?? t.noEmail,
		image: profileUser?.image ?? session?.user?.image,
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
