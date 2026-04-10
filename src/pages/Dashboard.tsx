import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import OverviewContent from '@/components/dashboard/OverviewContent';
import EvaluateContent from '@/components/dashboard/EvaluateContent';
import EssayAnalyzerContent from '@/components/dashboard/EssayAnalyzerContent';
import ActionPlanContent from '@/components/dashboard/ActionPlanContent';
import SchoolListContent from '@/components/dashboard/SchoolListContent';
import { LayoutDashboard, FileSearch, PenTool, Target, GraduationCap } from 'lucide-react';

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
        return <EvaluateContent initialSchool={schoolParam} />;
      case 'essay-analyzer':
        return <EssayAnalyzerContent initialSchool={schoolParam} />;
      case 'action-plan':
        return <ActionPlanContent initialSchool={schoolParam} />;
      case 'school-list':
        return <SchoolListContent onNavigateTab={handleNavigateTab} />;
      default:
        return <OverviewContent onNavigateTab={handleNavigateTab} />;
    }
  }, [activeTab, schoolParam, handleNavigateTab]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Tab bar */}
      <div className="sticky top-16 z-40" style={{ backgroundColor: '#1a1f36' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide -mb-px">
            {TABS.map(({ key, label, icon: Icon }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                    isActive
                      ? 'text-white border-[#e85d3a]'
                      : 'text-gray-500 border-transparent hover:text-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
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
