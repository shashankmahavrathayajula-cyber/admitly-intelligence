import { ApplicationData } from '@/types/application';
import { UniversityEvaluation, EvaluationError } from '@/types/evaluation';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function buildRequestPayload(data: ApplicationData) {
  return {
    application: {
      academics: {
        gpa: data.academics.gpa ?? 0,
        courseRigor: data.academics.courseRigor || undefined,
        ...(data.academics.satScore || data.academics.actScore
          ? {
              tests: {
                ...(data.academics.satScore ? { sat: data.academics.satScore } : {}),
                ...(data.academics.actScore ? { act: data.academics.actScore } : {}),
              },
            }
          : {}),
      },
      activities: data.activities.map((a) => ({
        name: a.name,
        role: a.role,
        description: a.description,
        yearsActive: a.yearsActive,
        isLeadership: a.isLeadership,
      })),
      honors: data.honors.map((h) => ({
        title: h.title,
        level: h.level,
        year: h.year,
      })),
      essays: {
        personalStatement: data.essays.personalStatement,
      },
      intendedMajor: data.academics.intendedMajor,
    },
    universities: data.universities,
  };
}

export async function evaluateApplication(
  data: ApplicationData
): Promise<UniversityEvaluation[]> {
  const payload = buildRequestPayload(data);

  const { data: { session } } = await supabase.auth.getSession();

  if (import.meta.env.DEV) {
    console.log('[Admitly] Calling backend evaluation API', {
      url: `${API_BASE_URL}/api/evaluateApplication`,
      payload,
    });
  }

  const response = await fetch(`${API_BASE_URL}/api/evaluateApplication`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(session?.access_token && {
        Authorization: `Bearer ${session.access_token}`,
      }),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    if (response.status === 401) {
      toast.error('Please sign in to run an evaluation');
      window.location.href = '/login';
      throw { message: 'Unauthorized', code: '401', retryable: false } as EvaluationError;
    }
    if (response.status === 429) {
      toast.error("You've reached your daily evaluation limit. Try again tomorrow.");
      throw { message: 'Rate limited', code: '429', retryable: false } as EvaluationError;
    }
    const errorData = await response.json().catch(() => ({}));
    if (import.meta.env.DEV) {
      console.error('[Admitly] Backend evaluation failed', { status: response.status, errorData });
    }
    const error: EvaluationError = {
      message: errorData.message || `Evaluation failed (${response.status})`,
      code: errorData.code || String(response.status),
      retryable: response.status >= 500,
    };
    throw error;
  }

  const results: UniversityEvaluation[] = await response.json();

  if (import.meta.env.DEV) {
    console.log('[Admitly] Evaluation response received', results);
  }

  return results.map(r => ({
    ...r,
    alignmentScore: Math.round((r.alignmentScore ?? 0) * 10),
    academicStrength: Math.round((r.academicStrength ?? 0) * 10),
    activityImpact: Math.round((r.activityImpact ?? 0) * 10),
    honorsAwards: Math.round((r.honorsAwards ?? 0) * 10),
    narrativeStrength: Math.round((r.narrativeStrength ?? 0) * 10),
    institutionalFit: Math.round((r.institutionalFit ?? 0) * 10),
  }));
}
