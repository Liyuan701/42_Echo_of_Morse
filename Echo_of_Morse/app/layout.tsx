import "./globals.css";

import { I18nProvider } from "@/lib/i18n";
import AuthSessionProvider from "@/components/auth/session-provider";
import { SocketProvider } from "@/providers/socket-provider";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";

export const metadata = {
  title: "Echoes of Morse",
  description: "Learn, communicate, and compete through Morse code.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthSessionProvider>
          <SocketProvider>
            <I18nProvider>
              <NotificationProvider>
                <a href="#main-content" className="skip-link">
                  Skip to main content
                </a>
                {children}
              </NotificationProvider>
            </I18nProvider>
          </SocketProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}

// ! i18n: move metadata title, metadata description, html lang, and skip-link text into the i18n setup.
// ! i18n: html lang should follow the current selected locale, for example en / fr / zh.