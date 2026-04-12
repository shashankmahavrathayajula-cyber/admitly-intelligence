import { useEffect, useRef, useState } from 'react';
import { BarChart3, FileText, Target, GraduationCap } from 'lucide-react';

const tools = [
  {
    title: 'School-specific evaluation',
    hookLine: 'For students asking: do I have a shot?',
    body: "Your profile scored against each school's actual admissions priorities — not a generic rubric. Five dimensions, honest scoring, and a clear reach, target, or safety verdict backed by Common Data Set benchmarks.",
    replaces: 'Replaces: chance-me threads, generic AI chatbots, and expensive \'preliminary assessments\' from private counselors.',
    footer: 'Step 1 → Build your profile',
    icon: BarChart3,
    iconBg: 'bg-orange-50',
    iconColor: 'text-[#e85d3a]',
    hookColor: 'text-[#e85d3a]',
    footerColor: 'text-[#e85d3a]',
    borderColor: 'border-t-[#e85d3a]',
  },
  {
    title: 'Essay feedback with rewrites',
    hookLine: 'For students asking: is my essay good enough?',
    body: "Paste your essay, select your school, and get feedback a $300/hour counselor would give. Specific before-and-after rewrite suggestions tied to what each school's readers actually look for.",
    replaces: "Replaces: Grammarly (too generic), ChatGPT (different answer every time), and friends who say 'it sounds great' without real critique.",
    footer: 'Step 2 → Strengthen your writing',
    icon: FileText,
    iconBg: 'bg-teal-50',
    iconColor: 'text-[#0d9488]',
    hookColor: 'text-[#0d9488]',
    footerColor: 'text-[#0d9488]',
    borderColor: 'border-t-[#0d9488]',
  },
  {
    title: 'Gap analysis & action plan',
    hookLine: 'For students asking: what should I actually do?',
    body: "See exactly where your biggest gaps are at each school, ranked by how much improving them would help. Get 5 time-bound actions with estimated score improvements — not vague advice, but a concrete weekly plan.",
    replaces: "Replaces: staring at your evaluation wondering what to change, generic 'get more leadership' advice, and the anxiety of not knowing where to focus.",
    footer: 'Step 3 → Focus your effort',
    icon: Target,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    hookColor: 'text-amber-600',
    footerColor: 'text-amber-600',
    borderColor: 'border-t-amber-500',
  },
  {
    title: 'Smart school list',
    hookLine: 'For students asking: where should I apply?',
    body: "Evaluate your profile against all 25 schools at once. See your reaches, targets, and safeties side by side. Build a balanced application list backed by data — not rankings, not Reddit, not guesswork.",
    replaces: 'Replaces: applying to 20 random schools and hoping for the best, or only applying to 3 dream schools with no safety net.',
    footer: 'Step 4 → Apply with confidence',
    icon: GraduationCap,
    iconBg: 'bg-blue-50',
    iconColor: 'text-[#1a1f36]',
    hookColor: 'text-blue-800',
    footerColor: 'text-blue-800',
    borderColor: 'border-t-[#1a1f36]',
  },
];

export default function ToolsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const onScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.scrollWidth / tools.length;
      setActiveIndex(Math.round(scrollLeft / cardWidth));
    };
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  const cardStyle = (i: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.97)',
    transition: `opacity 0.6s ease-out ${0.4 + i * 0.15}s, transform 0.6s ease-out ${0.4 + i * 0.15}s`,
  });

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 bg-white px-4 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center" style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease-out 0s, transform 0.6s ease-out 0s',
        }}>
          <p className="text-xs font-bold uppercase tracking-widest text-[#e85d3a] mb-3">
            YOUR APPLICATION STRATEGY
          </p>
          <h2 className="text-3xl font-bold text-gray-900">
            Four tools that replace a $5,000 counselor
          </h2>
        </div>
        <p className="text-base text-gray-500 max-w-2xl mx-auto mt-4 text-center" style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s',
        }}>
          Most students guess. Admitly students know exactly where they stand, where to improve, and where to apply.
        </p>

        {/* Desktop grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-6 mt-12">
          {tools.map((t, i) => {
            const Icon = t.icon;
            return (
              <div
                key={t.title}
                className={`bg-white rounded-2xl border border-gray-100 overflow-hidden p-7 border-t-[3px] ${t.borderColor} hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 ease-out`}
                style={cardStyle(i)}
              >
                <div className={`w-[52px] h-[52px] rounded-full ${t.iconBg} flex items-center justify-center mb-4`}>
                  <Icon className={t.iconColor} size={24} />
                </div>
                <h3 className="font-semibold text-xl text-gray-900 mb-1">{t.title}</h3>
                <p className={`text-xs font-medium ${t.hookColor} italic mb-2`}>{t.hookLine}</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{t.body}</p>
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <p className="text-xs text-gray-400 italic">{t.replaces}</p>
                </div>
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <p className={`text-xs uppercase tracking-wide font-medium ${t.footerColor}`}>{t.footer}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile horizontal scroll */}
        <div className="md:hidden mt-10">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pr-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {tools.map((t, i) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.title}
                  className={`snap-center min-w-[300px] flex-shrink-0 bg-white rounded-2xl border border-gray-100 overflow-hidden p-7 border-t-[3px] ${t.borderColor}`}
                  style={cardStyle(i)}
                >
                  <div className={`w-[52px] h-[52px] rounded-full ${t.iconBg} flex items-center justify-center mb-4`}>
                    <Icon className={t.iconColor} size={24} />
                  </div>
                  <h3 className="font-semibold text-xl text-gray-900 mb-1">{t.title}</h3>
                  <p className={`text-xs font-medium ${t.hookColor} italic mb-2`}>{t.hookLine}</p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{t.body}</p>
                  <div className="border-t border-gray-100 pt-3 mt-3">
                    <p className="text-xs text-gray-400 italic">{t.replaces}</p>
                  </div>
                  <div className="border-t border-gray-100 pt-3 mt-3">
                    <p className={`text-xs uppercase tracking-wide font-medium ${t.footerColor}`}>{t.footer}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {tools.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${i === activeIndex ? 'bg-[#e85d3a]' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>

        {/* Bridge text */}
        <p className="text-sm text-gray-400 mt-12 mb-0 text-center">
          Every tool is built on school-specific data for each of our 25 supported universities{' '}
          <span className="inline-block animate-bounce">↓</span>
        </p>
      </div>
    </section>
  );
}
