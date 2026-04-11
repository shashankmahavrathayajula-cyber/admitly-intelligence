/**
 * Essay Analyzer content — extracted from EssayAnalyzer page for embedding in dashboard tabs.
 * Renders form + results without Navbar/Footer wrapper.
 */
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, CheckCircle2, AlertTriangle, XCircle,
  ArrowRight, RotateCcw, Sparkles, Target, Pen,
  BookOpen, Link2, Quote, ShieldAlert,
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admitly-backend.onrender.com';

const SUPPORTED_UNIVERSITIES = [
  'University of Washington', 'Washington State University', 'Stanford University',
  'Massachusetts Institute of Technology', 'Harvard University',
  'University of California, Berkeley', 'University of California, Los Angeles',
  'University of Southern California', 'University of Michigan — Ann Arbor',
  'The University of Texas at Austin',
];

const ESSAY_TYPES = [
  { value: 'personal_statement', label: 'Personal Statement' },
  { value: 'supplemental', label: 'Supplemental Essay' },
  { value: 'why_this_school', label: 'Why This School' },
];

interface Recommendation { priority: string; current: string; revised: string; why: string; }

interface EssayAnalysis {
  overallVerdict?: string;
  readerMemoryTest?: string;
  strategicFit?: { score?: number; assessment?: string; prioritiesAddressed?: string[]; prioritiesMissing?: string[]; antiPatternsTriggered?: string[]; };
  contentAnalysis?: { score?: number; strongestMoment?: string; weakestMoment?: string; specificity?: string; redundancyCheck?: string; depthVsBreadth?: string; };
  structureAndVoice?: { score?: number; openingVerdict?: string; closingVerdict?: string; voiceAuthenticity?: string; pacing?: string; };
  applicationCoherence?: { essayConnectsToMajor?: boolean; essayConnectsToActivities?: boolean; addsNewDimension?: boolean; coherenceAssessment?: string; };
  topThreeRecommendations?: Recommendation[];
  error?: string;
  school?: string;
}

const LOADING_STEPS = ['Reading your essay...', 'Evaluating against priorities...', 'Generating recommendations...'];

function wordCount(text: string): number { return text.trim().split(/\s+/).filter(Boolean).length; }

function scoreColor(score: number): string {
  if (score >= 9) return 'text-teal-600';
  if (score >= 7) return 'text-teal-500';
  return 'text-amber-600';
}

function scoreBarColor(score: number): string {
  if (score >= 9) return 'bg-teal-600';
  if (score >= 7) return 'bg-teal-500';
  return 'bg-amber-500';
}

function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/(?:^|\s)\w/g, (c) => c.toUpperCase());
}

interface EssayAnalyzerContentProps {
  initialSchool?: string;
}

