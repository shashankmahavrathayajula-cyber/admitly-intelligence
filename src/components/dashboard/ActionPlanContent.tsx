/**
 * Action Plan (Gap Analysis) content — extracted for dashboard tab embedding.
 * Renders without Navbar/Footer.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, ChevronDown, ChevronUp, CheckCircle2, AlertTriangle,
  ArrowRight, RotateCcw, Sparkles, Shield, Zap, Clock,
  BookOpen, XCircle, TrendingUp, BarChart3, FileText,
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admitly-backend.onrender.com';

const SUPPORTED_UNIVERSITIES = [
  'University of Washington', 'Washington State University', 'Stanford University',
  'Massachusetts Institute of Technology', 'Harvard University',
  'University of California, Berkeley', 'University of California, Los Angeles',
  'University of Southern California', 'University of Michigan — Ann Arbor',
  'The University of Texas at Austin',
];

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
}

export default function ActionPlanContent({ initialSchool }: ActionPlanContentProps) {
  const { user } = useAuth();
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

  useEffect(() => {
    if (initialSchool && SUPPORTED_UNIVERSITIES.includes(initialSchool)) {
      setSchool(initialSchool);
    }
  }, [initialSchool]);

  useEffect(() => {
    if (!school || !user) { setHasEvaluation(null); setEvaluationData(null); return; }
    async function checkEvaluation() {
      const { data: evaluations } = await supabase.from('evaluations').select('id, application_snapshot, universities').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(10);
      const match = evaluations?.find((e) => (e.universities as string[])?.includes(school));
      if (match) {
        const { data: results } = await supabase.from('evaluation_results').select('*').eq('evaluation_id', match.id).eq('university_name', school).limit(1);
        if (results && results.length > 0) { setHasEvaluation(true); setEvaluationData({ snapshot: match.application_snapshot, result: results[0] }); return; }
      }
      setHasEvaluation(false); setEvaluationData(null);
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
    setLoading(true); setResult(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const body: any = { universityName: school, timelineStage: timeline };
      if (evaluationData) { body.application = evaluationData.snapshot; body.evaluationResult = evaluationData.result; }
      const response = await fetch(`${API_BASE_URL}/api/gapAnalysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }) },
        body: JSON.stringify(body),
      });
      if (response.status === 401) { toast.error('Please sign in.'); return; }
      if (response.status === 429) { toast.error("Rate limited. Try later."); return; }
      if (!response.ok) { const err = await response.json().catch(() => ({})); toast.error(err.message || `Failed (${response.status})`); return; }
      const data = await response.json();
      if (data.error) { setResult({ error: data.error } as GapAnalysisResult); } else {
        if (data.gapMap) { data.gapMap = data.gapMap.map((item: any) => ({ ...item, currentScore: item.currentScore ?? item.current, targetScore: item.targetScore ?? item.target })); }
        setResult(data);
      }
    } catch (e: any) { toast.error(e.message || 'Something went wrong.'); } finally { setLoading(false); }
  };

  const toggleAction = (priority: number) => { setExpandedActions((prev) => { const next = new Set(prev); if (next.has(priority)) next.delete(priority); else next.add(priority); return next; }); };
  const resetForm = () => { setResult(null); setSchool(''); setTimeline('applying'); setExpandedActions(new Set([1, 2])); };
  const getGapColor = (gap: number, alreadyStrong: boolean) => { if (alreadyStrong) return 'bg-emerald-500'; if (gap <= 1) return 'bg-amber-400'; return 'bg-red-400'; };
  const getChangeableBadge = (level: string) => { const lower = level?.toLowerCase(); if (lower === 'high') return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">High</Badge>; if (lower === 'moderate') return <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">Moderate</Badge>; return <Badge variant="secondary">Limited</Badge>; };
  const getDifficultyBadge = (difficultyLevel: string) => { const lower = difficultyLevel?.toLowerCase(); if (lower?.includes('quick') || lower?.includes('easy') || lower?.includes('low')) return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">Quick win</Badge>; if (lower?.includes('significant') || lower?.includes('hard') || lower?.includes('high')) return <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">Significant commitment</Badge>; return <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">Medium effort</Badge>; };

  const sortedGaps = result?.gapMap ? [...result.gapMap].sort((a, b) => (b.weightedImpact ?? 0) - (a.weightedImpact ?? 0)) : [];
  const topPriorities = sortedGaps.filter((g) => !g.alreadyStrong).slice(0, 3);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <p className="text-sm text-muted-foreground text-center mb-6">A personalized strategy to strengthen your application.</p>

      {!result && !loading && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-xl rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="space-y-4">
            <div>
              <Label className="mb-1.5 block text-sm font-medium">School</Label>
              <Select value={school} onValueChange={setSchool}>
                <SelectTrigger className="focus-coral"><SelectValue placeholder="Select a school" /></SelectTrigger>
                <SelectContent>{SUPPORTED_UNIVERSITIES.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
              </Select>
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
            <Button onClick={handleSubmit} disabled={!school} className="w-full cta-gradient border-0 text-white hover:opacity-90">
              <Sparkles className="mr-2 h-4 w-4" /> Generate my action plan
            </Button>
          </div>
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
              <motion.p key={loadingStep} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="text-muted-foreground font-medium">
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
                    {gap.changeNote && <p className="mt-0.5 text-xs text-muted-foreground/70 leading-snug">{gap.changeNote}</p>}
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
                  <div key={i} className="rounded-lg border border-border bg-muted/30 p-3 text-center">
                    <div className="mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-full cta-gradient text-sm font-bold text-white">{i + 1}</div>
                    <p className="text-sm font-medium text-foreground">{p.label || p.dimension}</p>
                    <p className="text-xs text-muted-foreground mt-1">
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
          <Accordion type="multiple" className="space-y-2">
            {/* Your Application Story — collapsed */}
            {result.narrativeThreadAssessment && (
              <AccordionItem value="narrative" className="rounded-xl border border-border bg-card overflow-hidden">
                <AccordionTrigger className="px-5 py-3 text-sm font-semibold font-sans hover:no-underline">
                  <span className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-[hsl(var(--coral))]" /> Your application story</span>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.narrativeThreadAssessment}</p>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Essay Strategy — collapsed */}
            {result.essayStrategy && (
              <AccordionItem value="essay-strategy" className="rounded-xl border border-border bg-card overflow-hidden">
                <AccordionTrigger className="px-5 py-3 text-sm font-semibold font-sans hover:no-underline">
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
              <AccordionItem value="strengths" className="rounded-xl border border-border bg-card overflow-hidden">
                <AccordionTrigger className="px-5 py-3 text-sm font-semibold font-sans hover:no-underline">Strengths to protect</AccordionTrigger>
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
                    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
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
                              <p className="text-sm text-foreground">{action.estimatedImpact}</p>
                            </div>
                          )}
                          {action.whatDoneLooksLike && (
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                              <div><p className="text-xs font-medium text-muted-foreground">What done looks like</p><p className="text-sm text-foreground">{action.whatDoneLooksLike}</p></div>
                            </div>
                          )}
                          {action.compoundEffect && <p className="text-xs italic text-muted-foreground">{action.compoundEffect}</p>}
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
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2 font-sans"><Shield className="h-4 w-4 text-muted-foreground" /> Honest assessment</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.honestAssessment}</p>
            </div>
          )}

          <div className="text-center pt-3">
            <Button variant="outline" onClick={resetForm} className="border-muted-foreground/30"><RotateCcw className="mr-2 h-4 w-4" /> Generate another plan</Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
