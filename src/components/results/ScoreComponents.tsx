import { UniversityEvaluation, SCORE_CATEGORIES } from '@/types/evaluation';

interface ScoreRingProps {
  score: number;
  size?: number;
  label?: string;
}

export function ScoreRing({ score, size = 120, label }: ScoreRingProps) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return 'hsl(152 60% 46%)';
    if (s >= 60) return 'hsl(210 76% 52%)';
    if (s >= 40) return 'hsl(45 93% 47%)';
    return 'hsl(0 84% 60%)';
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={getColor(score)} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-2xl font-bold font-sans">{score}</span>
        <span className="text-[10px] text-muted-foreground font-sans uppercase tracking-wide">/ 100</span>
      </div>
      {label && <span className="text-xs text-muted-foreground font-sans mt-1">{label}</span>}
    </div>
  );
}

interface CategoryScoresProps {
  evaluation: UniversityEvaluation;
}

export function CategoryScores({ evaluation }: CategoryScoresProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {SCORE_CATEGORIES.map(({ key, label }) => {
        const score = evaluation[key] as number;
        return (
          <div key={key} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground font-sans">{label}</span>
              <span className="text-lg font-bold font-sans">{score}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${score}%`,
                  backgroundColor: score >= 80 ? 'hsl(152 60% 46%)' : score >= 60 ? 'hsl(210 76% 52%)' : score >= 40 ? 'hsl(45 93% 47%)' : 'hsl(0 84% 60%)',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface FeedbackListProps {
  title: string;
  items: string[];
  variant: 'strength' | 'weakness' | 'suggestion';
}

export function FeedbackList({ title, items, variant }: FeedbackListProps) {
  if (items.length === 0) return null;

  const colorMap = {
    strength: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    weakness: 'bg-red-50 text-red-800 border-red-200',
    suggestion: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  const iconMap = { strength: '✓', weakness: '△', suggestion: '→' };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h4 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground font-sans mb-4">{title}</h4>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className={`rounded-lg border px-4 py-3 text-sm font-sans ${colorMap[variant]}`}>
            <span className="mr-2 font-bold">{iconMap[variant]}</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
