import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-2xl font-semibold text-[#1a1f36] sm:text-3xl">
          Ready to see where you stand?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-gray-600">
          Free to use. No account required for your first evaluation.
        </p>
        <div className="mt-8">
          <Link to="/application">
            <Button
              size="lg"
              className="bg-[#e85d3a] hover:bg-[#d4502f] border-0 px-10 text-white"
            >
              Start Your Free Evaluation
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
