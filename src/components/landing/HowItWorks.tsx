import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ClipboardList, BarChart3, Target, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Build your profile',
    description: 'Enter your GPA, activities, honors, and essays. Takes 5 minutes.',
  },
  {
    number: '02',
    icon: BarChart3,
    title: 'Get school-specific evaluation',
    description: "See exactly how you align with each school's priorities, scored across 5 dimensions.",
  },
  {
    number: '03',
    icon: Target,
    title: 'Follow your action plan',
    description: 'Know what to improve, what to write about, and where to focus your energy.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 section-alt">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <h2 className="text-center text-2xl sm:text-3xl font-semibold font-sans tracking-[-0.02em] text-foreground">
          Three steps to a <span className="font-serif italic">stronger application</span>
        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="landing-section-fade rounded-2xl border border-border/80 bg-white p-8 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ transitionDelay: `${i * 0.2}s` }}
            >
              <div className="mx-auto mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#1a1f36] text-sm font-bold text-white font-sans">
                {step.number}
              </div>
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1a1f36]/[0.05]">
                <step.icon className="h-5 w-5 text-foreground/60" />
              </div>
              <h3 className="text-lg font-medium font-sans text-foreground">{step.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground font-sans">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link to="/signup">
            <Button size="lg" className="cta-gradient border-0 px-8 text-white hover:opacity-90">
              Start your free evaluation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
