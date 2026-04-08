import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getEvaluationResults } from '@/services/storage';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Plus, ClipboardList, ArrowRight, CloudOff } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import type { EvaluationResult, UniversityEvaluation } from '@/types/evaluation';

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
      alignmentScore: Number(r.alignment_score),
      academicStrength: Number(r.academic_strength),
      activityImpact: Number(r.activity_impact),
      honorsAwards: Number(r.honors_awards),
      narrativeStrength: Number(r.narrative_strength),
      institutionalFit: Number(r.institutional_fit),
      strengths: Array.isArray(r.strengths) ? r.strengths as string[] : [],
      weaknesses: Array.isArray(r.weaknesses) ? r.weaknesses as string[] : [],
      suggestions: Array.isArray(r.suggestions) ? r.suggestions as string[] : [],
      coreInsight: r.core_insight ?? undefined,
      mostImportantNextStep: r.most_important_next_step ?? undefined,
      admissionsSummary: r.band ? { band: r.band, reasoning: r.band_reasoning ?? '' } : undefined,
    })),
  };
}

export default function Dashboard() {
  const { user } = useAuth();
  const [results, setResults] = useState<EvaluationResult[]>([]);
  const [isLocal, setIsLocal] = useState(false);
  const [loading, setLoading] = useState(true);

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
          setIsLocal(false);
          setLoading(false);
          return;
        }
      }

      // Fallback to localStorage
      const local = getEvaluationResults();
      if (local.length > 0) {
        setResults(local);
        setIsLocal(true);
      }
      setLoading(false);
    }
    load();
  }, [user]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold font-sans">Dashboard</h1>
          <Link to="/application">
            <Button className="gap-2 cta-gradient border-0 text-primary-foreground">
              <Plus className="h-4 w-4" /> New Evaluation
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="rounded-xl border border-border bg-card p-16 text-center">
            <p className="text-sm text-muted-foreground font-sans">Loading evaluations…</p>
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-16 text-center">
            <ClipboardList className="mx-auto h-10 w-10 text-muted-foreground/50 mb-4" />
            <h2 className="text-lg font-semibold font-sans">No evaluations yet</h2>
            <p className="mt-2 text-sm text-muted-foreground font-sans max-w-sm mx-auto">
              Start your first evaluation to see your results here.
            </p>
            <Link to="/application" className="inline-block mt-6">
              <Button className="gap-2 cta-gradient border-0 text-primary-foreground">
                Start Your First Evaluation <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {isLocal && (
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-3 text-xs text-muted-foreground font-sans mb-2">
                <CloudOff className="h-4 w-4 shrink-0" />
                These results are stored locally and may not persist across devices.
              </div>
            )}
            <h2 className="text-sm font-medium text-muted-foreground font-sans mb-4">
              Evaluation history
            </h2>
            {results.map((r) => (
              <Link
                key={r.id}
                to="/results"
                state={{ result: r }}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md group"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium font-sans truncate">
                    {r.universities.map((u) => u.university).join(', ')}
                  </div>
                  <div className="text-xs text-muted-foreground font-sans mt-1">
                    {formatDistanceToNow(new Date(r.timestamp), { addSuffix: true })} · {r.universities.length}{' '}
                    {r.universities.length === 1 ? 'university' : 'universities'}
                  </div>
                </div>
                <span className="text-sm font-medium text-muted-foreground font-sans group-hover:text-primary transition-colors ml-4 shrink-0">
                  View Results →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
