import { ArrowLeft } from 'lucide-react';

export default function AIPolicy() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => window.history.back()} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <h1 className="text-3xl font-bold text-foreground mb-1">AI Transparency Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: April 2026</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed font-sans">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">How Admitly uses artificial intelligence</h2>
            <p>Admitly uses AI to help you understand how your college application aligns with each university's admissions priorities. Here is exactly how AI is and isn't used in our product.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">What AI does in Admitly</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Generates written feedback on your essays, including specific suggestions for improvement tied to each school's stated priorities</li>
              <li>Creates personalized action plans based on your evaluation results, recommending where to focus your effort for maximum impact</li>
              <li>Produces the "Core Insight" and "Recommended Next Step" summaries that contextualize your scores for each school</li>
              <li>Powers the essay analyzer's before-and-after rewrite suggestions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">What AI does NOT do in Admitly</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>AI does not calculate your scores.</strong> All numeric scores (alignment score, academic strength, activity impact, honors, narrative strength, institutional fit) are calculated using a deterministic, rule-based scoring engine built on publicly available Common Data Set information. The same profile always produces the same scores — no AI variability.</li>
              <li><strong>AI does not decide your reach/target/safety classification.</strong> These bands are calculated mathematically based on your scores and each school's selectivity data.</li>
              <li><strong>AI does not have access to any university's internal admissions database,</strong> applicant pool, or decision-making systems. Our evaluations are based on publicly available data only.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">How your data is handled by AI</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>When you use the essay analyzer or gap analysis, your profile data and essay text are sent to OpenAI's API for processing. This data is used solely to generate your personalized feedback in real time.</li>
              <li>OpenAI's API data usage policy states that data sent via the API is not used to train their models. Your essays and profile information are not retained by OpenAI after processing.</li>
              <li>We do not use your data to train any AI models — not ours, not anyone else's.</li>
              <li>Your profile data is never combined with other users' data for AI processing. Each evaluation is independent.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">AI limitations you should know</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>AI-generated feedback (essay suggestions, action plans, core insights) may occasionally contain inaccuracies or miss important context. Always review AI suggestions critically and discuss major decisions with a school counselor or trusted adult.</li>
              <li>AI cannot assess subjective qualities that admissions officers consider: the tone of your recommendation letters, the impression you make in interviews, or the nuances of your personal circumstances that don't appear in a profile form.</li>
              <li>AI feedback reflects patterns in language and publicly available admissions data. It cannot predict how a specific admissions officer will react to your application.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Our commitment</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>We will always be transparent about where AI is and isn't used in our product.</li>
              <li>We will never present AI-generated content as human expert opinion.</li>
              <li>We will clearly label AI-generated suggestions with appropriate disclaimers.</li>
              <li>If our AI capabilities change, we will update this policy and notify active users.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Questions</h2>
            <p>If you have questions about how Admitly uses AI, reach out to us. (Contact email coming soon — check the website footer for updates.)</p>
          </section>
        </div>
      </div>
    </div>
  );
}
