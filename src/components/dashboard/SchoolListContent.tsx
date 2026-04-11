/**
 * School List content — extracted for dashboard tab embedding.
 * Renders without Navbar/Footer.
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTier } from '@/contexts/TierContext';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, ChevronUp, Sparkles, ArrowRight, TrendingUp,
  Target, Shield, School, BookOpen, BarChart3, FileText, Send,
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admitly-backend.onrender.com';

const SUPPORTED_UNIVERSITIES = [
  'University of Washington', 'Washington State University', 'Stanford University',
  'Massachusetts Institute of Technology', 'Harvard University',
  'University of California, Berkeley', 'University of California, Los Angeles',
  'University of Southern California', 'University of Michigan — Ann Arbor',
  'The University of Texas at Austin',
];

interface SchoolEntry { university: string; alignmentScore: number; band: string; coreInsight: string; strongestDimension?: string; reason?: string; }
interface RecommendedSchool extends SchoolEntry { reason: string; }
interface DimensionSummary { label: string; avgScore: number; }
interface SchoolListResult { summary: string; strongestDimension: DimensionSummary; weakestDimension: DimensionSummary; recommendedList: RecommendedSchool[]; reaches: SchoolEntry[]; targets: SchoolEntry[]; safeties: SchoolEntry[]; totalSchoolsEvaluated: number; }

function scoreColor(score: number): string {
  if (score >= 7) return 'text-teal-600';
  if (score >= 5) return 'text-amber-600';
  return 'text-red-600';
}

interface SchoolListContentProps {
  onNavigateTab: (tab: string, params?: Record<string, string>) => void;
}

export default function SchoolListContent({ onNavigateTab }: SchoolListContentProps) {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const { tier, setShowPricing } = useTier();

  const [applicationSnapshot, setApplicationSnapshot] = useState<any>(null);
  const [evaluationDate, setEvaluationDate] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSchoolIdx, setCurrentSchoolIdx] = useState(0);
  const [result, setResult] = useState<SchoolListResult | null>(null);
  const [reachesOpen, setReachesOpen] = useState(true);
  const [targetsOpen, setTargetsOpen] = useState(true);
  const [safetiesOpen, setSafetiesOpen] = useState(true);
  const [suggestion, setSuggestion] = useState('');

  useEffect(() => {
    async function fetchLatest() {
      if (!user) { setLoadingProfile(false); return; }
      const { data } = await supabase.from('evaluations').select('application_snapshot, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1);
      if (data && data.length > 0) { setApplicationSnapshot(data[0].application_snapshot); setEvaluationDate(data[0].created_at); }
      setLoadingProfile(false);
    }
    fetchLatest();
  }, [user]);

  useEffect(() => {
    if (!loading) return;
    setCurrentSchoolIdx(0); setProgress(0);
    const interval = setInterval(() => {
      setCurrentSchoolIdx(prev => {
        const next = prev + 1;
        if (next >= SUPPORTED_UNIVERSITIES.length) { clearInterval(interval); return prev; }
        setProgress(((next + 1) / SUPPORTED_UNIVERSITIES.length) * 100);
        return next;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [loading]);

  const handleBuild = async () => {
    if (!session || !applicationSnapshot) return;
    setLoading(true); setResult(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/buildSchoolList`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ application: applicationSnapshot }),
      });
      if (response.status === 401) { toast.error('Session expired.'); return; }
      if (response.status === 429) { toast.error('Too many requests.'); return; }
      if (!response.ok) { toast.error('Something went wrong.'); return; }
      setResult(await response.json());
    } catch { toast.error('Network error.'); } finally { setLoading(false); setProgress(100); }
  };

  const bandColor = (band: string) => {
    const b = band?.toLowerCase();
    if (b === 'safety') return 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30';
    if (b === 'target') return 'bg-blue-500/15 text-blue-600 border-blue-500/30';
    return 'bg-amber-500/15 text-amber-600 border-amber-500/30';
  };

  const bandBorderTop = (band: string) => {
    const b = band?.toLowerCase();
    if (b === 'safety') return 'border-t-[3px] border-t-[#16a34a]';
    if (b === 'target') return 'border-t-[3px] border-t-[#0d9488]';
    return 'border-t-[3px] border-t-[#e85d3a]';
  };

  const bandIcon = (band: string) => {
    const b = band?.toLowerCase();
    if (b === 'safety') return <Shield className="h-3.5 w-3.5" />;
    if (b === 'target') return <Target className="h-3.5 w-3.5" />;
    return <TrendingUp className="h-3.5 w-3.5" />;
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {tier === 'free' && (
        <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
          <span className="text-amber-800 font-medium">School List Builder requires Season Pass</span>
          <Button size="sm" className="bg-[#e85d3a] hover:bg-[#d14e2e] text-white border-0 text-xs px-3" onClick={() => setShowPricing(true)}>
            Upgrade
          </Button>
        </div>
      )}
      <p className="text-base text-gray-600 text-center">See how your profile matches across all schools — find your reaches, targets, and safeties.</p>

      {!result && !loading && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl rounded-xl border bg-card p-8 text-center space-y-3">
          {loadingProfile ? (
            <p className="text-muted-foreground text-sm">Loading your profile…</p>
          ) : !applicationSnapshot ? (
            <>
              <p className="text-muted-foreground text-sm">You need to complete an evaluation first.</p>
              <Button className="cta-gradient border-0 text-white" onClick={() => onNavigateTab('evaluate')}>
                Start an Evaluation <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </>
          ) : tier === 'free' ? (
            <>
              <p className="text-sm font-medium text-gray-600">Using your profile from <span className="text-foreground font-medium">{evaluationDate ? new Date(evaluationDate).toLocaleDateString() : 'recent evaluation'}</span></p>
              <Button disabled className="bg-gray-300 text-gray-500 cursor-not-allowed border-0 font-semibold"><Lock className="mr-1.5 h-4 w-4" /> Requires Season Pass</Button>
              <Button size="sm" className="bg-[#e85d3a] hover:bg-[#d14e2e] text-white border-0 px-6" onClick={() => setShowPricing(true)}>Upgrade</Button>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-gray-600">Using your profile from <span className="text-foreground font-medium">{evaluationDate ? new Date(evaluationDate).toLocaleDateString() : 'recent evaluation'}</span></p>
              <Button onClick={handleBuild} className="bg-[#e85d3a] hover:bg-[#d4522f] border-0 text-white font-semibold"><Sparkles className="mr-1.5 h-4 w-4" /> Build My School List</Button>
              <p className="text-sm text-gray-500">This evaluates against all {SUPPORTED_UNIVERSITIES.length} schools and may take 15–30 seconds.</p>
            </>
          )}
        </motion.div>
      )}

      {loading && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border bg-card p-8 space-y-5 text-center">
          <Sparkles className="h-8 w-8 mx-auto text-[hsl(var(--coral))] animate-pulse" />
          <div className="space-y-1.5">
            <p className="text-base text-gray-600 font-medium">Evaluating against {SUPPORTED_UNIVERSITIES[currentSchoolIdx]}…</p>
            <p className="text-xs text-muted-foreground">School {currentSchoolIdx + 1} of {SUPPORTED_UNIVERSITIES.length}</p>
          </div>
          <Progress value={progress} className="h-2 max-w-md mx-auto" />
        </motion.div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            {evaluationDate && (
              <p className="text-xs text-muted-foreground text-center">Based on your evaluation from <span className="font-medium text-foreground">{new Date(evaluationDate).toLocaleDateString()}</span></p>
            )}

            <div className="rounded-xl border-l-4 border-l-[hsl(var(--coral))] border bg-card p-5 space-y-3">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 font-sans"><BarChart3 className="h-4 w-4 text-[hsl(var(--coral))]" /> Strategic Summary</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {result.strongestDimension && (
                  <div className="rounded-lg border bg-emerald-500/5 p-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-0.5">Your strongest signal</p>
                    <p className="text-base font-semibold text-gray-900">{result.strongestDimension.label} <span className="text-teal-600">(avg {result.strongestDimension.avgScore}/10)</span></p>
                  </div>
                )}
                {result.weakestDimension && (
                  <div className="rounded-lg border bg-amber-500/5 p-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-0.5">Biggest opportunity</p>
                    <p className="text-base font-semibold text-gray-900">{result.weakestDimension.label} <span className="text-amber-600">(avg {result.weakestDimension.avgScore}/10)</span></p>
                  </div>
                )}
              </div>
            </div>

            {result.recommendedList && result.recommendedList.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 font-sans"><Sparkles className="h-4 w-4 text-[hsl(var(--coral))]" /> Recommended Schools</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.recommendedList.slice(0, 4).map((school, i) => (
                    <motion.div key={school.university} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                      className={`group relative rounded-xl border bg-card p-4 space-y-2.5 shadow-md hover:shadow-lg hover:-translate-y-px transition-all ${bandBorderTop(school.band)}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-semibold text-foreground leading-tight font-sans">{school.university}</h3>
                        <Badge className={`shrink-0 ${bandColor(school.band)}`}>{bandIcon(school.band)}<span className="ml-1 capitalize">{school.band}</span></Badge>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-2xl font-bold ${scoreColor(school.alignmentScore)}`}>{school.alignmentScore}</span>
                        <span className="text-sm text-gray-400 font-normal">/10</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{school.reason}</p>
                      <div className="flex flex-wrap gap-1.5 border-t border-gray-100 pt-3 mt-3">
                        <Button variant="outline" size="sm" className="text-sm font-medium text-gray-600 hover:text-[#e85d3a] transition-colors h-7" onClick={() => onNavigateTab('evaluate', { school: school.university })}>
                          <BookOpen className="mr-1 h-3 w-3" /> Evaluate
                        </Button>
                        <Button variant="outline" size="sm" className="text-sm font-medium text-gray-600 hover:text-[#e85d3a] transition-colors h-7" onClick={() => onNavigateTab('essay-analyzer', { school: school.university })}>
                          <FileText className="mr-1 h-3 w-3" /> Essay
                        </Button>
                        <Button variant="outline" size="sm" className="text-sm font-medium text-gray-600 hover:text-[#e85d3a] transition-colors h-7" onClick={() => onNavigateTab('action-plan', { school: school.university })}>
                          <Target className="mr-1 h-3 w-3" /> Plan
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-foreground font-sans">All Schools</h2>
              <SchoolBandSection label="Reaches" schools={result.reaches} open={reachesOpen} onToggle={() => setReachesOpen(o => !o)} bandColor={bandColor} />
              <SchoolBandSection label="Targets" schools={result.targets} open={targetsOpen} onToggle={() => setTargetsOpen(o => !o)} bandColor={bandColor} />
              <SchoolBandSection label="Safeties" schools={result.safeties} open={safetiesOpen} onToggle={() => setSafetiesOpen(o => !o)} bandColor={bandColor} />
            </div>

            <div className="rounded-xl border bg-card p-5 space-y-2.5">
              <p className="text-sm text-muted-foreground">We currently evaluate against <span className="font-medium text-foreground">{result.totalSchoolsEvaluated || SUPPORTED_UNIVERSITIES.length}</span> schools. Which should we add next?</p>
              <div className="flex gap-2 max-w-md">
                <Input placeholder="e.g. Columbia University" value={suggestion} onChange={e => setSuggestion(e.target.value)} className="text-sm border-gray-300 rounded-lg focus:border-[#e85d3a] focus:ring-1 focus:ring-[#e85d3a]/20" />
                <a href={`mailto:feedback@admitly.app?subject=School%20request&body=${encodeURIComponent(suggestion)}`} onClick={() => { if (suggestion) toast.success('Thanks!'); }}>
                  <Button variant="outline" size="sm"><Send className="h-3.5 w-3.5" /></Button>
                </a>
              </div>
            </div>

            <div className="text-center">
              <Button variant="outline" onClick={() => setResult(null)} className="border-2 border-gray-300 text-gray-700 font-medium rounded-xl px-6 py-3 hover:border-[#e85d3a] hover:text-[#e85d3a] transition-colors">Build Another List</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SchoolBandSection({ label, schools, open, onToggle, bandColor }: { label: string; schools: { university: string; alignmentScore: number; band: string; coreInsight: string; }[]; open: boolean; onToggle: () => void; bandColor: (b: string) => string; }) {
  if (!schools || schools.length === 0) return null;

  const scoreClr = (s: number) => {
    if (s >= 7) return 'text-teal-600';
    if (s >= 5) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <Collapsible open={open} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <button className="flex w-full items-center justify-between rounded-lg border bg-card px-4 py-2.5 text-left hover:bg-accent/30 transition-colors">
          <span className="text-sm font-medium text-foreground">{label} ({schools.length})</span>
          {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-1.5 divide-y divide-gray-100">
          {schools.map((s) => (
            <div key={s.university} className="flex items-center justify-between rounded-lg px-4 py-4 hover:bg-muted/30 transition-colors">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{s.university}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{s.coreInsight}</p>
              </div>
              <div className="flex items-center gap-2 ml-3 shrink-0">
                <span className={`text-sm font-semibold ${scoreClr(s.alignmentScore)}`}>{s.alignmentScore}<span className="text-sm text-gray-400 font-normal">/10</span></span>
                <Badge className={`text-xs capitalize ${bandColor(s.band)}`}>{s.band}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
