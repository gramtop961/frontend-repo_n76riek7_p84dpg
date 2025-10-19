export default function CTA() {
  return (
    <section id="forum" className="relative">
      <div className="mx-auto max-w-3xl px-6 py-20 md:py-24 text-center">
        <h2 className="font-serif text-3xl tracking-tight text-neutral-900 md:text-4xl">
          A quiet space for steady progress
        </h2>
        <p className="mt-4 text-neutral-700">
          Join the private forum for weekly focus cycles, reflection prompts, and gentle accountability.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <a
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-white hover:bg-neutral-800 transition-colors"
          >
            Log in to the forum
          </a>
          <a
            href="#principles"
            className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-6 py-3 text-neutral-900 hover:bg-neutral-50 transition-colors"
          >
            Read our principles
          </a>
        </div>
        <p className="mt-6 text-xs text-neutral-500">
          New here? Browse the principles below — the forum opens after a short intro.
        </p>
      </div>
    </section>
  );
}
