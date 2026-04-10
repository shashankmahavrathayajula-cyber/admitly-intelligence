import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, ChevronDown, ChevronUp, CheckCircle2, AlertTriangle,
  ArrowRight, RotateCcw, Sparkles, Shield, Zap, Clock,
  BookOpen, XCircle, TrendingUp, BarChart3, FileText,
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admitly-backend.onrender.com';

const SUPPORTED_UNIVERSITIES = [
  'University of Washington',
  'Washington State University',
  'Stanford University',
  'Massachusetts Institute of Technology',
  'Harvard University',
  'University of California, Berkeley',
  'University of California, Los Angeles',
  'University of Southern California',
  'University of Michigan — Ann Arbor',
  'The University of Texas at Austin',
];

const TIMELINE_OPTIONS = [
  { value: 'exploring', label: 'Exploring (2+ years out)' },
  { value: 'building', label: 'Building my profile (1-2 years out)' },
  { value: 'applying', label: 'Preparing applications (this year)' },
  { value: 'finalizing', label: 'Finalizing (within 3 months)' },
];

const LOADING_STEPS = [
  'Analyzing your profile gaps...',
  'Computing priorities...',
  'Generating your action plan...',
];

interface GapDimension {
  dimension: string;
  label: string;
  currentScore: number;
  targetScore: number;
  stretchScore?: number;
  gap: number;
  weightedImpact: number;
  changeable: string;
  changeNote: string;
  alreadyStrong: boolean;
  potentialScoreGain?: number;
}

interface ActionItem {
  priority: number;
  title: string;
  description: string;
  difficultyLevel: string;
  timeline: string;
  estimatedImpact: string;
  whatDoneLooksLike: string;
  compoundEffect?: string;
}

interface EssayStrategy {
  primaryEssayFocus: string;
  essayAngle: string;
  avoidInEssay: string;
  supplementalStrategy: string;
}

interface GapAnalysisResult {
  error?: string;
  strategicOverview: string;
  gapMap: GapDimension[];
  narrativeThreadAssessment: string;
  actions: ActionItem[];
  essayStrategy: EssayStrategy;
  honestAssessment: string;
  strengthsToProtect: string[];
}

