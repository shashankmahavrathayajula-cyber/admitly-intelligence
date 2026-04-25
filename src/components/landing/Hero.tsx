import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, FileText, Target, GraduationCap, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';

const CYCLE_MS = 5000;

const tools = [
  {
    key: 'evaluate',
    label: 'Evaluate',
    icon: BarChart3,
    accent: '#e85d3a',
    title: 'School-Specific Evaluation',
    desc: 'Your profile scored against each school\'s actual admissions priorities — not a generic rubric.',
  },
  {
    key: 'essay',
    label: 'Essays',
    icon: FileText,
    accent: '#0d9488',
    title: 'Essay Analyzer',
    desc: 'Specific before-and-after rewrite suggestions tied to what each school\'s readers look for.',
  },
  {
    key: 'plan',
    label: 'Plan',
    icon: Target,
    accent: '#d97706',
    title: 'Gap Analysis & Action Plan',
    desc: 'See exactly where your biggest gaps are, ranked by how much improving them would help.',
  },
  {
    key: 'list',
    label: 'School List',
    icon: GraduationCap,
    accent: '#6366f1',
    title: 'School List Builder',
    desc: 'See your reaches, targets, and safeties side by side. Build a balanced list backed by data.',
  },
];

/* ── Mockup visuals ── */

function EvaluateMockup() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-white text-sm">Stanford University</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#e85d3a]/20 text-[#e85d3a] font-medium">Reach</span>
      </div>
      {[
        { label: 'Academic', score: 7.2, color: '#0d9488' },
        { label: 'Activities', score: 5.1, color: '#d97706' },
        { label: 'Essay', score: 8.0, color: '#0d9488' },
        { label: 'Honors', score: 4.5, color: '#e85d3a' },
        { label: 'Fit', score: 7.8, color: '#0d9488' },
      ].map((d) => (
        <div key={d.label} className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-white/60">{d.label}</span>
            <span className="text-white/40 tabular-nums">{d.score}/10</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${d.score * 10}%`, backgroundColor: d.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function EssayMockup() {
  return (
    <div className="space-y-3 text-sm">
      <p className="text-white/40 line-through text-xs leading-relaxed">
        "I have always been passionate about science and making a difference in the world"
      </p>
      <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-[#0d9488]/20 text-[#0d9488] font-medium">Rewrite</span>
      <p className="text-white/80 text-xs leading-relaxed">
        "The first time I isolated a protein in lab, I forgot about the timer — and accidentally discovered our enzyme was heat-stable"
      </p>
      <div className="flex items-center gap-1.5 mt-1">
        <CheckCircle2 className="h-3 w-3 text-[#0d9488]" />
        <span className="text-[10px] text-[#0d9488]">More specific, shows genuine curiosity</span>
      </div>
    </div>
  );
}

function PlanMockup() {
  const items = [
    { label: 'Academic Preparation', current: 7, target: 8.5, strong: false },
    { label: 'Essay & Narrative', current: 8.5, target: 8, strong: true },
    { label: 'Honors & Awards', current: 5, target: 7.5, strong: false },
  ];
  return (
    <div className="space-y-3">
      {items.map((g) => (
        <div key={g.label}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-white/60">{g.label}</span>
            {g.strong ? (
              <span className="flex items-center gap-1 text-[10px] text-[#0d9488]">
                <CheckCircle2 className="h-3 w-3" /> Strong
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] text-white/40">
                <AlertTriangle className="h-3 w-3 text-[#d97706]" />
                Gap: {(g.target - g.current).toFixed(1)} pts
              </span>
            )}
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(g.current / 10) * 100}%`,
                backgroundColor: g.strong ? '#0d9488' : g.current >= 7 ? '#0d9488' : '#d97706',
              }}
            />
          </div>
        </div>
      ))}
      <div className="border-t border-white/10 pt-2 mt-2">
        <p className="text-[10px] text-white/50 font-medium mb-1">Top action:</p>
        <p className="text-[11px] text-white/70">Add a national-level honor or award (+1.5 pts est.)</p>
      </div>
    </div>
  );
}

