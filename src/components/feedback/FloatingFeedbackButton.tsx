import { useEffect, useRef, useState } from 'react';
import { Bug, GraduationCap, Lightbulb, MessageSquare } from 'lucide-react';
import FeedbackModal, { type FeedbackType } from './FeedbackModal';

const OPTIONS: { type: FeedbackType; label: string; Icon: React.ComponentType<{ className?: string }>; emoji: string }[] = [
  { type: 'bug', label: 'Report a bug', Icon: Bug, emoji: '🐛' },
  { type: 'school_request', label: 'Request a school', Icon: GraduationCap, emoji: '🏫' },
  { type: 'feature_request', label: 'Request a feature', Icon: Lightbulb, emoji: '💡' },
  { type: 'general', label: 'Send feedback', Icon: MessageSquare, emoji: '💬' },
];

export default function FloatingFeedbackButton() {
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

  return (
    <>
      <div ref={ref} className="fixed bottom-5 right-5 z-50">
        {open && (
          <div className="absolute bottom-14 right-0 w-56 rounded-xl bg-white shadow-lg border border-gray-100 p-2">
            {OPTIONS.map((opt) => (
              <button
                key={opt.type}
                onClick={() => {
                  setModalType(opt.type);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span className="text-base leading-none">{opt.emoji}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Open feedback menu"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1a1f36] text-white shadow-md hover:shadow-xl transition-shadow"
        >
          <MessageSquare className="h-4 w-4" />
        </button>
      </div>
      {modalType && (
        <FeedbackModal isOpen onClose={() => setModalType(null)} type={modalType} />
      )}
    </>
  );
}