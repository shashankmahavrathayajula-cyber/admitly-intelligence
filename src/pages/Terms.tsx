import { ArrowLeft } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => window.history.back()} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <h1 className="text-3xl font-bold text-foreground mb-1">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: April 2026</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed font-sans">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. What Admitly is</h2>
            <p>Admitly is an AI-powered college admissions evaluation tool that provides informational guidance based on publicly available admissions data and AI analysis. Admitly is not a licensed counseling service, admissions consulting firm, or educational institution.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. No guarantee of outcomes</h2>
            <p>Admitly does not guarantee admission to any university. Evaluation scores, reach/target/safety classifications, essay feedback, action plans, and school recommendations are generated using AI and publicly available Common Data Set information. They are intended as supplementary guidance and should not replace advice from school counselors, admissions professionals, or the universities themselves. Admissions decisions are made solely by universities based on their own criteria, which may change without notice.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. AI-generated content</h2>
            <p>All evaluations, essay feedback, gap analyses, and recommendations are generated using artificial intelligence. While we strive for accuracy, AI-generated content may contain errors or inaccuracies. Users should independently verify important information and use Admitly's output as one input among many in their college planning process.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Acceptable use</h2>
            <p className="mb-2">You agree to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Provide accurate information in your application profile</li>
              <li>Use Admitly for personal college planning purposes only</li>
              <li>Not share your account credentials with others</li>
              <li>Not attempt to reverse-engineer, scrape, or abuse the evaluation engine</li>
              <li>Not submit content that is harmful, illegal, or violates others' rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Account and data</h2>
            <p>You are responsible for maintaining the security of your account. You may request deletion of your account and data at any time. (Contact email coming soon.)</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Payments and refunds</h2>
            <p>All purchases (Season Pass, Premium) are one-time payments processed securely by Stripe. Purchases are valid through January 31 of the following year. Refund requests may be submitted within 7 days of purchase. After 7 days, all sales are final.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Intellectual property</h2>
            <p>Admitly's evaluation engine, university schemas, scoring algorithms, and interface design are the intellectual property of Admitly. Users retain ownership of all content they submit (essays, activity descriptions, etc.).</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Limitation of liability</h2>
            <p>To the maximum extent permitted by law, Admitly and its creators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service, including but not limited to: university admissions decisions, reliance on AI-generated recommendations, or any errors in evaluation scores or feedback. Our total liability shall not exceed the amount you paid for the service.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Modifications</h2>
            <p>We may update these terms from time to time. Continued use of Admitly after changes constitutes acceptance of the updated terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">10. Contact</h2>
            <p>Questions about these terms: contact email coming soon — check the website footer for updates.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
