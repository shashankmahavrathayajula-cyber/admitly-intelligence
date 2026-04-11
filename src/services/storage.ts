import { ApplicationDraft, ApplicationData, createEmptyApplication } from '@/types/application';

const DRAFTS_KEY = 'admitly_drafts';
const CURRENT_DRAFT_KEY = 'admitly_current_draft';

export function saveDraft(draft: ApplicationDraft): void {
  const drafts = getDrafts();
  const idx = drafts.findIndex((d) => d.id === draft.id);
  if (idx >= 0) drafts[idx] = draft;
  else drafts.unshift(draft);
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
}

export function getDrafts(): ApplicationDraft[] {
  try {
    return JSON.parse(localStorage.getItem(DRAFTS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function deleteDraft(id: string): void {
  const drafts = getDrafts().filter((d) => d.id !== id);
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
}

export function saveCurrentDraft(data: ApplicationData): void {
  localStorage.setItem(CURRENT_DRAFT_KEY, JSON.stringify(data));
}

export function getCurrentDraft(): ApplicationData {
  try {
    const raw = localStorage.getItem(CURRENT_DRAFT_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return createEmptyApplication();
}

export function clearCurrentDraft(): void {
  localStorage.removeItem(CURRENT_DRAFT_KEY);
}
