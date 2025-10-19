export default function Testimonials() {
  const items = [
    {
      quote:
        "Parallel helped me rebuild my attention. My mornings are now sacred blocks of uninterrupted work.",
      name: "Amara K.",
      role: "Researcher",
    },
    {
      quote:
        "I deleted 60% of my apps and gained back hours each week. The community keeps me accountable.",
      name: "Jules P.",
      role: "Product Designer",
    },
    {
      quote:
        "It’s the kindest corner of the internet. Thoughtful prompts, no noise, and real depth.",
      name: "Leo M.",
      role: "Engineer",
    },
  ];

  return (
    <section id="testimonials" className="bg-neutral-50 border-y border-neutral-200/70">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl tracking-tight text-neutral-900 md:text-4xl">
            Stories from the community
          </h2>
          <p className="mt-4 text-neutral-700">
            Gentle accountability, simple systems, and focused days.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <figure
              key={i}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <blockquote className="font-serif italic text-neutral-900 leading-relaxed">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-4 text-sm text-neutral-600">
                <span className="font-medium text-neutral-900">{t.name}</span>
                <span className="mx-2">·</span>
                {t.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
