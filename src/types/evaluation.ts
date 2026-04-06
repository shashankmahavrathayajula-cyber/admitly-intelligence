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
  { key: 'academicStrength', label: 'Academic Strength', icon: 'GraduationCap' },
  { key: 'activityImpact', label: 'Activity Impact', icon: 'Trophy' },
  { key: 'honorsAwards', label: 'Honors & Awards', icon: 'Award' },
  { key: 'narrativeStrength', label: 'Narrative Strength', icon: 'BookOpen' },
  { key: 'institutionalFit', label: 'Institutional Fit', icon: 'Building2' },
] as const;

export type ScoreCategoryKey = typeof SCORE_CATEGORIES[number]['key'];
