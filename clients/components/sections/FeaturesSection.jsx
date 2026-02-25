import Container from "../layout/Container";
import { FiUser, FiShield, FiHeart } from "react-icons/fi";

export default function FeaturesSection() {
  return (
    <section className="relative py-28 bg-gradient-to-b from-white to-zinc-50">
      <Container>
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            A Refined Way to Find the Right Person
          </h2>
          <p className="mt-6 text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            Thoughtfully designed to help individuals present themselves clearly,
            express genuine intentions, and connect with purpose.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="group rounded-3xl bg-white p-10 shadow-sm border border-zinc-100 hover:shadow-xl transition-all duration-300 text-center">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-2xl bg-zinc-100 group-hover:bg-zinc-900 transition-colors duration-300">
              <FiUser className="text-zinc-900 text-2xl group-hover:text-white transition-colors duration-300" />
            </div>

            <h3 className="mt-8 text-xl font-semibold">
              Complete Personal Profiles
            </h3>

            <p className="mt-4 text-zinc-600 leading-relaxed text-sm">
              Share your background, values, and aspirations in a structured,
              meaningful way that truly represents who you are.
            </p>
          </div>

          <div className="group rounded-3xl bg-white p-10 shadow-sm border border-zinc-100 hover:shadow-xl transition-all duration-300 text-center">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-2xl bg-zinc-100 group-hover:bg-zinc-900 transition-colors duration-300">
              <FiShield className="text-zinc-900 text-2xl group-hover:text-white transition-colors duration-300" />
            </div>

            <h3 className="mt-8 text-xl font-semibold">
              Structured & Intentional
            </h3>

            <p className="mt-4 text-zinc-600 leading-relaxed text-sm">
              Every profile is focused on clarity and purpose, helping you connect
              with individuals who are aligned with your life direction.
            </p>
          </div>

          <div className="group rounded-3xl bg-white p-10 shadow-sm border border-zinc-100 hover:shadow-xl transition-all duration-300 text-center">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-2xl bg-zinc-100 group-hover:bg-zinc-900 transition-colors duration-300">
              <FiHeart className="text-zinc-900 text-2xl group-hover:text-white transition-colors duration-300" />
            </div>

            <h3 className="mt-8 text-xl font-semibold">
              Meaningful Connections
            </h3>

            <p className="mt-4 text-zinc-600 leading-relaxed text-sm">
              Move beyond casual swiping and discover people who value commitment,
              respect, and long-term compatibility.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}