const features = [
  {
    title: 'School-Specific Evaluation',
    description:
      "Your profile scored against 25 universities using each school's actual admissions priorities, not a generic rubric. Reach, target, or safety — with the data to back it up.",
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
  coral: 'border-t-2 border-t-[#e85d3a]',
  teal: 'border-t-2 border-t-[#e85d3a]',
};

export default function Features() {
  return (
    <section id="features" className="py-12 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <h2 className="text-center text-2xl sm:text-3xl font-semibold font-sans tracking-[-0.02em] text-foreground">
          Built for <span className="font-serif italic">serious applicants</span>
        </h2>

        <div className="mt-10 sm:mt-16 grid gap-6 sm:gap-8 sm:grid-cols-2">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`landing-section-fade landing-scale-fade rounded-2xl border border-border/80 bg-white p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${accentBorder[f.accent]}`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <h3 className="text-lg font-medium font-sans text-foreground">{f.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground font-sans">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
