import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';

function ProductMockup() {
  const gaps = [
    { label: 'Academic Preparation', current: 7, target: 8.5, strong: false, gap: '1.5 pts' },
    { label: 'Extracurricular Impact', current: 6, target: 8, strong: false, gap: '2 pts' },
    { label: 'Essay & Narrative', current: 8.5, target: 8, strong: true, gap: null },
    { label: 'Honors & Awards', current: 5, target: 7, strong: false, gap: '2 pts' },
    { label: 'Institutional Fit', current: 7.5, target: 8, strong: false, gap: '0.5 pts' },
  ];

  return (
    <div className="mockup-float rounded-2xl border border-white/20 bg-white/[0.05] p-6 backdrop-blur-sm shadow-2xl shadow-black/20 max-w-md w-full">
      <div className="flex items-center gap-2 mb-5">
        <div className="h-3 w-3 rounded-full bg-[#e85d3a]/70" />
        <div className="h-3 w-3 rounded-full bg-[#d97706]/50" />
        <div className="h-3 w-3 rounded-full bg-[#0d9488]/50" />
        <span className="ml-2 text-xs font-sans text-white/35 tracking-wide">Gap Analysis — Stanford University</span>
      </div>
      <div className="space-y-4">
        {gaps.map((g) => (
          <div key={g.label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[13px] font-sans font-medium text-white/70">{g.label}</span>
              {g.strong ? (
                <span className="flex items-center gap-1 text-xs font-sans font-medium text-[#0d9488]">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Already strong
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-sans text-white/40">
                  {g.current >= 7 ? null : <AlertTriangle className="h-3 w-3 text-[#d97706]" />}
                  <span>Gap: <span className={g.current >= 7 ? 'text-white/50' : 'text-[#d97706]'}>{g.gap}</span></span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-white/[0.12]">
                <div
                  className="h-2 rounded-full transition-all duration-1000"
                  style={{
                    width: `${(g.current / 10) * 100}%`,
                    background: g.strong
                      ? '#0d9488'
                      : g.current >= 7
                        ? '#0d9488'
                        : g.current >= 5
                          ? '#d97706'
                          : '#dc2626',
                  }}
                />
              </div>
              <span className="text-xs font-sans font-medium text-white/50 w-14 text-right tabular-nums">
                {g.current}/10
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-[100vh] flex items-center bg-[#1a1f36] overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(232,93,58,0.08),transparent)]" />

      <div className="relative mx-auto max-w-7xl w-full px-5 py-24 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left — copy */}
          <div>
            <div className="landing-fade-in mb-3">
              <span className="text-sm font-sans font-medium uppercase tracking-[0.15em] text-[hsl(var(--coral))]">
                Admitly
              </span>
            </div>

            <h1 className="landing-fade-in landing-fade-delay-1 text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold leading-[1.1] tracking-tight hero-headline-gradient">
              Know exactly where you stand.{' '}
              <span className="italic">Know exactly what to do.</span>
            </h1>

            <p className="landing-fade-in landing-fade-delay-2 mt-6 max-w-lg text-base sm:text-lg leading-relaxed text-gray-300 font-sans">
              Admitly evaluates your college application against each school's actual priorities — not generic advice. Get school-specific scores, essay feedback with rewrites, and a personalized action plan.
            </p>

            <div className="landing-fade-in landing-fade-delay-3 mt-10">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="cta-gradient border-0 px-8 py-6 text-base text-white hover:opacity-90"
                >
                  Start your free evaluation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <p className="mt-3 text-base font-sans text-gray-400">
                3 free evaluations. No credit card required.
              </p>
            </div>
          </div>

          {/* Right — product mockup */}
          <div className="landing-slide-right flex justify-center lg:justify-end">
            <ProductMockup />
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
