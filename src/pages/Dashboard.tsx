import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getEvaluationResults, getCurrentDraft } from '@/services/storage';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
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

export default function Dashboard() {
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

  const profileComplete = getProfileComplete(draft);
  const selectedSchools = draft.universities || [];
  const evaluatedSchools = useMemo(() => {
    const set = new Set<string>();
    results.forEach(r => r.universities.forEach(u => set.add(u.university)));
    return set;
  }, [results]);

  const hasEssays = !!(draft.essays?.personalStatement?.trim());

  // Journey computation
  const journeySteps = useMemo(() => [
    { key: 'profile', done: profileComplete, icon: User, label: 'Profile', detail: profileComplete ? 'Complete' : 'Not started' },
    { key: 'schools', done: selectedSchools.length > 0, icon: School, label: 'Schools', detail: selectedSchools.length > 0 ? `${selectedSchools.length} selected` : 'None yet' },
    { key: 'evaluate', done: results.length > 0, icon: BarChart3, label: 'Evaluate', detail: results.length > 0 ? `${results.length} done` : 'Not run' },
    { key: 'essays', done: false, icon: FileText, label: 'Essays', detail: 'Coming soon', locked: true },
  ], [profileComplete, selectedSchools.length, results.length]);

  const completedCount = journeySteps.filter(s => s.done).length;
  const progressPercent = (completedCount / journeySteps.length) * 100;

  // Next action logic
  const nextAction = useMemo(() => {
    if (!profileComplete) return {
      title: 'Complete your admissions profile',
      subtitle: 'Tell us about your academics, activities, and achievements so we can evaluate your fit.',
      cta: 'Build profile',
      link: '/application',
      icon: User,
    };
    if (selectedSchools.length === 0) return {
      title: 'Select your target universities',
      subtitle: 'Choose the schools you\'re interested in so we can run a personalized evaluation.',
      cta: 'Select schools',
      link: '/application',
      icon: Target,
    };
    if (results.length === 0) return {
      title: 'Run your first evaluation',
      subtitle: 'See how your profile aligns with each university\'s admissions criteria.',
      cta: 'Start evaluation',
      link: '/application',
      icon: Sparkles,
    };
    return {
      title: 'Review your results or run a new evaluation',
      subtitle: 'Dive into your scores, strengths, and suggestions — or evaluate additional schools.',
      cta: 'View results',
      link: '/results',
      icon: BarChart3,
      state: { result: results[0] },
    };
  }, [profileComplete, selectedSchools.length, results]);

  const statusParts: string[] = [];
  if (selectedSchools.length > 0) statusParts.push(`${selectedSchools.length} school${selectedSchools.length !== 1 ? 's' : ''} selected`);
  if (results.length > 0) statusParts.push(`${results.length} evaluation${results.length !== 1 ? 's' : ''} completed`);

  const recentEvals = results.slice(0, 3);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="animate-pulse text-sm text-muted-foreground font-sans">Loading your dashboard…</div>
          </div>
        ) : (
          <>
            {/* ── Header + Progress ── */}
            <div className="mb-10">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-semibold font-sans text-foreground tracking-tight">
                    {firstName ? `Welcome back, ${firstName}` : 'Welcome back'}
                  </h1>
                  <p className="text-sm text-muted-foreground font-sans mt-1">
                    {statusParts.length > 0 ? statusParts.join(' · ') : 'Start building your admissions profile.'}
                  </p>
                </div>
                <Link to="/application">
                  <Button size="sm" className="gap-1.5 cta-gradient border-0 text-primary-foreground text-sm font-sans">
                    <Plus className="h-3.5 w-3.5" /> New evaluation
                  </Button>
                </Link>
              </div>

              {/* Progress strip */}
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold font-sans text-foreground uppercase tracking-wider">Journey progress</span>
                  <span className="text-xs font-sans text-muted-foreground">{completedCount} of {journeySteps.length}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full mb-5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progressPercent}%`, background: 'hsl(var(--success))' }}
                  />
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {journeySteps.map((step) => (
                    <div key={step.key} className="text-center">
                      <div className={`mx-auto mb-1.5 w-9 h-9 rounded-full flex items-center justify-center ${
                        step.done
                          ? 'bg-[hsl(var(--success-bg))]'
                          : step.locked
                          ? 'bg-muted'
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
                      <div className={`text-[11px] font-sans mt-0.5 ${step.done ? 'text-[hsl(var(--success))]' : 'text-muted-foreground'}`}>
                        {step.detail}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Two-column body ── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left column — main content (3/5) */}
              <div className="lg:col-span-3 space-y-8">
                {/* Next action card */}
                <div className="rounded-xl border-2 border-primary/15 bg-primary/[0.03] p-6">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <nextAction.icon className="h-5 w-5 text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-semibold font-sans text-foreground leading-snug">{nextAction.title}</h2>
                      <p className="text-sm text-muted-foreground font-sans mt-1 leading-relaxed">{nextAction.subtitle}</p>
                      <Link to={nextAction.link} state={(nextAction as any).state}>
                        <Button size="sm" className="mt-4 gap-2 cta-gradient border-0 text-primary-foreground text-sm font-sans">
                          {nextAction.cta} <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Target universities */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold font-sans text-foreground">Target universities</h2>
                    {selectedSchools.length > 0 && (
                      <Link to="/application" className="text-xs font-medium font-sans text-secondary hover:underline inline-flex items-center gap-1">
                        Edit <ChevronRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>

                  {selectedSchools.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
                      <School className="mx-auto h-7 w-7 text-muted-foreground/30 mb-2" />
                      <p className="text-sm text-muted-foreground font-sans mb-3">No universities selected yet</p>
                      <Link to="/application">
                        <Button variant="outline" size="sm" className="gap-1.5 font-sans text-xs">
                          <Plus className="h-3.5 w-3.5" /> Select universities
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedSchools.map((school) => {
                        const isEvaluated = evaluatedSchools.has(school);
                        const evalResult = results.find(r => r.universities.some(u => u.university === school));
                        return (
                          <div
                            key={school}
                            className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-2 h-2 rounded-full shrink-0 ${isEvaluated ? 'bg-[hsl(var(--success))]' : 'bg-muted-foreground/30'}`} />
                              <div className="min-w-0">
                                <span className="text-sm font-medium font-sans text-foreground block truncate">{school}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-3">
                              {isEvaluated ? (
                                <Link
                                  to="/results"
                                  state={{ result: evalResult }}
                                  className="text-xs font-medium font-sans text-secondary hover:underline"
                                >
                                  Results →
                                </Link>
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

              {/* Right column — sidebar (2/5) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Recent evaluations */}
                {results.length > 0 && (
                  <div className="rounded-xl border border-border bg-card">
                    <div className="px-5 pt-4 pb-2 flex items-center justify-between">
                      <h3 className="text-sm font-semibold font-sans text-foreground">Recent evaluations</h3>
                      {results.length > 3 && (
                        <Link to="/results" state={{ result: results[0] }} className="text-[11px] font-medium font-sans text-secondary hover:underline">
                          View all
                        </Link>
                      )}
                    </div>
                    <div className="divide-y divide-border">
                      {recentEvals.map((r) => (
                        <Link
                          key={r.id}
                          to="/results"
                          state={{ result: r }}
                          className="flex items-center justify-between px-5 py-3 hover:bg-muted/40 transition-colors group"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium font-sans text-foreground truncate">
                              {r.universities.map(u => u.university).join(', ')}
                            </div>
                            <div className="text-[11px] font-sans text-muted-foreground mt-0.5">
                              {formatDistanceToNow(new Date(r.timestamp), { addSuffix: true })}
                            </div>
                          </div>
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0 ml-2" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick actions */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold font-sans text-foreground mb-3">Quick actions</h3>
                  {[
                    { to: '/application', icon: PenLine, label: 'Update profile', sub: 'Edit academics & activities' },
                    { to: '/application', icon: Play, label: 'New evaluation', sub: 'Run against your schools' },
                    ...(results.length > 0
                      ? [{ to: '/results', icon: Eye, label: 'View all results', sub: 'Past evaluations & insights', state: { result: results[0] } }]
                      : []),
                  ].map((action) => (
                    <Link
                      key={action.label}
                      to={action.to}
                      state={(action as any).state}
                      className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 hover:shadow-sm hover:border-primary/20 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <action.icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium font-sans text-foreground">{action.label}</div>
                        <div className="text-[11px] font-sans text-muted-foreground">{action.sub}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
