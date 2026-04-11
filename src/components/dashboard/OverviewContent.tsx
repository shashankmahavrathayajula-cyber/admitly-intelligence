import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getEvaluationResults, getCurrentDraft } from '@/services/storage';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowRight, Plus, School, CheckCircle2, Clock, MapPin,
  User, GraduationCap, BarChart3, FileText, Lock, Play,
  PenLine, Eye, Sparkles, Target, ChevronRight,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState, useMemo } from 'react';
import type { EvaluationResult, UniversityEvaluation } from '@/types/evaluation';
import type { ApplicationData } from '@/types/application';

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

function getProfileComplete(draft: ApplicationData): boolean {
  return !!(draft.academics.gpa && draft.academics.courseRigor);
}

function scoreColor(score: number): string {
  if (score >= 70) return 'text-teal-700';
  if (score >= 50) return 'text-amber-700';
  return 'text-red-700';
}

function scoreBg(score: number): string {
  if (score >= 70) return 'bg-teal-50';
  if (score >= 50) return 'bg-amber-50';
  return 'bg-red-50';
}

function bandBadge(band?: string) {
  if (!band) return null;
  const b = band.toLowerCase();
  if (b === 'safety') return <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 text-[10px]">Safety</Badge>;
  if (b === 'target') return <Badge className="bg-blue-500/15 text-blue-600 border-blue-500/30 text-[10px]">Target</Badge>;
  return <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/30 text-[10px]">Reach</Badge>;
}

interface OverviewContentProps {
  onNavigateTab: (tab: string, params?: Record<string, string>) => void;
}

