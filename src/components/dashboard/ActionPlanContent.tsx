/**
 * Action Plan (Gap Analysis) content — extracted for dashboard tab embedding.
 * Renders without Navbar/Footer.
 */
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useTier } from '@/contexts/TierContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, ChevronDown, ChevronUp, CheckCircle2, AlertTriangle,
  ArrowRight, RotateCcw, Sparkles, Shield, Zap, Clock,
  BookOpen, XCircle, TrendingUp, BarChart3, FileText, ChevronRight,
} from 'lucide-react';

import { SUPPORTED_UNIVERSITIES } from '@/lib/universities';
import RequestSchoolForm, { RequestSchoolLink } from '@/components/RequestSchoolForm';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admitly-backend.onrender.com';

const TIMELINE_OPTIONS = [
  { value: 'exploring', label: 'Exploring (2+ years out)' },
  { value: 'building', label: 'Building my profile (1-2 years out)' },
  { value: 'applying', label: 'Preparing applications (this year)' },
  { value: 'finalizing', label: 'Finalizing (within 3 months)' },
];

const LOADING_STEPS = ['Analyzing your profile gaps...', 'Computing priorities...', 'Generating your action plan...'];

interface GapDimension { dimension: string; label: string; currentScore: number; targetScore: number; stretchScore?: number; gap: number; weightedImpact: number; changeable: string; changeNote: string; alreadyStrong: boolean; potentialScoreGain?: number; }
interface ActionItem { priority: number; title: string; description: string; difficultyLevel: string; timeline: string; estimatedImpact: string; whatDoneLooksLike: string; compoundEffect?: string; }
interface EssayStrategy { primaryEssayFocus: string; essayAngle: string; avoidInEssay: string; supplementalStrategy: string; }
interface GapAnalysisResult { error?: string; strategicOverview: string; gapMap: GapDimension[]; narrativeThreadAssessment: string; actionPlan: ActionItem[]; essayStrategy: EssayStrategy; honestAssessment: string; strengthsToProtect: string[]; }

function gapScoreColor(score: number): string {
  if (score >= 7) return 'text-[hsl(var(--score-strong))]';
  if (score >= 4) return 'text-[hsl(var(--score-moderate))]';
  return 'text-[hsl(var(--score-weak))]';
}

interface ActionPlanContentProps {
  initialSchool?: string;
  resultId?: string;
}

