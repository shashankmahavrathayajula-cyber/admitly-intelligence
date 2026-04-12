import { ApplicationData } from '@/types/application';
import { UniversityEvaluation, EvaluationError } from '@/types/evaluation';
import { supabase } from '@/lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admitly-backend.onrender.com';

function buildRequestPayload(data: ApplicationData) {
  return {
    application: {
      academics: {
        gpa: data.academics.gpa ?? 0,
        apCoursesTaken: data.academics.apCoursesTaken ?? undefined,
        apCoursesAvailable: data.academics.apCoursesAvailable ?? undefined,
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
    console.log('[API] Evaluating:', payload.universities?.length ?? 0, 'schools');
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/evaluateApplication`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(session?.access_token && {
          Authorization: `Bearer ${session.access_token}`,
        }),
      },
      body: JSON.stringify(payload),
    });
  } catch {
    // Network-level failure (server unreachable, cold start timeout, etc.)
    throw {
      message: 'Could not connect to the server. Please try again in a moment.',
      code: 'NETWORK_ERROR',
      retryable: true,
    } as EvaluationError;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    if (response.status === 401) {
      window.location.href = '/login';
      throw { message: 'Unauthorized', code: '401', retryable: false } as EvaluationError;
    }

    if (response.status === 403 && errorData.upgradeRequired) {
      throw {
        message: errorData.message || 'Upgrade required',
        code: 'UPGRADE_REQUIRED',
        retryable: false,
      } as EvaluationError;
    }

    if (response.status === 429) {
      throw {
        message: errorData.message || "You've reached your evaluation limit.",
        code: 'LIMIT_REACHED',
        retryable: false,
        limitReached: true,
      } as EvaluationError & { limitReached: boolean };
    }

    if (import.meta.env.DEV) {
      console.error('[API] Evaluation failed:', response.status);
    }

    throw {
      message: errorData.message || `Evaluation failed (${response.status})`,
      code: errorData.code || String(response.status),
      retryable: response.status >= 500,
    } as EvaluationError;
  }

  const results: UniversityEvaluation[] = await response.json();

  if (import.meta.env.DEV) {
    console.log('[API] Evaluation complete:', results.length, 'results');
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
