import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, TrendingUp, Target, Shield } from 'lucide-react';

const MOCK_REACHES = [
  { university: 'Stanford University', score: 4.8 },
  { university: 'Yale University', score: 5.1 },
  { university: 'Columbia University', score: 4.5 },
];
const MOCK_TARGETS = [
  { university: 'University of Virginia', score: 6.8 },
  { university: 'Georgia Institute of Technology', score: 6.5 },
  { university: 'University of Michigan', score: 7.0 },
  { university: 'NYU', score: 6.2 },
];
const MOCK_SAFETIES = [
  { university: 'University of Washington', score: 8.1 },
  { university: 'Purdue University', score: 8.4 },
];

function scoreColor(s: number) {
  if (s >= 7) return 'text-teal-600';
  if (s >= 5) return 'text-amber-600';
  return 'text-red-600';
}

function MockCard({ university, score, band }: { university: string; score: number; band: string }) {
  const badgeClass =
    band === 'reach' ? 'bg-amber-500/15 text-amber-600 border-amber-500/30' :
    band === 'target' ? 'bg-blue-500/15 text-blue-600 border-blue-500/30' :
    'bg-emerald-500/15 text-emerald-600 border-emerald-500/30';
  const borderTop =
    band === 'reach' ? 'border-t-[3px] border-t-[#e85d3a]' :
    band === 'target' ? 'border-t-[3px] border-t-[#0d9488]' :
    'border-t-[3px] border-t-[#16a34a]';
  const Icon = band === 'reach' ? TrendingUp : band === 'target' ? Target : Shield;

  return (
    <div className={`rounded-xl border bg-card p-3.5 space-y-1.5 shadow-sm ${borderTop}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-foreground leading-tight font-sans">{university}</p>
        <Badge className={`shrink-0 text-xs ${badgeClass}`}>
          <Icon className="h-3 w-3" />
          <span className="ml-1 capitalize">{band}</span>
        </Badge>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-xl font-bold ${scoreColor(score)}`}>{score}</span>
        <span className="text-xs text-muted-foreground font-normal">/10</span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">Strong academic profile with competitive positioning…</p>
    </div>
  );
}

function MockSection({ label, schools, band }: { label: string; schools: { university: string; score: number }[]; band: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-2.5">
        <span className="text-sm font-medium text-foreground">{label} ({schools.length})</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {schools.map(s => (
          <MockCard key={s.university} university={s.university} score={s.score} band={band} />
        ))}
      </div>
    </div>
  );
}

interface SchoolListPaywallProps {
  onUpgrade: () => void;
}

export default function SchoolListPaywall({ onUpgrade }: SchoolListPaywallProps) {
  return (
    <div className="relative rounded-xl overflow-hidden">
      {/* Blurred mock preview */}
      <div
        className="pointer-events-none select-none overflow-hidden"
        style={{ filter: 'blur(8px)', maxHeight: 500 }}
        aria-hidden="true"
      >
        <div className="space-y-4 p-1">
          <MockSection label="Reaches" schools={MOCK_REACHES} band="reach" />
          <MockSection label="Targets" schools={MOCK_TARGETS} band="target" />
          <MockSection label="Safeties" schools={MOCK_SAFETIES} band="safety" />
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[1px]">
        <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 text-center space-y-0">
          {/* Lock icon */}
          <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-full bg-[hsl(var(--coral))]/10 mb-4">
            <Lock className="h-6 w-6 text-[hsl(var(--coral))]" />
          </div>

          <h3 className="text-xl font-bold text-foreground">See where you stand at all 25 schools</h3>

          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            The School List Builder evaluates your profile against every supported university and builds your personalized reach, target, and safety list.
          </p>

          <Button
            onClick={onUpgrade}
            className="w-full bg-[hsl(var(--coral))] hover:bg-[hsl(var(--coral))]/90 text-white border-0 rounded-xl py-3 font-semibold mt-6 shadow-lg hover:shadow-xl transition-all"
          >
            Upgrade to Season Pass — $24.99
          </Button>

          <p className="text-xs text-muted-foreground mt-2">One-time purchase · Valid through Jan 2027</p>

          {/* Divider */}
          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground/60">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <button onClick={onUpgrade} className="text-sm text-muted-foreground underline hover:text-foreground transition-colors">
            Get Premium — $39.99
          </button>
        </div>
      </div>
    </div>
  );
}
