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
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
          <circle
            cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={getColor(score)} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold font-sans">{score}</span>
          <span className="text-[10px] text-muted-foreground font-sans uppercase tracking-wide">/ 100</span>
        </div>
      </div>
      {label && <span className="text-xs text-muted-foreground font-sans mt-1">{label}</span>}
    </div>
  );
}

/** Derive a classification from score */
export function getClassification(score: number): { label: string; className: string } {
  if (score >= 75) return { label: 'Safety', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' };
  if (score >= 50) return { label: 'Target', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' };
  return { label: 'Reach', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' };
}

export function ClassificationBadge({ score }: { score: number }) {
  const { label, className } = getClassification(score);
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${className}`}>
      {label}
    </span>
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
          <div key={key} className="rounded-xl border border-border bg-muted/40 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground font-sans">{label}</span>
              <span className="text-lg font-bold font-sans">{score}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-background overflow-hidden">
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

  const accentMap = {
    strength: 'border-l-emerald-500',
    weakness: 'border-l-red-400',
    suggestion: 'border-l-blue-400',
  };

  const iconMap = { strength: '✓', weakness: '△', suggestion: '→' };
  const iconColorMap = {
    strength: 'text-emerald-600 dark:text-emerald-400',
    weakness: 'text-red-500 dark:text-red-400',
    suggestion: 'text-blue-500 dark:text-blue-400',
  };

  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-sans mb-3">{title}</h4>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            className={`rounded-lg border border-border border-l-[3px] ${accentMap[variant]} bg-card px-4 py-3 text-sm font-sans text-foreground`}
          >
            <span className={`mr-2 font-bold ${iconColorMap[variant]}`}>{iconMap[variant]}</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
