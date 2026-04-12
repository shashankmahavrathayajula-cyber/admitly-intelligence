import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import VerifyEmail from '@/pages/VerifyEmail';
import { Check, X } from 'lucide-react';
import { isValidEmailFormat, isBlockedDomain, getSuggestedEmail } from '@/lib/emailValidation';

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const { signUp, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const pwChecks = useMemo(() => [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', met: /[a-z]/.test(password) },
    { label: 'One number', met: /[0-9]/.test(password) },
    { label: 'One special character (!@#$%...)', met: /[!@#$%^&*()_+\-=\[\]{}|;:',.<>?/]/.test(password) },
  ], [password]);

  const allPwMet = pwChecks.every(c => c.met);
  const confirmMismatch = confirm.length > 0 && password !== confirm;

  const emailFormatValid = email.length === 0 || isValidEmailFormat(email);
  const emailBlocked = email.length > 0 && isValidEmailFormat(email) && isBlockedDomain(email);
  const suggestedEmail = email.length > 0 ? getSuggestedEmail(email) : null;
  const emailValid = email.length > 0 && isValidEmailFormat(email) && !isBlockedDomain(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password || !confirm) { setError('Please fill in all fields.'); return; }
    if (!emailValid) { setError('Please enter a valid email address.'); return; }
    if (!allPwMet) { setError('Password does not meet all requirements.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    const { error } = await signUp(name, email, password);
    setLoading(false);
    // Always show verification screen regardless of error (prevents enumeration)
    setShowVerify(true);
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
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => { setEmail(e.target.value); setEmailExists(false); setEmailTouched(true); }} onBlur={() => setEmailTouched(true)} />
                {emailTouched && email.length > 0 && !emailFormatValid && (
                  <p className="text-xs text-destructive font-sans mt-1">Please enter a valid email address</p>
                )}
                {emailBlocked && (
                  <p className="text-xs text-destructive font-sans mt-1">Please use a real email address. Disposable and temporary emails are not allowed.</p>
                )}
                {suggestedEmail && (
                  <button type="button" onClick={() => setEmail(suggestedEmail)} className="text-xs text-primary font-sans mt-1 underline hover:opacity-80 cursor-pointer block">
                    Did you mean {suggestedEmail}?
                  </button>
                )}
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
                {password.length > 0 && (
                  <div className="flex flex-col gap-1 mt-1.5">
                    {pwChecks.map((c) => (
                      <div key={c.label} className={`flex items-center gap-1.5 text-xs font-sans ${c.met ? 'text-teal-600' : 'text-muted-foreground'}`}>
                        {c.met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        {c.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm" className="font-sans">Confirm Password</Label>
                <Input id="confirm" type="password" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                {confirmMismatch && (
                  <p className="text-xs text-destructive font-sans mt-1">Passwords don't match</p>
                )}
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
              <Button type="submit" className="w-full cta-gradient border-0 text-primary-foreground" disabled={loading || !ageConfirmed || !termsAccepted || !allPwMet || confirmMismatch || !confirm || !emailValid}>
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
