import Container from "@/components/layout/Container";

export default function PrivacyPage() {
  return (
    <section className="py-24 bg-white">
      <Container className="max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
          Privacy Policy
        </h1>

        <p className="mt-6 text-sm text-zinc-500">
          Last updated: {new Date().getFullYear()}
        </p>

        <div className="mt-12 space-y-10 text-sm text-zinc-700 leading-relaxed">

          <div>
            <h2 className="text-base font-semibold text-zinc-900 mb-3">
              1. Information We Collect
            </h2>
            <p>
              When you register on Match, we collect personal information
              including your name, email address, username, gender,
              date of birth, and profile details that you choose to share.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-zinc-900 mb-3">
              2. How We Use Information
            </h2>
            <p>
              Your information is used to operate the platform, display
              your public profile, improve user experience, and maintain
              platform quality.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-zinc-900 mb-3">
              3. Public Information
            </h2>
            <p>
              Information included in your advertisement profile may be
              publicly visible. You are responsible for the details you
              choose to publish.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-zinc-900 mb-3">
              4. Data Protection
            </h2>
            <p>
              We implement appropriate technical and organizational safeguards
              to protect personal information from unauthorized access,
              alteration, or misuse.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-zinc-900 mb-3">
              5. Data Retention
            </h2>
            <p>
              Personal data is retained as long as your account remains active.
              You may request deletion of your account, after which related
              personal information will be removed in accordance with
              applicable laws.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-zinc-900 mb-3">
              6. Updates to This Policy
            </h2>
            <p>
              We may update this Privacy Policy periodically. Continued use
              of the platform constitutes acceptance of any revisions.
            </p>
          </div>

        </div>
      </Container>
    </section>
  );
}