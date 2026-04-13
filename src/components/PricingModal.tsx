import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Check, Crown, Sparkles, Zap } from 'lucide-react';
import { useTier, handleCheckout } from '@/contexts/TierContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admitly-backend.onrender.com';

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
      '10 essay analyses per day with before/after rewrites',
      '5 gap analyses & action plans per day',
      'School list builder',
      'Re-evaluate after improvements',
    ],
    borderClass: 'border-[#e85d3a]',
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
      '20 essay analyses per day · 10 action plans per day',
      'Counselor summary PDF export',
      'Priority evaluation processing',
      'Early access to new schools',
    ],
    borderClass: 'border-purple-500',
    highlighted: false,
  },
];

export default function PricingModal() {
  const { tier: currentTier, showPricing, setShowPricing, refreshTier } = useTier();
  const { session } = useAuth();
  const [showPromo, setShowPromo] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

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

  const onRedeemPromo = async () => {
    if (!promoCode.trim() || !session?.access_token) return;
    setPromoError('');
    setPromoLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/promo/redeem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ code: promoCode.trim().toUpperCase() }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(data.message || 'Promo code redeemed!');
        await refreshTier();
        setShowPricing(false);
        setShowPromo(false);
        setPromoCode('');
        return;
      }

      if (res.status === 404) {
        setPromoError('Invalid or expired promo code');
      } else if (res.status === 410) {
        const data = await res.json().catch(() => ({}));
        setPromoError(data.message || 'This promo code has expired or reached its usage limit.');
      } else if (res.status === 409) {
        setPromoError('You already have Premium access');
      } else {
        setPromoError('Something went wrong. Please try again.');
      }
    } catch {
      setPromoError('Could not connect. Try again.');
    } finally {
      setPromoLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setShowPricing(open);
    if (!open) {
      setShowPromo(false);
      setPromoCode('');
      setPromoError('');
    }
  };

  return (
    <Dialog open={showPricing} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-semibold text-foreground">
            Upgrade your plan
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            One-time payment — no subscription, no recurring charges.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 sm:px-6 pb-4">
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

        {currentTier === 'free' && (
          <div className="px-6 pb-6 text-center">
            {!showPromo ? (
              <button
                onClick={() => setShowPromo(true)}
                className="text-sm text-muted-foreground underline hover:text-foreground transition-colors"
              >
                Have a promo code?
              </button>
            ) : (
              <div className="max-w-xs mx-auto space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoError(''); }}
                    className="uppercase text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && onRedeemPromo()}
                  />
                  <Button
                    onClick={onRedeemPromo}
                    disabled={!promoCode.trim() || promoLoading}
                    className="bg-[#e85d3a] hover:bg-[#d14e2e] text-white border-0 px-4 text-sm shrink-0"
                    size="default"
                  >
                    {promoLoading ? 'Redeeming…' : 'Redeem'}
                  </Button>
                </div>
                {promoError && (
                  <p className="text-sm text-destructive text-left">{promoError}</p>
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
