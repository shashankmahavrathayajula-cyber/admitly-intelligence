import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getEvaluationResults, getDrafts } from '@/services/storage';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Plus, FileText, Clock, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const results = getEvaluationResults();
  const drafts = getDrafts();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground font-sans">Your evaluations and drafts at a glance.</p>
          </div>
          <Link to="/application">
            <Button className="gap-2 cta-gradient border-0 text-primary-foreground">
              <Plus className="h-4 w-4" /> New Evaluation
            </Button>
          </Link>
        </div>

        {/* Recent Evaluations */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold font-sans mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" /> Recent Evaluations
          </h2>
          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <p className="text-muted-foreground font-sans text-sm mb-4">No evaluations yet. Start your first one!</p>
              <Link to="/application">
                <Button variant="outline" className="gap-2">Get Started <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {results.slice(0, 10).map((r) => (
                <Link
                  key={r.id}
                  to="/results"
                  state={{ result: r }}
                  className="flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
                >
                  <div>
                    <div className="text-sm font-medium font-sans">
                      {r.universities.map((u) => u.university).join(', ')}
                    </div>
                    <div className="text-xs text-muted-foreground font-sans mt-1">
                      {new Date(r.timestamp).toLocaleDateString()} · {r.universities.length} {r.universities.length === 1 ? 'university' : 'universities'}
                    </div>
                  </div>
                  <div className="text-right">
                    {r.universities.map((u) => (
                      <span key={u.university} className="inline-block ml-2 text-sm font-bold font-sans text-primary">
                        {u.alignmentScore}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Saved Drafts */}
        <section>
          <h2 className="text-lg font-semibold font-sans mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" /> Saved Drafts
          </h2>
          {drafts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <p className="text-muted-foreground font-sans text-sm">Your in-progress applications will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {drafts.map((d) => (
                <div key={d.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
                  <div>
                    <div className="text-sm font-medium font-sans">{d.name}</div>
                    <div className="text-xs text-muted-foreground font-sans mt-1">
                      Last updated: {new Date(d.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>
                  <Link to="/application">
                    <Button variant="outline" size="sm">Resume</Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}
