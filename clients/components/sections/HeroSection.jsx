import Container from "../layout/Container";
import Button from "../ui/Button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative bg-white py-32 overflow-hidden">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block mb-6 text-sm tracking-widest uppercase text-zinc-500">
            A New Standard for Modern Relationships
          </span>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-zinc-900">
            Find Someone Who
            <br className="hidden md:block" />
            Truly Aligns With You
          </h1>

          <p className="mt-8 text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            Present who you are with clarity, explore thoughtfully crafted
            profiles, and connect with individuals who value commitment,
            direction, and shared life goals.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-5">
            <Link href="/explore">
              <Button
                variant="brand"
                className="px-8 py-4 text-base rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                Browse Profiles
              </Button>
            </Link>

            <Link href="/users/profile">
              <Button
                variant="secondary"
                className="px-8 py-4 text-base rounded-2xl"
              >
                Create Your Profile
              </Button>
            </Link>
          </div>

          <div className="mt-16 flex justify-center gap-10 text-sm text-zinc-500">
            <span>Intentional</span>
            <span>Respectful</span>
            <span>Future-Focused</span>
          </div>
        </div>
      </Container>
    </section>
  );
}