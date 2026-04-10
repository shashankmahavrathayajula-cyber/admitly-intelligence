const features = [
  {
    title: 'Profile Evaluation',
    description:
      'Comprehensive scoring of your academic record, activities, honors, and narrative against real admissions standards.',
  },
  {
    title: 'University Fit Analysis',
    description:
      'Understand how your profile aligns with specific institutional priorities and what each school values most.',
  },
  {
    title: 'Strategic Recommendations',
    description:
      'Actionable suggestions to strengthen your application, address weaknesses, and highlight untapped potential.',
  },
  {
    title: 'Multi-School Comparison',
    description:
      'Compare your fit across multiple universities side by side to build a balanced, strategic school list.',
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold text-[#1a1f36] sm:text-3xl">
            Features
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-gray-200 bg-white p-8"
            >
              <h3 className="text-base font-semibold text-[#1a1f36]">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
