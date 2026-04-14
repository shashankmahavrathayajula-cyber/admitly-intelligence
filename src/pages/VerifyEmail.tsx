import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

export default function VerifyEmail({ email }: { email: string }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-20">
        <Card className="w-full max-w-md shadow-lg text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-500/10">
              <CheckCircle className="h-7 w-7 text-teal-500" />
            </div>
            <CardTitle className="text-2xl">Check your email!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground font-sans">
              We've sent a verification link to <span className="font-semibold text-foreground">{email}</span>. Click the link to activate your account, then come back and sign in.
            </p>
            <p className="text-xs text-muted-foreground font-sans">
              Didn't receive it? Check your spam folder.
            </p>
            <Link to="/login">
              <Button variant="outline" className="mt-2">Back to Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
