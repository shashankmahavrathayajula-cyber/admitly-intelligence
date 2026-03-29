import { motion } from 'framer-motion';

const stats = [
  { value: '10,000+', label: 'Applications Evaluated' },
  { value: '500+', label: 'Universities Supported' },
  { value: '94%', label: 'User Satisfaction' },
  { value: '<2 min', label: 'Average Analysis Time' },
];

export default function Stats() {
  return (
    <section className="border-y border-border bg-card py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-gradient font-sans">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground font-sans">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
