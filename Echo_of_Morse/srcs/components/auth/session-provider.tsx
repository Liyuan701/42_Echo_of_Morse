"use client";

import { SessionProvider } from "next-auth/react"; //outil pour utiliser useSession()
import type { ReactNode } from "react";

export default function AuthSessionProvider({ children,}: { children: ReactNode;}) {
	return <SessionProvider>{children}</SessionProvider>;
}