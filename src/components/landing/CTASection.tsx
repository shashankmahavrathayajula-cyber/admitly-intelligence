import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="hero-gradient py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Ready to Discover Your{' '}
          <span className="italic">Admissions Edge</span>?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground font-sans">
          Join thousands of students using AI-powered insights to build stronger applications and apply with confidence.
        </p>
        <div className="mt-8">
          <Link to="/application">
            <Button size="lg" className="cta-gradient border-0 px-10 text-primary-foreground hover:opacity-90">
              Get Started Free
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
