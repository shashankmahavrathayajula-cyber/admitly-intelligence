import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useApplication } from '@/contexts/ApplicationContext';
import { evaluateApplication } from '@/services/api';
import { saveEvaluationResult, clearCurrentDraft } from '@/services/storage';
import StepAcademics from '@/components/application/StepAcademics';
import StepActivities from '@/components/application/StepActivities';
import StepHonors from '@/components/application/StepHonors';
import StepEssays from '@/components/application/StepEssays';
import StepUniversities from '@/components/application/StepUniversities';
import StepReview from '@/components/application/StepReview';
import { ScoreRing, CategoryScores, FeedbackList, ClassificationBadge } from '@/components/results/ScoreComponents';
import ComparisonChart from '@/components/results/ComparisonChart';
import { ArrowLeft, ArrowRight, Send, Loader2, Plus, AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { getEvaluationResults } from '@/services/storage';
import type { EvaluationResult } from '@/types/evaluation';

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
}

export default function EvaluateContent({ initialSchool }: EvaluateContentProps) {
  const { data, currentStep, setCurrentStep, totalSteps } = useApplication();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);

  const progress = ((currentStep + 1) / totalSteps) * 100;

  const canProceed = () => {
    switch (currentStep) {
      case 4: return data.universities.length > 0;
      default: return true;
    }
  };

  const handleSubmit = async () => {
    if (data.universities.length === 0) {
      toast.error('Please select at least one university.');
      return;
    }
    setIsSubmitting(true);
    try {
      const results = await evaluateApplication(data);
      const result = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        universities: results,
      };
      saveEvaluationResult(result);
      clearCurrentDraft();
      setEvalResult(result);
    } catch (err: unknown) {
      const error = err as { message?: string; retryable?: boolean };
      toast.error(error.message || 'Evaluation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewEvaluation = () => {
    setEvalResult(null);
    setCurrentStep(0);
  };

  const getAssessment = (score: number, university: string) => {
    if (score >= 80) return `Your profile is a strong match for ${university}.`;
    if (score >= 60) return `You have a competitive profile for ${university}. Targeted improvements could help.`;
    if (score >= 40) return `${university} is an ambitious target. Strategic enhancements will be important.`;
    return `${university} represents a significant reach.`;
  };

  // Show results if we have them
  if (evalResult) {
    const isMulti = evalResult.universities.length > 1;
    return (
      <div className="w-full max-w-6xl mx-auto">
        <motion.div
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-10"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-semibold">Evaluation Results</h1>
            <p className="mt-1 text-sm text-muted-foreground font-sans">
              {isMulti
                ? `Comparing ${evalResult.universities.length} universities`
                : `Analysis for ${evalResult.universities[0].university}`}
            </p>
          </div>
          <Button variant="outline" className="gap-2" onClick={handleNewEvaluation}>
            <Plus className="h-4 w-4" /> New Evaluation
          </Button>
        </motion.div>

        {isMulti && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <ComparisonChart evaluations={evalResult.universities} />
          </motion.div>
        )}

        <div className="space-y-12">
          {evalResult.universities.map((ev, i) => (
            <motion.div
              key={ev.university}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            >
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <motion.div className="p-6 sm:p-8" custom={0} initial="hidden" animate="visible" variants={sectionVariants}>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <h3 className="text-xl font-semibold font-sans">{ev.university}</h3>
                    <ClassificationBadge evaluation={ev} />
                  </div>
                </motion.div>
                <Separator />
                <motion.div className="px-6 sm:px-8 py-6" custom={1} initial="hidden" animate="visible" variants={sectionVariants}>
                  <p className="text-sm font-medium text-muted-foreground font-sans mb-2">Core Insight</p>
                  <p className="text-sm font-sans text-foreground/80 leading-relaxed">
                    {ev.coreInsight || getAssessment(ev.alignmentScore, ev.university)}
                  </p>
                  {ev.mostImportantNextStep && (
                    <div className="mt-5 rounded-xl bg-primary/5 border border-primary/20 p-4">
                      <p className="text-sm font-medium text-primary font-sans mb-1">Recommended Next Step</p>
                      <p className="text-sm font-sans text-foreground/80">{ev.mostImportantNextStep}</p>
                    </div>
                  )}
                </motion.div>
                <Separator />
                <motion.div className="px-6 sm:px-8 py-6" custom={2} initial="hidden" animate="visible" variants={sectionVariants}>
                  <p className="text-sm font-medium text-muted-foreground font-sans mb-4">Alignment Score</p>
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
                <motion.div className="p-6 sm:p-8" custom={3} initial="hidden" animate="visible" variants={sectionVariants}>
                  <p className="text-sm font-medium text-muted-foreground font-sans mb-5">Score Breakdown</p>
                  <CategoryScores evaluation={ev} />
                </motion.div>
                <Separator />
                <motion.div className="p-6 sm:p-8" custom={4} initial="hidden" animate="visible" variants={sectionVariants}>
                  <p className="text-sm font-medium text-muted-foreground font-sans mb-6">Insights</p>
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <FeedbackList title="Strengths" items={ev.strengths} variant="strength" />
                    <FeedbackList title="Areas to Improve" items={ev.weaknesses} variant="weakness" />
                    <FeedbackList title="Suggestions" items={ev.suggestions} variant="suggestion" />
                  </div>
                </motion.div>
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
      <div className="mb-8">
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
              className={`flex-1 rounded-full py-1 text-[10px] font-sans font-medium transition-colors ${
                i === currentStep
                  ? 'bg-primary text-primary-foreground'
                  : i < currentStep
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{i + 1}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        {currentStep === 0 && <StepAcademics />}
        {currentStep === 1 && <StepActivities />}
        {currentStep === 2 && <StepHonors />}
        {currentStep === 3 && <StepEssays />}
        {currentStep === 4 && <StepUniversities />}
        {currentStep === 5 && <StepReview />}
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        {currentStep < totalSteps - 1 ? (
          <Button
            onClick={() => setCurrentStep(Math.min(totalSteps - 1, currentStep + 1))}
            disabled={!canProceed()}
            className="gap-2 cta-gradient border-0 text-primary-foreground"
          >
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || data.universities.length === 0}
            className="gap-2 cta-gradient border-0 text-primary-foreground"
          >
            {isSubmitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing…</>
            ) : (
              <><Send className="h-4 w-4" /> Submit for Evaluation</>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
