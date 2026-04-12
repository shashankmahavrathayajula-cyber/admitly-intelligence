import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ArrowRight } from 'lucide-react';

interface RequestSchoolFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RequestSchoolForm({ open, onOpenChange }: RequestSchoolFormProps) {
  const { user } = useAuth();
  const [schoolName, setSchoolName] = useState('');
  const [email, setEmail] = useState(() => user?.email || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!schoolName.trim()) return;
    setSubmitting(true);
    try {
      await supabase.from('school_requests').insert({
        school_name: schoolName.trim(),
        user_email: email.trim() || null,
        user_id: user?.id || null,
      });
      toast.success(`Thanks! We'll notify you when ${schoolName.trim()} is added.`);
      setSchoolName('');
      onOpenChange(false);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Request a school</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-sans">School name</Label>
            <Input
              placeholder="e.g. Cornell University"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-sans">Your email</Label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">We'll email you when it's available.</p>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!schoolName.trim() || submitting}
            className="w-full cta-gradient border-0 text-white"
          >
            {submitting ? 'Submitting…' : 'Submit request'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function RequestSchoolLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-sm text-muted-foreground hover:text-[hsl(var(--coral))] transition-colors font-sans inline-flex items-center gap-1 mt-2"
    >
      Don't see your school? Request it <ArrowRight className="h-3 w-3" />
    </button>
  );
}
