import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admitly-backend.onrender.com';

export type UserTier = 'free' | 'season_pass' | 'premium';

interface TierContextType {
  tier: UserTier;
  loading: boolean;
  refreshTier: () => Promise<void>;
  showPricing: boolean;
  setShowPricing: (v: boolean) => void;
}

const TierContext = createContext<TierContextType | undefined>(undefined);

export function TierProvider({ children }: { children: React.ReactNode }) {
  const { session, isAuthenticated } = useAuth();
  const [tier, setTier] = useState<UserTier>('free');
  const [loading, setLoading] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const lastKnownTier = useRef<UserTier>('free');

  const fetchTier = useCallback(async (): Promise<boolean> => {
    if (!session?.access_token) return false;
    try {
      const res = await fetch(`${API_BASE_URL}/api/user-tier`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.status === 401) {
        setTier('free');
        lastKnownTier.current = 'free';
        return true;
      }
      if (res.ok) {
        const data = await res.json();
        const newTier = (data.tier || 'free') as UserTier;
        setTier(newTier);
        lastKnownTier.current = newTier;
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [session?.access_token]);

  const refreshTier = useCallback(async () => {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const success = await fetchTier();
      if (!success) {
        // Retry once after 3 seconds
        await new Promise(resolve => setTimeout(resolve, 3000));
        const retrySuccess = await fetchTier();
        if (!retrySuccess) {
          // Keep last known tier instead of defaulting to free
          setTier(lastKnownTier.current);
          toast.error('Could not verify your subscription status. Some features may appear locked. Please refresh the page.');
        }
      }
    } finally {
      setLoading(false);
    }
  }, [session?.access_token, fetchTier]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshTier();
    } else {
      setTier('free');
      lastKnownTier.current = 'free';
    }
  }, [isAuthenticated, refreshTier]);

  return (
    <TierContext.Provider value={{ tier, loading, refreshTier, showPricing, setShowPricing }}>
      {children}
    </TierContext.Provider>
  );
}

export function useTier() {
  const ctx = useContext(TierContext);
  if (!ctx) throw new Error('useTier must be used within TierProvider');
  return ctx;
}

export async function handleCheckout(tier: 'season_pass' | 'premium', accessToken: string) {
  const res = await fetch(`${API_BASE_URL}/api/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ tier }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || 'Checkout failed. Please try again.');
  }
  const data = await res.json();
  if (data.url) window.location.href = data.url;
}
