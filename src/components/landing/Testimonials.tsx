import { motion } from 'framer-motion';
import { Lightbulb, Target, BarChart3 } from 'lucide-react';

const cards = [
  {
    icon: Lightbulb,
    title: 'Personalized Core Insight',
    description:
      "A school-specific assessment of your profile that explains what matters most at each institution you're targeting.",
  },
  {
    icon: Target,
    title: 'Actionable Next Step',
    description:
      'One clear, prioritized recommendation for the highest-impact improvement you can make for each school.',
  },
  {
    icon: BarChart3,
    title: 'Reach / Target / Safety Mapping',
    description:
      "Calibrated classification that accounts for each school's selectivity, not just a generic score cutoff.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary font-sans">
            Outputs
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            What You'll Get
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="flex flex-col rounded-2xl border border-border bg-card p-8 shadow-sm"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <card.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground font-sans">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground font-sans">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
