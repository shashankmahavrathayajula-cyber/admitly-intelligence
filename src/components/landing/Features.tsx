import { motion } from 'framer-motion';
import { Target, Building2, Lightbulb, GitCompareArrows } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Profile Evaluation',
    description: 'Comprehensive scoring of your academic record, activities, honors, and narrative against real admissions standards.',
  },
  {
    icon: Building2,
    title: 'University Fit Analysis',
    description: 'Understand how your profile aligns with specific institutional priorities and what each school values most.',
  },
  {
    icon: Lightbulb,
    title: 'Strategic Recommendations',
    description: 'Actionable suggestions to strengthen your application, address weaknesses, and highlight untapped potential.',
  },
  {
    icon: GitCompareArrows,
    title: 'Multi-School Comparison',
    description: 'Compare your fit across multiple universities side by side to build a balanced, strategic school list.',
  },
];

export default function Features() {
  return (
    <section id="features" className="hero-gradient py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary font-sans">Features</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Consulting-Grade Intelligence,{' '}
            <span className="italic">Instantly</span>
          </h2>
          <p className="mt-4 text-muted-foreground font-sans">
            Everything a top admissions consultant would tell you — powered by AI.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/30"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent transition-colors group-hover:bg-primary/10">
                <feature.icon className="h-5 w-5 text-accent-foreground transition-all duration-200 group-hover:text-primary group-hover:scale-105" />
              </div>
              <h3 className="text-lg font-semibold font-sans">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground font-sans">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
