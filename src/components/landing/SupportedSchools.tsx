import { Link } from 'react-router-dom';
import { SUPPORTED_UNIVERSITIES } from '@/lib/universities';

export default function SupportedSchools() {
  return (
    <section className="landing-section-fade bg-white py-16 px-4">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1a1f36] mb-3">
          25 universities. School-specific evaluation for each one.
        </h2>
        <p className="text-base text-gray-500 max-w-2xl mx-auto mb-8">
          Every school is evaluated using its actual admissions priorities and benchmarks — not a generic rubric. More schools added every season.
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {SUPPORTED_UNIVERSITIES.map((name) => (
            <span
              key={name}
              className="rounded-full border border-gray-200 bg-white py-2 px-4 text-sm font-medium text-gray-700 transition-colors duration-200 hover:border-[hsl(var(--coral))]"
            >
              {name}
            </span>
          ))}
        </div>

        <p className="text-sm text-gray-500">
          Don't see your school? We add new schools every season.{' '}
          <Link to="/signup" className="text-[hsl(var(--coral))] font-medium hover:underline">
            Sign up to request yours →
          </Link>
        </p>
      </div>
    </section>
  );
}
