import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, CheckCircle2, AlertTriangle, XCircle,
  ArrowRight, RotateCcw, Sparkles, Target, Pen,
  BookOpen, Link2, Quote,
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

const ESSAY_TYPES = [
  { value: 'personal_statement', label: 'Personal Statement' },
  { value: 'supplemental', label: 'Supplemental Essay' },
  { value: 'why_this_school', label: 'Why This School' },
];

interface Recommendation {
  priority: string;
  current: string;
  revised: string;
  why: string;
}

interface EssayAnalysis {
  overallVerdict?: string;
  readerMemoryTest?: string;
  strategicFit?: {
    score?: number;
    assessment?: string;
    prioritiesAddressed?: string[];
    prioritiesMissing?: string[];
    antiPatternsTriggered?: string[];
  };
  contentAnalysis?: {
    score?: number;
    strongestMoment?: string;
    weakestMoment?: string;
    specificity?: string;
    redundancyCheck?: string;
    depthVsBreadth?: string;
  };
  structureAndVoice?: {
    score?: number;
    openingVerdict?: string;
    closingVerdict?: string;
    voiceAuthenticity?: string;
    pacing?: string;
  };
  applicationCoherence?: {
    essayConnectsToMajor?: boolean;
    essayConnectsToActivities?: boolean;
    addsNewDimension?: boolean;
    coherenceAssessment?: string;
  };
  topThreeRecommendations?: Recommendation[];
  error?: string;
  school?: string;
}

