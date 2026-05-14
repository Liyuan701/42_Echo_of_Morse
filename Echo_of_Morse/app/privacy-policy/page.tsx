import PageShell from "@/components/layout/page-shell";

export default function PrivacyPolicyPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-6 py-10 text-gray-800 leading-7">
        <h1 className="mb-4 text-4xl font-bold">Privacy Policy</h1>

        <p className="text-sm text-gray-500">
          <em>Effective Date: [10/07/2026]</em>
        </p>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">1. Introduction</h2>

          <p>
            Welcome to Echoes of Morse, an online platform for learning Morse
            code, participating in competitions, and communicating with other
            users. This Privacy Policy explains how Morse Team collects, uses,
            stores, and protects your personal data when you use our platform.
          </p>

          <p>
            By using Echoes of Morse, you agree to the practices described in
            this policy.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">2. Data Controller</h2>

          <p>
            Morse Team —{" "}
            <a
              href="mailto:morseteam@42.fr"
              className="text-blue-600 hover:underline"
            >
              morseteam@42.fr
            </a>
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">3. Data We Collect</h2>

          <div className="space-y-3">
            <h3 className="text-xl font-medium">
              3.1 Account Information
            </h3>

            <p>
              When you log in via GitHub or 42 OAuth, we receive your username,
              email address, and profile picture. We do not store your password.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-medium">
              3.2 Usage & Activity Data
            </h3>

            <ul className="list-disc pl-6 space-y-2">
              <li>Learning progress and exercise results</li>
              <li>Competition history and scores</li>
              <li>Leaderboard rankings</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-medium">3.3 Private Messages</h3>

            <p>
              Messages sent via the private chat feature are stored in our
              database for the duration of your account.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-medium">3.4 Technical Data</h3>

            <ul className="list-disc pl-6 space-y-2">
              <li>IP address, browser type, operating system</li>
              <li>Session and connection timestamps</li>
            </ul>
          </div>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            4. How We Use Your Data
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>To authenticate your identity via GitHub or 42 OAuth</li>
            <li>To operate the learning system and track your progress</li>
            <li>To run competitions and display leaderboards</li>
            <li>To enable private messaging between users</li>
            <li>To maintain platform security and prevent abuse</li>
          </ul>

          <p>
            We do not send marketing emails. We do not use your data for
            advertising purposes.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            5. Third-Party Services
          </h2>

          <p>
            We use GitHub OAuth and 42 OAuth for authentication. These
            providers may collect data according to their own privacy policies.
            We do not sell your data to any third party.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            6. Private Chat & Content Moderation
          </h2>

          <p>
            Private messages are retained while your account is active. In the
            event of a reported violation, platform administrators may access
            chat content for moderation purposes. Please do not share sensitive
            personal information in chat.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">7. Data Retention</h2>

          <p>
            We retain your data for as long as your account is active. Upon
            account deletion, your profile and messages are permanently deleted.
            Competition data may be retained in anonymised form for statistical
            purposes.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            8. Your Rights (GDPR)
          </h2>

          <p>
            As an EU user, you have the right to access, correct, delete,
            restrict, or export your data. To exercise these rights, contact us
            at{" "}
            <a
              href="mailto:morseteam@42.fr"
              className="text-blue-600 hover:underline"
            >
              morseteam@42.fr
            </a>
            . We will respond within 30 days. You may also lodge a complaint
            with your national data protection authority.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">9. Data Security</h2>

          <p>
            We use OAuth-based authentication, encrypted storage, and access
            controls to protect your data. No system is completely secure. We
            recommend using strong passwords on your GitHub or 42 accounts.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            10. Children&apos;s Privacy
          </h2>

          <p>
            Echoes of Morse is not directed at children under 13. If you
            believe a child has provided us with personal data, please contact
            us and we will delete it promptly.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            11. Changes to This Policy
          </h2>

          <p>
            We may update this policy from time to time. Continued use of the
            platform after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">12. Contact</h2>

          <p>
            Morse Team —{" "}
            <a
              href="mailto:morseteam@42.fr"
              className="text-blue-600 hover:underline"
            >
              morseteam@42.fr
            </a>
          </p>
        </section>
      </div>
    </PageShell>
  );
}

//! check if we have somethings to change (third part API etc.)
// ! i18n: move legal page titles and body text into the i18n dictionary.
// ! i18n: once real legal content is added, each locale should have its own reviewed legal text.