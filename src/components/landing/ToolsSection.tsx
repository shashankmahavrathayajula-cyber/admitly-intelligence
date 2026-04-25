import { useEffect, useRef, useState, useCallback } from 'react';
import { BarChart3, FileText, Target, GraduationCap } from 'lucide-react';

const CYCLE_MS = 6000;

const tabs = [
  {
    key: 'evaluate',
    label: 'Evaluate',
    icon: BarChart3,
    accent: '#e85d3a',
    hookColor: 'text-[#e85d3a]',
    hook: 'For students asking: do I have a shot?',
    title: 'School-specific evaluation',
    body: "Your profile scored against each school's actual admissions priorities — not a generic rubric. Five dimensions, honest scoring, and a clear reach, target, or safety verdict backed by Common Data Set benchmarks.",
    replaces: 'Replaces chance-me threads, generic AI chatbots, and $500 preliminary assessments from private counselors.',
  },
  {
    key: 'analyze',
    label: 'Analyze',
    icon: FileText,
    accent: '#0d9488',
    hookColor: 'text-[#0d9488]',
    hook: 'For students asking: is my essay good enough?',
    title: 'Essay feedback with rewrites',
    body: "Paste your essay, select your school, and get feedback a $300/hour counselor would give. Specific before-and-after rewrite suggestions tied to what each school's readers actually look for.",
    replaces: "Replaces Grammarly (too generic), ChatGPT (different answer every time), and friends who say 'it sounds great' without real critique.",
  },
  {
    key: 'plan',
    label: 'Plan',
    icon: Target,
    accent: '#d97706',
    hookColor: 'text-amber-600',
    hook: 'For students asking: what should I actually do?',
    title: 'Gap analysis & action plan',
    body: "See exactly where your biggest gaps are at each school, ranked by how much improving them would help. Get 5 time-bound actions with estimated score improvements — not vague advice, a concrete weekly plan.",
    replaces: "Replaces staring at your evaluation wondering what to change, generic 'get more leadership' advice, and the anxiety of not knowing where to focus.",
  },
  {
    key: 'list',
    label: 'Build Your List',
    icon: GraduationCap,
    accent: '#1a1f36',
    hookColor: 'text-blue-800',
    hook: 'For students asking: where should I apply?',
    title: 'Smart school list',
    body: "Evaluate your profile against all 25 schools at once. See your reaches, targets, and safeties side by side. Build a balanced application list backed by data — not rankings, not Reddit, not guesswork.",
    replaces: 'Replaces applying to 20 random schools and hoping for the best, or only applying to 3 dream schools with no safety net.',
  },
];

/* ── Mockup components ── */

