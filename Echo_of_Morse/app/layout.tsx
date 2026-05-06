import "./globals.css"
//----------------- yren -----------------
import { I18nProvider } from "@/lib/i18n";
import AuthSessionProvider from "@/components/auth/session-provider";

export const metadata = {
  title: "Echoes of Morse",
  description: "Learn, communicate, and compete through Morse code.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
		<AuthSessionProvider>
			<I18nProvider>
				<a href="#main-content" className="skip-link">
					Skip to main content
				</a>
				{children}
			</I18nProvider>
		</AuthSessionProvider>
      </body>
    </html>
  )
}