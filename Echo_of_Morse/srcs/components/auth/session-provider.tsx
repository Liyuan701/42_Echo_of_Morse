"use client";

import { SessionProvider } from "next-auth/react"; //outil pour utiliser useSession()
import type { ReactNode } from "react";
import { SocketProvider } from "@/providers/socket-provider";

export default function AuthSessionProvider({ children,}: { children: ReactNode;}) {
	return (
	<SessionProvider>
		<SocketProvider>
			{children}
		</SocketProvider>
	</SessionProvider>
	);
}