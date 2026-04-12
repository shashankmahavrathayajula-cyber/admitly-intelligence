import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useApplication } from '@/contexts/ApplicationContext';

export default function StepAcademics() {
  const { data, updateSection } = useApplication();
  const { academics } = data;

  const update = (field: string, value: unknown) => {
    updateSection('academics', { ...academics, [field]: value });
  };

  const notSureAvailable = !!academics.apCoursesAvailableNotSure;

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
          <Label className="font-sans">Intended Major <span className="text-red-500 text-sm">*</span></Label>
          <Input
            placeholder="e.g. Computer Science, Economics, Biology"
            value={academics.intendedMajor}
            onChange={(e) => update('intendedMajor', e.target.value)}
          />
        </div>
      </div>

      {/* AP/IB Course Rigor */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="font-sans">AP/IB courses taken <span className="text-red-500 text-sm">*</span></Label>
          <Input
            type="number"
            min="0"
            max="20"
            placeholder="e.g. 8"
            value={academics.apCoursesTaken ?? ''}
            onChange={(e) => update('apCoursesTaken', e.target.value !== '' ? parseInt(e.target.value, 10) : null)}
          />
        </div>

        <div className="space-y-2">
          <Label className="font-sans">AP/IB courses offered at your school <span className="text-red-500 text-sm">*</span></Label>
          <Input
            className={notSureAvailable ? 'opacity-50' : ''}
            type="number"
            min="0"
            max="30"
            placeholder="e.g. 15"
            disabled={notSureAvailable}
            value={notSureAvailable ? '' : (academics.apCoursesAvailable ?? '')}
            onChange={(e) => update('apCoursesAvailable', e.target.value !== '' ? parseInt(e.target.value, 10) : null)}
          />
          <div className="flex items-center gap-2 mt-1">
            <Checkbox
              id="not-sure-ap"
              checked={notSureAvailable}
              onCheckedChange={(checked) => {
                const isNotSure = !!checked;
                updateSection('academics', {
                  ...academics,
                  apCoursesAvailableNotSure: isNotSure,
                  apCoursesAvailable: isNotSure ? null : academics.apCoursesAvailable,
                });
              }}
            />
            <label htmlFor="not-sure-ap" className="text-xs text-muted-foreground font-sans cursor-pointer">Not sure</label>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500 font-sans">
        This helps us evaluate your academic rigor in context. A student taking 8 of 10 available AP courses shows more rigor than one taking 8 of 30.
      </p>

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
    </div>
  );
}
