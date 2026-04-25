/**
 * Persistence + staleness detection for the school list builder.
 *
 * Saves the latest school list per user in localStorage so it survives
 * tab switches, page reloads, and browser restarts. A profile snapshot is
 * stored alongside the results so we can detect when the student's
 * profile has changed since the list was built.
 */

export interface ProfileSnapshot {
  gpa: number;
  intendedMajor: string;
  apCoursesTaken: number;
  activitiesCount: number;
  leadershipCount: number;
  honorsCount: number;
  essayLength: number;
}

export interface SavedSchoolList {
  results: any;
  builtAt: string;
  profileSnapshot: ProfileSnapshot;
}

const KEY_PREFIX = 'admitly_school_list_';

function key(userId: string) {
  return `${KEY_PREFIX}${userId}`;
}

export function buildProfileSnapshot(currentProfile: any): ProfileSnapshot {
  const activities = currentProfile?.activities || [];
  return {
    gpa: Number(currentProfile?.academics?.gpa ?? currentProfile?.gpa ?? 0) || 0,
    intendedMajor:
      currentProfile?.academics?.intendedMajor || currentProfile?.intendedMajor || '',
    apCoursesTaken:
      Number(currentProfile?.academics?.apCoursesTaken ?? currentProfile?.apCoursesTaken ?? 0) || 0,
    activitiesCount: Array.isArray(activities) ? activities.length : 0,
    leadershipCount: Array.isArray(activities)
      ? activities.filter((a: any) => a?.isLeadership).length
      : 0,
    honorsCount: Array.isArray(currentProfile?.honors) ? currentProfile.honors.length : 0,
    essayLength: currentProfile?.essays?.personalStatement?.length || 0,
  };
}

export function isSchoolListStale(saved: ProfileSnapshot, currentProfile: any): boolean {
  const current = buildProfileSnapshot(currentProfile);
  return (
    current.gpa !== saved.gpa ||
    current.intendedMajor !== saved.intendedMajor ||
    current.apCoursesTaken !== saved.apCoursesTaken ||
    current.activitiesCount !== saved.activitiesCount ||
    current.leadershipCount !== saved.leadershipCount ||
    current.honorsCount !== saved.honorsCount ||
    Math.abs(current.essayLength - saved.essayLength) > 50
  );
}

export function loadSchoolList(userId: string | undefined | null): SavedSchoolList | null {
  if (!userId || typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.results || !parsed.profileSnapshot) return null;
    return parsed as SavedSchoolList;
  } catch {
    return null;
  }
}

export function saveSchoolList(
  userId: string | undefined | null,
  results: any,
  currentProfile: any,
  builtAt: string = new Date().toISOString(),
): SavedSchoolList | null {
  if (!userId || !results) return null;
  const payload: SavedSchoolList = {
    results,
    builtAt,
    profileSnapshot: buildProfileSnapshot(currentProfile),
  };
  try {
    localStorage.setItem(key(userId), JSON.stringify(payload));
  } catch {
    /* ignore quota errors */
  }
  return payload;
}

export function clearSchoolList(userId: string | undefined | null): void {
  if (!userId) return;
  try {
    localStorage.removeItem(key(userId));
  } catch {
    /* ignore */
  }
}

/** Count reach/target/safety from a school list result object. */
export function countBands(result: any): { reach: number; target: number; safety: number } {
  const reaches = Array.isArray(result?.reaches) ? result.reaches.length : 0;
  const targets = Array.isArray(result?.targets) ? result.targets.length : 0;
  const safeties = Array.isArray(result?.safeties) ? result.safeties.length : 0;
  return { reach: reaches, target: targets, safety: safeties };
}