import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useApplication } from '@/contexts/ApplicationContext';
import { evaluateApplication } from '@/services/api';
import { saveEvaluationResult, clearCurrentDraft } from '@/services/storage';
import Navbar from '@/components/layout/Navbar';
import StepAcademics from '@/components/application/StepAcademics';
import StepActivities from '@/components/application/StepActivities';
import StepHonors from '@/components/application/StepHonors';
import StepEssays from '@/components/application/StepEssays';
import StepUniversities from '@/components/application/StepUniversities';
import StepReview from '@/components/application/StepReview';
import { ArrowLeft, ArrowRight, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const STEP_LABELS = ['Academics', 'Activities', 'Honors', 'Essays', 'Universities', 'Review'];

export default function Application() {
  const { data, currentStep, setCurrentStep, totalSteps } = useApplication();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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
      const evalResult = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        universities: results,
      };
      saveEvaluationResult(evalResult);
      clearCurrentDraft();
      navigate('/results', { state: { result: evalResult } });
    } catch (err: unknown) {
      const error = err as { message?: string; retryable?: boolean };
      toast.error(error.message || 'Evaluation failed. Please try again.');
      if (import.meta.env.DEV) console.error('[Admitly] Evaluation error', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <StepAcademics />;
      case 1: return <StepActivities />;
      case 2: return <StepHonors />;
      case 3: return <StepEssays />;
      case 4: return <StepUniversities />;
      case 5: return <StepReview />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
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
          {renderStep()}
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
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Analyzing…
                </>
              ) : (
                <>
                  Submit for Evaluation <Send className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
