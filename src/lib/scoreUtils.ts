/**
 * Shared score color utilities for consistent theming across all components.
 */

/** For 0–10 scale scores (essay, gap analysis, school list) */
export function getScoreColor(score: number): string {
  if (score >= 7) return 'text-teal-600';
  if (score >= 4) return 'text-amber-600';
  return 'text-red-600';
}

export function getScoreBarColor(score: number): string {
  if (score >= 7) return 'bg-teal-500';
  if (score >= 4) return 'bg-amber-500';
  return 'bg-red-500';
}

export function getScoreBg(score: number): string {
  if (score >= 7) return 'bg-teal-50';
  if (score >= 4) return 'bg-amber-50';
  return 'bg-red-50';
}

/** For 0–100 scale scores (overview / alignment scores) */
export function getScoreColor100(score: number): string {
  if (score >= 70) return 'text-teal-600';
  if (score >= 40) return 'text-amber-600';
  return 'text-red-600';
}

export function getScoreBg100(score: number): string {
  if (score >= 70) return 'bg-teal-50';
  if (score >= 40) return 'bg-amber-50';
  return 'bg-red-50';
}
