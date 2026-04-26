import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface OnboardingTooltipProps {
  /** Stable tab identifier — used as part of the localStorage key. */
  tabKey: string;
  /** Bold heading shown next to the lightbulb icon. */
  title: string;
  /** 1–2 sentence description shown below the title. */
  description: string;
  /**
   * If true, the tooltip is suppressed entirely (e.g. user already has data
   * on this tab — no need to onboard them).
   */
  suppress?: boolean;
  /** Auto-dismiss delay in ms. Defaults to 10s. */
  autoDismissMs?: number;
}

/**
 * Lightweight, dismissible inline banner shown the first time an authenticated
 * user visits a dashboard tab. Dismissal is persisted per-user in localStorage
 * so each tooltip is shown at most once.
 */
export default function OnboardingTooltip({
  tabKey,
  title,
  description,
  suppress = false,
  autoDismissMs = 10000,
}: OnboardingTooltipProps) {
  const { user } = useAuth();
  const userId = user?.id;
  const storageKey = userId ? `admitly_tooltip_seen_${userId}_${tabKey}` : null;

  // Default to false (hidden) so we never flash the tooltip for users who
  // have already dismissed it. We flip it on in the effect below.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!storageKey || suppress) return;
    try {
      if (localStorage.getItem(storageKey) !== 'true') {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable — fall back to showing once per session.
      setVisible(true);
    }
  }, [storageKey, suppress]);

  const dismiss = () => {
    setVisible(false);
    if (storageKey) {
      try { localStorage.setItem(storageKey, 'true'); } catch { /* ignore */ }
    }
  };

  // Auto-dismiss after the configured delay.
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(dismiss, autoDismissMs);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, autoDismissMs]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative mb-6 rounded-2xl bg-[#1a1f36] text-white p-4 pr-10 shadow-md"
          role="status"
          aria-live="polite"
        >
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss tip"
            className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400/20">
              <Lightbulb className="h-4 w-4 text-amber-300" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold font-sans">{title}</p>
              <p className="mt-1 text-sm text-white/80 font-sans leading-relaxed">{description}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Clear all onboarding tooltip flags for a given user (call on logout). */
export function clearOnboardingTooltips(userId: string): void {
  try {
    const prefix = `admitly_tooltip_seen_${userId}_`;
    const toRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) toRemove.push(key);
    }
    toRemove.forEach((k) => localStorage.removeItem(k));
  } catch {
    // ignore
  }
}