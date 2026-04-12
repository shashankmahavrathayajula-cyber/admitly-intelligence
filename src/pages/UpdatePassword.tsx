import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import { Check, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const pwChecks = useMemo(() => [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', met: /[a-z]/.test(password) },
    { label: 'One number', met: /[0-9]/.test(password) },
    { label: 'One special character (!@#$%...)', met: /[!@#$%^&*()_+\-=\[\]{}|;:',.<>?/]/.test(password) },
  ], [password]);

  const allMet = pwChecks.every(c => c.met);
  const passwordsMatch = password === confirm;
  const canSubmit = allMet && passwordsMatch && confirm.length > 0;

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => navigate('/login'), 3000);
      return () => clearTimeout(t);
    }
  }, [success, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-20">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Set your new password</CardTitle>
            <CardDescription className="font-sans">
              Choose a strong password for your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-green-600 font-sans font-medium">
                  Password updated! Redirecting to login…
                </p>
                <Link to="/login" className="text-sm text-primary hover:underline font-sans">
                  Go to login now
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-sm text-destructive font-sans">{error}</p>}
                <div className="space-y-2">
                  <Label htmlFor="password" className="font-sans">New password</Label>
                  <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                  {password.length > 0 && (
                    <ul className="space-y-1 mt-1">
                      {pwChecks.map((c) => (
                        <li key={c.label} className={`flex items-center gap-1.5 text-xs ${c.met ? 'text-teal-600' : 'text-muted-foreground'}`}>
                          {c.met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                          {c.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm" className="font-sans">Confirm new password</Label>
                  <Input id="confirm" type="password" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                  {confirm.length > 0 && !passwordsMatch && (
                    <p className="text-xs text-destructive">Passwords don't match</p>
                  )}
                </div>
                <Button type="submit" className="w-full cta-gradient border-0 text-primary-foreground" disabled={!canSubmit || loading}>
                  {loading ? 'Updating…' : 'Update password'}
                </Button>
                <p className="text-center text-sm text-muted-foreground font-sans">
                  <Link to="/login" className="text-primary hover:underline">Back to login</Link>
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
