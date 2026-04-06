import { UniversityEvaluation, SCORE_CATEGORIES } from '@/types/evaluation';
import { motion } from 'framer-motion';

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
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={getColor(score)} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-2xl font-bold font-sans"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {score}
          </motion.span>
          <motion.span
            className="text-[10px] text-muted-foreground font-sans uppercase tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.0 }}
          >
            / 100
          </motion.span>
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

const BAND_STYLES: Record<string, { label: string; className: string }> = {
  safety: { label: 'Safety', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
  target: { label: 'Target', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
  reach: { label: 'Reach', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
};

export function ClassificationBadge({ evaluation }: { evaluation: UniversityEvaluation }) {
  const band = evaluation.admissionsSummary?.band;
  const { label, className } = (band && BAND_STYLES[band]) || getClassification(evaluation.alignmentScore);
  const reasoning = evaluation.admissionsSummary?.reasoning;

  return (
    <div className="flex flex-col items-start gap-1">
      <motion.span
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${className}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        {label}
      </motion.span>
      {reasoning && (
        <p className="text-xs text-muted-foreground italic font-sans">{reasoning}</p>
      )}
    </div>
  );
}

interface CategoryScoresProps {
  evaluation: UniversityEvaluation;
}

export function CategoryScores({ evaluation }: CategoryScoresProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {SCORE_CATEGORIES.map(({ key, label }, index) => {
        const score = evaluation[key] as number;
        return (
          <motion.div
            key={key}
            className="rounded-xl border border-border bg-card p-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + index * 0.08 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground font-sans">{label}</span>
              <span className="text-lg font-bold font-sans">{score}</span>
            </div>
            <div className="h-0.5 w-full rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 + index * 0.08 }}
              />
            </div>
          </motion.div>
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
        {items.map((item, i) => {
          const isPrimary = i === 0;
          return (
            <motion.div
              key={i}
              className="rounded-lg border border-border bg-card px-4 py-3 font-sans transition-colors duration-200 hover:bg-muted/30"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
            >
              <span className={`mr-2 font-bold ${iconColorMap[variant]}`}>{iconMap[variant]}</span>
              <span className={isPrimary ? 'text-sm text-foreground' : 'text-xs text-muted-foreground'}>
                {item}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