export default function OverviewContent({ onNavigateTab }: OverviewContentProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState<EvaluationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft] = useState<ApplicationData>(() => getCurrentDraft());

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || '';

  useEffect(() => {
    async function load() {
      if (user) {
        const { data } = await supabase
          .from('evaluations')
          .select(`
            id, created_at, universities,
            evaluation_results (
              university_name, alignment_score, academic_strength,
              activity_impact, honors_awards, narrative_strength,
              institutional_fit, core_insight, most_important_next_step,
              band, band_reasoning, strengths, weaknesses, suggestions
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (data && data.length > 0) {
          setResults((data as unknown as SupabaseEvaluation[]).map(mapToEvaluationResult));
          setLoading(false);
          return;
        }
      }
      const local = getEvaluationResults();
      if (local.length > 0) setResults(local);
      setLoading(false);
    }
    load();
  }, [user]);

  // Derive status from Supabase results (not localStorage draft)
  const hasEvaluations = results.length > 0;
  const profileComplete = hasEvaluations || getProfileComplete(draft);

  // Unique schools from evaluation results
  const evaluatedSchools = useMemo(() => {
    const map = new Map<string, { score: number; band?: string }>();
    results.forEach(r => r.universities.forEach(u => {
      if (!map.has(u.university)) {
        map.set(u.university, { score: u.alignmentScore, band: u.admissionsSummary?.band });
      }
    }));
    return map;
  }, [results]);

  // For display: use evaluated schools from Supabase, fall back to draft
  const selectedSchools = useMemo(() => {
    if (evaluatedSchools.size > 0) return Array.from(evaluatedSchools.keys());
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
    { key: 'essays', done: false, icon: FileText, label: 'Essays', detail: 'Coming soon', locked: true },
  ], [profileComplete, uniqueSchoolCount, results.length]);

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

  const recentEvals = results.slice(0, 3);

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
          <div className="grid grid-cols-4 gap-3">
            {journeySteps.map((step) => (
              <div key={step.key} className="text-center">
                <div className={`mx-auto mb-1.5 w-9 h-9 rounded-full flex items-center justify-center ${
                  step.done
                    ? 'bg-[hsl(var(--success-bg))]'
                    : 'bg-muted'
                }`}>
                  {step.done ? (
                    <CheckCircle2 className="h-4.5 w-4.5" style={{ color: 'hsl(var(--success))' }} />
                  ) : step.locked ? (
                    <Lock className="h-3.5 w-3.5 text-muted-foreground/50" />
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

      {/* Two-column body */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Left column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Next action card */}
          <div className="rounded-xl border-2 border-primary/15 bg-primary/[0.03] p-5">
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

          {/* Target universities */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold font-sans text-foreground">Target universities</h2>
              {selectedSchools.length > 0 && (
                <button
                  onClick={() => onNavigateTab('evaluate')}
                  className="text-xs font-medium font-sans text-secondary hover:underline inline-flex items-center gap-1"
                >
                  Edit <ChevronRight className="h-3 w-3" />
                </button>
              )}
            </div>

            {selectedSchools.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center h-full flex flex-col items-center justify-center">
                <School className="mx-auto h-7 w-7 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground font-sans mb-3">No universities selected yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 font-sans text-xs"
                  onClick={() => onNavigateTab('evaluate')}
                >
                  <Plus className="h-3.5 w-3.5" /> Select universities
                </Button>
              </div>
            ) : (
              <div className="space-y-1.5">
                {selectedSchools.map((school) => {
                  const evalData = evaluatedSchools.get(school);
                  const schoolEvalId = evalData ? schoolEvalIdMap.get(school) : undefined;
                  return (
                    <div
                      key={school}
                      className={`flex items-center justify-between rounded-lg border border-border bg-card px-4 py-2.5 transition-shadow ${evalData ? 'hover:shadow-sm cursor-pointer' : ''}`}
                      onClick={() => {
                        if (evalData && schoolEvalId) {
                          onNavigateTab('evaluate', { evalId: schoolEvalId });
                        }
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${evalData ? 'bg-[hsl(var(--success))]' : 'bg-muted-foreground/30'}`} />
                        <span className="text-sm font-medium font-sans text-foreground block truncate">{school}</span>
                        {evalData && bandBadge(evalData.band)}
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        {evalData ? (
                          <span className={`text-sm font-semibold font-sans ${scoreColor(evalData.score)}`}>
                            {evalData.score}
                          </span>
                        ) : (
                          <span className="text-[11px] font-sans text-muted-foreground">Pending</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-5">
          {results.length > 0 && (
            <div className="rounded-xl border border-border bg-card">
              <div className="px-5 pt-4 pb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold font-sans text-foreground">Recent evaluations</h3>
              </div>
              <div className="divide-y divide-border">
                {recentEvals.map((r) => {
                  const topScore = r.universities[0]?.alignmentScore;
                  return (
                    <button
                      key={r.id}
                      onClick={() => onNavigateTab('evaluate', { evalId: r.id })}
                      className="flex items-center justify-between px-5 py-2.5 hover:bg-muted/40 transition-colors group w-full text-left"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium font-sans text-foreground line-clamp-2">
                          {r.universities.map(u => u.university).join(', ')}
                        </div>
                        <div className="text-[11px] font-sans text-muted-foreground mt-0.5">
                          {formatDistanceToNow(new Date(r.timestamp), { addSuffix: true })}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {topScore != null && (
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${scoreColor(topScore)} ${scoreBg(topScore)}`}>{topScore}</span>
                        )}
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div>
            <h3 className="text-sm font-semibold font-sans text-foreground mb-2">Quick actions</h3>
            <div className="rounded-xl border border-border bg-card divide-y divide-gray-100">
            {[
              { tab: 'evaluate', icon: PenLine, label: 'Update profile', sub: 'Edit academics & activities' },
              { tab: 'evaluate', icon: Play, label: 'New evaluation', sub: 'Run against your schools' },
              { tab: 'essay-analyzer', icon: Eye, label: 'Essay analyzer', sub: 'Get essay feedback' },
              { tab: 'action-plan', icon: Target, label: 'Action plan', sub: 'Gap analysis & strategy' },
              { tab: 'school-list', icon: GraduationCap, label: 'School list', sub: 'Find your matches' },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => onNavigateTab(action.tab)}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors group w-full text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <action.icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium font-sans text-foreground">{action.label}</div>
                  <div className="text-[11px] font-sans text-muted-foreground">{action.sub}</div>
                </div>
              </button>
            ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
