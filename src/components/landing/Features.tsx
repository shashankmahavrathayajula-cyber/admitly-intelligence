const features = [
  {
    title: 'School-Specific Evaluation',
    description:
      "Your profile scored against 10+ universities using each school's actual admissions priorities, not a generic rubric. Reach, target, or safety — with the data to back it up.",
    accent: 'coral',
  },
  {
    title: 'Essay Analyzer',
    description:
      'Paste your essay, get feedback a $300/hour counselor would give. Specific rewrites tied to what each school values. Before and after suggestions you can act on today.',
    accent: 'teal',
  },
  {
    title: 'Gap Analysis & Action Plan',
    description:
      'See exactly where your gaps are, ranked by impact. Get 5 time-bound actions with estimated score improvements. Know what to do this week, this month, and before deadlines.',
    accent: 'coral',
  },
  {
    title: 'School List Builder',
    description:
      'Evaluate against all supported schools at once. Find your reaches, targets, and safeties. Build a balanced application list backed by data.',
    accent: 'teal',
  },
];

const accentBorder: Record<string, string> = {
  coral: 'border-t-[3px] border-t-[hsl(var(--coral))]',
  teal: 'border-t-[3px] border-t-[hsl(var(--score-strong))]',
};

export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <h2 className="text-center text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
          Built for <span className="italic">serious applicants</span>
        </h2>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className={`landing-section-fade rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-md ${accentBorder[f.accent]}`}
            >
              <h3 className="text-base font-semibold font-sans text-foreground">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground font-sans">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
