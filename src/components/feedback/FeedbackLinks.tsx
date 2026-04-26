import { useEffect, useRef, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import FeedbackModal, { type FeedbackType } from './FeedbackModal';

interface HelpFeedbackMenuProps {
  variant?: 'light' | 'dark';
}

const OPTIONS: { type: FeedbackType; label: string; emoji: string }[] = [
  { type: 'bug', label: 'Report a bug', emoji: '🐛' },
  { type: 'school_request', label: 'Request a school', emoji: '🏫' },
  { type: 'feature_request', label: 'Request a feature', emoji: '💡' },
  { type: 'general', label: 'Send feedback', emoji: '💬' },
];

export default function HelpFeedbackMenu({ variant = 'light' }: HelpFeedbackMenuProps) {
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState<FeedbackType | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const triggerClass =
    variant === 'dark'
      ? 'text-sm font-sans text-white/40 hover:text-white/60 transition-colors'
      : 'text-sm text-muted-foreground hover:text-foreground transition-colors';

  return (
    <>
      <div ref={ref} className="relative inline-block">
        <button
          onClick={() => setOpen((v) => !v)}
          className={`inline-flex items-center gap-1 ${triggerClass}`}
          aria-expanded={open}
        >
          Help & Feedback
          <ChevronUp
            className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-0' : 'rotate-180'}`}
          />
        </button>
        {open && (
          <div className="absolute bottom-full right-0 mb-2 w-56 rounded-xl bg-white shadow-lg border border-gray-100 p-2 z-50">
            {OPTIONS.map((opt) => (
              <button
                key={opt.type}
                onClick={() => {
                  setModalType(opt.type);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span className="text-base leading-none">{opt.emoji}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {modalType && (
        <FeedbackModal isOpen onClose={() => setModalType(null)} type={modalType} />
      )}
    </>
  );
}