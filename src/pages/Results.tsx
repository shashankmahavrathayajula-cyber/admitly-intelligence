import { useLocation, useNavigate, Link } from 'react-router-dom';
import { EvaluationResult } from '@/types/evaluation';
import { ScoreRing, CategoryScores, FeedbackList } from '@/components/results/ScoreComponents';
import ComparisonChart from '@/components/results/ComparisonChart';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, AlertTriangle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = (location.state as { result?: EvaluationResult })?.result;

  if (!result || !result.universities || result.universities.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-xl px-4 py-20 text-center">
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
        </div>
      </div>
    );
  }

  const isMulti = result.universities.length > 1;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-between mb-8">
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
        </div>

        {/* Multi-university comparison chart */}
        {isMulti && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <ComparisonChart evaluations={result.universities} />
          </motion.div>
        )}

        {/* Per-university results */}
        <div className="space-y-10">
          {result.universities.map((ev, i) => (
            <motion.div
              key={ev.university}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                  <div className="relative">
                    <ScoreRing score={ev.alignmentScore} size={130} />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-semibold font-sans">{ev.university}</h3>
                    <p className="text-sm text-muted-foreground font-sans mt-1">
                      Overall Alignment Score: <strong>{ev.alignmentScore}/100</strong>
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <CategoryScores evaluation={ev} />
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-3">
                  <FeedbackList title="Strengths" items={ev.strengths} variant="strength" />
                  <FeedbackList title="Areas to Improve" items={ev.weaknesses} variant="weakness" />
                  <FeedbackList title="Suggestions" items={ev.suggestions} variant="suggestion" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
