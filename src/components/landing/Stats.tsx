const stats = [
  { value: '10', label: 'Universities Analyzed' },
  { value: '5', label: 'Evaluation Dimensions' },
  { value: 'School-Specific', label: 'Calibrated Scoring' },
  { value: '<2 min', label: 'Average Analysis Time' },
];

export default function Stats() {
  return (
    <section className="border-y border-gray-200 bg-[#f8f9fb] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-[#1a1f36]">{stat.value}</div>
              <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
