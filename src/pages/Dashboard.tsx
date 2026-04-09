import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getEvaluationResults, getCurrentDraft } from '@/services/storage';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  ArrowRight, Plus, School, CheckCircle2, Clock, MapPin,
  User, GraduationCap, BarChart3, FileText, Lock, Play,
  PenLine, Eye,
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
            id,
            created_at,
            universities,
            evaluation_results (
              university_name,
              alignment_score,
              academic_strength,
              activity_impact,
              honors_awards,
              narrative_strength,
              institutional_fit,
              core_insight,
              most_important_next_step,
              band,
              band_reasoning,
              strengths,
              weaknesses,
              suggestions
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
      if (local.length > 0) {
        setResults(local);
      }
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
  const essaysAnalyzed = 0; // Future feature

  // Journey steps
  const steps = useMemo(() => {
    const profileDone = profileComplete;
    const schoolsDone = selectedSchools.length > 0;
    const evalsDone = results.length > 0;

    return [
      {
        num: 1,
        title: 'Build your profile',
        description: 'Complete a short questionnaire so we can understand your goals, interests, and preferences.',
        link: '/application',
        done: profileDone,
        locked: false,
        cta: profileDone ? 'Update profile' : 'Complete profile',
      },
      {
        num: 2,
        title: 'Select your schools',
        description: 'Discover universities that align with your profile and add them to your target list.',
        link: '/application',
        done: schoolsDone,
        locked: false,
        cta: schoolsDone ? 'Edit selections' : 'Select universities',
      },
      {
        num: 3,
        title: 'Run your evaluation',
        description: 'Build a mock application and see how your profile aligns with each university\'s values.',
        link: '/application',
        done: evalsDone,
        locked: false,
        cta: evalsDone ? 'Run again' : 'Begin evaluation',
      },
      {
        num: 4,
        title: 'Improve your essays',
        description: 'Analyze your essays against university institutional traits and get actionable feedback.',
        link: '#',
        done: false,
        locked: true,
        cta: 'Coming soon',
      },
    ];
  }, [profileComplete, selectedSchools.length, results.length]);

  const completedSteps = steps.filter(s => s.done).length;
  const activeStepIndex = steps.findIndex(s => !s.done && !s.locked);
  const progressPercent = (completedSteps / steps.length) * 100;

  const statusParts: string[] = [];
  if (selectedSchools.length > 0) statusParts.push(`${selectedSchools.length} school${selectedSchools.length !== 1 ? 's' : ''} selected`);
  if (results.length > 0) statusParts.push(`${results.length} evaluation${results.length !== 1 ? 's' : ''} completed`);

  const recentEvals = results.slice(0, 3);

  const progressIndicators = [
    {
      icon: User,
      label: 'Profile',
      value: profileComplete ? 'Done' : 'Pending',
      done: profileComplete,
    },
    {
      icon: School,
      label: 'Schools',
      value: String(selectedSchools.length),
      done: selectedSchools.length > 0,
    },
    {
      icon: BarChart3,
      label: 'Evaluations',
      value: String(results.length),
      done: results.length > 0,
    },
    {
      icon: FileText,
      label: 'Essays analyzed',
      value: String(essaysAnalyzed),
      done: essaysAnalyzed > 0,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        {/* Welcome header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold font-sans text-foreground">
            Welcome back{firstName ? `, ${firstName}` : ''}
          </h1>
          <p className="text-sm mt-1 font-sans text-muted-foreground">
            {statusParts.length > 0
              ? statusParts.join(' · ')
              : 'Track your admissions journey and keep building your profile.'}
          </p>
        </div>

        {loading ? (
          <div className="rounded-xl border border-border bg-card p-16 text-center">
            <p className="text-sm text-muted-foreground font-sans">Loading…</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Progress tracker card */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              {/* Progress bar */}
              <div className="h-1.5 bg-muted">
                <div
                  className="h-full rounded-r-full transition-all duration-500"
                  style={{
                    width: `${progressPercent}%`,
                    background: 'hsl(var(--primary))',
                  }}
                />
              </div>
              <div className="px-5 py-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold font-sans text-foreground">Admissions progress</h2>
                <span className="text-xs font-sans text-muted-foreground">{completedSteps}/{steps.length} steps</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
                {progressIndicators.map((ind) => (
                  <div key={ind.label} className="bg-card px-4 py-3 flex items-center gap-3">
                    <div className={`shrink-0 ${ind.done ? '' : 'opacity-40'}`}>
                      {ind.done ? (
                        <CheckCircle2 className="h-5 w-5" style={{ color: 'hsl(var(--success))' }} />
                      ) : (
                        <ind.icon className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-sans text-muted-foreground leading-tight">{ind.label}</div>
                      <div className="text-sm font-semibold font-sans text-foreground leading-tight mt-0.5">{ind.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Journey steps */}
            <div>
              <h2 className="text-lg font-semibold font-sans text-foreground mb-1">Your admissions journey</h2>
              <p className="text-sm text-muted-foreground font-sans mb-6">Complete each step to build a comprehensive admissions profile.</p>

              <div className="relative">
                {steps.map((step, i) => {
                  const isActive = i === activeStepIndex;
                  const isLast = i === steps.length - 1;

                  return (
                    <div key={step.num} className="relative flex gap-4">
                      {/* Timeline connector */}
                      <div className="flex flex-col items-center shrink-0 w-8">
                        {/* Circle */}
                        <div
                          className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs font-bold font-sans transition-colors ${
                            step.done
                              ? 'border-transparent text-white'
                              : step.locked
                              ? 'border-border bg-muted text-muted-foreground'
                              : isActive
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border bg-card text-muted-foreground'
                          }`}
                          style={step.done ? { background: 'hsl(var(--success))' } : undefined}
                        >
                          {step.done ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : step.locked ? (
                            <Lock className="h-3.5 w-3.5" />
                          ) : (
                            step.num
                          )}
                        </div>
                        {/* Line */}
                        {!isLast && (
                          <div
                            className={`w-0.5 flex-1 min-h-[24px] ${
                              step.done ? '' : 'bg-border'
                            }`}
                            style={step.done ? { background: 'hsl(var(--success))' } : undefined}
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div
                        className={`flex-1 pb-8 ${isLast ? 'pb-0' : ''}`}
                      >
                        <div
                          className={`rounded-xl border p-5 transition-colors ${
                            isActive
                              ? 'border-primary/30 bg-primary/5'
                              : step.locked
                              ? 'border-border bg-muted/30'
                              : 'border-border bg-card'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[11px] font-sans font-medium text-muted-foreground uppercase tracking-wider">
                                  Step {step.num}
                                </span>
                                {step.done && (
                                  <span
                                    className="text-[11px] font-sans font-semibold uppercase tracking-wider"
                                    style={{ color: 'hsl(var(--success))' }}
                                  >
                                    Complete
                                  </span>
                                )}
                              </div>
                              <h3 className={`text-sm font-semibold font-sans ${step.locked ? 'text-muted-foreground' : 'text-foreground'}`}>
                                {step.title}
                              </h3>
                              <p className="text-xs text-muted-foreground font-sans mt-1 leading-relaxed">
                                {step.description}
                              </p>
                            </div>
                          </div>
                          {!step.locked && (
                            <Link to={step.link} className="inline-block mt-3">
                              {isActive ? (
                                <Button size="sm" className="gap-2 cta-gradient border-0 text-primary-foreground text-xs">
                                  {step.cta} <ArrowRight className="h-3.5 w-3.5" />
                                </Button>
                              ) : (
                                <span className="text-xs font-sans font-medium text-secondary hover:underline inline-flex items-center gap-1">
                                  {step.cta} <ArrowRight className="h-3 w-3" />
                                </span>
                              )}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Target universities */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold font-sans text-foreground">Target universities</h2>
                {selectedSchools.length > 0 && (
                  <Link to="/application" className="text-sm font-medium font-sans text-secondary hover:underline inline-flex items-center gap-1">
                    Edit selections <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
              {selectedSchools.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-10 text-center">
                  <School className="mx-auto h-8 w-8 text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-muted-foreground font-sans">
                    No universities selected yet.
                  </p>
                  <Link to="/application" className="inline-block mt-4">
                    <Button variant="outline" className="gap-2 font-sans text-sm">
                      <Plus className="h-4 w-4" /> Select universities
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedSchools.map((school) => {
                    const isEvaluated = evaluatedSchools.has(school);
                    const evalResult = results.find(r => r.universities.some(u => u.university === school));
                    return (
                      <div
                        key={school}
                        className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="min-w-0">
                            <h3 className="text-sm font-semibold font-sans text-foreground">{school}</h3>
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground font-sans">United States</span>
                            </div>
                          </div>
                          {isEvaluated ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-sans font-medium px-2 py-0.5 rounded-full shrink-0" style={{ background: 'hsl(var(--success-bg))', color: 'hsl(var(--success))' }}>
                              <CheckCircle2 className="h-3 w-3" /> Evaluated
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-sans font-medium text-muted-foreground px-2 py-0.5 rounded-full bg-muted shrink-0">
                              <Clock className="h-3 w-3" /> Pending
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 pt-3 border-t border-border">
                          <Link to="/application">
                            <Button size="sm" variant="outline" className="gap-1.5 text-xs font-sans h-8">
                              <Play className="h-3 w-3" /> Run evaluation
                            </Button>
                          </Link>
                          {isEvaluated && evalResult && (
                            <Link
                              to="/results"
                              state={{ result: evalResult }}
                              className="text-xs font-sans font-medium text-secondary hover:underline inline-flex items-center gap-1"
                            >
                              <Eye className="h-3 w-3" /> View results
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent evaluations */}
            {results.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold font-sans text-foreground">Recent evaluations</h2>
                  {results.length > 3 && (
                    <Link to="/results" className="text-sm font-medium font-sans text-secondary hover:underline inline-flex items-center gap-1">
                      View all <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
                <div className="rounded-xl border border-border bg-card divide-y divide-border">
                  {recentEvals.map((r) => (
                    <Link
                      key={r.id}
                      to="/results"
                      state={{ result: r }}
                      className="flex items-center justify-between px-5 py-4 hover:bg-muted/50 transition-colors group"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium font-sans text-foreground truncate">
                          {r.universities.map((u) => u.university).join(', ')}
                        </div>
                        <div className="text-xs font-sans mt-1 text-muted-foreground">
                          {formatDistanceToNow(new Date(r.timestamp), { addSuffix: true })} · {r.universities.length}{' '}
                          {r.universities.length === 1 ? 'university' : 'universities'}
                        </div>
                      </div>
                      <span className="text-sm font-medium font-sans text-muted-foreground group-hover:text-primary transition-colors ml-4 shrink-0">
                        View results →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/application"
                className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow group"
              >
                <div className="rounded-lg bg-muted p-2 w-fit mb-3">
                  <PenLine className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-sm font-semibold font-sans text-foreground">Update profile</h3>
                <p className="text-xs text-muted-foreground font-sans mt-1">Edit your academic info and activities.</p>
              </Link>
              <Link
                to="/application"
                className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow group"
              >
                <div className="rounded-lg bg-muted p-2 w-fit mb-3">
                  <BarChart3 className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-sm font-semibold font-sans text-foreground">New evaluation</h3>
                <p className="text-xs text-muted-foreground font-sans mt-1">Run a fresh evaluation against your schools.</p>
              </Link>
              {results.length > 0 ? (
                <Link
                  to="/results"
                  state={{ result: results[0] }}
                  className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow group"
                >
                  <div className="rounded-lg bg-muted p-2 w-fit mb-3">
                    <Eye className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-sm font-semibold font-sans text-foreground">View all results</h3>
                  <p className="text-xs text-muted-foreground font-sans mt-1">Review past evaluations and insights.</p>
                </Link>
              ) : (
                <div className="rounded-xl border border-border bg-card p-5 opacity-50">
                  <div className="rounded-lg bg-muted p-2 w-fit mb-3">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h3 className="text-sm font-semibold font-sans text-foreground">View all results</h3>
                  <p className="text-xs text-muted-foreground font-sans mt-1">No results yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
