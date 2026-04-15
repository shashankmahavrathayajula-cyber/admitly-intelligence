import { useState, useMemo, useEffect, useCallback } from 'react';
import { useTier } from '@/contexts/TierContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useApplication } from '@/contexts/ApplicationContext';
import { evaluateApplication, type EvaluationResponse } from '@/services/api';
import { clearCurrentDraft } from '@/services/storage';
import StepAcademics from '@/components/application/StepAcademics';
import StepActivities from '@/components/application/StepActivities';
import StepHonors from '@/components/application/StepHonors';
import StepEssays from '@/components/application/StepEssays';
import StepUniversities from '@/components/application/StepUniversities';
import StepReview from '@/components/application/StepReview';
import { ScoreRing, CategoryScores, FeedbackList, ClassificationBadge } from '@/components/results/ScoreComponents';
import ComparisonChart from '@/components/results/ComparisonChart';
import { ArrowLeft, ArrowRight, Send, Loader2, Plus, AlertTriangle, RefreshCw, Check, Clock, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

import { supabase } from '@/integrations/supabase/client';
import type { EvaluationResult, UniversityEvaluation } from '@/types/evaluation';

const STEP_LABELS = ['Academics', 'Activities', 'Honors', 'Essays', 'Universities', 'Review'];

const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.12, ease: 'easeOut' },
  }),
};

interface EvaluateContentProps {
  initialSchool?: string;
  evaluationId?: string;
}

