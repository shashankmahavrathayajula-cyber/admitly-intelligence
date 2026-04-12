import Logo from '@/components/layout/Logo';

export default function LandingFooter() {
  return (
    <footer className="bg-[#1a1f36] border-t border-white/[0.06] py-8">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Logo variant="light" />
          <span className="text-sm font-sans text-white/40">© 2026</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="/privacy" className="text-sm font-sans text-white/40 hover:text-white/60 transition-colors">
            Privacy Policy
          </a>
          <a href="/terms" className="text-sm font-sans text-white/40 hover:text-white/60 transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
