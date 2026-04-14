import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, FileText, Target, GraduationCap } from 'lucide-react';

const heroCards = [
  { icon: BarChart3, name: 'School-Specific Evaluation', desc: "Scored against 25+ schools' actual priorities", accent: '#e85d3a' },
  { icon: FileText, name: 'Essay Analyzer', desc: 'Before/after rewrites tied to each school', accent: '#0d9488' },
  { icon: Target, name: 'Gap Analysis & Action Plan', desc: 'Ranked actions with estimated score impact', accent: '#d97706' },
  { icon: GraduationCap, name: 'School List Builder', desc: 'Reach, target, and safety in one click', accent: '#1a1f36' },
];

export default function Hero() {
  return (
    <section className="relative min-h-[100vh] flex items-center bg-[#1a1f36] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(232,93,58,0.08),transparent)]" />

      <div className="relative mx-auto max-w-7xl w-full px-4 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — copy */}
          <div>
            <div className="landing-fade-in mb-3">
              <span className="text-sm font-sans font-medium uppercase tracking-[0.15em] text-[hsl(var(--coral))]">
                Admitly
              </span>
            </div>

            <h1 className="landing-fade-in landing-fade-delay-1 text-3xl sm:text-5xl lg:text-[3.5rem] font-semibold leading-[1.1] tracking-tight hero-headline-gradient">
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
                  className="cta-gradient border-0 px-8 py-6 text-base text-white hover:opacity-90 w-full sm:w-auto"
                >
                  Start your free evaluation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <p className="mt-3 text-base font-sans text-gray-400">
                2 free evaluations. No credit card required.
              </p>
            </div>
          </div>

          {/* Right — feature cards 2x2 */}
          <div className="flex justify-center lg:justify-end">
            <div className="grid grid-cols-2 gap-3 max-w-md w-full">
              {heroCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.name}
                    className="rounded-xl border border-white/10 border-t-2 bg-white/[0.05] backdrop-blur-sm p-4 transition-transform duration-300 hover:-translate-y-0.5"
                    style={{
                      borderTopColor: `${card.accent}88`,
                      animation: `heroCardIn 0.5s ease-out ${i * 0.15}s both`,
                    }}
                  >
                    <Icon className="h-5 w-5 mb-2" style={{ color: card.accent }} />
                    <p className="font-medium text-white text-sm leading-snug">{card.name}</p>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{card.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
