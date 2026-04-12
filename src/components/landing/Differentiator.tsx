import { X, Check } from 'lucide-react';

const comparisons = [
  {
    others: 'Generic writing feedback',
    admitly: "School-specific rewrites tied to each university's actual priorities",
  },
  {
    others: '"You have a 23% chance"',
    admitly: '"Your biggest gap is essay narrative — here\'s what to write about and why"',
  },
  {
    others: 'Different answer every time',
    admitly: 'Deterministic scoring — same profile, same result, every time',
  },
];

export default function Differentiator() {
  return (
    <section className="py-12 sm:py-24 section-alt">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <h2 className="text-center text-2xl sm:text-3xl font-semibold font-sans tracking-[-0.02em] text-foreground">
          Not another <span className="font-serif italic">AI chatbot</span>
        </h2>

        <div className="mt-16 space-y-5 max-w-3xl mx-auto">
          {comparisons.map((c, i) => (
            <div
              key={i}
              className="landing-section-fade grid sm:grid-cols-2 gap-4"
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              <div className="rounded-2xl border border-border/80 bg-white p-6 flex items-start gap-3">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--score-weak))]" />
                <div>
                  <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-muted-foreground/50">Other tools</span>
                  <p className="mt-1 text-base font-sans text-muted-foreground leading-relaxed">{c.others}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-[hsl(var(--score-strong))]/20 bg-[#0d9488]/[0.06] p-6 flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--score-strong))]" />
                <div>
                  <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-[hsl(var(--score-strong))]">Admitly</span>
                  <p className="mt-1 text-base font-sans text-foreground leading-relaxed">{c.admitly}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
