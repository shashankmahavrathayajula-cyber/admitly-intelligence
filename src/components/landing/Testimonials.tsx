const cards = [
  {
    title: 'Personalized Core Insight',
    description:
      "A school-specific assessment of your profile that explains what matters most at each institution you're targeting.",
  },
  {
    title: 'Actionable Next Step',
    description:
      'One clear, prioritized recommendation for the highest-impact improvement you can make for each school.',
  },
  {
    title: 'Reach / Target / Safety Mapping',
    description:
      "Calibrated classification that accounts for each school's selectivity, not just a generic score cutoff.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-[#f8f9fb] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold text-[#1a1f36] sm:text-3xl">
            What You'll Get
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-gray-200 bg-white p-8"
            >
              <h3 className="text-base font-semibold text-[#1a1f36]">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
