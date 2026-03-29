import { motion } from 'framer-motion';
import { FileText, Brain, BarChart3 } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    number: '01',
    title: 'Input Your Profile',
    description: 'Enter your academic record, extracurriculars, honors, essay, and target universities.',
  },
  {
    icon: Brain,
    number: '02',
    title: 'AI Analysis',
    description: 'Our AI evaluates your application against real admissions criteria and institutional fit models.',
  },
  {
    icon: BarChart3,
    number: '03',
    title: 'Get Strategic Insights',
    description: 'Receive detailed scores, strengths, weaknesses, and actionable recommendations for each school.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary font-sans">How It Works</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            From Application to <span className="italic">Insights</span> in Minutes
          </h2>
          <p className="mt-4 text-muted-foreground font-sans">
            Three simple steps to consulting-grade admissions evaluation.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative rounded-2xl border border-border bg-card p-8 text-center shadow-sm"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-accent">
                <step.icon className="h-6 w-6 text-accent-foreground" />
              </div>
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-muted-foreground">{step.number}</span>
              <h3 className="mt-2 text-xl font-semibold font-sans">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground font-sans">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
