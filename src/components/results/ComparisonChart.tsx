import { UniversityEvaluation, SCORE_CATEGORIES } from '@/types/evaluation';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';

interface ComparisonChartProps {
  evaluations: UniversityEvaluation[];
}

const COLORS = ['hsl(210, 76%, 52%)', 'hsl(152, 60%, 46%)', 'hsl(45, 93%, 47%)', 'hsl(280, 60%, 52%)', 'hsl(0, 84%, 60%)'];

export default function ComparisonChart({ evaluations }: ComparisonChartProps) {
  const data = SCORE_CATEGORIES.map(({ key, label }) => {
    const point: Record<string, unknown> = { category: label };
    evaluations.forEach((ev) => {
      point[ev.university] = ev[key] as number;
    });
    return point;
  });

  return (
    <motion.div
      className="rounded-xl border border-border/50 bg-card p-4 max-h-[400px]"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-sm font-semibold text-gray-600 font-sans mb-2">
        Comparative Analysis
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fontSize: 13, fontFamily: 'Inter', fill: '#4b5563', fontWeight: 500 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
          {evaluations.map((ev, i) => (
            <Radar
              key={ev.university}
              name={ev.university}
              dataKey={ev.university}
              stroke={COLORS[i % COLORS.length]}
              fill={COLORS[i % COLORS.length]}
              fillOpacity={0.15}
              strokeWidth={2}
              animationBegin={200}
              animationDuration={1000}
              animationEasing="ease-out"
            />
          ))}
          <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'Inter' }} />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
