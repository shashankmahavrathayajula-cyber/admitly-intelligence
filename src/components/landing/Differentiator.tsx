import { X, Check } from 'lucide-react';

const comparisons = [
  {
    others: 'Generic writing feedback',
    admitly: "School-specific rewrites tied to Stanford's priorities",
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
    <section className="py-20 sm:py-28 section-alt">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <h2 className="text-center text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
          Not another <span className="italic">AI chatbot</span>
        </h2>

        <div className="mt-14 space-y-4 max-w-3xl mx-auto">
          {comparisons.map((c, i) => (
            <div
              key={i}
              className="landing-section-fade grid sm:grid-cols-2 gap-4"
            >
              <div className="rounded-xl border border-border bg-card p-5 flex items-start gap-3">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--score-weak))]" />
                <div>
                  <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-muted-foreground/60">Other tools</span>
                  <p className="mt-1 text-sm font-sans text-muted-foreground">{c.others}</p>
                </div>
              </div>
              <div className="rounded-xl border border-[hsl(var(--score-strong))]/20 bg-[hsl(var(--score-strong))]/[0.04] p-5 flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--score-strong))]" />
                <div>
                  <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-[hsl(var(--score-strong))]">Admitly</span>
                  <p className="mt-1 text-sm font-sans text-foreground">{c.admitly}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
