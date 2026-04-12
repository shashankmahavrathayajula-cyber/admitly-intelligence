import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Sparkles, Zap } from 'lucide-react';
import { useTier, handleCheckout, UserTier } from '@/contexts/TierContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const tiers = [
  {
    id: 'free' as const,
    name: 'Free',
    price: '$0',
    period: '',
    icon: Zap,
    features: [
      '2 evaluations',
      '1 essay analysis',
      '1 gap analysis',
      'No school list builder',
    ],
    borderClass: 'border-border',
    badgeClass: 'bg-muted text-muted-foreground',
    highlighted: false,
  },
  {
    id: 'season_pass' as const,
    name: 'Season Pass',
    price: '$24.99',
    period: 'for the entire application season',
    icon: Sparkles,
    features: [
      'Unlimited evaluations',
      'Unlimited essay analyses with before/after rewrites',
      'Unlimited gap analyses & action plans',
      'School list builder',
      'Re-evaluate after improvements',
    ],
    borderClass: 'border-[#e85d3a]',
    badgeClass: 'bg-[#e85d3a] text-white',
    highlighted: true,
  },
  {
    id: 'premium' as const,
    name: 'Premium',
    price: '$39.99',
    period: 'one-time',
    icon: Crown,
    features: [
      'Everything in Season Pass',
      'Counselor summary PDF export',
      'Priority evaluation processing',
      'Early access to new schools',
    ],
    borderClass: 'border-purple-500',
    badgeClass: 'bg-purple-100 text-purple-700',
    highlighted: false,
  },
];

export default function PricingModal() {
  const { tier: currentTier, showPricing, setShowPricing } = useTier();
  const { session } = useAuth();

  const onCheckout = async (tierId: 'season_pass' | 'premium') => {
    if (!session?.access_token) {
      toast.error('Please sign in first');
      return;
    }
    try {
      await handleCheckout(tierId, session.access_token);
    } catch {
      toast.error('Could not start checkout. Please try again.');
    }
  };

  return (
    <Dialog open={showPricing} onOpenChange={setShowPricing}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-semibold text-foreground">
            Upgrade your plan
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            One-time payment — no subscription, no recurring charges.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 sm:px-6 pb-6">
          {tiers.map((t) => {
            const isCurrent = t.id === currentTier;
            return (
              <div
                key={t.id}
                className={cn(
                  'relative flex flex-col rounded-xl border-2 p-5 transition-shadow',
                  t.borderClass,
                  t.highlighted && 'shadow-lg shadow-[#e85d3a]/10 scale-[1.02] order-first sm:order-none',
                )}
              >
                {/* Badge */}
                {isCurrent ? (
                  <Badge className="absolute -top-2.5 left-4 bg-muted text-muted-foreground text-[10px] px-2">
                    Current plan
                  </Badge>
                ) : t.highlighted ? (
                  <Badge className="absolute -top-2.5 left-4 bg-[#e85d3a] text-white text-[10px] px-2">
                    Best value
                  </Badge>
                ) : null}

                <div className="flex items-center gap-2 mb-3 mt-1">
                  <t.icon className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold text-foreground">{t.name}</h3>
                </div>

                <div className="mb-1">
                  <span className="text-2xl font-bold text-foreground">{t.price}</span>
                </div>
                {t.period && (
                  <p className="text-xs text-muted-foreground mb-4">{t.period}</p>
                )}
                {!t.period && <div className="mb-4" />}

                <ul className="flex-1 space-y-2 mb-5">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
                      <Check className="h-4 w-4 mt-0.5 shrink-0 text-teal-600" />
                      {f}
                    </li>
                  ))}
                </ul>

                {t.id === 'free' ? (
                  <Button variant="outline" disabled className="w-full">
                    {isCurrent ? 'Current plan' : 'Free'}
                  </Button>
                ) : (
                  <Button
                    disabled={isCurrent}
                    onClick={() => onCheckout(t.id)}
                    className={cn(
                      'w-full',
                      t.id === 'season_pass'
                        ? 'bg-[#e85d3a] hover:bg-[#d14e2e] text-white border-0'
                        : 'bg-purple-600 hover:bg-purple-700 text-white border-0',
                    )}
                  >
                    {isCurrent ? 'Current plan' : `Get ${t.name}`}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
