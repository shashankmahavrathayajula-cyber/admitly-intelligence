import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

export default function VerifyEmail({ email }: { email: string }) {
  const { resendVerification } = useAuth();
  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    await resendVerification(email);
    setLoading(false);
    setResent(true);
    setTimeout(() => setResent(false), 5000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-20">
        <Card className="w-full max-w-md shadow-lg text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-2xl">Check your email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground font-sans">
              We sent a verification link to <span className="font-semibold text-foreground">{email}</span>. Click it to activate your account and start your free evaluation.
            </p>

            {resent ? (
              <p className="flex items-center justify-center gap-2 text-sm text-green-600 font-sans">
                <CheckCircle2 className="h-4 w-4" /> Verification email resent!
              </p>
            ) : (
              <p className="text-sm text-muted-foreground font-sans">
                Didn't get it?{' '}
                <button
                  onClick={handleResend}
                  disabled={loading}
                  className="text-[hsl(var(--coral))] underline hover:opacity-80 font-medium"
                >
                  {loading ? 'Sending…' : 'Resend verification email'}
                </button>
              </p>
            )}

            <p className="text-xs text-muted-foreground font-sans pt-2">
              Already verified?{' '}
              <Link to="/login" className="text-primary hover:underline font-semibold">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
