import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApplication } from '@/contexts/ApplicationContext';

export default function StepAcademics() {
  const { data, updateSection } = useApplication();
  const { academics } = data;

  const update = (field: string, value: unknown) => {
    updateSection('academics', { ...academics, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-2xl font-semibold">Academic Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground font-sans">Tell us about your academic performance.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="font-sans">Unweighted GPA <span className="text-red-500 text-sm">*</span></Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            max="4.0"
            placeholder="e.g. 3.85"
            value={academics.gpa ?? ''}
            onChange={(e) => update('gpa', e.target.value ? parseFloat(e.target.value) : null)}
          />
          <p className="text-xs text-gray-500 font-sans">Required · On a 4.0 scale</p>
        </div>

        <div className="space-y-2">
          <Label className="font-sans">Course Rigor</Label>
          <Select value={academics.courseRigor} onValueChange={(v) => update('courseRigor', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select course rigor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="honors">Honors</SelectItem>
              <SelectItem value="ap_ib">AP / IB</SelectItem>
              <SelectItem value="most_demanding">Most Demanding</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="font-sans">SAT Score (optional)</Label>
          <Input
            type="number"
            min="400"
            max="1600"
            placeholder="e.g. 1450"
            value={academics.satScore ?? ''}
            onChange={(e) => update('satScore', e.target.value ? parseInt(e.target.value, 10) : null)}
          />
        </div>

        <div className="space-y-2">
          <Label className="font-sans">ACT Composite Score (optional)</Label>
          <Input
            type="number"
            min="1"
            max="36"
            placeholder="e.g. 32"
            value={academics.actScore ?? ''}
            onChange={(e) => update('actScore', e.target.value ? parseInt(e.target.value, 10) : null)}
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground font-sans">Leave blank if not applicable. Some universities are test-optional or test-blind.</p>

        <div className="space-y-2">
          <Label className="font-sans">Intended Major <span className="text-red-500 text-sm">*</span></Label>
        <Input
          placeholder="e.g. Computer Science, Economics, Biology"
          value={academics.intendedMajor}
          onChange={(e) => update('intendedMajor', e.target.value)}
        />
      </div>
    </div>
  );
}