export default function EvaluateContent({ initialSchool, evaluationId }: EvaluateContentProps) {
  const { data, currentStep, setCurrentStep, totalSteps } = useApplication();
  const { tier, setShowPricing } = useTier();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);
  const [limitNote, setLimitNote] = useState<string | undefined>();
  const [showUpgradeInResults, setShowUpgradeInResults] = useState(false);
  const [isPastResult, setIsPastResult] = useState(false);
  const [loadingPast, setLoadingPast] = useState(false);

  // Load past evaluation from Supabase when evaluationId is provided
  useEffect(() => {
    if (!evaluationId || !user) return;
    let cancelled = false;
    async function loadPastEvaluation() {
      setLoadingPast(true);
      try {
        const { data: evalData } = await supabase
          .from('evaluations')
          .select(`
            id, created_at, universities,
            evaluation_results (
              university_name, alignment_score, academic_strength,
              activity_impact, honors_awards, narrative_strength,
              institutional_fit, core_insight, most_important_next_step,
              band, band_reasoning, strengths, weaknesses, suggestions
            )
          `)
          .eq('id', evaluationId)
          .eq('user_id', user.id)
          .limit(1);

        if (cancelled) return;
        if (evalData && evalData.length > 0) {
          const ev = evalData[0] as any;
          const mapped: EvaluationResult = {
            id: ev.id,
            timestamp: ev.created_at ?? new Date().toISOString(),
            universities: (ev.evaluation_results || []).map((r: any): UniversityEvaluation => ({
              university: r.university_name,
              alignmentScore: Math.round(Number(r.alignment_score) * 10),
              academicStrength: Math.round(Number(r.academic_strength) * 10),
              activityImpact: Math.round(Number(r.activity_impact) * 10),
              honorsAwards: Math.round(Number(r.honors_awards) * 10),
              narrativeStrength: Math.round(Number(r.narrative_strength) * 10),
              institutionalFit: Math.round(Number(r.institutional_fit) * 10),
              strengths: Array.isArray(r.strengths) ? r.strengths as string[] : [],
              weaknesses: Array.isArray(r.weaknesses) ? r.weaknesses as string[] : [],
              suggestions: Array.isArray(r.suggestions) ? r.suggestions as string[] : [],
              coreInsight: r.core_insight ?? undefined,
              mostImportantNextStep: r.most_important_next_step ?? undefined,
              admissionsSummary: r.band ? { band: r.band, reasoning: r.band_reasoning ?? '' } : undefined,
            })),
          };
          setEvalResult(mapped);
          setIsPastResult(true);
        }
      } catch (err) {
        console.error('Failed to load past evaluation:', err);
      } finally {
        if (!cancelled) setLoadingPast(false);
      }
    }
    loadPastEvaluation();
    return () => { cancelled = true; };
  }, [evaluationId, user]);

  const progress = ((currentStep + 1) / totalSteps) * 100;

  const essayWordCount = data.essays.personalStatement.trim() ? data.essays.personalStatement.trim().split(/\s+/).length : 0;

  const canProceed = () => {
    switch (currentStep) {
      case 0: return data.academics.apCoursesTaken !== null;
      case 4: return data.universities.length > 0;
      default: return true;
    }
  };

  const canSubmit = data.universities.length > 0 && !!data.academics.gpa && data.academics.apCoursesTaken !== null && essayWordCount >= 50;

  const handleSubmit = async () => {
    if (data.universities.length === 0) {
      toast.error('Please select at least one university.');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await evaluateApplication(data);
      const result = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        universities: response.results,
      };
      clearCurrentDraft();
      setEvalResult(result);
      setLimitNote(response.limitNote);
      setShowUpgradeInResults(!!response.upgradeRequired);
      setIsPastResult(false);
    } catch (err: unknown) {
      const error = err as { message?: string; retryable?: boolean; code?: string; limitReached?: boolean };
      if (error.code === 'UPGRADE_REQUIRED') {
        setShowPricing(true);
      } else if (error.limitReached) {
        // For free users, show pricing. For paid users, show the message.
        if (tier === 'free') {
          setShowPricing(true);
        } else {
          toast.error(error.message || "You've reached your daily evaluation limit.");
        }
      } else {
        toast.error(error.message || 'Evaluation failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewEvaluation = () => {
    setEvalResult(null);
    setIsPastResult(false);
    setCurrentStep(0);
  };

  const loadPastEvalById = useCallback(async (evalId: string) => {
    if (!user) return;
    setLoadingPast(true);
    try {
      const { data: evalData } = await supabase
        .from('evaluations')
        .select(`
          id, created_at, universities,
          evaluation_results (
            university_name, alignment_score, academic_strength,
            activity_impact, honors_awards, narrative_strength,
            institutional_fit, core_insight, most_important_next_step,
            band, band_reasoning, strengths, weaknesses, suggestions
          )
        `)
        .eq('id', evalId)
        .eq('user_id', user.id)
        .limit(1);
      if (evalData && evalData.length > 0) {
        const ev = evalData[0] as any;
        const mapped: EvaluationResult = {
          id: ev.id,
          timestamp: ev.created_at ?? new Date().toISOString(),
          universities: (ev.evaluation_results || []).map((r: any): UniversityEvaluation => ({
            university: r.university_name,
            alignmentScore: Math.round(Number(r.alignment_score) * 10),
            academicStrength: Math.round(Number(r.academic_strength) * 10),
            activityImpact: Math.round(Number(r.activity_impact) * 10),
            honorsAwards: Math.round(Number(r.honors_awards) * 10),
            narrativeStrength: Math.round(Number(r.narrative_strength) * 10),
            institutionalFit: Math.round(Number(r.institutional_fit) * 10),
            strengths: Array.isArray(r.strengths) ? r.strengths as string[] : [],
            weaknesses: Array.isArray(r.weaknesses) ? r.weaknesses as string[] : [],
            suggestions: Array.isArray(r.suggestions) ? r.suggestions as string[] : [],
            coreInsight: r.core_insight ?? undefined,
            mostImportantNextStep: r.most_important_next_step ?? undefined,
            admissionsSummary: r.band ? { band: r.band, reasoning: r.band_reasoning ?? '' } : undefined,
          })),
        };
        setEvalResult(mapped);
        setIsPastResult(true);
      }
    } catch (err) {
      console.error('Failed to load evaluation:', err);
    } finally {
      setLoadingPast(false);
    }
  }, [user]);

  const getAssessment = (score: number, university: string) => {
    if (score >= 80) return `Your profile is a strong match for ${university}.`;
    if (score >= 60) return `You have a competitive profile for ${university}. Targeted improvements could help.`;
    if (score >= 40) return `${university} is an ambitious target. Strategic enhancements will be important.`;
    return `${university} represents a significant reach.`;
  };

  // Loading past result
  if (loadingPast) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-pulse text-sm text-muted-foreground font-sans">Loading evaluation results…</div>
      </div>
    );
  }

  // Show results if we have them
  if (evalResult) {
    const isMulti = evalResult.universities.length > 1;
    const resultDate = new Date(evalResult.timestamp).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
    return (
      <div className="w-full max-w-6xl mx-auto">
        <motion.div
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            {isPastResult && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-sans mb-1">
                <Clock className="h-3.5 w-3.5" />
                Results from {resultDate}
              </div>
            )}
            <h2 className="text-lg font-semibold font-sans">Evaluation results</h2>
            <p className="mt-0.5 text-sm text-muted-foreground font-sans">
              {isMulti
                ? `Comparing ${evalResult.universities.length} universities`
                : `Analysis for ${evalResult.universities[0].university}`}
            </p>
          </div>
          <div className="flex gap-2">
            <Button className="gap-2 cta-gradient border-0 text-white" onClick={handleNewEvaluation}>
              <Plus className="h-4 w-4" /> {isPastResult ? 'Run new evaluation' : 'New evaluation'}
            </Button>
          </div>
        </motion.div>

        {isMulti && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <ComparisonChart evaluations={evalResult.universities} />
          </motion.div>
        )}

        <div className="space-y-10">
          {evalResult.universities.map((ev, i) => (
            <motion.div
              key={ev.university}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            >
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <motion.div className="p-5 sm:p-6" custom={0} initial="hidden" animate="visible" variants={sectionVariants}>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <h3 className="text-lg font-semibold font-sans">{ev.university}</h3>
                    <ClassificationBadge evaluation={ev} />
                  </div>
                </motion.div>
                <Separator />
                <motion.div className="px-5 sm:px-6 py-5" custom={1} initial="hidden" animate="visible" variants={sectionVariants}>
                  <p className="text-xs font-medium text-muted-foreground font-sans mb-1.5">Core insight</p>
                  <p className="text-sm font-sans text-foreground/80 leading-relaxed">
                    {ev.coreInsight || getAssessment(ev.alignmentScore, ev.university)}
                  </p>
                  {ev.mostImportantNextStep && (
                    <div className="mt-4 rounded-xl bg-primary/5 border border-primary/20 p-3.5">
                      <p className="text-xs font-medium text-primary font-sans mb-1">Recommended next step</p>
                      <p className="text-sm font-sans text-foreground/80">{ev.mostImportantNextStep}</p>
                    </div>
                  )}
                </motion.div>
                <Separator />
                <motion.div className="px-5 sm:px-6 py-5" custom={2} initial="hidden" animate="visible" variants={sectionVariants}>
                  <p className="text-xs font-medium text-muted-foreground font-sans mb-3">Alignment score</p>
                  <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
                    <ScoreRing score={ev.alignmentScore} size={100} />
                    <div className="flex-1 text-center sm:text-left space-y-1">
                      <p className="text-sm text-muted-foreground font-sans">Overall: <strong>{ev.alignmentScore}/100</strong></p>
                      <p className="text-xs text-muted-foreground italic font-sans">
                        {ev.admissionsSummary?.reasoning || "Scores are calibrated to each school's selectivity."}
                      </p>
                    </div>
                  </div>
                </motion.div>
                <Separator />
                <motion.div className="p-5 sm:p-6" custom={3} initial="hidden" animate="visible" variants={sectionVariants}>
                  <p className="text-xs font-medium text-muted-foreground font-sans mb-4">Score breakdown</p>
                  <CategoryScores evaluation={ev} />
                </motion.div>
                <Separator />
                <motion.div className="p-5 sm:p-6" custom={4} initial="hidden" animate="visible" variants={sectionVariants}>
                  <p className="text-xs font-medium text-muted-foreground font-sans mb-5">Insights</p>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <FeedbackList title="Strengths" items={ev.strengths} variant="strength" />
                    <FeedbackList title="Areas to improve" items={ev.weaknesses} variant="weakness" />
                    <FeedbackList title="Suggestions" items={ev.suggestions} variant="suggestion" />
                  </div>
                </motion.div>
                {/* Previous evaluations for this school */}
                {isPastResult && (
                  <PreviousSchoolEvals
                    university={ev.university}
                    currentEvalId={evalResult.id}
                    onLoadEval={(evalId) => {
                      // Navigate to that evaluation
                      setEvalResult(null);
                      setIsPastResult(false);
                      // Trigger reload with new evalId by updating URL would be complex;
                      // instead load inline
                      loadPastEvalById(evalId);
                    }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Show form
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-sans text-muted-foreground mb-2">
          <span>Step {currentStep + 1} of {totalSteps}</span>
          <span>{STEP_LABELS[currentStep]}</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="mt-3 flex gap-1">
          {STEP_LABELS.map((label, i) => (
            <button
              key={label}
              onClick={() => setCurrentStep(i)}
              className={`flex-1 rounded-full py-1 text-[10px] font-sans font-medium transition-colors flex items-center justify-center gap-0.5 ${
                i === currentStep
                  ? 'bg-[hsl(var(--coral))] text-white'
                  : i < currentStep
                  ? 'bg-[hsl(var(--score-strong))] text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {i < currentStep && <Check className="h-2.5 w-2.5" />}
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{i + 1}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7 [&_input]:focus-coral [&_textarea]:focus-coral [&_select]:focus-coral">
        {currentStep === 0 && <StepAcademics />}
        {currentStep === 1 && <StepActivities />}
        {currentStep === 2 && <StepHonors />}
        {currentStep === 3 && <StepEssays />}
        {currentStep === 4 && <StepUniversities />}
        {currentStep === 5 && <StepReview />}
      </div>

      {/* Navigation */}
      <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="gap-2 border-muted-foreground/30 w-full sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        {currentStep < totalSteps - 1 ? (
          <Button
            onClick={() => setCurrentStep(Math.min(totalSteps - 1, currentStep + 1))}
            disabled={!canProceed()}
            className="gap-2 cta-gradient border-0 text-white w-full sm:w-auto"
          >
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !canSubmit}
            className="gap-2 cta-gradient border-0 text-white w-full sm:w-auto"
          >
            {isSubmitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing…</>
            ) : (
              <><Send className="h-4 w-4" /> Submit for evaluation</>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

/* Previous evaluations for a specific school — expandable section */
function PreviousSchoolEvals({
  university,
  currentEvalId,
  onLoadEval,
}: {
  university: string;
  currentEvalId: string;
  onLoadEval: (evalId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<{ evalId: string; score: number; date: string }[]>([]);
  const [loaded, setLoaded] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!open || loaded || !user) return;
    (async () => {
      // Get all evaluations for this user that include this school
      const { data: evals } = await supabase
        .from('evaluations')
        .select('id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      if (!evals) { setLoaded(true); return; }

      const otherEvals = evals.filter(e => e.id !== currentEvalId);
      if (otherEvals.length === 0) { setLoaded(true); return; }

      const { data: results } = await supabase
        .from('evaluation_results')
        .select('evaluation_id, alignment_score')
        .in('evaluation_id', otherEvals.map(e => e.id))
        .eq('university_name', university)
        .order('created_at', { ascending: false })
        .limit(10);

      if (results) {
        const mapped = results.map(r => {
          const parent = evals.find(e => e.id === r.evaluation_id);
          return {
            evalId: r.evaluation_id,
            score: Math.round(Number(r.alignment_score) * 10),
            date: parent?.created_at ?? '',
          };
        });
        setItems(mapped);
      }
      setLoaded(true);
    })();
  }, [open, loaded, user, university, currentEvalId]);

  // Don't render if we know there are no other evals
  if (loaded && items.length === 0 && !open) return null;

  return (
    <>
      <Separator />
      <div className="px-5 sm:px-6 py-3">
        <button
          onClick={() => setOpen(!open)}
          className="text-xs font-medium text-muted-foreground hover:text-foreground font-sans flex items-center gap-1.5 transition-colors"
        >
          <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
          {loaded && items.length > 0
            ? `Previous evaluations for this school (${items.length})`
            : 'Previous evaluations for this school'}
        </button>
        {open && (
          <div className="mt-2 space-y-1">
            {!loaded ? (
              <div className="text-xs text-muted-foreground animate-pulse font-sans">Loading…</div>
            ) : items.length === 0 ? (
              <div className="text-xs text-muted-foreground font-sans">No other evaluations for this school</div>
            ) : (
              items.map((item) => (
                <button
                  key={item.evalId}
                  onClick={() => onLoadEval(item.evalId)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted/40 transition-colors text-left"
                >
                  <span className="text-xs font-sans text-foreground">
                    {item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown date'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold font-sans text-muted-foreground">{item.score}/100</span>
                    <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}
