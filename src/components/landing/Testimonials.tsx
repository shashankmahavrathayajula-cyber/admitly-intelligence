import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "Admitly gave me insights my school counselor couldn't. I reshaped my entire application strategy around its suggestions and got into my dream school.",
    name: 'Sarah M.',
    detail: 'Admitted to Stanford, Class of 2029',
  },
  {
    quote: "The multi-school comparison saved me hours of guesswork. I could see exactly where my profile was strongest and built my school list around real data.",
    name: 'James R.',
    detail: 'Admitted to UPenn, Class of 2029',
  },
  {
    quote: "I used this alongside my private consultant, and honestly, Admitly caught weaknesses even they missed. The AI is impressively thorough.",
    name: 'Priya K.',
    detail: 'Admitted to UC Berkeley, Class of 2028',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary font-sans">Testimonials</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Trusted by <span className="italic">Ambitious</span> Applicants
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="flex flex-col rounded-2xl border border-border bg-card p-8 shadow-sm"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="flex-1 text-sm leading-relaxed text-muted-foreground font-sans italic">"{t.quote}"</p>
              <div className="mt-6">
                <div className="text-sm font-semibold text-foreground font-sans">{t.name}</div>
                <div className="text-xs text-muted-foreground font-sans">{t.detail}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
