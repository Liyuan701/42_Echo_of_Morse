"use client";
import { Button, Card } from "@/components/ui";
import Link from "next/link";
import styles from "./profile-form.module.css";
import { useI18n } from "@/lib/i18n";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Profile() {
	const { dictionary } = useI18n();
  	const t = dictionary.profile;
	const { data: session, status } = useSession();

	// ===================== Données du profil =====================
	//creer un type pour les données du profil
	type ProfileUser = {
		id: string;
		username: string;
		email: string | null;
		image: string | null;
		isOnline: boolean;
	};
	//setprofileUser avec un type ProfileUser/null au début
	//ici useState<type de la variable>(valeur initiale)
	const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);

	// ===================== Charger les données du profil =====================
	//useEffect pour charger les données du profil
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
		bio: "hahahahaha.",
		accuracy: "84%",
		learningLevel: "Level 4",
		friendsCount: "12",
		joinedAt: "Jan 2026",
		googleLinked: false,
		fortyTwoLinked: true,
	};

	return (
			<Card className={styles.profileCard}>
				<div className={styles.heroHeader}>
			{/* =====================  avatar ===================== */}
					<div className={styles.avatarBlock}>
						<div className={styles.avatar}>
							{user.image ? (
								<img src={user.image} className={styles.avatarImage}/>
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

			{/* =====================  bio ===================== */}
					<section className={styles.profileSection}>
						<h2 className={styles.sectionTitle}>{t.bio}</h2>
						<p className={styles.bio}>{user.bio}</p>
					</section>
			{/* =====================  stats pour profil ===================== */}
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
		
			{/* ===================== comptes provi ===================== */}
				<section className={styles.profileSection}>
				<h2 className={styles.sectionTitle}>{t.connectedAccounts}</h2>

				<div className={styles.connectedList}>
					<div className={styles.connectedRow}>
					<div>
						<span className={styles.providerName}>Google</span>
						<p className={styles.providerDescription}>{t.notConnected}</p>
					</div>

					<Button type="button" variant="secondary" disabled>
						Coming soon
					</Button>
					</div>

					<div className={styles.connectedRow}>
					<div>
						<span className={styles.providerName}>42</span>
						<p className={styles.providerDescription}>{t.notConnected}</p>
					</div>

					<Button type="button" variant="secondary" disabled>
						Coming soon
					</Button>
					</div>
				</div>
				</section>
			</Card>
	);
}
