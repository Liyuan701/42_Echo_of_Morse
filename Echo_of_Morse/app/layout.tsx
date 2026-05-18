// import "./globals.css"

// export const metadata = {
//   title: "Echoes of Morse",
//   description: "Learn, communicate, and compete through Morse code.",
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en">
//       <body>
//         <a href="#main-content" className="skip-link">
//           Skip to main content
//         </a>
//         {children}
//       </body>
//     </html>
//   )
// }

// // ! i18n: move metadata title, metadata description, html lang, and skip-link text into the i18n setup.
// // ! i18n: html lang should follow the current selected locale, for example en / fr / zh.

import "./globals.css"
//----------------- yren -----------------
import { I18nProvider } from "@/lib/i18n";
import AuthSessionProvider from "@/components/auth/session-provider";

import { SocketProvider } from "@/providers/socket-provider";

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
        <SocketProvider>
				  {children}
        </SocketProvider>
			</I18nProvider>
		</AuthSessionProvider>
      </body>
    </html>
  )
}

// ! i18n: move metadata title, metadata description, html lang, and skip-link text into the i18n setup.
// ! i18n: html lang should follow the current selected locale, for example en / fr / zh.