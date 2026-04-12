import { ArrowLeft } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => window.history.back()} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <h1 className="text-3xl font-bold text-foreground mb-1">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: April 2026</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed font-sans">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">What we collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Account information:</strong> name, email address, password (hashed, never stored in plain text)</li>
              <li><strong>Application profile data:</strong> GPA, test scores, course information, extracurricular activities, honors/awards, essay text, intended major, university preferences</li>
              <li><strong>Usage data:</strong> evaluation history, essay analyses, feature usage patterns</li>
              <li><strong>Payment information:</strong> processed securely by Stripe — Admitly never sees or stores your credit card number</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">How we use your data</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To generate personalized college admissions evaluations, essay feedback, gap analyses, and school recommendations</li>
              <li>To track your evaluation history so you can review past results</li>
              <li>To improve our evaluation engine using anonymized, aggregated data (no individual profiles are shared)</li>
              <li>To communicate with you about your account and product updates</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">What we do NOT do</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>We do not sell your personal information to universities, advertisers, or any third parties</li>
              <li>We do not share your individual profile data with anyone without your explicit permission</li>
              <li>We do not use your essay text to train AI models — your essays are processed in real-time and not retained for training purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Data storage and security</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Your data is stored securely using Supabase (hosted on AWS) with row-level security policies ensuring you can only access your own data</li>
              <li>All data transmission is encrypted via HTTPS/TLS</li>
              <li>We use industry-standard security practices including input validation, CORS restrictions, and secure authentication</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Your rights</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>You can view all data associated with your account through the dashboard</li>
              <li>You can request deletion of your account and all associated data — we will process deletion requests within 30 days</li>
              <li><strong>California residents:</strong> under the CCPA, you have the right to know what data we collect, request deletion, and opt out of data selling (we don't sell data, so this right is automatically honored)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Age requirement</h2>
            <p>You must be at least 13 years old to create an Admitly account. If we learn that a user is under 13, we will delete their account and data promptly.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Cookies and tracking</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Admitly uses essential cookies for authentication and session management only</li>
              <li>We do not use advertising cookies or third-party tracking pixels</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Changes to this policy</h2>
            <p>We may update this policy from time to time. Material changes will be communicated via email or a notice on the dashboard.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Contact</h2>
            <p>For privacy questions or data deletion requests, email us at the address listed on our website. (Contact email coming soon.)</p>
          </section>
        </div>
      </div>
    </div>
  );
}
