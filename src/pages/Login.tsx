import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import { isValidEmailFormat, getSuggestedEmail } from '@/lib/emailValidation';
import { AlertTriangle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hashError, setHashError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('error_code=otp_expired')) {
      setHashError('Your verification link has expired. Please sign up again to receive a new link.');
    } else if (hash.includes('error_code=')) {
      setHashError('There was a problem verifying your account. Please try signing in or sign up again.');
    }
  }, []);

  const emailFormatValid = email.length === 0 || isValidEmailFormat(email);
  const suggestedEmail = email.length > 0 ? getSuggestedEmail(email) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (!isValidEmailFormat(email)) { setError('Please enter a valid email address.'); return; }
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-20">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription className="font-sans">Sign in to your Admitly account</CardDescription>
          </CardHeader>
          <CardContent>
            {hashError && (
              <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-3 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <div className="text-sm font-sans text-amber-800">
                  <p>{hashError}</p>
                  <Link to="/signup" className="underline font-semibold mt-1 inline-block">Sign up again →</Link>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-sm text-destructive font-sans">{error}</p>}
              <div className="space-y-2">
                <Label htmlFor="email" className="font-sans">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => { setEmail(e.target.value); setEmailTouched(true); }} onBlur={() => setEmailTouched(true)} />
                {emailTouched && email.length > 0 && !emailFormatValid && (
                  <p className="text-xs text-destructive font-sans mt-1">Please enter a valid email address.</p>
                )}
                {suggestedEmail && (
                  <button type="button" onClick={() => setEmail(suggestedEmail)} className="text-xs text-amber-700 font-sans mt-1 underline hover:opacity-80 cursor-pointer block">
                    Did you mean {suggestedEmail}?
                  </button>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="font-sans">Password</Label>
                </div>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full cta-gradient border-0 text-primary-foreground" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign In'}
              </Button>
              <p className="text-center text-sm text-muted-foreground font-sans">
                Forgot your password?{' '}
                <Link to="/reset-password" className="text-primary hover:underline font-semibold">Reset it here →</Link>
              </p>
              <p className="text-center text-sm text-muted-foreground font-sans">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:underline font-semibold">Sign up</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
