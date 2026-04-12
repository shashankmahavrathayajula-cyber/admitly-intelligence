import { useCallback, useMemo, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import OverviewContent from '@/components/dashboard/OverviewContent';
import EvaluateContent from '@/components/dashboard/EvaluateContent';
import EssayAnalyzerContent from '@/components/dashboard/EssayAnalyzerContent';
import ActionPlanContent from '@/components/dashboard/ActionPlanContent';
import SchoolListContent from '@/components/dashboard/SchoolListContent';
import { LayoutDashboard, FileSearch, PenTool, Target, GraduationCap, X, CheckCircle2, Info, Mail, ShieldAlert } from 'lucide-react';
import { useTier } from '@/contexts/TierContext';
import { useAuth } from '@/contexts/AuthContext';

const TABS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'evaluate', label: 'Evaluate', icon: FileSearch },
  { key: 'essay-analyzer', label: 'Essay', icon: PenTool },
  { key: 'action-plan', label: 'Plan', icon: Target },
  { key: 'school-list', label: 'Schools', icon: GraduationCap },
] as const;

type TabKey = typeof TABS[number]['key'];

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as TabKey) || 'overview';
  const schoolParam = searchParams.get('school') || undefined;
  const evaluationIdParam = searchParams.get('evalId') || undefined;
  const paymentStatus = searchParams.get('payment');
  const paymentTier = searchParams.get('tier');

  const { refreshTier } = useTier();
  const [banner, setBanner] = useState<{ type: 'success' | 'cancelled'; message: string } | null>(null);

  // Handle payment redirect params
  useEffect(() => {
    if (paymentStatus === 'success') {
      const tierLabel = paymentTier === 'premium' ? 'Premium' : 'Season Pass';
      setBanner({
        type: 'success',
        message: `Welcome to ${tierLabel}! You now have unlimited access to all Admitly tools.`,
      });
      refreshTier();
      // Clean URL params
      const p = new URLSearchParams(searchParams);
      p.delete('payment');
      p.delete('tier');
      setSearchParams(p, { replace: true });
      const timer = setTimeout(() => setBanner(null), 10000);
      return () => clearTimeout(timer);
    } else if (paymentStatus === 'cancelled') {
      setBanner({
        type: 'cancelled',
        message: 'Payment cancelled. You can upgrade anytime from your dashboard.',
      });
      const p = new URLSearchParams(searchParams);
      p.delete('payment');
      p.delete('tier');
      setSearchParams(p, { replace: true });
      const timer = setTimeout(() => setBanner(null), 8000);
      return () => clearTimeout(timer);
    }
  }, []); // run once on mount

  const setTab = useCallback((tab: string, extraParams?: Record<string, string>) => {
    const params: Record<string, string> = { tab };
    if (extraParams) Object.assign(params, extraParams);
    setSearchParams(params, { replace: false });
  }, [setSearchParams]);

  const handleNavigateTab = useCallback((tab: string, params?: Record<string, string>) => {
    setTab(tab, params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setTab]);

  const tabContent = useMemo(() => {
    switch (activeTab) {
      case 'evaluate':
        return <EvaluateContent initialSchool={schoolParam} evaluationId={evaluationIdParam} />;
      case 'essay-analyzer':
        return <EssayAnalyzerContent initialSchool={schoolParam} />;
      case 'action-plan':
        return <ActionPlanContent initialSchool={schoolParam} />;
      case 'school-list':
        return <SchoolListContent onNavigateTab={handleNavigateTab} />;
      default:
        return <OverviewContent onNavigateTab={handleNavigateTab} />;
    }
  }, [activeTab, schoolParam, evaluationIdParam, handleNavigateTab]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Payment banner */}
      {banner && (
        <div
          className={`relative px-4 py-3 text-sm font-medium text-center ${
            banner.type === 'success'
              ? 'bg-teal-50 text-teal-800 border-b border-teal-200'
              : 'bg-amber-50 text-amber-800 border-b border-amber-200'
          }`}
        >
          <span className="inline-flex items-center gap-2">
            {banner.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <Info className="h-4 w-4" />}
            {banner.message}
          </span>
          <button onClick={() => setBanner(null)} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      <div className="sticky top-16 z-40" style={{ backgroundColor: '#1a1f36' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto whitespace-nowrap scrollbar-hide -mb-px">
            {TABS.map(({ key, label, icon: Icon }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex items-center gap-1.5 sm:gap-2 whitespace-nowrap px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-colors border-b-2 shrink-0 ${
                    isActive
                      ? 'text-white border-[#e85d3a]'
                      : 'text-gray-500 border-transparent hover:text-gray-200'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {tabContent}
      </div>

      <Footer />
    </div>
  );
}
