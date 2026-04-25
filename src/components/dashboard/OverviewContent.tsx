import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getCurrentDraft } from '@/services/storage';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowRight, Plus, School, CheckCircle2, Clock, MapPin,
  User, GraduationCap, BarChart3, FileText, Play,
  PenLine, Eye, Sparkles, Target, ChevronRight, ChevronDown,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useEffect, useState, useMemo, useCallback } from 'react';
import type { EvaluationResult, UniversityEvaluation } from '@/types/evaluation';
import type { ApplicationData } from '@/types/application';
import {
  loadSchoolList, isSchoolListStale, countBands,
  type SavedSchoolList,
} from '@/lib/schoolListStorage';
import { AlertTriangle } from 'lucide-react';

type SupabaseEvaluation = {
  id: string;
  created_at: string | null;
  universities: string[];
  evaluation_results: {
    university_name: string;
    alignment_score: number;
    academic_strength: number;
    activity_impact: number;
    honors_awards: number;
    narrative_strength: number;
    institutional_fit: number;
    core_insight: string | null;
    most_important_next_step: string | null;
    band: string | null;
    band_reasoning: string | null;
    strengths: unknown;
    weaknesses: unknown;
    suggestions: unknown;
  }[];
};

function mapToEvaluationResult(ev: SupabaseEvaluation): EvaluationResult {
  return {
    id: ev.id,
    timestamp: ev.created_at ?? new Date().toISOString(),
    universities: ev.evaluation_results.map((r): UniversityEvaluation => ({
      university: r.university_name,
      alignmentScore: Math.round(Number(r.alignment_score) * 10),
      academicStrength: Math.round(Number(r.academic_strength) * 10),
      activityImpact: Math.round(Number(r.activity_impact) * 10),
      honorsAwards: Math.round(Number(r.honors_awards) * 10),
      narrativeStrength: Math.round(Number(r.narrative_strength) * 10),
      institutionalFit: Math.round(Number(r.institutional_fit) * 10),
      strengths: Array.isArray(r.strengths) ? r.strengths as string[] : [],
      weaknesses: Array.isArray(r.weaknesses) ? r.weaknesses as string[] : [],
      suggestions: Array.isArray(r.suggestions) ? r.suggestions as string[] : [],
      coreInsight: r.core_insight ?? undefined,
      mostImportantNextStep: r.most_important_next_step ?? undefined,
      admissionsSummary: r.band ? { band: r.band, reasoning: r.band_reasoning ?? '' } : undefined,
    })),
  };
}


import { getScoreColor100, getScoreBg100 } from '@/lib/scoreUtils';

function bandBadge(band?: string) {
  if (!band) return null;
  const b = band.toLowerCase();
  if (b === 'safety') return <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 text-[10px]">Safety</Badge>;
  if (b === 'target') return <Badge className="bg-blue-500/15 text-blue-600 border-blue-500/30 text-[10px]">Target</Badge>;
  return <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/30 text-[10px]">Reach</Badge>;
}

interface EssayEntry {
  id: string;
  university_name: string;
  essay_type: string | null;
  school_name: string | null;
  created_at: string | null;
}

interface GapEntry {
  id: string;
  university_name: string;
  timeline_stage: string | null;
  created_at: string | null;
}

interface OverviewContentProps {
  onNavigateTab: (tab: string, params?: Record<string, string>) => void;
}

const ESSAY_TYPE_LABELS: Record<string, string> = {
  personal_statement: 'Personal Statement',
  supplemental: 'Supplemental Essay',
  why_this_school: 'Why This School',
};

const PAGE_SIZE = 10;
const INITIAL_SIZE = 5;