export default function EssayAnalyzerContent({ initialSchool }: EssayAnalyzerContentProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [school, setSchool] = useState(() => {
    return initialSchool && SUPPORTED_UNIVERSITIES.includes(initialSchool) ? initialSchool : '';
  });
  const [essayType, setEssayType] = useState('personal_statement');
  const [essayText, setEssayText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<EssayAnalysis | null>(null);
  const [applicationSnapshot, setApplicationSnapshot] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (initialSchool && SUPPORTED_UNIVERSITIES.includes(initialSchool)) {
      setSchool(initialSchool);
    }
  }, [initialSchool]);

  const words = useMemo(() => wordCount(essayText), [essayText]);
  const canSubmit = school && words >= 50 && !loading;

  useEffect(() => {
    async function loadSnapshot() {
      if (!user) return;
      const { data } = await supabase
        .from('evaluations')
        .select('application_snapshot')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);
      if (data?.[0]?.application_snapshot) {
        setApplicationSnapshot(data[0].application_snapshot as Record<string, unknown>);
      }
    }
    loadSnapshot();
  }, [user]);

  async function handleAnalyze() {
    if (!canSubmit) return;
    setLoading(true);
    setLoadingStep(0);
    setResult(null);
    const interval = setInterval(() => {
      setLoadingStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1));
    }, 2500);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${API_BASE_URL}/api/analyzeEssay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        },
        body: JSON.stringify({
          essayText, universityName: school, essayType,
          ...(applicationSnapshot && { application: applicationSnapshot }),
        }),
      });

      if (response.status === 401) { toast.error('Please sign in to analyze essays'); navigate('/login'); return; }
      if (response.status === 429) { toast.error("You've reached your daily limit. Try again tomorrow."); return; }
      if (!response.ok) throw new Error(`Analysis failed (${response.status})`);

      const data: EssayAnalysis = await response.json();
      if (data.error) { toast.error(data.error); }
      setResult(data);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setEssayText('');
    setSchool('');
    setEssayType('personal_statement');
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header removed — tab label is sufficient */}
      <p className="text-base text-gray-600 font-sans mb-6">
        Get school-specific feedback on your essays — the same quality as a private admissions counselor.
      </p>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div key="loading" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="rounded-xl border border-border bg-card p-8">
            <div className="flex flex-col items-center text-center gap-6">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                <Sparkles className="h-10 w-10 text-[hsl(var(--coral))]" />
              </motion.div>
              <div className="w-full max-w-sm space-y-4">
                {LOADING_STEPS.map((step, i) => {
                  const label = step.replace('priorities', `${school}'s priorities`);
                  const isActive = i === loadingStep;
                  const isDone = i < loadingStep;
                  return (
                    <motion.div key={step} initial={{ opacity: 0.4 }} animate={{ opacity: isDone || isActive ? 1 : 0.4 }} className="flex items-center gap-3">
                      {isDone ? <CheckCircle2 className="h-5 w-5 text-[hsl(var(--score-strong))] shrink-0" /> : isActive ? (
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="h-5 w-5 rounded-full bg-[hsl(var(--coral))]/20 flex items-center justify-center shrink-0">
                          <div className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--coral))]" />
                        </motion.div>
                      ) : <div className="h-5 w-5 rounded-full border-2 border-border shrink-0" />}
                      <span className={`text-sm font-sans ${isActive ? 'text-foreground font-medium' : isDone ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>{label}</span>
                    </motion.div>
                  );
                })}
              </div>
              <Progress value={((loadingStep + 1) / LOADING_STEPS.length) * 100} className="h-1.5 w-full max-w-sm" />
            </div>
          </motion.div>
        )}

        {!loading && result && !result.error && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            {/* Always visible: Overall verdict */}
            <div className="rounded-xl border-l-4 border-l-[hsl(var(--coral))] border border-border bg-card p-5">
              <p className="text-xs font-medium tracking-wider text-muted-foreground mb-1.5 font-sans">Overall verdict</p>
              <p className="text-sm text-foreground font-sans leading-relaxed">{result?.overallVerdict}</p>
            </div>

            {/* Always visible: Reader memory test */}
            <div className="rounded-xl border border-border section-alt p-5">
              <p className="text-xs font-medium tracking-wider text-[hsl(var(--coral))] mb-1.5 font-sans flex items-center gap-1.5">
                <Quote className="h-3.5 w-3.5" /> What will the admissions reader remember?
              </p>
              <p className="text-sm text-foreground font-sans italic leading-relaxed">{result?.readerMemoryTest}</p>
            </div>

            {/* Always visible: 3 score cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Strategic fit', score: result?.strategicFit?.score ?? 0, icon: Target },
                { label: 'Content', score: result?.contentAnalysis?.score ?? 0, icon: BookOpen },
                { label: 'Structure & voice', score: result?.structureAndVoice?.score ?? 0, icon: Pen },
              ].map(({ label, score, icon: Icon }) => (
                <div key={label} className="rounded-xl border border-border bg-card p-4 text-center">
                  <Icon className="h-4 w-4 text-muted-foreground mx-auto mb-1.5" />
                  <p className={`text-3xl font-bold ${scoreColor(score)}`}>{score}<span className="text-sm text-gray-400 font-normal">/10</span></p>
                  <p className="text-xs text-muted-foreground mt-1 font-sans">{label}</p>
                  <div className="h-1 mt-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className={`h-full rounded-full ${scoreBarColor(score)}`} style={{ width: `${score * 10}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Accordion sections */}
            <Accordion type="multiple" className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-gray-100">
              <AccordionItem value="strategic-fit" className="border-0">
                <AccordionTrigger className="px-5 py-4 px-2 text-sm font-semibold font-sans hover:no-underline">Strategic fit details</AccordionTrigger>
                <AccordionContent className="px-5 pb-4 space-y-3">
                  <p className="text-sm text-muted-foreground font-sans leading-relaxed">{result?.strategicFit?.assessment}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(result?.strategicFit?.prioritiesAddressed?.length ?? 0) > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-xs font-medium text-muted-foreground tracking-wider font-sans">Priorities addressed</p>
                        {result?.strategicFit?.prioritiesAddressed?.map((p) => (
                          <div key={p} className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[hsl(var(--score-strong))] mt-0.5 shrink-0" /><span className="text-sm text-foreground font-sans">{p}</span></div>
                        ))}
                      </div>
                    )}
                    {(result?.strategicFit?.prioritiesMissing?.length ?? 0) > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-xs font-medium text-muted-foreground tracking-wider font-sans">Priorities missing</p>
                        {result?.strategicFit?.prioritiesMissing?.map((p) => (
                          <div key={p} className="flex items-start gap-2"><AlertTriangle className="h-3.5 w-3.5 text-[hsl(var(--score-moderate))] mt-0.5 shrink-0" /><span className="text-sm text-foreground font-sans">{p}</span></div>
                        ))}
                      </div>
                    )}
                  </div>
                  {(result?.strategicFit?.antiPatternsTriggered?.length ?? 0) > 0 && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 space-y-1.5">
                      <p className="text-xs font-semibold text-destructive tracking-wider font-sans">Warning</p>
                      {result?.strategicFit?.antiPatternsTriggered?.map((p) => <p key={p} className="text-sm text-foreground font-sans">{p}</p>)}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="content-analysis" className="border-0">
                <AccordionTrigger className="px-5 py-4 px-2 text-sm font-semibold font-sans hover:no-underline">Content analysis</AccordionTrigger>
                <AccordionContent className="px-5 pb-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20 p-3">
                      <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 tracking-wider mb-1 font-sans">Strongest moment</p>
                      <p className="text-sm text-foreground font-sans">{result?.contentAnalysis?.strongestMoment}</p>
                    </div>
                    <div className="rounded-lg border border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20 p-3">
                      <p className="text-xs font-medium text-amber-700 dark:text-amber-400 tracking-wider mb-1 font-sans">Weakest moment</p>
                      <p className="text-sm text-foreground font-sans">{result?.contentAnalysis?.weakestMoment}</p>
                    </div>
                  </div>
                  {[
                    { label: 'Specificity', text: result?.contentAnalysis?.specificity },
                    { label: 'Redundancy check', text: result?.contentAnalysis?.redundancyCheck },
                    { label: 'Depth vs. breadth', text: result?.contentAnalysis?.depthVsBreadth },
                  ].map(({ label, text }) => (
                    <div key={label}><p className="text-xs font-medium text-muted-foreground tracking-wider mb-1 font-sans">{label}</p><p className="text-sm text-foreground font-sans leading-relaxed">{text}</p></div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="structure-voice" className="border-0">
                <AccordionTrigger className="px-5 py-4 px-2 text-sm font-semibold font-sans hover:no-underline">Structure & voice</AccordionTrigger>
                <AccordionContent className="px-5 pb-4 space-y-3">
                  {[
                    { label: 'Opening verdict', text: result?.structureAndVoice?.openingVerdict },
                    { label: 'Closing verdict', text: result?.structureAndVoice?.closingVerdict },
                    { label: 'Voice authenticity', text: result?.structureAndVoice?.voiceAuthenticity },
                    { label: 'Pacing', text: result?.structureAndVoice?.pacing },
                  ].map(({ label, text }) => (
                    <div key={label}><p className="text-xs font-medium text-muted-foreground tracking-wider mb-1 font-sans">{label}</p><p className="text-sm text-foreground font-sans leading-relaxed">{text}</p></div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="coherence" className="border-0">
                <AccordionTrigger className="px-5 py-4 px-2 text-sm font-semibold font-sans hover:no-underline">Application coherence</AccordionTrigger>
                <AccordionContent className="px-5 pb-4 space-y-3">
                  <div className="flex flex-wrap gap-4">
                    {[
                      { label: 'Connects to major', ok: result?.applicationCoherence?.essayConnectsToMajor },
                      { label: 'Connects to activities', ok: result?.applicationCoherence?.essayConnectsToActivities },
                      { label: 'Adds new dimension', ok: result?.applicationCoherence?.addsNewDimension },
                    ].map(({ label, ok }) => (
                      <div key={label} className="flex items-center gap-2">
                        {ok ? <CheckCircle2 className="h-4 w-4 text-[hsl(var(--score-strong))]" /> : <XCircle className="h-4 w-4 text-destructive" />}
                        <span className="text-sm font-sans text-foreground">{label}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground font-sans leading-relaxed">{result?.applicationCoherence?.coherenceAssessment}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Always visible: Top recommendations */}
            {(result?.topThreeRecommendations?.length ?? 0) > 0 && (
              <div className="space-y-3">
                <div className="rounded-xl border border-amber-300/40 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-500/20 p-3.5 flex gap-3 items-start">
                  <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 font-sans">Use these as inspiration, not copy-paste</p>
                    <p className="text-xs text-amber-700/80 dark:text-amber-400/70 font-sans leading-relaxed">Rewrite the ideas in your own voice.</p>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-foreground font-sans">Top recommendations</h3>
                {result?.topThreeRecommendations?.slice(0, 3).map((rec, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[hsl(var(--coral))]/10 text-xs font-semibold text-[hsl(var(--coral))]">{i + 1}</span>
                      <span className="text-base font-semibold text-[#e85d3a] font-sans">{toTitleCase(rec?.priority ?? '')}</span>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3.5 space-y-2.5">
                      <div><p className="text-sm font-semibold text-gray-500 mb-1 font-sans">Current:</p><p className="text-sm text-gray-400 line-through font-sans italic">"{rec?.current}"</p></div>
                      <div><p className="text-sm font-semibold text-teal-600 mb-1 font-sans">Try instead:</p><p className="text-sm text-foreground font-sans font-medium">"{rec?.revised}"</p><p className="text-xs text-muted-foreground italic mt-1 font-sans">↳ Rewrite this in your own words</p></div>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-3 py-2 mt-3">
                      <p className="text-xs text-muted-foreground font-sans leading-relaxed"><span className="font-medium">Why:</span> {rec?.why}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-3">
              <Button onClick={handleReset} variant="outline" className="w-full gap-2 border-2 border-gray-300 text-gray-700 font-medium rounded-xl px-6 py-3 hover:border-[#e85d3a] hover:text-[#e85d3a] transition-colors"><RotateCcw className="h-4 w-4" /> Analyze another essay</Button>
            </div>
          </motion.div>
        )}

        {!loading && result?.error && (
          <motion.div key="error" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="rounded-xl border-l-4 border-l-destructive border border-border bg-card p-5">
              <p className="text-xs font-medium tracking-wider text-destructive mb-1.5 font-sans">Analysis error</p>
              <p className="text-sm text-foreground font-sans leading-relaxed">{result.error}</p>
            </div>
            <Button onClick={handleReset} variant="outline" className="w-full gap-2"><RotateCcw className="h-4 w-4" /> Try again</Button>
          </motion.div>
        )}

        {!loading && !result && (
          <motion.div key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="rounded-xl border border-border bg-card p-5 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-gray-100 pb-4 mb-4">
              <div className="space-y-1.5">
                <Label className="font-sans text-sm">School</Label>
                <Select value={school} onValueChange={setSchool}>
                  <SelectTrigger className="focus-coral"><SelectValue placeholder="Select a university" /></SelectTrigger>
                  <SelectContent>{SUPPORTED_UNIVERSITIES.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="font-sans text-sm">Essay type</Label>
                <Select value={essayType} onValueChange={setEssayType}>
                  <SelectTrigger className="focus-coral"><SelectValue /></SelectTrigger>
                  <SelectContent>{ESSAY_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="font-sans text-sm">Your essay</Label>
              <Textarea placeholder="Paste your essay here..." value={essayText} onChange={(e) => setEssayText(e.target.value)} className="min-h-[200px] font-sans text-sm resize-y focus-coral" />
              <div className="flex justify-between">
                <p className="text-sm text-gray-500 font-sans">{words} word{words !== 1 ? 's' : ''}{words > 0 && words < 50 && ' — minimum 50 words'}</p>
              </div>
            </div>
            <Button onClick={handleAnalyze} disabled={!canSubmit} className="w-full bg-[#e85d3a] hover:bg-[#d4522f] border-0 text-white font-semibold gap-2">
              <Sparkles className="h-4 w-4" /> Analyze my essay
            </Button>
            {applicationSnapshot && (
              <div className="bg-gray-50 rounded-lg px-3 py-2 text-center">
                <p className="text-sm text-gray-500 font-sans flex items-center justify-center gap-1.5">
                  <Link2 className="h-3 w-3" /> Your application profile will be cross-referenced for personalized feedback
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
