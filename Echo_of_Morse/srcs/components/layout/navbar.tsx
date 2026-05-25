"use client";
import Link from "next/link";
import LanguageSwitcher from "@/components/layout/language-switcher";
import styles from "./navbar.module.css";
//----------------- yren -----------------
import { signOut, useSession } from "next-auth/react";
import { useI18n } from "@/lib/i18n";

export default function Navbar() {
	//----------------- yren -----------------
	const { data: session, status } = useSession();
	const isLoggedIn = status === "authenticated";

	const { dictionary } = useI18n();
	const t = dictionary.layout;
	//----------------- yren -----------------

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        {t.brand}
      </Link>

      <nav className={styles.nav} aria-label={t.mainNavigation}>
        <Link href="/dashboard" className={styles.navLink}>
          {t.dashboard}
        </Link>

		{/* //----------------- yren ----------------- */}
		{isLoggedIn ? (
		// si login, show profile/logout
		<>
			<Link href="/profile" className={styles.navLink}>
				{t.profile}
			</Link>

			<span className={styles.navLink}>
			{session.user?.name ?? session.user?.email ?? t.user}
			</span>

			<button
			type="button"
			className={styles.navButton}
			onClick={() => signOut({ callbackUrl: "/" })}
			>
				{t.logout}
			</button>
		</>
		) : (
			// sinon show login
			<Link href="/login" className={styles.navLink}>
				{t.login}
			</Link>
		)}
		{/* //----------------- yren ----------------- */}
        <LanguageSwitcher />
      </nav>
    </header>
  );
}
