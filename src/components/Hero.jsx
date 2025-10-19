import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="max-w-3xl">
          <h1 className="font-serif text-4xl leading-tight tracking-tight text-neutral-900 md:text-6xl">
            Practice deep work. Live with less. Together.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-neutral-700 md:text-xl">
            Parallel is a calm community for people who value focus and intentional
            technology use. Fewer tabs, more presence.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a
              href="#principles"
              className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-white hover:bg-neutral-800 transition-colors"
            >
              Explore principles
            </a>
            <a
              href="#forum"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 px-6 py-3 text-neutral-900 hover:bg-neutral-50 transition-colors"
            >
              Join the forum
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 -bottom-16 h-48 bg-gradient-to-b from-transparent to-white/80" />
    </section>
  );
}