const LOADING_STEPS = [
  'Reading your essay...',
  'Evaluating against priorities...',
  'Generating recommendations...',
];

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function EssayAnalyzer() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [school, setSchool] = useState('');
  const [essayType, setEssayType] = useState('personal_statement');
  const [essayText, setEssayText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<EssayAnalysis | null>(null);
  const [applicationSnapshot, setApplicationSnapshot] = useState<Record<string, unknown> | null>(null);

  const words = useMemo(() => wordCount(essayText), [essayText]);
  const canSubmit = school && words >= 50 && !loading;

  // Load most recent evaluation's application snapshot
  useEffect(() => {
    async function loadSnapshot() {
      if (!user) return;
      const { data } = await supabase
        .from('evaluations')
        .select('application_snapshot')
        .order('created_at', { ascending: false })
        .limit(1);
      if (data?.[0]?.application_snapshot) {
        setApplicationSnapshot(data[0].application_snapshot as Record<string, unknown>);
      }
    }
    loadSnapshot();
  }, [user]);

  const loadingLabel = useMemo(() => {
    const step = LOADING_STEPS[loadingStep] || LOADING_STEPS[LOADING_STEPS.length - 1];
    return step.replace('priorities', `${school}'s priorities`);
  }, [loadingStep, school]);

  async function handleAnalyze() {
    if (!canSubmit) return;
    setLoading(true);
    setLoadingStep(0);
    setResult(null);

    // Progress animation
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
          essayText,
          universityName: school,
          essayType,
          ...(applicationSnapshot && { application: applicationSnapshot }),
        }),
      });

      if (response.status === 401) {
        toast.error('Please sign in to analyze essays');
        navigate('/login');
        return;
      }
      if (response.status === 429) {
        toast.error("You've reached your daily limit. Try again tomorrow.");
        return;
      }
      if (!response.ok) {
        throw new Error(`Analysis failed (${response.status})`);
      }

      const data: EssayAnalysis = await response.json();
      if (data.error) {
        toast.error(data.error);
        setResult(data); // store to show error card
      } else {
        setResult(data);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(message);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Pen className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground font-serif">Essay analyzer</h1>
          </div>
          <p className="text-muted-foreground text-sm font-sans">
            Get school-specific feedback on your essays — the same quality as a private admissions counselor.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* Loading state */}
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="rounded-xl border border-border bg-card p-8"
            >
              <div className="flex flex-col items-center text-center gap-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="h-10 w-10 text-primary" />
                </motion.div>
                <div className="w-full max-w-sm space-y-4">
                  {LOADING_STEPS.map((step, i) => {
                    const label = step.replace('priorities', `${school}'s priorities`);
                    const isActive = i === loadingStep;
                    const isDone = i < loadingStep;
                    return (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0.4 }}
                        animate={{ opacity: isDone || isActive ? 1 : 0.4 }}
                        className="flex items-center gap-3"
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                        ) : isActive ? (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0"
                          >
                            <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                          </motion.div>
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-border shrink-0" />
                        )}
                        <span className={`text-sm font-sans ${isActive ? 'text-foreground font-medium' : isDone ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                          {label}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
                <Progress value={((loadingStep + 1) / LOADING_STEPS.length) * 100} className="h-1.5 w-full max-w-sm" />
              </div>
            </motion.div>
          )}

          {/* Results */}
          {!loading && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Overall verdict */}
              <div className="rounded-xl border-l-4 border-l-primary border border-border bg-card p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 font-sans">Overall verdict</p>
                <p className="text-foreground font-sans leading-relaxed">{result.overallVerdict}</p>
              </div>

              {/* Reader memory test */}
              <div className="rounded-xl border border-border bg-primary/5 p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-primary mb-2 font-sans flex items-center gap-1.5">
                  <Quote className="h-3.5 w-3.5" /> What will the admissions reader remember?
                </p>
                <p className="text-foreground font-sans italic leading-relaxed">{result.readerMemoryTest}</p>
              </div>

              {/* Score cards */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Strategic fit', score: result.scores.strategicFit, icon: Target },
                  { label: 'Content', score: result.scores.content, icon: BookOpen },
                  { label: 'Structure & voice', score: result.scores.structureVoice, icon: Pen },
                ].map(({ label, score, icon: Icon }) => (
                  <div key={label} className="rounded-xl border border-border bg-card p-5 text-center">
                    <Icon className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
                    <p className="text-3xl font-semibold text-foreground">{score}<span className="text-sm text-muted-foreground font-normal">/10</span></p>
                    <p className="text-xs text-muted-foreground mt-1 font-sans">{label}</p>
                    <Progress value={score * 10} className="h-1 mt-3" />
                  </div>
                ))}
              </div>

              {/* Strategic fit */}
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <h3 className="text-sm font-semibold text-foreground font-sans">Strategic fit</h3>
                <p className="text-sm text-muted-foreground font-sans leading-relaxed">{result.strategicFit.assessment}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.strategicFit.prioritiesAddressed.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider font-sans">Priorities addressed</p>
                      {result.strategicFit.prioritiesAddressed.map((p) => (
                        <div key={p} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                          <span className="text-sm text-foreground font-sans">{p}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {result.strategicFit.prioritiesMissing.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider font-sans">Priorities missing</p>
                      {result.strategicFit.prioritiesMissing.map((p) => (
                        <div key={p} className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                          <span className="text-sm text-foreground font-sans">{p}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {result.strategicFit.antiPatterns.length > 0 && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-2">
                    <p className="text-xs font-semibold text-destructive uppercase tracking-wider font-sans">Warning</p>
                    {result.strategicFit.antiPatterns.map((p) => (
                      <p key={p} className="text-sm text-foreground font-sans">{p}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Content analysis */}
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <h3 className="text-sm font-semibold text-foreground font-sans">Content analysis</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-lg border border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20 p-4">
                    <p className="text-xs font-medium text-green-700 dark:text-green-400 uppercase tracking-wider mb-1 font-sans">Strongest moment</p>
                    <p className="text-sm text-foreground font-sans">{result.contentAnalysis.strongestMoment}</p>
                  </div>
                  <div className="rounded-lg border border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20 p-4">
                    <p className="text-xs font-medium text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1 font-sans">Weakest moment</p>
                    <p className="text-sm text-foreground font-sans">{result.contentAnalysis.weakestMoment}</p>
                  </div>
                </div>
                {[
                  { label: 'Specificity', text: result.contentAnalysis.specificity },
                  { label: 'Redundancy check', text: result.contentAnalysis.redundancyCheck },
                  { label: 'Depth vs. breadth', text: result.contentAnalysis.depthVsBreadth },
                ].map(({ label, text }) => (
                  <div key={label}>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 font-sans">{label}</p>
                    <p className="text-sm text-foreground font-sans leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>

              {/* Structure & voice */}
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <h3 className="text-sm font-semibold text-foreground font-sans">Structure & voice</h3>
                {[
                  { label: 'Opening verdict', text: result.structureVoice.openingVerdict },
                  { label: 'Closing verdict', text: result.structureVoice.closingVerdict },
                  { label: 'Voice authenticity', text: result.structureVoice.voiceAuthenticity },
                  { label: 'Pacing', text: result.structureVoice.pacing },
                ].map(({ label, text }) => (
                  <div key={label}>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 font-sans">{label}</p>
                    <p className="text-sm text-foreground font-sans leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>

              {/* Application coherence */}
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <h3 className="text-sm font-semibold text-foreground font-sans">Application coherence</h3>
                <div className="flex flex-wrap gap-4">
                  {[
                    { label: 'Connects to major', ok: result.applicationCoherence.connectsToMajor },
                    { label: 'Connects to activities', ok: result.applicationCoherence.connectsToActivities },
                    { label: 'Adds new dimension', ok: result.applicationCoherence.addsNewDimension },
                  ].map(({ label, ok }) => (
                    <div key={label} className="flex items-center gap-2">
                      {ok ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive" />
                      )}
                      <span className="text-sm font-sans text-foreground">{label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground font-sans leading-relaxed">{result.applicationCoherence.coherenceAssessment}</p>
              </div>

              {/* Top 3 recommendations */}
              {result.recommendations.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground font-sans">Top recommendations</h3>
                  {result.recommendations.slice(0, 3).map((rec, i) => (
                    <div key={i} className="rounded-xl border border-border bg-card p-6 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{i + 1}</span>
                        <span className="text-xs font-medium text-primary uppercase tracking-wider font-sans">{rec.priority}</span>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1 font-sans">Current:</p>
                          <p className="text-sm text-muted-foreground line-through font-sans italic">"{rec.current}"</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-primary mb-1 font-sans">Try instead:</p>
                          <p className="text-sm text-foreground font-sans font-medium">"{rec.revised}"</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground font-sans leading-relaxed"><span className="font-medium">Why:</span> {rec.why}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reset */}
              <div className="pt-4">
                <Button onClick={handleReset} variant="outline" className="w-full gap-2">
                  <RotateCcw className="h-4 w-4" /> Analyze another essay
                </Button>
              </div>
            </motion.div>
          )}

          {/* Input form */}
          {!loading && !result && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="rounded-xl border border-border bg-card p-6 space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-sans text-sm">School</Label>
                  <Select value={school} onValueChange={setSchool}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a university" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_UNIVERSITIES.map((u) => (
                        <SelectItem key={u} value={u}>{u}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-sans text-sm">Essay type</Label>
                  <Select value={essayType} onValueChange={setEssayType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ESSAY_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-sans text-sm">Your essay</Label>
                <Textarea
                  placeholder="Paste your essay here..."
                  value={essayText}
                  onChange={(e) => setEssayText(e.target.value)}
                  className="min-h-[200px] font-sans text-sm resize-y"
                />
                <div className="flex justify-between">
                  <p className="text-xs text-muted-foreground font-sans">
                    {words} word{words !== 1 ? 's' : ''}
                    {words > 0 && words < 50 && ' — minimum 50 words'}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={!canSubmit}
                className="w-full cta-gradient border-0 text-primary-foreground hover:opacity-90 gap-2"
              >
                <Sparkles className="h-4 w-4" /> Analyze my essay
              </Button>

              {applicationSnapshot && (
                <p className="text-xs text-muted-foreground font-sans text-center flex items-center justify-center gap-1.5">
                  <Link2 className="h-3 w-3" /> Your application profile will be cross-referenced for personalized feedback
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
