"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button, Card } from "@/components/ui";
import PageShell from "@/components/layout/page-shell";
import { useI18n } from "@/lib/i18n";

export default function AuthErrorPage() {
	//----------- obtenir erreur -----------
	//nextauth donne les info erreur dans url, donc
	//lire les param dans url, puis obtenir type d'erreur: 
	// ex: /auth/error?error=AccessDenied --> error=AccessDenied
	const searchParams = useSearchParams();
	const error = searchParams.get("error");

	const router = useRouter();

	const { dictionary } = useI18n();
	const t = dictionary.authError;


	const message =
		error === "AccessDenied"
			? t.accessDenied
			: error === "OAuthCallback"
				? t.oauthCallback
				: t.defaultError;

	return (
		<PageShell>
			<Card size="narrow">
				<h1>{t.title}</h1>
				<p>{message}</p>

				<Button type="button" onClick={() => router.push("/login")} fullWidth>
					{t.backToLogin}
				</Button>
			</Card>
		</PageShell>
	);
}
