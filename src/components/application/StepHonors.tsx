import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApplication } from '@/contexts/ApplicationContext';
import { Honor } from '@/types/application';
import { Plus, Trash2 } from 'lucide-react';

export default function StepHonors() {
  const { data, updateSection } = useApplication();
  const { honors } = data;

  const addHonor = () => {
    const newHonor: Honor = { id: crypto.randomUUID(), title: '', level: 'school', year: '' };
    updateSection('honors', [...honors, newHonor]);
  };

  const updateHonor = (id: string, field: keyof Honor, value: string) => {
    updateSection('honors', honors.map((h) => (h.id === id ? { ...h, [field]: value } : h)));
  };

  const removeHonor = (id: string) => {
    updateSection('honors', honors.filter((h) => h.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Honors & Awards</h2>
        <p className="mt-1 text-sm text-muted-foreground font-sans">List any academic or extracurricular honors, awards, or recognitions.</p>
      </div>

      {honors.map((honor, i) => (
        <div key={honor.id} className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground font-sans">Honor {i + 1}</span>
            <Button variant="ghost" size="icon" onClick={() => removeHonor(honor.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1.5">
            <Label className="font-sans text-xs">Award / Honor Title</Label>
            <Input placeholder="e.g. National Merit Semifinalist" value={honor.title} onChange={(e) => updateHonor(honor.id, 'title', e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="font-sans text-xs">Level</Label>
              <Select value={honor.level} onValueChange={(v) => updateHonor(honor.id, 'level', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="school">School</SelectItem>
                  <SelectItem value="regional">Regional</SelectItem>
                  <SelectItem value="state">State</SelectItem>
                  <SelectItem value="national">National</SelectItem>
                  <SelectItem value="international">International</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="font-sans text-xs">Year</Label>
              <Input placeholder="e.g. 2025" value={honor.year} onChange={(e) => updateHonor(honor.id, 'year', e.target.value)} />
            </div>
          </div>
        </div>
      ))}

      <Button variant="outline" onClick={addHonor} className="w-full gap-2 border-dashed">
        <Plus className="h-4 w-4" /> Add Honor or Award
      </Button>
    </div>
  );
}
