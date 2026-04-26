import { useState } from 'react';
import FeedbackModal, { type FeedbackType } from './FeedbackModal';

interface FeedbackLinksProps {
  variant?: 'dashboard' | 'landing';
}

export default function FeedbackLinks({ variant = 'dashboard' }: FeedbackLinksProps) {
  const [openType, setOpenType] = useState<FeedbackType | null>(null);

  const items: { type: FeedbackType; label: string }[] =
    variant === 'landing'
      ? [
          { type: 'bug', label: 'Report a bug' },
          { type: 'general', label: 'Send feedback' },
        ]
      : [
          { type: 'bug', label: 'Report a bug' },
          { type: 'school_request', label: 'Request a school' },
          { type: 'feature_request', label: 'Request a feature' },
          { type: 'general', label: 'Send feedback' },
        ];

  const linkClass =
    variant === 'landing'
      ? 'text-sm font-sans text-white/40 hover:text-white/60 transition-colors'
      : 'text-xs text-gray-400 hover:text-gray-600 transition-colors';

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        {items.map((item, idx) => (
          <span key={item.type} className="inline-flex items-center gap-2">
            <button onClick={() => setOpenType(item.type)} className={linkClass}>
              {item.label}
            </button>
            {idx < items.length - 1 && (
              <span className={variant === 'landing' ? 'text-white/30' : 'text-gray-300'}>·</span>
            )}
          </span>
        ))}
      </div>
      {openType && (
        <FeedbackModal isOpen onClose={() => setOpenType(null)} type={openType} />
      )}
    </>
  );
}