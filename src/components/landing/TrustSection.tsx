const stats = [
  { value: '10 schools', label: 'Evaluated with school-specific schemas' },
  { value: '5 dimensions', label: 'Scored per evaluation' },
  { value: 'Deterministic', label: 'Same input = same score, every time' },
];

export default function TrustSection() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold font-sans tracking-[-0.02em] text-foreground">
          Honest <span className="font-serif italic">by design</span>
        </h2>

        <p className="mt-8 text-base leading-[1.8] text-muted-foreground font-sans">
          Admitly doesn't tell you what you want to hear. If Stanford is a reach, we say so — and
          then we tell you exactly what it would take to change that. Our scoring is deterministic,
          our feedback is school-specific, and our action plans are time-bound. No fluff, no false
          hope, just strategic guidance.
        </p>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {stats.map((s) => (
            <div key={s.value} className="landing-section-fade">
              <div className="text-2xl font-bold font-sans text-[hsl(var(--score-strong))]">{s.value}</div>
              <div className="mt-2 text-sm text-muted-foreground font-sans leading-relaxed">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
