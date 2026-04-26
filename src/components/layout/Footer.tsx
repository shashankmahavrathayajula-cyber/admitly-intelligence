import Logo from '@/components/layout/Logo';
import type { ReactNode } from 'react';

interface FooterProps {
  rightSlot?: ReactNode;
}

export default function Footer({ rightSlot }: FooterProps) {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
        <div className="flex items-center gap-4">
          <Logo variant="dark" size="small" />
          <span className="text-sm text-muted-foreground">© 2026</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
          <a href="/terms" className="hover:text-foreground transition-colors">Terms of Service</a>
          <a href="/ai-policy" className="hover:text-foreground transition-colors">AI Transparency</a>
        </div>
        {rightSlot && <div className="flex items-center">{rightSlot}</div>}
      </div>
    </footer>
  );
}
