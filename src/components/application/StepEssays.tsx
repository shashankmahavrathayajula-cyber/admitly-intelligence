import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useApplication } from '@/contexts/ApplicationContext';

export default function StepEssays() {
  const { data, updateSection } = useApplication();
  const { essays } = data;
  const charCount = essays.personalStatement.length;
  const wordCount = essays.personalStatement.trim() ? essays.personalStatement.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-2xl font-semibold">Personal Statement</h2>
        <p className="mt-1 text-sm text-muted-foreground font-sans">
          Paste or write your personal essay. This helps our AI evaluate your narrative strength and voice.
        </p>
        <p className="mt-1 text-xs text-muted-foreground font-sans">Required — minimum 50 words. Your essay is critical for an accurate evaluation.</p>
      </div>

      <div className="space-y-2">
        <Label className="font-sans">Personal Statement <span className="text-red-500 text-sm">*</span></Label>
        <p className="text-xs text-gray-500 font-sans">Required — minimum 50 words. Your essay is critical for an accurate evaluation.</p>
        <Textarea
          rows={12}
          placeholder="Share your story, experiences, and what drives you…"
          value={essays.personalStatement}
          onChange={(e) => updateSection('essays', { ...essays, personalStatement: e.target.value })}
          className="resize-y"
        />
        <div className="flex justify-between text-xs text-muted-foreground font-sans">
          <span>Recommended: 250–650 words</span>
          <span className={wordCount < 50 && wordCount > 0 ? 'text-amber-600 font-medium' : ''}>
            {wordCount} words · {charCount} characters
            {wordCount > 0 && wordCount < 50 && ' (minimum 50)'}
          </span>
        </div>
      </div>
    </div>
  );
}
