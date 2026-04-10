import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="relative bg-[#1a1f36] py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_110%,rgba(232,93,58,0.1),transparent)]" />
      <div className="relative mx-auto max-w-3xl px-5 sm:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
          Your application deserves more than{' '}
          <span className="italic text-white/90">generic advice</span>
        </h2>
        <p className="mt-5 text-base text-white/50 font-sans max-w-lg mx-auto">
          Start with 3 free evaluations. See what school-specific guidance actually looks like.
        </p>
        <div className="mt-10">
          <Link to="/signup">
            <Button size="lg" className="cta-gradient border-0 px-8 py-6 text-base text-white hover:opacity-90">
              Create your free account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <p className="mt-3 text-sm font-sans text-white/35">
            No credit card required. Ready in 5 minutes.
          </p>
        </div>
      </div>
    </section>
  );
}
