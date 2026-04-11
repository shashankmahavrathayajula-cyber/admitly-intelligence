import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTier } from '@/contexts/TierContext';
import Logo from '@/components/layout/Logo';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLanding = location.pathname === '/';
  const { isAuthenticated, signOut } = useAuth();
  const { tier, setShowPricing } = useTier();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-xl transition-colors ${
        isLanding
          ? 'bg-[#1a1f36]/90 border-b border-white/[0.06]'
          : 'bg-background/80 border-b border-border/50'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo variant={isLanding ? 'light' : 'dark'} />

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  isLanding ? 'text-white/70 hover:text-white' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Dashboard
              </Link>
              {tier === 'free' && (
                <Button
                  size="sm"
                  onClick={() => setShowPricing(true)}
                  className="bg-[#e85d3a] hover:bg-[#d14e2e] text-white border-0 text-xs px-3"
                >
                  Upgrade
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className={isLanding ? 'text-white/70 hover:text-white hover:bg-white/10' : ''}
              >
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className={isLanding ? 'text-white/70 hover:text-white hover:bg-white/10' : ''}
                >
                  Log In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="cta-gradient border-0 text-white hover:opacity-90">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? (
            <X className={`h-5 w-5 ${isLanding ? 'text-white' : ''}`} />
          ) : (
            <Menu className={`h-5 w-5 ${isLanding ? 'text-white' : ''}`} />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className={`border-t px-4 pb-4 pt-2 md:hidden ${
            isLanding
              ? 'border-white/10 bg-[#1a1f36]'
              : 'border-border bg-background'
          }`}
        >
          <div className="flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`text-sm ${isLanding ? 'text-white/70' : 'text-muted-foreground'}`}
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                {tier === 'free' && (
                  <Button
                    size="sm"
                    className="w-full bg-[#e85d3a] hover:bg-[#d14e2e] text-white border-0 text-xs"
                    onClick={() => { setShowPricing(true); setMobileOpen(false); }}
                  >
                    Upgrade
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full ${isLanding ? 'text-white/70 hover:bg-white/10' : ''}`}
                  onClick={() => { handleSignOut(); setMobileOpen(false); }}
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" size="sm" className={`w-full ${isLanding ? 'text-white/70 hover:bg-white/10' : ''}`}>
                    Log In
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full cta-gradient border-0 text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
