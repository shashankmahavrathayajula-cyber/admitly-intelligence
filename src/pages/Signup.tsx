import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import VerifyEmail from '@/pages/VerifyEmail';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [emailExists, setEmailExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailExists(false);
    if (!name || !email || !password || !confirm) { setError('Please fill in all fields.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    const { error } = await signUp(name, email, password);
    setLoading(false);
    if (error) {
      const msg = error.message?.toLowerCase() ?? '';
      if (msg.includes('already registered') || msg.includes('already been registered') || msg.includes('user already registered')) {
        setEmailExists(true);
      } else {
        setError(error.message);
      }
    } else {
      setShowVerify(true);
    }
  };

  if (showVerify) {
    return <VerifyEmail email={email} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-20">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <CardDescription className="font-sans">Start your admissions intelligence journey</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-sm text-destructive font-sans">{error}</p>}
              <div className="space-y-2">
                <Label htmlFor="name" className="font-sans">Full Name</Label>
                <Input id="name" placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-sans">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => { setEmail(e.target.value); setEmailExists(false); }} />
                {emailExists && (
                  <p className="text-sm text-destructive font-sans mt-1">
                    An account with this email already exists.{' '}
                    <Link to="/login" className="text-primary font-semibold underline hover:opacity-80">Sign in instead →</Link>
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-sans">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm" className="font-sans">Confirm Password</Label>
                <Input id="confirm" type="password" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
              </div>
              <div className="space-y-3 pt-1">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" checked={ageConfirmed} onChange={(e) => setAgeConfirmed(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-border accent-primary" />
                  <span className="text-sm text-muted-foreground font-sans">I confirm that I am at least 13 years old</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-border accent-primary" />
                  <span className="text-sm text-muted-foreground font-sans">
                    I agree to the{' '}
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--coral))] underline hover:opacity-80">Terms of Service</a>
                    ,{' '}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--coral))] underline hover:opacity-80">Privacy Policy</a>
                    , and{' '}
                    <a href="/ai-policy" target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--coral))] underline hover:opacity-80">AI Transparency Policy</a>
                  </span>
                </label>
              </div>
              <Button type="submit" className="w-full cta-gradient border-0 text-primary-foreground" disabled={loading || !ageConfirmed || !termsAccepted}>
                {loading ? 'Creating account…' : 'Create Account'}
              </Button>
              <p className="text-center text-sm text-muted-foreground font-sans">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline font-semibold">Sign in</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
