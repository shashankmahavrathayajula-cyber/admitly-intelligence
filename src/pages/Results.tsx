import { useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { EvaluationResult } from '@/types/evaluation';
import { ScoreRing, CategoryScores, FeedbackList, ClassificationBadge } from '@/components/results/ScoreComponents';
import ComparisonChart from '@/components/results/ComparisonChart';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, AlertTriangle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { getEvaluationResults } from '@/services/storage';

const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.12, ease: 'easeOut' },
  }),
};

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = useMemo(() => {
    const fromState = (location.state as { result?: EvaluationResult })?.result;
    if (fromState?.universities?.length) return fromState;
    const saved = getEvaluationResults();
    return saved.length ? saved[0] : undefined;
  }, [location.state]);

  if (!result || !result.universities || result.universities.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <motion.div
          className="mx-auto max-w-xl px-4 py-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Results Available</h2>
          <p className="text-muted-foreground font-sans mb-6">
            We couldn't find evaluation results. This may be because the analysis hasn't been run yet or the backend was unreachable.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Go Back
            </Button>
            <Link to="/application">
              <Button className="gap-2 cta-gradient border-0 text-primary-foreground">
                <RefreshCw className="h-4 w-4" /> New Evaluation
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const isMulti = result.universities.length > 1;

  const getAssessment = (score: number, university: string) => {
    if (score >= 80) return `Your profile is a strong match for ${university}. Focus on maintaining your current trajectory.`;
    if (score >= 60) return `You have a competitive profile for ${university}. Targeted improvements could significantly strengthen your application.`;
    if (score >= 40) return `${university} is an ambitious target. Strategic enhancements in weaker areas will be important.`;
    return `${university} represents a significant reach. Consider building strength in multiple categories.`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Page header */}
        <motion.div
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-10"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <h1 className="text-3xl font-semibold">Evaluation Results</h1>
            <p className="mt-1 text-sm text-muted-foreground font-sans">
              {isMulti
                ? `Comparing ${result.universities.length} universities`
                : `Analysis for ${result.universities[0].university}`}
            </p>
          </div>
          <Link to="/application">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" /> New Evaluation
            </Button>
          </Link>
        </motion.div>

        {/* Multi-university comparison chart */}
        {isMulti && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <ComparisonChart evaluations={result.universities} />
          </motion.div>
        )}

        {/* Per-university results */}
        <div className="space-y-12">
          {result.universities.map((ev, i) => (
            <motion.div
              key={ev.university}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            >
              <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden transition-shadow duration-300 hover:shadow-md">
                {/* ── Header: Name + Badge ── */}
                <motion.div
                  className="p-6 sm:p-8"
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  variants={sectionVariants}
                >
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <h3 className="text-xl font-semibold font-sans">{ev.university}</h3>
                    <ClassificationBadge evaluation={ev} />
                  </div>
                </motion.div>

                <Separator />

                {/* ── Core Insight + Next Step ── */}
                <motion.div
                  className="px-6 sm:px-8 py-5 bg-muted/30"
                  custom={1}
                  initial="hidden"
                  animate="visible"
                  variants={sectionVariants}
                >
                  <p className="text-sm font-sans text-foreground/80 leading-relaxed">
                    <span className="font-semibold text-foreground">Core Insight:</span>{' '}
                    {ev.coreInsight || getAssessment(ev.alignmentScore, ev.university)}
                  </p>
                  {ev.mostImportantNextStep && (
                    <div className="mt-4 rounded-lg bg-primary/5 border border-primary/20 p-4">
                      <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
                        Recommended Next Step
                      </p>
                      <p className="text-sm font-sans text-foreground/80">
                        {ev.mostImportantNextStep}
                      </p>
                    </div>
                  )}
                </motion.div>

                <Separator />

                {/* ── Alignment Score ── */}
                <motion.div
                  className="px-6 sm:px-8 py-5"
                  custom={2}
                  initial="hidden"
                  animate="visible"
                  variants={sectionVariants}
                >
                  <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
                    <ScoreRing score={ev.alignmentScore} size={100} />
                    <div className="flex-1 text-center sm:text-left space-y-1">
                      <p className="text-sm text-muted-foreground font-sans">
                        Overall Alignment Score: <strong>{ev.alignmentScore}/100</strong>
                      </p>
                      <p className="text-xs text-muted-foreground italic font-sans">
                        {ev.admissionsSummary?.reasoning || "Scores are calibrated to each school\u2019s selectivity \u2014 the same profile will score differently at different institutions."}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <Separator />

                {/* ── Category Breakdown ── */}
                <motion.div
                  className="p-6 sm:p-8"
                  custom={3}
                  initial="hidden"
                  animate="visible"
                  variants={sectionVariants}
                >
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-sans mb-4">
                    Score Breakdown
                  </h4>
                  <CategoryScores evaluation={ev} />
                </motion.div>

                <Separator />

                {/* ── Insights ── */}
                <motion.div
                  className="p-6 sm:p-8"
                  custom={4}
                  initial="hidden"
                  animate="visible"
                  variants={sectionVariants}
                >
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-sans mb-5">
                    Insights
                  </h4>
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
    </div>
  );
}