export default function ActionPlanContent({ initialSchool, resultId }: ActionPlanContentProps) {
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [savedDate, setSavedDate] = useState<string | null>(null);
  const [requestSchoolOpen, setRequestSchoolOpen] = useState(false);
  const { user } = useAuth();
  const { tier, setShowPricing } = useTier();
  const [school, setSchool] = useState(() => {
    return initialSchool && SUPPORTED_UNIVERSITIES.includes(initialSchool) ? initialSchool : '';
  });
  const [timeline, setTimeline] = useState('applying');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<GapAnalysisResult | null>(null);
  const [hasEvaluation, setHasEvaluation] = useState<boolean | null>(null);
  const [evaluationData, setEvaluationData] = useState<{ snapshot: any; result: any } | null>(null);
  const [expandedActions, setExpandedActions] = useState<Set<number>>(new Set([1, 2]));
  const [rateLimitMsg, setRateLimitMsg] = useState<string | null>(null);
  // Load saved result if resultId is provided
  useEffect(() => {
    if (!resultId || !user) return;
    setLoadingSaved(true);
    async function loadSaved() {
      const { data } = await supabase
        .from('gap_analyses')
        .select('*')
        .eq('id', resultId!)
        .eq('user_id', user!.id)
        .single();
      if (data?.result) {
        const parsed = data.result as unknown as GapAnalysisResult;
        if (parsed.gapMap) {
          parsed.gapMap = parsed.gapMap.map((item: any) => ({
            ...item,
            currentScore: item.currentScore ?? item.current,
            targetScore: item.targetScore ?? item.target,
          }));
        }
        setResult(parsed);
        setSchool(data.university_name || '');
        setTimeline(data.timeline_stage || 'applying');
        setSavedDate(data.created_at);
      }
      setLoadingSaved(false);
    }
    loadSaved();
  }, [resultId, user]);

  useEffect(() => {
    if (initialSchool && SUPPORTED_UNIVERSITIES.includes(initialSchool)) {
      setSchool(initialSchool);
    }
  }, [initialSchool]);

  useEffect(() => {
    if (!school || !user) { setHasEvaluation(null); setEvaluationData(null); return; }
    async function checkEvaluation() {
      const { data: evaluations } = await supabase.from('evaluations').select('id, application_snapshot, universities').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(10);
      if (!evaluations || evaluations.length === 0) { setHasEvaluation(false); setEvaluationData(null); return; }

      // Try exact match on universities array
      const match = evaluations.find((e) => (e.universities as string[])?.includes(school));
      if (match) {
        const { data: results } = await supabase.from('evaluation_results').select('*').eq('evaluation_id', match.id).eq('university_name', school).limit(1);
        if (results && results.length > 0) {
          setHasEvaluation(true); setEvaluationData({ snapshot: match.application_snapshot, result: results[0] }); return;
        }
      }

      // Try ilike match across all evaluation_results for this user's evaluations
      const evalIds = evaluations.map(e => e.id);
      const { data: ilikeResults } = await supabase.from('evaluation_results').select('*').in('evaluation_id', evalIds).ilike('university_name', `%${school}%`).order('created_at', { ascending: false }).limit(1);
      if (ilikeResults && ilikeResults.length > 0) {
        const parentEval = evaluations.find(e => e.id === ilikeResults[0].evaluation_id);
        setHasEvaluation(true); setEvaluationData({ snapshot: parentEval?.application_snapshot ?? evaluations[0].application_snapshot, result: ilikeResults[0] }); return;
      }

      // No result for this school, but pass the most recent application_snapshot so backend can work with it
      setHasEvaluation(false); setEvaluationData({ snapshot: evaluations[0].application_snapshot, result: null });
    }
    checkEvaluation();
  }, [school, user]);

  useEffect(() => {
    if (!loading) return;
    setLoadingStep(0);
    const t1 = setTimeout(() => setLoadingStep(1), 3000);
    const t2 = setTimeout(() => setLoadingStep(2), 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [loading]);

  const handleSubmit = async () => {
    if (!school) return;
    setLoading(true); setResult(null); setRateLimitMsg(null);
    let response: Response;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const body: any = { universityName: school, timelineStage: timeline };
      if (evaluationData?.snapshot) { body.application = evaluationData.snapshot; }
      if (evaluationData?.result) { body.evaluationResult = evaluationData.result; }
      response = await fetch(`${API_BASE_URL}/api/gapAnalysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }) },
        body: JSON.stringify(body),
      });
    } catch {
      toast.error('Could not connect to the server. Please try again.');
      setLoading(false);
      return;
    }

    try {
      if (response.status === 401) { toast.error('Please sign in.'); return; }
      if (response.status === 429 || response.status === 403) {
        const errData = await response.json().catch(() => ({}));
        if (tier === 'free' || errData.upgradeRequired) {
          setShowPricing(true);
          return;
        }
        if (response.status === 429) {
          setRateLimitMsg(errData.message || "You've reached your daily action plan limit. Your plans reset tomorrow.");
          return;
        }
        toast.error(errData.message || 'Access denied.');
        return;
      }
      if (!response.ok) { const err = await response.json().catch(() => ({})); toast.error(err.message || `Failed (${response.status})`); return; }
      const data = await response.json();
      if (data.error) { setResult({ error: data.error } as GapAnalysisResult); } else {
        if (data.gapMap) { data.gapMap = data.gapMap.map((item: any) => ({ ...item, currentScore: item.currentScore ?? item.current, targetScore: item.targetScore ?? item.target })); }
        setResult(data);
      }
    } catch (e: any) { toast.error(e.message || 'Something went wrong.'); } finally { setLoading(false); }
  };

  const toggleAction = (priority: number) => { setExpandedActions((prev) => { const next = new Set(prev); if (next.has(priority)) next.delete(priority); else next.add(priority); return next; }); };
  const resetForm = () => { setResult(null); setSchool(''); setTimeline('applying'); setExpandedActions(new Set([1, 2])); setSavedDate(null); setRateLimitMsg(null); };
  const getGapColor = (gap: number, alreadyStrong: boolean) => { if (alreadyStrong) return 'bg-emerald-500'; if (gap <= 1) return 'bg-amber-400'; return 'bg-red-400'; };
  const getChangeableBadge = (level: string) => { const lower = level?.toLowerCase(); if (lower === 'high') return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">High</Badge>; if (lower === 'moderate') return <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">Moderate</Badge>; return <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">Limited</Badge>; };
  const getDifficultyBadge = (difficultyLevel: string) => { const lower = difficultyLevel?.toLowerCase(); if (lower?.includes('quick') || lower?.includes('easy') || lower?.includes('low')) return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">Quick win</Badge>; if (lower?.includes('significant') || lower?.includes('hard') || lower?.includes('high')) return <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">Significant commitment</Badge>; return <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">Medium effort</Badge>; };

  const sortedGaps = result?.gapMap ? [...result.gapMap].sort((a, b) => (b.weightedImpact ?? 0) - (a.weightedImpact ?? 0)) : [];
  const topPriorities = sortedGaps.filter((g) => !g.alreadyStrong).slice(0, 3);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <p className="text-base text-gray-600 text-center mb-6">A personalized strategy to strengthen your application.</p>

      {/* Rate limit message */}
      {rateLimitMsg && !loading && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-5 mb-4">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300 font-sans">{rateLimitMsg}</p>
              <button
                onClick={() => { setRateLimitMsg(null); window.location.href = '/dashboard?tab=overview'; }}
                className="text-xs font-medium text-[hsl(var(--coral))] hover:underline font-sans mt-2 inline-flex items-center gap-1"
              >
                View your previous plans on the Overview tab →
              </button>
            </div>
          </div>
        </div>
      )}

      {!result && !loading && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl space-y-5">
          <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
            <div className="space-y-4">
              <div>
                <Label className="mb-1.5 block text-sm font-medium">School</Label>
                <Select value={school} onValueChange={setSchool}>
                  <SelectTrigger className="focus-coral"><SelectValue placeholder="Select a school" /></SelectTrigger>
                  <SelectContent>{SUPPORTED_UNIVERSITIES.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                </Select>
                <RequestSchoolLink onClick={() => setRequestSchoolOpen(true)} />
              </div>
              <div>
                <Label className="mb-1.5 block text-sm font-medium">Timeline stage</Label>
                <Select value={timeline} onValueChange={setTimeline}>
                  <SelectTrigger className="focus-coral"><SelectValue /></SelectTrigger>
                  <SelectContent>{TIMELINE_OPTIONS.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              {school && hasEvaluation === false && (
                <div className="rounded-lg border border-amber-300/40 bg-amber-50/50 p-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
                  <p>No evaluation found for {school}. Run an evaluation first for a more accurate plan.</p>
                </div>
              )}
              {school && hasEvaluation === true && (
                <div className="rounded-lg border border-emerald-300/40 bg-emerald-50/50 p-3 text-sm text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200">
                  <CheckCircle2 className="inline-block h-4 w-4 mr-1.5 -mt-0.5" /> Evaluation data found — it will be included automatically.
                </div>
              )}
              <Button onClick={handleSubmit} disabled={!school} className="w-full bg-[#e85d3a] hover:bg-[#d4522f] border-0 text-white font-semibold">
                <Sparkles className="mr-2 h-4 w-4" /> Generate my action plan
              </Button>
              <p className="text-sm text-gray-400 font-sans text-center mt-3">Your plan will include gap analysis, prioritized actions, and essay strategy.</p>
            </div>
          </div>

          {/* Previous action plans — collapsible, below form */}
          <PreviousActionPlans onLoad={(id) => {
            if (!user?.id) return;
            setLoadingSaved(true);
            (async () => {
              const { data } = await supabase
                .from('gap_analyses')
                .select('*')
                .eq('id', id)
                .eq('user_id', user.id)
                .single();
              if (data?.result) {
                const parsed = data.result as unknown as GapAnalysisResult;
                if (parsed.gapMap) {
                  parsed.gapMap = parsed.gapMap.map((item: any) => ({
                    ...item,
                    currentScore: item.currentScore ?? item.current,
                    targetScore: item.targetScore ?? item.target,
                  }));
                }
                setResult(parsed);
                setSchool(data.university_name || '');
                setTimeline(data.timeline_stage || 'applying');
                setSavedDate(data.created_at);
              }
              setLoadingSaved(false);
            })();
          }} />
        </motion.div>
      )}

      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-md text-center py-14">
          <div className="mb-6">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full cta-gradient">
              <BarChart3 className="h-6 w-6 text-white animate-pulse" />
            </div>
            <Progress value={((loadingStep + 1) / LOADING_STEPS.length) * 100} className="h-2 mb-4" />
            <AnimatePresence mode="wait">
              <motion.p key={loadingStep} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="text-base text-gray-600 font-medium">
                {LOADING_STEPS[loadingStep]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {result?.error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-xl">
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-center">
            <XCircle className="mx-auto mb-3 h-8 w-8 text-destructive" />
            <p className="font-medium text-foreground mb-1">Something went wrong</p>
            <p className="text-sm text-muted-foreground mb-4">{result.error}</p>
            <Button variant="outline" onClick={resetForm}><RotateCcw className="mr-2 h-4 w-4" /> Try again</Button>
          </div>
        </motion.div>
      )}

      {result && !result.error && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-5">
          {/* Saved result banner */}
          {savedDate && (
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-5 py-3">
              <span className="text-sm text-muted-foreground font-sans">
                Results from {format(new Date(savedDate), 'MMM d, yyyy')}
              </span>
              <Button size="sm" variant="outline" onClick={resetForm} className="gap-1.5 text-xs font-sans">
                <Sparkles className="h-3.5 w-3.5" /> Generate new plan
              </Button>
            </div>
          )}
          {/* Always visible: Strategic overview */}
          {result.strategicOverview && (
            <div className="rounded-xl border-l-4 border-l-[hsl(var(--coral))] border border-border bg-card p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2 font-sans"><Target className="h-4 w-4 text-[hsl(var(--coral))]" /> Strategic overview</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.strategicOverview}</p>
            </div>
          )}

          {/* Always visible: Gap map */}
          {sortedGaps.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2 font-sans"><BarChart3 className="h-4 w-4 text-[hsl(var(--coral))]" /> Gap map</h2>
              <div className="space-y-5">
                {sortedGaps.map((gap, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{gap.label || gap.dimension}</span>
                      {getChangeableBadge(gap.changeable)}
                    </div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-sans ${gapScoreColor(gap.currentScore)}`}>Your score: {gap.currentScore ?? '–'}/10</span>
                      <span className="text-xs text-muted-foreground">Target: {gap.targetScore ?? '–'}/10</span>
                    </div>
                    <div className="relative h-5 w-full rounded-full bg-secondary overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${getGapColor(gap.gap, gap.alreadyStrong)}`} style={{ width: `${((gap.currentScore ?? 0) / 10) * 100}%` }} />
                      {gap.targetScore != null && <div className="absolute top-0 h-full rounded-full bg-gray-200 border border-gray-300" style={{ left: `${((gap.currentScore ?? 0) / 10) * 100}%`, width: `${(((gap.targetScore - (gap.currentScore ?? 0)) / 10) * 100)}%` }} />}
                      {gap.targetScore != null && <div className="absolute top-0 h-full w-0.5 bg-foreground/60" style={{ left: `${(gap.targetScore / 10) * 100}%` }} />}
                      {gap.stretchScore != null && <div className="absolute top-0 h-full w-0.5 bg-primary/40 border-dashed" style={{ left: `${(gap.stretchScore / 10) * 100}%` }} />}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      {gap.alreadyStrong ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600"><CheckCircle2 className="h-3 w-3" /> Already strong</span>
                      ) : gap.gap > 0 ? (
                        <span className={`text-xs font-medium ${gap.gap > 2 ? 'text-[hsl(var(--score-weak))]' : 'text-[hsl(var(--score-moderate))]'}`}>Gap: {gap.gap} pts</span>
                      ) : null}
                    </div>
                    {gap.changeNote && <p className="mt-0.5 text-sm text-gray-500 leading-snug">{gap.changeNote}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Always visible: Priority stack */}
          {topPriorities.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2 font-sans"><TrendingUp className="h-4 w-4 text-[hsl(var(--coral))]" /> Where to focus your energy</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {topPriorities.map((p, i) => (
                  <div key={i} className={`rounded-xl border p-3 text-center ${i === 0 ? 'bg-red-50 border-red-100' : 'border-border bg-muted/30'}`}>
                    <div className="mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-full cta-gradient text-sm font-bold text-white">{i + 1}</div>
                    <p className="text-sm font-medium text-foreground">{p.label || p.dimension}</p>
                    <p className="text-sm font-medium text-muted-foreground mt-1">
                      <span className={gapScoreColor(p.currentScore)}>{p.currentScore}</span> → {p.targetScore} (gap: {p.gap})
                    </p>
                    <div className="mt-1.5">{getChangeableBadge(p.changeable)}</div>
                    {p.potentialScoreGain != null && <p className="text-xs text-emerald-600 font-medium mt-0.5">+{p.potentialScoreGain} potential</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Accordion sections */}
          <Accordion type="multiple" className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-gray-100">
            {/* Your Application Story — collapsed */}
            {result.narrativeThreadAssessment && (
              <AccordionItem value="narrative" className="border-0">
                <AccordionTrigger className="px-5 py-4 text-sm font-semibold font-sans hover:no-underline hover:bg-gray-50 transition-colors">
                  <span className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-[hsl(var(--coral))]" /> Your application story</span>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.narrativeThreadAssessment}</p>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Essay Strategy — collapsed */}
            {result.essayStrategy && (
              <AccordionItem value="essay-strategy" className="border-0">
                <AccordionTrigger className="px-5 py-4 text-sm font-semibold font-sans hover:no-underline hover:bg-gray-50 transition-colors">
                  <span className="flex items-center gap-2"><FileText className="h-4 w-4 text-[hsl(var(--coral))]" /> Essay strategy</span>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-4 space-y-3">
                  {result.essayStrategy.primaryEssayFocus && <div><p className="text-xs font-medium text-muted-foreground mb-0.5">Write about</p><p className="text-sm text-foreground">{result.essayStrategy.primaryEssayFocus}</p></div>}
                  {result.essayStrategy.essayAngle && <div><p className="text-xs font-medium text-muted-foreground mb-0.5">Your angle</p><p className="text-sm text-foreground">{result.essayStrategy.essayAngle}</p></div>}
                  {result.essayStrategy.avoidInEssay && (
                    <div className="rounded-lg border border-amber-300/40 bg-amber-50/50 p-3 dark:bg-amber-900/20">
                      <p className="text-xs font-medium text-amber-700 dark:text-amber-300 mb-0.5 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Avoid</p>
                      <p className="text-sm text-amber-800 dark:text-amber-200">{result.essayStrategy.avoidInEssay}</p>
                    </div>
                  )}
                  {result.essayStrategy.supplementalStrategy && <div><p className="text-xs font-medium text-muted-foreground mb-0.5">Supplemental strategy</p><p className="text-sm text-foreground">{result.essayStrategy.supplementalStrategy}</p></div>}
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Strengths to Protect — collapsed */}
            {result.strengthsToProtect && result.strengthsToProtect.length > 0 && (
              <AccordionItem value="strengths" className="border-0">
                <AccordionTrigger className="px-5 py-4 text-sm font-semibold font-sans hover:no-underline hover:bg-gray-50 transition-colors">Strengths to protect</AccordionTrigger>
                <AccordionContent className="px-5 pb-4">
                  <ul className="space-y-1.5">{result.strengthsToProtect.map((s, i) => <li key={i} className="flex items-start gap-2 text-sm text-foreground"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />{s}</li>)}</ul>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>

          {/* Action plan items — keep existing collapsible behavior */}
          {result.actionPlan && result.actionPlan.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 font-sans"><Zap className="h-4 w-4 text-[hsl(var(--coral))]" /> Action plan</h2>
              {result.actionPlan.map((action) => {
                const isOpen = expandedActions.has(action.priority);
                return (
                  <Collapsible key={action.priority} open={isOpen} onOpenChange={() => toggleAction(action.priority)}>
                    <div className={`rounded-xl border border-border bg-card shadow-sm overflow-hidden ${!isOpen ? 'hover:bg-gray-50 cursor-pointer transition-colors' : ''}`}>
                      <CollapsibleTrigger className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[hsl(var(--coral))]/10 text-xs font-bold text-[hsl(var(--coral))]">{action.priority}</div>
                          <span className="text-sm font-medium text-foreground text-left">{action.title}</span>
                          {getDifficultyBadge(action.difficultyLevel)}
                        </div>
                        {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="px-4 pb-4 pt-1 space-y-3 border-t border-border">
                          <p className="text-sm text-muted-foreground leading-relaxed">{action.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {action.timeline && <Badge variant="outline" className="text-xs"><Clock className="mr-1 h-3 w-3" />{action.timeline}</Badge>}
                          </div>
                          {action.estimatedImpact && (
                            <div className="rounded-lg bg-[hsl(var(--coral))]/5 border border-[hsl(var(--coral))]/10 p-3">
                              <p className="text-xs font-medium text-[hsl(var(--coral))]">Estimated impact</p>
                              <p className="text-base font-semibold text-gray-900">{action.estimatedImpact}</p>
                            </div>
                          )}
                          {action.whatDoneLooksLike && (
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                              <div><p className="text-xs font-medium text-muted-foreground">What done looks like</p><p className="text-sm text-foreground">{action.whatDoneLooksLike}</p></div>
                            </div>
                          )}
                          {action.compoundEffect && <p className="text-sm italic text-gray-500">{action.compoundEffect}</p>}
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                );
              })}
            </div>
          )}

          {/* Always visible: Honest assessment */}
          {result.honestAssessment && (
            <div className="bg-gray-50 border-l-4 border-gray-400 rounded-r-lg p-6">
              <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2 font-sans"><Shield className="h-4 w-4 text-muted-foreground" /> Honest assessment</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.honestAssessment}</p>
            </div>
          )}

          <div className="text-center pt-3">
            <Button variant="outline" onClick={resetForm} className="border-muted-foreground/30"><RotateCcw className="mr-2 h-4 w-4" /> Generate another plan</Button>
          </div>
        </motion.div>
      )}
      <RequestSchoolForm open={requestSchoolOpen} onOpenChange={setRequestSchoolOpen} />
    </div>
  );
}

interface PrevGapEntry {
  id: string;
  university_name: string;
  timeline_stage: string | null;
  created_at: string | null;
}

function PreviousActionPlans({ onLoad }: { onLoad: (id: string) => void }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<PrevGapEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!open || loaded || !user) return;
    (async () => {
      const { data } = await supabase
        .from('gap_analyses')
        .select('id, university_name, timeline_stage, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      setItems((data ?? []) as PrevGapEntry[]);
      setLoaded(true);
    })();
  }, [open, loaded, user]);

  if (!user) return null;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 flex items-center justify-between text-sm font-medium font-sans text-muted-foreground hover:bg-muted/30 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5" /> Previous action plans
        </span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="border-t border-border divide-y divide-border">
          {!loaded ? (
            <div className="px-4 py-3 text-xs text-muted-foreground font-sans animate-pulse">Loading…</div>
          ) : items.length === 0 ? (
            <div className="px-4 py-3 text-xs text-muted-foreground font-sans">No previous action plans</div>
          ) : (
            <>
              {items.map((g) => (
                <button
                  key={g.id}
                  onClick={() => onLoad(g.id)}
                  className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-muted/40 transition-colors text-left"
                >
                  <span className="text-xs font-sans text-foreground truncate">
                    {g.university_name} — {g.timeline_stage ? g.timeline_stage.charAt(0).toUpperCase() + g.timeline_stage.slice(1) : 'Plan'} — {g.created_at ? format(new Date(g.created_at), 'MMM d') : ''}
                  </span>
                  <ChevronRight className="h-3 w-3 text-muted-foreground/40 shrink-0 ml-2" />
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
