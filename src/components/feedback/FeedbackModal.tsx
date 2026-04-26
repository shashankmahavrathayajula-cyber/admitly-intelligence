import { useEffect, useState } from 'react';
import { Bug, GraduationCap, Lightbulb, MessageSquare, X, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SUPPORTED_UNIVERSITIES } from '@/lib/universities';

// Common nicknames / abbreviations → canonical school name
const SCHOOL_ALIASES: Record<string, string> = {
  'mit': 'Massachusetts Institute of Technology',
  'ucla': 'University of California, Los Angeles',
  'ucb': 'University of California, Berkeley',
  'cal': 'University of California, Berkeley',
  'berkeley': 'University of California, Berkeley',
  'ucsd': 'University of California, San Diego',
  'ucd': 'University of California, Davis',
  'usc': 'University of Southern California',
  'nyu': 'New York University',
  'gatech': 'Georgia Institute of Technology',
  'georgia tech': 'Georgia Institute of Technology',
  'ut austin': 'The University of Texas at Austin',
  'ut-austin': 'The University of Texas at Austin',
  'utexas': 'The University of Texas at Austin',
  'texas': 'The University of Texas at Austin',
  'penn': 'University of Pennsylvania',
  'upenn': 'University of Pennsylvania',
  'umich': 'University of Michigan – Ann Arbor',
  'michigan': 'University of Michigan – Ann Arbor',
  'uiuc': 'University of Illinois Urbana-Champaign',
  'illinois': 'University of Illinois Urbana-Champaign',
  'uw': 'University of Washington',
  'uva': 'University of Virginia',
  'uf': 'University of Florida',
  'wsu': 'Washington State University',
  'columbia': 'Columbia University in the City of New York',
};

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}

function findSupportedMatch(input: string): string | null {
  const q = normalize(input);
  if (q.length < 3) return null;

  // Exact alias match
  if (SCHOOL_ALIASES[q]) return SCHOOL_ALIASES[q];

  // Alias substring (e.g. user types "ucla campus")
  for (const [alias, full] of Object.entries(SCHOOL_ALIASES)) {
    if (q === alias || q.split(' ').includes(alias)) return full;
  }

  // Direct substring match against supported list (case-insensitive)
  for (const school of SUPPORTED_UNIVERSITIES) {
    const ns = normalize(school);
    if (ns.includes(q) || q.includes(ns)) return school;
  }

  // Token-based partial match: every input token must appear in school name
  const tokens = q.split(' ').filter((t) => t.length >= 3 && t !== 'university' && t !== 'the' && t !== 'of');
  if (tokens.length === 0) return null;
  for (const school of SUPPORTED_UNIVERSITIES) {
    const ns = normalize(school);
    if (tokens.every((t) => ns.includes(t))) return school;
  }

  return null;
}

export type FeedbackType = 'bug' | 'school_request' | 'feature_request' | 'general';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: FeedbackType;
}

const CONFIG: Record<FeedbackType, {
  title: string;
  Icon: React.ComponentType<{ className?: string }>;
  submitLabel: string;
  field1: { label: string; placeholder: string; required: boolean; multiline: boolean };
  field2: { label: string; placeholder: string; required: boolean; multiline: boolean };
  showPageUrl?: boolean;
}> = {
  bug: {
    title: 'Report a bug',
    Icon: Bug,
    submitLabel: 'Submit report',
    field1: { label: 'What happened?', placeholder: 'Describe what went wrong...', required: true, multiline: true },
    field2: { label: 'What did you expect?', placeholder: 'What should have happened...', required: false, multiline: true },
    showPageUrl: true,
  },
  school_request: {
    title: 'Request a school',
    Icon: GraduationCap,
    submitLabel: 'Submit request',
    field1: { label: 'School name', placeholder: 'e.g., Georgetown University', required: true, multiline: false },
    field2: { label: 'Why this school?', placeholder: 'Are you applying here? Any details help us prioritize...', required: false, multiline: true },
  },
  feature_request: {
    title: 'Request a feature',
    Icon: Lightbulb,
    submitLabel: 'Submit request',
    field1: { label: 'What feature would you like?', placeholder: 'Describe the feature in a sentence...', required: true, multiline: false },
    field2: { label: 'How would this help you?', placeholder: 'Tell us how this would improve your experience...', required: false, multiline: true },
  },
  general: {
    title: 'Send feedback',
    Icon: MessageSquare,
    submitLabel: 'Send feedback',
    field1: { label: 'Subject', placeholder: "What's on your mind?", required: false, multiline: false },
    field2: { label: 'Your feedback', placeholder: 'We read every piece of feedback...', required: true, multiline: true },
  },
};

