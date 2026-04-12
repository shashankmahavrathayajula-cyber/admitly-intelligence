import { Users, RefreshCw, DollarSign } from 'lucide-react';

const problems = [
  {
    icon: Users,
    title: 'Your counselor has 400 students',
    description:
      'Average school counselors spend 15 minutes per student per semester. You need more.',
  },
  {
    icon: RefreshCw,
    title: 'ChatGPT gives different answers every time',
    description:
      "Generic AI doesn't know what Stanford values versus what Michigan values. We do.",
  },
  {
    icon: DollarSign,
    title: 'Private counselors cost $5,000+',
    description:
      "Elite guidance shouldn't require elite wealth.",
  },
];

export default function ProblemSection() {
  return (
    <section className="pt-16 sm:pt-28 pb-12 sm:pb-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <h2 className="text-center text-2xl sm:text-3xl font-semibold font-sans tracking-[-0.02em] text-foreground">
          College admissions has a <span className="font-serif italic">guidance gap</span>
        </h2>

        <div className="mt-10 sm:mt-16 grid gap-6 sm:gap-8 sm:grid-cols-3">
          {problems.map((p, i) => (
            <div
              key={p.title}
              className="landing-section-fade rounded-2xl border border-border/80 bg-white p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#e85d3a]/10">
                <p.icon className="h-5 w-5 text-[#e85d3a]" />
              </div>
              <h3 className="text-lg font-medium font-sans text-foreground">{p.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground font-sans">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
