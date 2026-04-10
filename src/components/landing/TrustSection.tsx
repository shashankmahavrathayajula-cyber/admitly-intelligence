const stats = [
  { value: '10 schools', label: 'Evaluated with school-specific schemas' },
  { value: '5 dimensions', label: 'Scored per evaluation' },
  { value: 'Deterministic', label: 'Same input = same score, every time' },
];

export default function TrustSection() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-12 text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
          Honest <span className="italic">by design</span>
        </h2>

        <p className="mt-6 text-base leading-relaxed text-muted-foreground font-sans">
          Admitly doesn't tell you what you want to hear. If Stanford is a reach, we say so — and
          then we tell you exactly what it would take to change that. Our scoring is deterministic,
          our feedback is school-specific, and our action plans are time-bound. No fluff, no false
          hope, just strategic guidance.
        </p>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {stats.map((s) => (
            <div key={s.value} className="landing-section-fade">
              <div className="text-2xl font-bold font-sans text-[hsl(var(--score-strong))]">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground font-sans">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