function EvaluateMockup() {
  return (
    <div className="bg-gray-900 rounded-xl p-5 text-white text-sm space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-semibold">Stanford University</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-[#e85d3a]/20 text-[#e85d3a] font-medium">Reach</span>
      </div>
      {[
        { label: 'Academic', score: 7.2, pct: 72, color: 'bg-[#0d9488]' },
        { label: 'Activities', score: 5.1, pct: 51, color: 'bg-amber-500' },
        { label: 'Essay', score: 8.0, pct: 80, color: 'bg-[#0d9488]' },
      ].map((d) => (
        <div key={d.label} className="space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>{d.label}</span><span>{d.score}/10</span>
          </div>
          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${d.color}`} style={{ width: `${d.pct}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function AnalyzeMockup() {
  return (
    <div className="bg-gray-900 rounded-xl p-5 text-white text-sm space-y-3">
      <p className="text-gray-400 line-through">"I have always been passionate about science"</p>
      <span className="inline-block text-xs px-2 py-0.5 rounded bg-[#e85d3a]/20 text-[#e85d3a] font-medium">Try instead</span>
      <p className="text-gray-100 leading-relaxed">"The first time I isolated a protein in lab, I forgot about the timer — and accidentally discovered our enzyme was heat-stable"</p>
    </div>
  );
}

function PlanMockup() {
  return (
    <div className="bg-gray-900 rounded-xl p-5 text-white text-sm space-y-4">
      {[
        { label: 'Academic Preparation', score: 7, gap: 'Gap: 1.5 pts', gapColor: 'text-amber-400' },
        { label: 'Essay & Narrative', score: 8.5, gap: 'Already strong ✓', gapColor: 'text-[#0d9488]' },
        { label: 'Honors', score: 5, gap: 'Gap: 3 pts', gapColor: 'text-[#e85d3a]' },
      ].map((d) => (
        <div key={d.label} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-300">{d.label}</span>
            <span className={`${d.gapColor} font-medium`}>{d.gap}</span>
          </div>
          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gray-400" style={{ width: `${d.score * 10}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ListMockup() {
  const groups = [
    { label: 'Reaches', color: 'text-[#e85d3a]', schools: [{ n: 'Stanford', s: 62 }, { n: 'MIT', s: 58 }] },
    { label: 'Targets', color: 'text-amber-400', schools: [{ n: 'UCLA', s: 74 }, { n: 'Michigan', s: 71 }, { n: 'UVA', s: 69 }] },
    { label: 'Safeties', color: 'text-[#0d9488]', schools: [{ n: 'U. of Washington', s: 84 }, { n: 'Washington State', s: 81 }] },
  ];
  return (
    <div className="bg-gray-900 rounded-xl p-5 text-white text-sm space-y-4">
      {groups.map((g) => (
        <div key={g.label}>
          <p className={`text-xs font-semibold uppercase tracking-wide ${g.color} mb-1.5`}>{g.label}</p>
          {g.schools.map((s) => (
            <div key={s.n} className="flex justify-between text-gray-300 text-xs py-0.5">
              <span>{s.n}</span><span className="text-gray-500">{s.s}%</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

const mockups = [<EvaluateMockup />, <AnalyzeMockup />, <PlanMockup />, <ListMockup />];

/* ── Main section ── */

export default function ToolsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  const [progress, setProgress] = useState(0);
  const paused = useRef(false);
  const startTime = useRef(Date.now());
  const elapsed = useRef(0);
  const rafId = useRef(0);

  // Scroll reveal
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setRevealed(true); obs.disconnect(); } },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const advance = useCallback((from: number, to: number, dir: 'left' | 'right') => {
    setDirection(dir);
    setPrev(from);
    setActive(to);
    elapsed.current = 0;
    startTime.current = Date.now();
    setProgress(0);
    // Clear prev after animation
    setTimeout(() => setPrev(null), 400);
  }, []);

  // Timer loop
  const tick = useCallback(() => {
    if (!paused.current) {
      const now = Date.now();
      elapsed.current += now - startTime.current;
      startTime.current = now;
      const pct = Math.min(elapsed.current / CYCLE_MS, 1);
      setProgress(pct);
      if (pct >= 1) {
        const nextIdx = (active + 1) % tabs.length;
        advance(active, nextIdx, 'left');
      }
    } else {
      startTime.current = Date.now();
    }
    rafId.current = requestAnimationFrame(tick);
  }, [active, advance]);

  useEffect(() => {
    if (!revealed) return;
    startTime.current = Date.now();
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [revealed, tick]);

  const selectTab = (i: number) => {
    if (i === active) return;
    advance(active, i, i > active ? 'left' : 'right');
  };

  const onPanelEnter = () => { paused.current = true; };
  const onPanelLeave = () => { paused.current = false; startTime.current = Date.now(); };

  // Touch swipe
  const touchX = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) {
        const next = (active + 1) % tabs.length;
        advance(active, next, 'left');
      } else {
        const next = (active - 1 + tabs.length) % tabs.length;
        advance(active, next, 'right');
      }
    }
  };

  const t = tabs[active];

  // Slide animation helpers
  const enterFrom = direction === 'left' ? 'translateX(60px)' : 'translateX(-60px)';
  const exitTo = direction === 'left' ? 'translateX(-60px)' : 'translateX(60px)';

  return (
    <section ref={sectionRef} className="py-20 bg-white px-4 sm:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div
          className="text-center"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
          }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-[#e85d3a] mb-3">YOUR APPLICATION STRATEGY</p>
          <h2 className="text-3xl font-bold text-gray-900">Four tools. One strategy. School-specific guidance for every application.</h2>
          <p className="text-base text-gray-500 max-w-2xl mx-auto mt-4">
            Most students guess. Admitly students know exactly where they stand, where to improve, and where to apply.
          </p>
        </div>

        {/* Showcase panel */}
        <div
          className="mt-12 bg-gray-50 rounded-2xl overflow-hidden"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.6s ease-out 0.3s, transform 0.6s ease-out 0.3s',
          }}
        >
          {/* Tab bar — desktop */}
          <div className="hidden sm:flex border-b border-gray-200">
            {tabs.map((tab, i) => {
              const Icon = tab.icon;
              const isActive = i === active;
              return (
                <button
                  key={tab.key}
                  onClick={() => selectTab(i)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors relative ${isActive ? 'text-gray-900 font-semibold' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Icon size={16} />
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ backgroundColor: tab.accent }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab bar — mobile 2x2 */}
          <div className="sm:hidden grid grid-cols-2 border-b border-gray-200">
            {tabs.map((tab, i) => {
              const Icon = tab.icon;
              const isActive = i === active;
              return (
                <button
                  key={tab.key}
                  onClick={() => selectTab(i)}
                  className={`flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors relative ${isActive ? 'text-gray-900 font-semibold' : 'text-gray-400'} ${i < 2 ? 'border-b border-gray-200' : ''}`}
                >
                  <Icon size={14} />
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ backgroundColor: tab.accent }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Content panel */}
          <div
            className="relative overflow-hidden"
            onMouseEnter={onPanelEnter}
            onMouseLeave={onPanelLeave}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="p-6 sm:p-8">
              {/* Exiting content */}
              {prev !== null && (
                <div
                  className="absolute inset-0 p-6 sm:p-8"
                  style={{
                    animation: `toolsSlideOut 0.35s ease-out forwards`,
                    '--tools-exit-to': exitTo,
                  } as React.CSSProperties}
                >
                  <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                    <div className="md:w-[60%] flex flex-col justify-center">
                      <p className={`text-sm italic ${tabs[prev].hookColor} mb-2`}>{tabs[prev].hook}</p>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{tabs[prev].title}</h3>
                      <p className="text-base text-gray-600 leading-relaxed">{tabs[prev].body}</p>
                      <p className="text-sm text-gray-400 italic mt-4">{tabs[prev].replaces}</p>
                    </div>
                    <div className="md:w-[40%]">{mockups[prev]}</div>
                  </div>
                </div>
              )}

              {/* Entering content */}
              <div
                key={t.key}
                style={{
                  animation: prev !== null ? `toolsSlideIn 0.35s ease-out forwards` : undefined,
                  '--tools-enter-from': enterFrom,
                } as React.CSSProperties}
              >
                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                  <div className="md:w-[60%] flex flex-col justify-center">
                    <p className={`text-sm italic ${t.hookColor} mb-2`}>{t.hook}</p>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{t.title}</h3>
                    <p className="text-base text-gray-600 leading-relaxed">{t.body}</p>
                    <p className="text-sm text-gray-400 italic mt-4">{t.replaces}</p>
                  </div>
                  <div className="md:w-[40%]">{mockups[active]}</div>
                </div>
              </div>
            </div>

            {/* Progress bar at bottom of panel */}
            <div className="h-[2px] bg-gray-200/50">
              <div
                className="h-full rounded-full transition-none"
                style={{ width: `${progress * 100}%`, backgroundColor: t.accent }}
              />
            </div>
          </div>
        </div>

        {/* Bridge */}
        <p className="text-sm text-gray-400 mt-12 text-center">
          Built on school-specific data for each of our 25 supported universities{' '}
          <span className="inline-block animate-bounce">↓</span>
        </p>
      </div>

      <style>{`
        @keyframes toolsSlideIn {
          from { opacity: 0; transform: var(--tools-enter-from); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes toolsSlideOut {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: var(--tools-exit-to); }
        }
      `}</style>
    </section>
  );
}
