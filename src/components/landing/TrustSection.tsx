import { Shield, Eye, RefreshCw } from 'lucide-react';

const cards = [
  {
    icon: Shield,
    title: 'No false promises',
    description:
      "If a school is a reach, we tell you — and show you what it would take to change that.",
  },
  {
    icon: Eye,
    title: 'Transparent & private',
    description:
      'Your individual profile is never shared with universities or third parties without your explicit permission. We use anonymized data to improve our evaluation engine.',
  },
  {
    icon: RefreshCw,
    title: 'Consistent results',
    description:
      "Run the same profile twice, get the same scores. Our evaluation engine is built on data, not randomness.",
  },
];

export default function TrustSection() {
  return (
    <section className="py-12 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <h2 className="text-center text-2xl sm:text-3xl font-semibold font-sans tracking-[-0.02em] text-foreground">
          Honest <span className="font-serif italic">by design</span>
        </h2>

        <div className="mt-10 sm:mt-16 grid gap-6 sm:gap-8 sm:grid-cols-3">
          {cards.map((c, i) => (
            <div
              key={c.title}
              className="landing-section-fade rounded-2xl border border-border/80 bg-white p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#e85d3a]/10">
                <c.icon className="h-5 w-5 text-[#e85d3a]" />
              </div>
              <h3 className="text-lg font-medium font-sans text-foreground">{c.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground font-sans">
                {c.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
