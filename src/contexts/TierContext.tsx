import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

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

  const refreshTier = useCallback(async () => {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/user-tier`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.status === 401) {
        // Session expired — default to free, don't retry
        setTier('free');
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setTier(data.tier || 'free');
      }
    } catch (error) {
      console.error('Failed to fetch user tier:', error);
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    if (isAuthenticated) refreshTier();
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