function ListMockup() {
  const groups = [
    { label: 'Reaches', color: '#e85d3a', schools: [{ n: 'Stanford', s: 62 }, { n: 'MIT', s: 58 }] },
    { label: 'Targets', color: '#d97706', schools: [{ n: 'UCLA', s: 74 }, { n: 'Michigan', s: 71 }] },
    { label: 'Safeties', color: '#0d9488', schools: [{ n: 'University of Washington', s: 84 }, { n: 'Stanford University', s: 81 }] },
  ];
  return (
    <div className="space-y-3">
      {groups.map((g) => (
        <div key={g.label}>
          <p className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: g.color }}>{g.label}</p>
          {g.schools.map((s) => (
            <div key={s.n} className="flex justify-between text-[11px] py-0.5">
              <span className="text-white/70">{s.n}</span>
              <span className="text-white/40 tabular-nums">{s.s}%</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

const mockups = [<EvaluateMockup />, <EssayMockup />, <PlanMockup />, <ListMockup />];

/* ── Hero Showcase ── */

function HeroShowcase() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const paused = useRef(false);
  const startTime = useRef(Date.now());
  const elapsed = useRef(0);
  const rafId = useRef(0);

  const goTo = useCallback((idx: number) => {
    setActive(idx);
    elapsed.current = 0;
    startTime.current = Date.now();
    setProgress(0);
  }, []);

  const tick = useCallback(() => {
    if (!paused.current) {
      const now = Date.now();
      elapsed.current += now - startTime.current;
      startTime.current = now;
      const pct = Math.min(elapsed.current / CYCLE_MS, 1);
      setProgress(pct);
      if (pct >= 1) {
        goTo((active + 1) % tools.length);
        return;
      }
    } else {
      startTime.current = Date.now();
    }
    rafId.current = requestAnimationFrame(tick);
  }, [active, goTo]);

  useEffect(() => {
    startTime.current = Date.now();
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [tick]);

  const t = tools[active];
  const Icon = t.icon;

  return (
    <div
      className="rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-sm shadow-2xl shadow-black/20 max-w-[420px] w-full overflow-hidden"
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; startTime.current = Date.now(); }}
      style={{ animation: 'heroCardIn 0.6s ease-out 0.3s both' }}
    >
      {/* Tab dots */}
      <div className="flex items-center gap-1 px-5 pt-4 pb-2">
        {tools.map((tool, i) => {
          const TabIcon = tool.icon;
          const isActive = i === active;
          return (
            <button
              key={tool.key}
              onClick={() => goTo(i)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/30 hover:text-white/50'
              }`}
            >
              <TabIcon size={12} />
              <span className="hidden sm:inline">{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="h-[2px] bg-white/5 mx-5">
        <div
          className="h-full rounded-full transition-none"
          style={{ width: `${progress * 100}%`, backgroundColor: t.accent }}
        />
      </div>

      {/* Content */}
      <div className="p-5 min-h-[280px] relative">
        <div
          key={t.key}
          style={{ animation: 'showcaseSlideIn 0.3s ease-out' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Icon size={14} style={{ color: t.accent }} />
            <h3 className="text-sm font-semibold text-white">{t.title}</h3>
          </div>
          <p className="text-[11px] text-white/40 mb-4 leading-relaxed">{t.desc}</p>
          {mockups[active]}
        </div>
      </div>
    </div>
  );
}

/* ── Hero Section ── */

export default function Hero() {
  return (
    <section className="relative min-h-[100vh] flex items-center bg-[#1a1f36] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(232,93,58,0.08),transparent)]" />

      <div className="relative mx-auto max-w-7xl w-full px-4 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
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

          {/* Right — showcase */}
          <div className="flex justify-center lg:justify-end">
            <HeroShowcase />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />

      <style>{`
        @keyframes heroCardIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes showcaseSlideIn {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