export default function GapAnalysis() {
  const { user } = useAuth();
  const [school, setSchool] = useState('');
  const [timeline, setTimeline] = useState('applying');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<GapAnalysisResult | null>(null);
  const [hasEvaluation, setHasEvaluation] = useState<boolean | null>(null);
  const [evaluationData, setEvaluationData] = useState<{ snapshot: any; result: any } | null>(null);
  const [expandedActions, setExpandedActions] = useState<Set<number>>(new Set([1, 2]));

  // Check for existing evaluation when school changes
  useEffect(() => {
    if (!school || !user) {
      setHasEvaluation(null);
      setEvaluationData(null);
      return;
    }

    async function checkEvaluation() {
      const { data: evaluations } = await supabase
        .from('evaluations')
        .select('id, application_snapshot, universities')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(10);

      const match = evaluations?.find((e) =>
        (e.universities as string[])?.includes(school)
      );

      if (match) {
        const { data: results } = await supabase
          .from('evaluation_results')
          .select('*')
          .eq('evaluation_id', match.id)
          .eq('university_name', school)
          .limit(1);

        if (results && results.length > 0) {
          setHasEvaluation(true);
          setEvaluationData({
            snapshot: match.application_snapshot,
            result: results[0],
          });
          return;
        }
      }
      setHasEvaluation(false);
      setEvaluationData(null);
    }

    checkEvaluation();
  }, [school, user]);

  // Loading step animation
  useEffect(() => {
    if (!loading) return;
    setLoadingStep(0);
    const t1 = setTimeout(() => setLoadingStep(1), 3000);
    const t2 = setTimeout(() => setLoadingStep(2), 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [loading]);

  const handleSubmit = async () => {
    if (!school) return;
    setLoading(true);
    setResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const body: any = { universityName: school, timelineStage: timeline };
      if (evaluationData) {
        body.application = evaluationData.snapshot;
        body.evaluationResult = evaluationData.result;
      }

      const response = await fetch(`${API_BASE_URL}/api/gapAnalysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        },
        body: JSON.stringify(body),
      });

      if (response.status === 401) {
        toast.error('Please sign in to generate an action plan.');
        return;
      }
      if (response.status === 429) {
        toast.error("You've reached your request limit. Try again later.");
        return;
      }
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        toast.error(err.message || `Request failed (${response.status})`);
        return;
      }

      const data = await response.json();
      if (data.error) {
        setResult({ error: data.error } as GapAnalysisResult);
      } else {
        setResult(data);
      }
    } catch (e: any) {
      toast.error(e.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAction = (priority: number) => {
    setExpandedActions((prev) => {
      const next = new Set(prev);
      if (next.has(priority)) next.delete(priority);
      else next.add(priority);
      return next;
    });
  };

  const resetForm = () => {
    setResult(null);
    setSchool('');
    setTimeline('applying');
    setExpandedActions(new Set([1, 2]));
  };

  const getGapColor = (gap: number, alreadyStrong: boolean) => {
    if (alreadyStrong) return 'bg-emerald-500';
    if (gap <= 1) return 'bg-amber-400';
    return 'bg-red-400';
  };

  const getChangeableBadge = (level: string) => {
    const lower = level?.toLowerCase();
    if (lower === 'high') return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">High</Badge>;
    if (lower === 'moderate') return <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">Moderate</Badge>;
    return <Badge variant="secondary">Limited</Badge>;
  };

  const getDifficultyBadge = (difficulty: string) => {
    const lower = difficulty?.toLowerCase();
    if (lower?.includes('quick') || lower?.includes('easy')) return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">Quick win</Badge>;
    if (lower?.includes('significant') || lower?.includes('hard') || lower?.includes('high')) return <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">Significant commitment</Badge>;
    return <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">Medium effort</Badge>;
  };

  const sortedGaps = result?.gapMap
    ? [...result.gapMap].sort((a, b) => (b.weightedImpact ?? 0) - (a.weightedImpact ?? 0))
    : [];

  const topPriorities = sortedGaps.filter((g) => !g.alreadyStrong).slice(0, 3);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            Gap Analysis & Action Plan
          </h1>
          <p className="mt-2 text-muted-foreground">
            A personalized strategy to strengthen your application — based on what each school actually values.
          </p>
        </div>

        {/* Input Card */}
        {!result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-xl rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="space-y-5">
              <div>
                <Label className="mb-1.5 block text-sm font-medium">School</Label>
                <Select value={school} onValueChange={setSchool}>
                  <SelectTrigger><SelectValue placeholder="Select a school" /></SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_UNIVERSITIES.map((u) => (
                      <SelectItem key={u} value={u}>{u}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-1.5 block text-sm font-medium">Timeline stage</Label>
                <Select value={timeline} onValueChange={setTimeline}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TIMELINE_OPTIONS.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {school && hasEvaluation === false && (
                <div className="rounded-lg border border-amber-300/40 bg-amber-50/50 p-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
                  <p>
                    No evaluation found for {school}.{' '}
                    <Link to="/application" className="underline font-medium hover:text-amber-900 dark:hover:text-amber-100">
                      Run an evaluation first
                    </Link>{' '}
                    for a more accurate action plan.
                  </p>
                </div>
              )}

              {school && hasEvaluation === true && (
                <div className="rounded-lg border border-emerald-300/40 bg-emerald-50/50 p-3 text-sm text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200">
                  <CheckCircle2 className="inline-block h-4 w-4 mr-1.5 -mt-0.5" />
                  Evaluation data found — it will be included automatically.
                </div>
              )}

              <Button
                onClick={handleSubmit}
                disabled={!school}
                className="w-full cta-gradient border-0 text-primary-foreground hover:opacity-90"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate my action plan
              </Button>
            </div>
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto max-w-md text-center py-16"
          >
            <div className="mb-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full cta-gradient">
                <BarChart3 className="h-6 w-6 text-primary-foreground animate-pulse" />
              </div>
              <Progress value={((loadingStep + 1) / LOADING_STEPS.length) * 100} className="h-2 mb-4" />
              <AnimatePresence mode="wait">
                <motion.p
                  key={loadingStep}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="text-muted-foreground font-medium"
                >
                  {LOADING_STEPS[loadingStep]}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Error result */}
        {result?.error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-xl">
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
              <XCircle className="mx-auto mb-3 h-8 w-8 text-destructive" />
              <p className="font-medium text-foreground mb-1">Something went wrong</p>
              <p className="text-sm text-muted-foreground mb-4">{result.error}</p>
              <Button variant="outline" onClick={resetForm}><RotateCcw className="mr-2 h-4 w-4" /> Try again</Button>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {result && !result.error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Strategic Overview */}
            {result.strategicOverview && (
              <div className="rounded-xl border-l-4 border-l-primary border border-border bg-card p-6 shadow-sm">
                <h2 className="font-serif text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Strategic overview
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.strategicOverview}</p>
              </div>
            )}

            {/* Gap Map */}
            {sortedGaps.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h2 className="font-serif text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Gap map
                </h2>
                <div className="space-y-5">
                  {sortedGaps.map((gap, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-foreground">{gap.dimension}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {gap.currentScore ?? '–'} → {gap.targetScore ?? '–'}
                            {gap.gap > 0 && <span className="ml-1 text-red-500">(gap: {gap.gap})</span>}
                          </span>
                          {getChangeableBadge(gap.changeableLevel)}
                        </div>
                      </div>
                      <div className="relative h-5 w-full rounded-full bg-secondary overflow-hidden">
                        {/* Current score bar */}
                        <div
                          className={`h-full rounded-full transition-all ${getGapColor(gap.gap, gap.alreadyStrong)}`}
                          style={{ width: `${((gap.currentScore ?? 0) / 10) * 100}%` }}
                        />
                        {/* Target marker */}
                        {gap.targetScore != null && (
                          <div
                            className="absolute top-0 h-full w-0.5 bg-foreground/60"
                            style={{ left: `${(gap.targetScore / 10) * 100}%` }}
                            title={`Target: ${gap.targetScore}`}
                          />
                        )}
                        {/* Stretch marker */}
                        {gap.stretchScore != null && (
                          <div
                            className="absolute top-0 h-full w-0.5 bg-primary/40 border-dashed"
                            style={{ left: `${(gap.stretchScore / 10) * 100}%` }}
                            title={`Stretch: ${gap.stretchScore}`}
                          />
                        )}
                      </div>
                      {gap.changeNote && (
                        <p className="mt-1 text-xs text-muted-foreground">{gap.changeNote}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Priority Stack */}
            {topPriorities.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h2 className="font-serif text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Where to focus your energy
                </h2>
                <div className="grid gap-3 sm:grid-cols-3">
                  {topPriorities.map((p, i) => (
                    <div key={i} className="rounded-lg border border-border bg-muted/30 p-4 text-center">
                      <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full cta-gradient text-sm font-bold text-primary-foreground">
                        {i + 1}
                      </div>
                      <p className="text-sm font-medium text-foreground">{p.dimension}</p>
                      <p className="text-xs text-muted-foreground mt-1">Gap: {p.gap} pts</p>
                      {p.potentialScoreGain != null && (
                        <p className="text-xs text-emerald-600 font-medium mt-0.5">+{p.potentialScoreGain} potential</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Narrative Thread Assessment */}
            {result.narrativeThreadAssessment && (
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h2 className="font-serif text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Your application story
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.narrativeThreadAssessment}</p>
              </div>
            )}

            {/* Action Plan */}
            {result.actions && result.actions.length > 0 && (
              <div className="space-y-3">
                <h2 className="font-serif text-lg font-semibold text-foreground flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Action plan
                </h2>
                {result.actions.map((action) => {
                  const isOpen = expandedActions.has(action.priority);
                  return (
                    <Collapsible key={action.priority} open={isOpen} onOpenChange={() => toggleAction(action.priority)}>
                      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                        <CollapsibleTrigger className="w-full px-5 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                              {action.priority}
                            </div>
                            <span className="text-sm font-medium text-foreground text-left">{action.title}</span>
                            {getDifficultyBadge(action.difficulty)}
                          </div>
                          {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="px-5 pb-5 pt-1 space-y-3 border-t border-border">
                            <p className="text-sm text-muted-foreground leading-relaxed">{action.description}</p>

                            <div className="flex flex-wrap gap-2">
                              {action.timeline && (
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="mr-1 h-3 w-3" />
                                  {action.timeline}
                                </Badge>
                              )}
                            </div>

                            {action.estimatedImpact && (
                              <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
                                <p className="text-xs font-medium text-primary">Estimated impact</p>
                                <p className="text-sm text-foreground">{action.estimatedImpact}</p>
                              </div>
                            )}

                            {action.whatDoneLooksLike && (
                              <div className="flex items-start gap-2">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground">What done looks like</p>
                                  <p className="text-sm text-foreground">{action.whatDoneLooksLike}</p>
                                </div>
                              </div>
                            )}

                            {action.compoundEffect && (
                              <p className="text-xs italic text-muted-foreground">{action.compoundEffect}</p>
                            )}
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  );
                })}
              </div>
            )}

            {/* Essay Strategy */}
            {result.essayStrategy && (
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h2 className="font-serif text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Essay strategy
                </h2>
                <div className="space-y-4">
                  {result.essayStrategy.primaryEssayFocus && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-0.5">Write about</p>
                      <p className="text-sm text-foreground">{result.essayStrategy.primaryEssayFocus}</p>
                    </div>
                  )}
                  {result.essayStrategy.essayAngle && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-0.5">Your angle</p>
                      <p className="text-sm text-foreground">{result.essayStrategy.essayAngle}</p>
                    </div>
                  )}
                  {result.essayStrategy.avoidInEssay && (
                    <div className="rounded-lg border border-amber-300/40 bg-amber-50/50 p-3 dark:bg-amber-900/20">
                      <p className="text-xs font-medium text-amber-700 dark:text-amber-300 mb-0.5 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> Avoid
                      </p>
                      <p className="text-sm text-amber-800 dark:text-amber-200">{result.essayStrategy.avoidInEssay}</p>
                    </div>
                  )}
                  {result.essayStrategy.supplementalStrategy && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-0.5">Supplemental strategy</p>
                      <p className="text-sm text-foreground">{result.essayStrategy.supplementalStrategy}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Honest Assessment */}
            {result.honestAssessment && (
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h2 className="font-serif text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  Honest assessment
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.honestAssessment}</p>
              </div>
            )}

            {/* Strengths to Protect */}
            {result.strengthsToProtect && result.strengthsToProtect.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h2 className="font-serif text-lg font-semibold text-foreground mb-3">Strengths to protect</h2>
                <ul className="space-y-2">
                  {result.strengthsToProtect.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Reset */}
            <div className="text-center pt-4">
              <Button variant="outline" onClick={resetForm}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Generate another plan
              </Button>
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
}
