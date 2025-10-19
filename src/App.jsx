import Header from "./components/Header";
import Hero from "./components/Hero";
import Testimonials from "./components/Testimonials";
import CTA from "./components/CTA";

export default function App() {
  const principles = [
    {
      title: "Depth over volume",
      body:
        "Fewer commitments. Fewer apps. Concentrate on meaningful work and relationships.",
    },
    {
      title: "Boundaries by default",
      body:
        "Protect attention with intentional constraints: time blocks, single-tasking, and offline windows.",
    },
    {
      title: "Calm, not hustle",
      body:
        "Progress comes from rhythm and rest, not constant stimulation.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
      <Header />
      <main>
        <Hero />

        <section id="principles" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl tracking-tight md:text-4xl">
              The Parallel principles
            </h2>
            <p className="mt-4 text-neutral-700">
              A shared foundation that keeps us grounded and aligned.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {principles.map((p, i) => (
              <div key={i} className="rounded-2xl border border-neutral-200 p-6">
                <h3 className="font-serif text-xl text-neutral-900">{p.title}</h3>
                <p className="mt-3 text-neutral-700 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        <Testimonials />
        <CTA />
      </main>
      <footer className="border-t border-neutral-200/70">
        <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-neutral-600 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-center sm:text-left">© {new Date().getFullYear()} Parallel. Designed for focus.</p>
          <div className="flex items-center gap-6">
            <a href="#principles" className="hover:text-neutral-900">Principles</a>
            <a href="#testimonials" className="hover:text-neutral-900">Testimonials</a>
            <a href="#forum" className="hover:text-neutral-900">Forum</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
