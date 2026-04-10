import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="hero-gradient relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium tracking-wide text-primary">AI-POWERED ADMISSIONS INTELLIGENCE</span>
          </div>

          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Your Strategic Edge in{' '}
            <span className="italic">College Admissions</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground font-sans">
            Get consulting-grade evaluation of your application with AI that understands what top universities are looking for. Know where you stand before you apply.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/application">
              <Button size="lg" className="cta-gradient border-0 px-8 text-primary-foreground hover:opacity-90">
                Start Your Evaluation
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" size="lg" className="px-8">
                See How It Works
              </Button>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="pointer-events-none absolute -bottom-1 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