export default function OverviewContent({ onNavigateTab }: OverviewContentProps) {
  const { user } = useAuth();
  const [results, setResults] = useState<EvaluationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft] = useState<ApplicationData>(() => getCurrentDraft());
  const [latestSnapshot, setLatestSnapshot] = useState<Record<string, unknown> | null>(null);
  const [essays, setEssays] = useState<EssayEntry[]>([]);
  const [gaps, setGaps] = useState<GapEntry[]>([]);
  const [savedSchoolList, setSavedSchoolList] = useState<SavedSchoolList | null>(null);

  useEffect(() => {
    if (!user) return;
    setSavedSchoolList(loadSchoolList(user.id));
  }, [user]);

  const schoolListStale = useMemo(() => {
    if (!savedSchoolList) return false;
    const profile = latestSnapshot || draft;
    if (!profile) return false;
    return isSchoolListStale(savedSchoolList.profileSnapshot, profile);
  }, [savedSchoolList, latestSnapshot, draft]);

  // Total counts
  const [evalTotal, setEvalTotal] = useState(0);
  const [essayTotal, setEssayTotal] = useState(0);
  const [gapTotal, setGapTotal] = useState(0);

  // Pagination: how many to show
  const [evalShow, setEvalShow] = useState(INITIAL_SIZE);
  const [essayShow, setEssayShow] = useState(INITIAL_SIZE);
  const [gapShow, setGapShow] = useState(INITIAL_SIZE);

  // Loading more state
  const [loadingMoreEssays, setLoadingMoreEssays] = useState(false);
  const [loadingMoreGaps, setLoadingMoreGaps] = useState(false);

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || '';

  useEffect(() => {
    async function load() {
      if (!user) { setLoading(false); return; }

      const [evalRes, essayRes, gapRes, evalCount, essayCount, gapCount] = await Promise.all([
        supabase
          .from('evaluations')
          .select(`
            id, created_at, universities, application_snapshot,
            evaluation_results (
              university_name, alignment_score, academic_strength,
              activity_impact, honors_awards, narrative_strength,
              institutional_fit, core_insight, most_important_next_step,
              band, band_reasoning, strengths, weaknesses, suggestions
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20),
        supabase
          .from('essay_analyses')
          .select('id, university_name, essay_type, school_name, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20),
        supabase
          .from('gap_analyses')
          .select('id, university_name, timeline_stage, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20),
        supabase.from('evaluations').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('essay_analyses').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('gap_analyses').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      ]);

      if (evalRes.data && evalRes.data.length > 0) {
        setResults((evalRes.data as unknown as SupabaseEvaluation[]).map(mapToEvaluationResult));
        setLatestSnapshot(evalRes.data[0].application_snapshot as Record<string, unknown> | null);
      }

      setEssays((essayRes.data ?? []) as EssayEntry[]);
      setGaps((gapRes.data ?? []) as GapEntry[]);
      setEvalTotal(evalCount.count ?? 0);
      setEssayTotal(essayCount.count ?? 0);
      setGapTotal(gapCount.count ?? 0);
      setLoading(false);
    }
    load();
  }, [user]);

  // Load more essays
  const loadMoreEssays = useCallback(async () => {
    if (!user || loadingMoreEssays) return;
    setLoadingMoreEssays(true);
    const nextFrom = essays.length;
    const { data } = await supabase
      .from('essay_analyses')
      .select('id, university_name, essay_type, school_name, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(nextFrom, nextFrom + PAGE_SIZE - 1);
    if (data && data.length > 0) {
      setEssays(prev => [...prev, ...(data as EssayEntry[])]);
    }
    setEssayShow(prev => prev + PAGE_SIZE);
    setLoadingMoreEssays(false);
  }, [user, essays.length, loadingMoreEssays]);

  // Load more gaps
  const loadMoreGaps = useCallback(async () => {
    if (!user || loadingMoreGaps) return;
    setLoadingMoreGaps(true);
    const nextFrom = gaps.length;
    const { data } = await supabase
      .from('gap_analyses')
      .select('id, university_name, timeline_stage, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(nextFrom, nextFrom + PAGE_SIZE - 1);
    if (data && data.length > 0) {
      setGaps(prev => [...prev, ...(data as GapEntry[])]);
    }
    setGapShow(prev => prev + PAGE_SIZE);
    setLoadingMoreGaps(false);
  }, [user, gaps.length, loadingMoreGaps]);

  // Load more evals (already have up to 20 in memory, just expand display)
  const loadMoreEvals = useCallback(() => {
    setEvalShow(prev => prev + PAGE_SIZE);
  }, []);

  const hasEvaluations = results.length > 0;
  const profileComplete = hasEvaluations;

  const evaluatedSchools = useMemo(() => {
    const map = new Map<string, { score: number; band?: string; date: string }>();
    results.forEach(r => r.universities.forEach(u => {
      if (!map.has(u.university)) {
        map.set(u.university, { score: u.alignmentScore, band: u.admissionsSummary?.band, date: r.timestamp });
      }
    }));
    return map;
  }, [results]);

  const selectedSchools = useMemo(() => {
    if (evaluatedSchools.size > 0) {
      // Sort by most recently evaluated
      return Array.from(evaluatedSchools.entries())
        .sort((a, b) => new Date(b[1].date).getTime() - new Date(a[1].date).getTime())
        .map(([name]) => name);
    }
    return draft.universities || [];
  }, [evaluatedSchools, draft.universities]);

  const schoolEvalIdMap = useMemo(() => {
    const map = new Map<string, string>();
    results.forEach(r => r.universities.forEach(u => {
      if (!map.has(u.university)) map.set(u.university, r.id);
    }));
    return map;
  }, [results]);

  const uniqueSchoolCount = evaluatedSchools.size;

  const journeySteps = useMemo(() => [
    { key: 'profile', done: profileComplete, icon: User, label: 'Profile', detail: profileComplete ? 'Complete' : 'Not started' },
    { key: 'schools', done: uniqueSchoolCount > 0, icon: School, label: 'Schools', detail: uniqueSchoolCount > 0 ? `${uniqueSchoolCount} evaluated` : 'None yet' },
    { key: 'evaluate', done: results.length > 0, icon: BarChart3, label: 'Evaluate', detail: results.length > 0 ? `${results.length} done` : 'Not run' },
    { key: 'essays', done: essays.length > 0, icon: FileText, label: 'Essays', detail: essays.length > 0 ? `${essays.length} analyzed` : 'Not yet' },
  ], [profileComplete, uniqueSchoolCount, results.length, essays.length]);

  const completedCount = journeySteps.filter(s => s.done).length;
  const progressPercent = (completedCount / journeySteps.length) * 100;

  const nextAction = useMemo(() => {
    if (!profileComplete) return {
      title: 'Complete your admissions profile',
      subtitle: 'Tell us about your academics, activities, and achievements so we can evaluate your fit.',
      cta: 'Build profile',
      tab: 'evaluate',
      icon: User,
    };
    if (results.length === 0) return {
      title: 'Run your first evaluation',
      subtitle: 'See how your profile aligns with each university\'s admissions criteria.',
      cta: 'Start evaluation',
      tab: 'evaluate',
      icon: Sparkles,
    };
    return {
      title: 'Review your results or run a new evaluation',
      subtitle: 'Dive into your scores, strengths, and suggestions — or evaluate additional schools.',
      cta: 'Run new evaluation',
      tab: 'evaluate',
      icon: BarChart3,
    };
  }, [profileComplete, results]);

  const statusParts: string[] = [];
  if (uniqueSchoolCount > 0) statusParts.push(`${uniqueSchoolCount} school${uniqueSchoolCount !== 1 ? 's' : ''} evaluated`);
  if (results.length > 0) statusParts.push(`${results.length} evaluation${results.length !== 1 ? 's' : ''} completed`);

  const visibleEvals = results.slice(0, evalShow);
  const visibleEssays = essays.slice(0, essayShow);
  const visibleGaps = gaps.slice(0, gapShow);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-pulse text-sm text-muted-foreground font-sans">Loading your dashboard…</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header + Progress */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-5">
          <div>
            <h1 className="text-2xl font-semibold font-sans text-foreground tracking-tight">
              {firstName ? `Welcome back, ${firstName}` : 'Welcome back'}
            </h1>
            <p className="text-sm text-muted-foreground font-sans mt-1">
              {statusParts.length > 0 ? statusParts.join(' · ') : 'Start building your admissions profile.'}
            </p>
          </div>
          <Button
            size="sm"
            className="gap-1.5 cta-gradient border-0 text-[hsl(var(--coral-foreground))] text-sm font-sans"
            onClick={() => onNavigateTab('evaluate')}
          >
            <Plus className="h-3.5 w-3.5" /> New evaluation
          </Button>
        </div>

        {/* Progress strip */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold font-sans text-foreground uppercase tracking-wider">Journey progress</span>
            <span className="text-xs font-sans text-muted-foreground">{completedCount} of {journeySteps.length}</span>
          </div>
          <div className="h-2 bg-muted rounded-full mb-4 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%`, background: 'hsl(var(--coral))' }}
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {journeySteps.map((step) => (
              <div key={step.key} className="text-center">
                <div className={`mx-auto mb-1.5 w-9 h-9 rounded-full flex items-center justify-center ${
                  step.done
                    ? 'bg-[hsl(var(--success-bg))]'
                    : 'bg-muted'
                }`}>
                  {step.done ? (
                    <CheckCircle2 className="h-4.5 w-4.5" style={{ color: 'hsl(var(--success))' }} />
                  ) : (
                    <step.icon className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="text-xs font-medium font-sans text-foreground">{step.label}</div>
                <div className={`text-sm font-sans mt-0.5 ${step.done ? 'text-[hsl(var(--success))]' : 'text-gray-500'}`}>
                  {step.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Next action card */}
      <div className="rounded-xl border-2 border-primary/15 bg-primary/[0.03] p-5 mb-8">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <nextAction.icon className="h-5 w-5 text-secondary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold font-sans text-foreground leading-snug">{nextAction.title}</h2>
            <p className="text-sm text-muted-foreground font-sans mt-1 leading-relaxed">{nextAction.subtitle}</p>
            <Button
              size="sm"
              className="mt-3 gap-2 cta-gradient border-0 text-[hsl(var(--coral-foreground))] text-sm font-sans"
              onClick={() => onNavigateTab(nextAction.tab)}
            >
              {nextAction.cta} <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Your Activity — comprehensive tool history */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold font-sans text-foreground">Your activity</h2>

        {/* Evaluations section */}
        <HistorySection
          icon={BarChart3}
          title="Evaluations"
          total={evalTotal}
          empty={visibleEvals.length === 0}
          emptyText="No evaluations yet"
          emptyAction={() => onNavigateTab('evaluate')}
          emptyActionLabel="Run your first evaluation"
          showMore={evalShow < results.length}
          onShowMore={loadMoreEvals}
          showCollapse={evalShow > INITIAL_SIZE}
          onCollapse={() => setEvalShow(INITIAL_SIZE)}
        >
          {visibleEvals.map((r) => {
            const topScore = r.universities[0]?.alignmentScore;
            return (
              <button
                key={r.id}
                onClick={() => onNavigateTab('evaluate', { evalId: r.id })}
                className="flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition-colors group w-full text-left"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium font-sans text-foreground line-clamp-1">
                    {r.universities.map(u => u.university).join(', ')}
                  </div>
                  <div className="text-[11px] font-sans text-muted-foreground mt-0.5">
                    {formatDistanceToNow(new Date(r.timestamp), { addSuffix: true })}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {topScore != null && (
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${getScoreColor100(topScore)} ${getScoreBg100(topScore)}`}>{topScore}</span>
                  )}
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                </div>
              </button>
            );
          })}
        </HistorySection>

        {/* Essay Analyses section */}
        <HistorySection
          icon={FileText}
          title="Essay analyses"
          total={essayTotal}
          empty={visibleEssays.length === 0}
          emptyText="No essays analyzed yet"
          emptyAction={() => onNavigateTab('essay-analyzer')}
          emptyActionLabel="Analyze your first essay"
          showMore={essayShow < essayTotal && essayShow <= essays.length}
          onShowMore={loadMoreEssays}
          showCollapse={essayShow > INITIAL_SIZE}
          onCollapse={() => setEssayShow(INITIAL_SIZE)}
        >
          {visibleEssays.map((e) => (
            <button
              key={e.id}
              onClick={() => onNavigateTab('essay-analyzer', { resultId: e.id })}
              className="flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition-colors group w-full text-left"
            >
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium font-sans text-foreground line-clamp-1">
                  {e.school_name || e.university_name}
                </div>
                <div className="text-[11px] font-sans text-muted-foreground mt-0.5 flex items-center gap-1.5">
                  {e.essay_type && <span>{ESSAY_TYPE_LABELS[e.essay_type] ?? e.essay_type}</span>}
                  {e.essay_type && e.created_at && <span>·</span>}
                  {e.created_at && <span>{formatDistanceToNow(new Date(e.created_at), { addSuffix: true })}</span>}
                </div>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0 ml-2" />
            </button>
          ))}
        </HistorySection>

        {/* Action Plans section */}
        <HistorySection
          icon={Target}
          title="Action plans"
          total={gapTotal}
          empty={visibleGaps.length === 0}
          emptyText="No action plans generated yet"
          emptyAction={() => onNavigateTab('action-plan')}
          emptyActionLabel="Generate your first plan"
          showMore={gapShow < gapTotal && gapShow <= gaps.length}
          onShowMore={loadMoreGaps}
          showCollapse={gapShow > INITIAL_SIZE}
          onCollapse={() => setGapShow(INITIAL_SIZE)}
        >
          {visibleGaps.map((g) => (
            <button
              key={g.id}
              onClick={() => onNavigateTab('action-plan', { resultId: g.id })}
              className="flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition-colors group w-full text-left"
            >
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium font-sans text-foreground line-clamp-1">
                  {g.university_name}
                </div>
                <div className="text-[11px] font-sans text-muted-foreground mt-0.5 flex items-center gap-1.5">
                  {g.timeline_stage && <span className="capitalize">{g.timeline_stage}</span>}
                  {g.timeline_stage && g.created_at && <span>·</span>}
                  {g.created_at && <span>{formatDistanceToNow(new Date(g.created_at), { addSuffix: true })}</span>}
                </div>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0 ml-2" />
            </button>
          ))}
        </HistorySection>
      </div>

      {/* Your schools — compact grid */}
      <div className="mt-8">
        {/* Your School List card */}
        <div className="mb-5">
          {savedSchoolList ? (
            (() => {
              const counts = countBands(savedSchoolList.results);
              return (
                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold font-sans text-foreground flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        Your School List
                      </h3>
                      <p className="text-sm text-muted-foreground font-sans mt-1">
                        {counts.reach} reach, {counts.target} target, {counts.safety} safety schools
                      </p>
                      <p className="text-xs text-muted-foreground font-sans mt-1">
                        Built: {new Date(savedSchoolList.builtAt).toLocaleDateString()}
                      </p>
                      {schoolListStale && (
                        <p className="text-xs font-medium text-amber-700 font-sans mt-2 flex items-center gap-1.5">
                          <AlertTriangle className="h-3 w-3" />
                          Profile updated — results may be outdated
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                      {schoolListStale && (
                        <Button
                          size="sm"
                          className="bg-[#e85d3a] hover:bg-[#d4522f] border-0 text-white"
                          onClick={() => onNavigateTab('school-list')}
                        >
                          Rebuild
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onNavigateTab('school-list')}
                        className="gap-1"
                      >
                        View full list <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold font-sans text-foreground flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    School List
                  </h3>
                  <p className="text-sm text-muted-foreground font-sans mt-1">
                    Build your personalized reach/target/safety school list
                  </p>
                </div>
                <Button
                  size="sm"
                  className="cta-gradient border-0 text-white gap-1 shrink-0"
                  onClick={() => onNavigateTab('school-list')}
                >
                  Build school list <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mb-3">
          <h2 className="text-sm font-semibold font-sans text-foreground">Your schools</h2>
        </div>

        {selectedSchools.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center">
            <School className="mx-auto h-7 w-7 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground font-sans mb-3">No schools evaluated yet</p>
            <button
              onClick={() => onNavigateTab('evaluate')}
              className="text-xs font-medium text-[hsl(var(--coral))] hover:underline font-sans"
            >
              Run your first evaluation →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {selectedSchools.map((school) => {
              const evalData = evaluatedSchools.get(school);
              const schoolEvalId = evalData ? schoolEvalIdMap.get(school) : undefined;
              return (
                <div
                  key={school}
                  className={`flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 transition-shadow ${evalData ? 'hover:shadow-sm cursor-pointer' : ''}`}
                  onClick={() => {
                    if (evalData && schoolEvalId) {
                      onNavigateTab('evaluate', { evalId: schoolEvalId });
                    }
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-medium font-sans text-foreground block truncate">{school}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {evalData && bandBadge(evalData.band)}
                    {evalData ? (
                      <span className={`text-xs font-semibold font-sans ${getScoreColor100(evalData.score)}`}>
                        {evalData.score}
                      </span>
                    ) : (
                      <span className="text-[10px] font-sans text-muted-foreground">—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* Reusable history section wrapper with pagination */
function HistorySection({
  icon: Icon,
  title,
  total,
  empty,
  emptyText,
  emptyAction,
  emptyActionLabel,
  showMore,
  onShowMore,
  showCollapse,
  onCollapse,
  children,
}: {
  icon: React.ElementType;
  title: string;
  total: number;
  empty: boolean;
  emptyText: string;
  emptyAction: () => void;
  emptyActionLabel: string;
  showMore: boolean;
  onShowMore: () => void;
  showCollapse: boolean;
  onCollapse: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold font-sans text-foreground flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          {title}
          {total > 0 && (
            <span className="text-xs font-normal text-muted-foreground">({total})</span>
          )}
        </h3>
        {showCollapse && (
          <button onClick={onCollapse} className="text-xs font-medium text-muted-foreground hover:text-foreground font-sans">
            Show less
          </button>
        )}
      </div>
      {empty ? (
        <div className="px-5 pb-5 pt-2 text-center">
          <p className="text-sm text-muted-foreground font-sans mb-2">{emptyText}</p>
          <button onClick={emptyAction} className="text-xs font-medium text-[hsl(var(--coral))] hover:underline font-sans">
            {emptyActionLabel} →
          </button>
        </div>
      ) : (
        <>
          <div className="divide-y divide-border">
            {children}
          </div>
          {showMore && (
            <div className="px-5 py-3 border-t border-border">
              <button
                onClick={onShowMore}
                className="w-full text-xs font-medium text-secondary hover:underline font-sans flex items-center justify-center gap-1"
              >
                <ChevronDown className="h-3 w-3" /> Show more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
