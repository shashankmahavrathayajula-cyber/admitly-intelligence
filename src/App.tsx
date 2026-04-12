import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useSearchParams } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ApplicationProvider } from "@/contexts/ApplicationContext";
import { TierProvider } from "@/contexts/TierContext";
import PricingModal from "@/components/PricingModal";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import AIPolicy from "./pages/AIPolicy";

const queryClient = new QueryClient();

/** Redirect helper that preserves ?school= param */
function RedirectToTab({ tab }: { tab: string }) {
  const [searchParams] = useSearchParams();
  const school = searchParams.get('school');
  const params = new URLSearchParams({ tab });
  if (school) params.set('school', school);
  return <Navigate to={`/dashboard?${params.toString()}`} replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TierProvider>
        <ApplicationProvider>
          <TooltipProvider>
            <PricingModal />
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              {/* Legacy redirects */}
              <Route path="/application" element={<ProtectedRoute><RedirectToTab tab="evaluate" /></ProtectedRoute>} />
              <Route path="/results" element={<ProtectedRoute><RedirectToTab tab="evaluate" /></ProtectedRoute>} />
              <Route path="/essay-analyzer" element={<ProtectedRoute><RedirectToTab tab="essay-analyzer" /></ProtectedRoute>} />
              <Route path="/gap-analysis" element={<ProtectedRoute><RedirectToTab tab="action-plan" /></ProtectedRoute>} />
              <Route path="/school-list" element={<ProtectedRoute><RedirectToTab tab="school-list" /></ProtectedRoute>} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/ai-policy" element={<AIPolicy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </ApplicationProvider>
        </TierProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
