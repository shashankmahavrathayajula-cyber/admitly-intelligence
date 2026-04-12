import { useApplication } from '@/contexts/ApplicationContext';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

export default function StepReview() {
  const { data } = useApplication();
  const { academics, activities, honors, essays, universities } = data;
  const essayWordCount = essays.personalStatement.trim() ? essays.personalStatement.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-2xl font-semibold">Review Your Application</h2>
        <p className="mt-1 text-sm text-muted-foreground font-sans">
          Review your information before submitting for evaluation.
        </p>
      </div>

      {!academics.gpa && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 font-sans">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          GPA is required — go back to Academics to add it
        </div>
      )}
      {academics.apCoursesTaken === null && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 font-sans">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          AP/IB courses taken is required — go back to Academics to add it
        </div>
      )}
      {essayWordCount < 50 && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 font-sans">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          A personal statement is required (minimum 50 words){essayWordCount > 0 ? ` — currently ${essayWordCount} words` : ''}
        </div>
      )}
      {universities.length === 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 font-sans">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Select at least one university
        </div>
      )}

      {/* Academics */}
      <div className="rounded-xl border border-border bg-card py-5 px-6">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-primary font-sans mb-4">Academics</h3>
        <div className="grid gap-3 sm:grid-cols-3 text-sm font-sans">
          <div>
            <span className="text-muted-foreground">GPA:</span>{' '}
            <span className={academics.gpa ? 'font-medium' : 'text-gray-400 font-normal'}>{academics.gpa ?? 'Not provided'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Course Rigor:</span>{' '}
            <span className={academics.apCoursesTaken !== null ? 'font-medium' : 'text-gray-400 font-normal'}>
              {academics.apCoursesTaken !== null
                ? academics.apCoursesAvailableNotSure
                  ? `${academics.apCoursesTaken} AP/IB courses taken (school offering unknown)`
                  : `${academics.apCoursesTaken}${academics.apCoursesAvailable !== null ? ` of ${academics.apCoursesAvailable}` : ''} AP/IB courses taken`
                : 'Not provided'}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Intended Major:</span>{' '}
            <span className={academics.intendedMajor ? 'font-medium' : 'text-gray-400 font-normal'}>{academics.intendedMajor || 'Not specified'}</span>
          </div>
        </div>
      </div>

      {/* Activities */}
      <div className="rounded-xl border border-border bg-card py-5 px-6">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-primary font-sans mb-4">
          Activities ({activities.length})
        </h3>
        {activities.length === 0 ? (
          <p className="text-sm text-gray-400 font-normal font-sans">No activities added.</p>
        ) : (
          <div className="space-y-3">
            {activities.map((a) => (
              <div key={a.id} className="flex items-start justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0">
                <div>
                  <span className="text-sm font-medium font-sans">{a.name || 'Unnamed'}</span>
                  {a.role && <span className="text-sm text-muted-foreground font-sans"> — {a.role}</span>}
                  {a.isLeadership && <Badge variant="secondary" className="ml-2 text-xs">Leadership</Badge>}
                </div>
                <span className="text-xs text-muted-foreground font-sans">{a.yearsActive}yr</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Honors */}
      <div className="rounded-xl border border-border bg-card py-5 px-6">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-primary font-sans mb-4">
          Honors & Awards ({honors.length})
        </h3>
        {honors.length === 0 ? (
          <p className="text-sm text-gray-400 font-normal font-sans">No honors added.</p>
        ) : (
          <div className="space-y-2">
            {honors.map((h) => (
              <div key={h.id} className="flex items-center justify-between text-sm font-sans">
                <span className="font-medium">{h.title || 'Unnamed'}</span>
                <span className="text-xs text-muted-foreground capitalize">{h.level} · {h.year}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Essay */}
      <div className="rounded-xl border border-border bg-card py-5 px-6">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-primary font-sans mb-4">Personal Statement</h3>
        {essays.personalStatement ? (
          <p className="text-sm text-muted-foreground font-sans line-clamp-4">{essays.personalStatement}</p>
        ) : (
          <p className="text-sm text-gray-400 font-normal font-sans">No essay provided.</p>
        )}
      </div>

      {/* Universities */}
      <div className="rounded-xl border border-border bg-card py-5 px-6">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-primary font-sans mb-4">Target Universities</h3>
        {universities.length === 0 ? (
          <p className="text-sm text-gray-400 font-normal font-sans">No universities selected.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {universities.map((u) => (
              <Badge key={u} variant="secondary" className="font-sans">{u}</Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
