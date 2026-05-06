"use client";
import Link from "next/link";
import LanguageSwitcher from "@/components/layout/language-switcher";
import styles from "./navbar.module.css";
//----------------- yren -----------------
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
	//----------------- yren -----------------
	const { data: session, status } = useSession();
	const isLoggedIn = status === "authenticated";
	//----------------- yren -----------------

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        Echoes of Morse
      </Link>

      <nav className={styles.nav} aria-label="Main navigation">
        <Link href="/dashboard" className={styles.navLink}>
          Dashboard
        </Link>

		{/* //----------------- yren ----------------- */}
		{isLoggedIn ? (
		// si login, show profile/logout
		<>
			<Link href="/profile" className={styles.navLink}>
			Profile
			</Link>

			<span className={styles.navLink}>
			{session.user?.name ?? session.user?.email ?? "User"}
			</span>

			<button
			type="button"
			className={styles.navButton}
			onClick={() => signOut({ callbackUrl: "/" })}
			>
			Logout
			</button>
		</>
		) : (
			// sinon show login/register
			<Link href="/login" className={styles.navLink}>
				Login
			</Link>
		)}
		{/* //----------------- yren ----------------- */}
        <LanguageSwitcher />
      </nav>
    </header>
  );
}