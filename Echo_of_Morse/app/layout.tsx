import "./globals.css"
import { I18nProvider } from "@/lib/i18n";

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
		<I18nProvider>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
		</I18nProvider>
      </body>
    </html>
  )
}