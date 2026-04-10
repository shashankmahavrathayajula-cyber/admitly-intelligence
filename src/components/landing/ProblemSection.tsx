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
    <section className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <h2 className="text-center text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
          College admissions has a <span className="italic">guidance gap</span>
        </h2>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {problems.map((p) => (
            <div
              key={p.title}
              className="landing-section-fade rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-md"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#1a1f36]/[0.06]">
                <p.icon className="h-5 w-5 text-foreground/70" />
              </div>
              <h3 className="text-base font-semibold font-sans text-foreground">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground font-sans">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
