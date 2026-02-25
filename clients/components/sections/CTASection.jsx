import Container from "../layout/Container";
import Button from "../ui/Button";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-28 bg-white">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900">
            Begin Something That Truly Matters
          </h2>

          <p className="mt-6 text-lg text-zinc-600 leading-relaxed">
            Create your profile, present yourself with clarity, and connect
            with individuals who are ready for meaningful commitment.
          </p>

          <div className="mt-10 flex justify-center">
            <Link href="/users/profile">
              <Button
                variant="brand"
                className="px-8 py-4 text-base rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                Create Your Profile
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}