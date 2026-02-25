import Container from "@/components/layout/Container";

export default function TermPage() {
  return (
    <section className="py-24 bg-white">
      <Container className="max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
          Terms of Service
        </h1>

        <p className="mt-6 text-sm text-zinc-500">
          Last updated: {new Date().getFullYear()}
        </p>

        <div className="mt-12 space-y-10 text-sm text-zinc-700 leading-relaxed">
          
          <div>
            <h2 className="text-base font-semibold text-zinc-900 mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using Match (match.inst.lk), you agree to be bound
              by these Terms of Service. If you do not agree to these terms,
              you must not use the platform.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-zinc-900 mb-3">
              2. Platform Purpose
            </h2>
            <p>
              Match is a relationship advertisement platform that allows users
              to create a personal profile and publish a single relationship
              advertisement. The platform is intended for individuals seeking
              meaningful and genuine connections.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-zinc-900 mb-3">
              3. Eligibility
            </h2>
            <p>
              You must be at least 18 years old to create an account.
              By registering, you confirm that the information you provide
              is accurate and truthful.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-zinc-900 mb-3">
              4. User Responsibilities
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials. You agree not to post false, misleading,
              abusive, defamatory, or unlawful content.
            </p>
            <p className="mt-3">
              Users may create only one active advertisement per account.
              Duplicate or misleading profiles may result in suspension.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-zinc-900 mb-3">
              5. Content Moderation
            </h2>
            <p>
              Match reserves the right to review, remove, or suspend profiles
              and advertisements that violate platform standards or applicable
              laws. We may also restrict access to protect other users or
              maintain platform integrity.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-zinc-900 mb-3">
              6. Account Suspension & Termination
            </h2>
            <p>
              We reserve the right to suspend or permanently terminate accounts
              that violate these terms. Suspended users may lose access to their
              profile and advertisement.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-zinc-900 mb-3">
              7. Disclaimer
            </h2>
            <p>
              Match provides a platform for users to connect. We do not
              guarantee compatibility, success of relationships, or the
              accuracy of user-provided information.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-zinc-900 mb-3">
              8. Changes to Terms
            </h2>
            <p>
              We may update these Terms periodically. Continued use of the
              platform after updates constitutes acceptance of the revised
              terms.
            </p>
          </div>

        </div>
      </Container>
    </section>
  );
}