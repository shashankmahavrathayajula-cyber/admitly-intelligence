import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface ScoreLegendProps {
  /** Trigger label shown when collapsed. */
  label?: string;
  /** Heading inside the expanded panel. */
  title: string;
  /** Body content (renderable nodes). */
  children: React.ReactNode;
  className?: string;
}

/**
 * Subtle, collapsible "what do these scores mean?" panel used on results pages.
 * Default-collapsed; expands inline. Style is intentionally muted so it never
 * competes with the actual score cards.
 */
export default function ScoreLegend({
  label = 'What do these scores mean?',
  title,
  children,
  className = '',
}: ScoreLegendProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-xl bg-gray-50 border border-gray-100 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm text-gray-600 hover:text-gray-900 font-sans"
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-1.5">
          <HelpCircle className="h-3.5 w-3.5" />
          {label}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-0 text-sm text-gray-600 font-sans space-y-2">
          <p className="font-semibold text-gray-900">{title}</p>
          {children}
        </div>
      )}
    </div>
  );
}