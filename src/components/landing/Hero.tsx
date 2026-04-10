import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40 text-center">
        <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[#1a1f36] sm:text-5xl lg:text-[3.25rem]">
          Know where you stand before you apply.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
          Admitly evaluates your college application against real admissions
          criteria — school by school. Get an honest read on your strengths,
          gaps, and what to do next.
        </p>

        <div className="mt-10">
          <Link to="/application">
            <Button
              size="lg"
              className="bg-[#e85d3a] hover:bg-[#d4502f] border-0 px-8 text-white"
            >
              Start Your Free Evaluation
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
          <p className="mt-4 text-sm text-gray-400">
            No credit card required. Results in under 2 minutes.
          </p>
        </div>
      </div>
    </section>
  );
}