export default function FeedbackModal({ isOpen, onClose, type }: FeedbackModalProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const cfg = CONFIG[type];
  const [field1, setField1] = useState('');
  const [field2, setField2] = useState('');
  const [pageUrl, setPageUrl] = useState('');
  const [editingUrl, setEditingUrl] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supportedMatch, setSupportedMatch] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setField1('');
      setField2('');
      setPageUrl(typeof window !== 'undefined' ? window.location.href : '');
      setEditingUrl(false);
      setSubmitting(false);
      setSuccess(false);
      setError(null);
      setSupportedMatch(null);
    }
  }, [isOpen, type]);

  // Debounced school match check (300ms, 3+ chars)
  useEffect(() => {
    if (type !== 'school_request') {
      setSupportedMatch(null);
      return;
    }
    if (field1.trim().length < 3) {
      setSupportedMatch(null);
      return;
    }
    const t = setTimeout(() => {
      setSupportedMatch(findSupportedMatch(field1));
    }, 300);
    return () => clearTimeout(t);
  }, [field1, type]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (type === 'school_request' && supportedMatch) return;

    // Determine subject + description based on type
    let subject: string | null = null;
    let description = '';

    if (type === 'bug') {
      subject = cfg.title;
      description = `What happened: ${field1}` + (field2 ? `\n\nExpected: ${field2}` : '');
    } else if (type === 'school_request') {
      subject = field1;
      description = field2 || `Requested school: ${field1}`;
    } else if (type === 'feature_request') {
      subject = field1;
      description = field2 || field1;
    } else {
      subject = field1 || cfg.title;
      description = field2;
    }

    if (!description.trim() && !field1.trim()) {
      setError('Please fill in the required field.');
      return;
    }

    setSubmitting(true);
    try {
      const { error: insertError } = await supabase.from('user_feedback').insert({
        user_id: user?.id ?? null,
        user_email: user?.email ?? null,
        type,
        subject,
        description: description.trim(),
        page_url: pageUrl || null,
      });
      if (insertError) throw insertError;
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('[FeedbackModal] insert failed', err);
      setError('Something went wrong. Please try again or email us at hello@useadmitly.com.');
    } finally {
      setSubmitting(false);
    }
  };

  const Icon = cfg.Icon;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fef2ed] text-[#e85d3a]">
            <Icon className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">{cfg.title}</h2>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 mb-3">
              <CheckCircle2 className="h-6 w-6 text-teal-600" />
            </div>
            <p className="text-base font-medium text-teal-700">Thank you! We've received your feedback.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {cfg.field1.label}{cfg.field1.required && <span className="text-[#e85d3a]"> *</span>}
              </label>
              {cfg.field1.multiline ? (
                <textarea
                  value={field1}
                  onChange={(e) => setField1(e.target.value)}
                  required={cfg.field1.required}
                  placeholder={cfg.field1.placeholder}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#e85d3a] focus:ring-1 focus:ring-[#e85d3a]/20"
                />
              ) : (
                <input
                  type="text"
                  value={field1}
                  onChange={(e) => setField1(e.target.value)}
                  required={cfg.field1.required}
                  placeholder={cfg.field1.placeholder}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#e85d3a] focus:ring-1 focus:ring-[#e85d3a]/20"
                />
              )}
            {type === 'school_request' && supportedMatch && (
              <div className="mt-2 rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm text-teal-800">
                <p>
                  Great news — <span className="font-semibold">{supportedMatch}</span> is already supported! You can evaluate your application against it on the Evaluate tab.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate(`/dashboard?tab=evaluate&school=${encodeURIComponent(supportedMatch)}`);
                  }}
                  className="mt-2 inline-flex items-center gap-1 font-medium text-teal-700 hover:text-teal-900"
                >
                  Go to Evaluate →
                </button>
              </div>
            )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {cfg.field2.label}{cfg.field2.required && <span className="text-[#e85d3a]"> *</span>}
              </label>
              {cfg.field2.multiline ? (
                <textarea
                  value={field2}
                  onChange={(e) => setField2(e.target.value)}
                  required={cfg.field2.required}
                  placeholder={cfg.field2.placeholder}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#e85d3a] focus:ring-1 focus:ring-[#e85d3a]/20"
                />
              ) : (
                <input
                  type="text"
                  value={field2}
                  onChange={(e) => setField2(e.target.value)}
                  required={cfg.field2.required}
                  placeholder={cfg.field2.placeholder}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#e85d3a] focus:ring-1 focus:ring-[#e85d3a]/20"
                />
              )}
            </div>

            {cfg.showPageUrl && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Which page were you on?</label>
                {editingUrl ? (
                  <input
                    type="text"
                    value={pageUrl}
                    onChange={(e) => setPageUrl(e.target.value)}
                    onBlur={() => setEditingUrl(false)}
                    autoFocus
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#e85d3a] focus:ring-1 focus:ring-[#e85d3a]/20"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditingUrl(true)}
                    className="w-full text-left rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 truncate"
                    title="Click to edit"
                  >
                    {pageUrl || '(unknown)'}
                  </button>
                )}
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !!supportedMatch}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#e85d3a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#d44e2c] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                cfg.submitLabel
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}