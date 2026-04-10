export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Enter your profile',
      description:
        'GPA, courses, activities, honors, essays, and target schools. Takes about 5 minutes.',
    },
    {
      number: '2',
      title: 'AI analysis runs',
      description:
        'Your application is evaluated against school-specific admissions models for each university you selected.',
    },
    {
      number: '3',
      title: 'Get your results',
      description:
        'Alignment scores, gap analysis, essay feedback, and a prioritized action plan — all in one dashboard.',
    },
  ];

  return (
    <section id="how-it-works" className="bg-[#f8f9fb] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold text-[#1a1f36] sm:text-3xl">
            How It Works
          </h2>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-0 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-6 left-[20%] right-[20%] h-px bg-gray-200" />

          {steps.map((step) => (
            <div key={step.number} className="relative text-center md:px-8">
              <span className="inline-block text-2xl font-bold text-[#e85d3a] relative z-10 bg-[#f8f9fb] px-3">
                {step.number}
              </span>
              <h3 className="mt-4 text-base font-semibold text-[#1a1f36]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
