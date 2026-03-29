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
    <div className="rounded-xl border border-border bg-card p-6">
      <h4 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground font-sans mb-4">
        Comparative Analysis
      </h4>
      <ResponsiveContainer width="100%" height={350}>
        <RadarChart data={data}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fontSize: 11, fontFamily: 'Inter', fill: 'hsl(var(--muted-foreground))' }}
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
            />
          ))}
          <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'Inter' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
