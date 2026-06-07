import PageShell from "@/components/layout/page-shell";

export default function TermsPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-6 py-10 text-gray-800 leading-7">
        <h1 className="mb-4 text-4xl font-bold">Terms of Service</h1>

        <p className="text-sm text-gray-500">
          <em>Effective Date: [10/07/2026]</em>
        </p>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">1. Introduction</h2>

          <p>
            Welcome to Echoes of Morse. These Terms of Service govern your use
            of our platform, including Morse code learning tools, competitions,
            leaderboards, and messaging features.
          </p>

          <p>
            By accessing or using Echoes of Morse, you agree to these Terms.
            If you do not agree, please do not use the platform.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">2. Eligibility</h2>

          <p>
            You must be at least 13 years old to use this platform. By using
            Echoes of Morse, you confirm that you meet this requirement.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">3. User Accounts</h2>

          <p>
            Access to the platform requires authentication via GitHub OAuth or
            42 OAuth.
          </p>

          <p>
            You are responsible for maintaining the security of your account and
            for all activities carried out under your account.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">4. Acceptable Use</h2>

          <p>You agree not to:</p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Use the platform for illegal purposes</li>
            <li>Attempt to hack, disrupt, or overload the service</li>
            <li>Cheat in competitions or manipulate rankings</li>
            <li>Send abusive, offensive, or harmful messages</li>
            <li>Impersonate another user or organisation</li>
          </ul>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            5. Competitions and Rankings
          </h2>

          <p>
            Echoes of Morse provides competitions and leaderboards for
            educational and entertainment purposes.
          </p>

          <p>
            We reserve the right to remove scores, suspend accounts, or reset
            rankings in cases of cheating, abuse, or technical issues.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">6. Private Messaging</h2>

          <p>
            Users may communicate through private chat features. You are solely
            responsible for the content you send.
          </p>

          <p>
            We reserve the right to moderate or remove content that violates
            these Terms or applicable laws.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">7. Intellectual Property</h2>

          <p>
            All platform content, design, logos, and learning materials are the
            property of Morse Team unless otherwise stated.
          </p>

          <p>
            You may not copy, redistribute, or commercially exploit platform
            content without permission.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">8. Service Availability</h2>

          <p>
            We strive to maintain continuous access to the platform, but we do
            not guarantee uninterrupted service.
          </p>

          <p>
            The platform may be modified, suspended, or discontinued at any
            time without prior notice.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">9. Limitation of Liability</h2>

          <p>
            Echoes of Morse is provided {"\"as is\""} without warranties of any
            kind.
          </p>

          <p>
            Morse Team shall not be liable for data loss, service interruptions,
            or damages arising from the use of the platform.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">10. Termination</h2>

          <p>
            We reserve the right to suspend or terminate accounts that violate
            these Terms or threaten platform security.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">11. Changes to These Terms</h2>

          <p>
            We may update these Terms from time to time. Continued use of the
            platform after changes constitutes acceptance of the updated Terms.
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

// ! i18n: move legal page titles and body text into the i18n dictionary.
// ! i18n: once real legal content is added, each locale should have its own reviewed legal text.