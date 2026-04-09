import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getEvaluationResults, getCurrentDraft } from '@/services/storage';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowRight, Plus, School, FileText, BarChart3, CheckCircle2, Clock } from 'lucide-react';
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

  // Next action logic
  const nextAction = useMemo(() => {
    if (!profileComplete) {
      return {
        title: 'Complete your admissions profile',
        description: 'Fill out your academic background, activities, and essays to get started.',
        cta: 'Complete profile',
        link: '/application',
      };
    }
    if (selectedSchools.length === 0) {
      return {
        title: 'Select your target universities',
        description: 'Choose the schools you want to evaluate your profile against.',
        cta: 'Select universities',
        link: '/application',
      };
    }
    if (results.length === 0) {
      return {
        title: 'Run your first evaluation',
        description: 'Evaluate your application against your selected universities to see how you align.',
        cta: 'Start evaluation',
        link: '/application',
      };
    }
    return {
      title: 'Review your results or run a new evaluation',
      description: 'Check your latest results or update your profile and run another evaluation.',
      cta: 'New evaluation',
      link: '/application',
    };
  }, [profileComplete, selectedSchools.length, results.length]);

  const statusParts: string[] = [];
  if (selectedSchools.length > 0) statusParts.push(`${selectedSchools.length} school${selectedSchools.length !== 1 ? 's' : ''} selected`);
  if (results.length > 0) statusParts.push(`${results.length} evaluation${results.length !== 1 ? 's' : ''} completed`);

  const recentEvals = results.slice(0, 3);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold font-sans text-foreground">
            Welcome back{firstName ? `, ${firstName}` : ''}
          </h1>
          <p className="text-sm mt-1 font-sans" style={{ color: 'hsl(224 14% 62%)' }}>
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
          <div className="space-y-8">
            {/* Next action prompt */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2.5 shrink-0 mt-0.5">
                  <ArrowRight className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-semibold font-sans text-foreground">
                    {nextAction.title}
                  </h2>
                  <p className="text-sm text-muted-foreground font-sans mt-1">
                    {nextAction.description}
                  </p>
                  <Link to={nextAction.link} className="inline-block mt-4">
                    <Button className="gap-2 cta-gradient border-0 text-primary-foreground">
                      {nextAction.cta} <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Your schools */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold font-sans text-foreground">Your schools</h2>
                {selectedSchools.length > 0 && (
                  <Link to="/application" className="text-sm font-medium font-sans text-secondary hover:underline">
                    Edit
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
                <div className="rounded-xl border border-border bg-card divide-y divide-border">
                  {selectedSchools.map((school) => {
                    const isEvaluated = evaluatedSchools.has(school);
                    const evalResult = results.find(r => r.universities.some(u => u.university === school));
                    return (
                      <div key={school} className="flex items-center justify-between px-5 py-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <School className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-sm font-medium font-sans text-foreground truncate">
                            {school}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 ml-4">
                          {isEvaluated ? (
                            <>
                              <span className="inline-flex items-center gap-1 text-xs font-sans font-medium px-2 py-0.5 rounded-full" style={{ background: 'hsl(140 33% 93%)', color: 'hsl(149 64% 29%)' }}>
                                <CheckCircle2 className="h-3 w-3" /> Evaluated
                              </span>
                              {evalResult && (
                                <Link
                                  to="/results"
                                  state={{ result: evalResult }}
                                  className="text-xs font-sans font-medium text-secondary hover:underline"
                                >
                                  Results
                                </Link>
                              )}
                            </>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-sans font-medium text-muted-foreground px-2 py-0.5 rounded-full bg-muted">
                              <Clock className="h-3 w-3" /> Pending
                            </span>
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
                  <h2 className="text-base font-semibold font-sans text-foreground">Recent evaluations</h2>
                  {results.length > 3 && (
                    <Link to="/results" className="text-sm font-medium font-sans text-secondary hover:underline">
                      View all
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
                        <div className="text-xs font-sans mt-1" style={{ color: 'hsl(224 14% 62%)' }}>
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

            {/* Footer links */}
            <div className="flex items-center justify-center gap-6 pt-4 pb-2">
              <Link to="/application" className="text-sm font-sans text-muted-foreground hover:text-foreground transition-colors">
                Update profile
              </Link>
              <Link to="/application" className="text-sm font-sans text-muted-foreground hover:text-foreground transition-colors">
                New evaluation
              </Link>
              {results.length > 0 && (
                <Link to="/results" state={{ result: results[0] }} className="text-sm font-sans text-muted-foreground hover:text-foreground transition-colors">
                  All results
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
