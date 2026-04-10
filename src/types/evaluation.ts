export interface UniversityEvaluation {
  university: string;
  alignmentScore: number;
  academicStrength: number;
  activityImpact: number;
  honorsAwards: number;
  narrativeStrength: number;
  institutionalFit: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  coreInsight?: string;
  mostImportantNextStep?: string;
  admissionsSummary?: { band: string; reasoning: string };
  // Extensible: probabilityBands, consultantNotes, essayCritique, etc.
  [key: string]: unknown;
}

export interface EvaluationResult {
  id: string;
  timestamp: string;
  universities: UniversityEvaluation[];
  applicationSnapshot?: Record<string, unknown>;
}

export interface EvaluationError {
  message: string;
  code?: string;
  retryable: boolean;
}

export const SCORE_CATEGORIES = [
  { key: 'academicStrength', label: 'Academic strength', icon: 'GraduationCap' },
  { key: 'activityImpact', label: 'Activity impact', icon: 'Trophy' },
  { key: 'honorsAwards', label: 'Honors & awards', icon: 'Award' },
  { key: 'narrativeStrength', label: 'Narrative strength', icon: 'BookOpen' },
  { key: 'institutionalFit', label: 'Institutional fit', icon: 'Building2' },
] as const;

export type ScoreCategoryKey = typeof SCORE_CATEGORIES[number]['key'];
