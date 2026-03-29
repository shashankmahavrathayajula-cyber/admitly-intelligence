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
      <div>
        <h2 className="text-2xl font-semibold">Academic Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground font-sans">Tell us about your academic performance.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="font-sans">Unweighted GPA</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            max="4.0"
            placeholder="e.g. 3.85"
            value={academics.gpa ?? ''}
            onChange={(e) => update('gpa', e.target.value ? parseFloat(e.target.value) : null)}
          />
          <p className="text-xs text-muted-foreground font-sans">On a 4.0 scale</p>
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

      <div className="space-y-2">
        <Label className="font-sans">Intended Major</Label>
        <Input
          placeholder="e.g. Computer Science, Economics, Biology"
          value={academics.intendedMajor}
          onChange={(e) => update('intendedMajor', e.target.value)}
        />
      </div>
    </div>
  );
}
