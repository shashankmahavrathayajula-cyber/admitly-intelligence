import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useApplication } from '@/contexts/ApplicationContext';
import { Activity } from '@/types/application';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';

export default function StepActivities() {
  const { data, updateSection } = useApplication();
  const { activities } = data;

  const addActivity = () => {
    const newActivity: Activity = {
      id: crypto.randomUUID(),
      name: '',
      role: '',
      description: '',
      yearsActive: 1,
      isLeadership: false,
    };
    updateSection('activities', [...activities, newActivity]);
  };

  const updateActivity = (id: string, field: keyof Activity, value: unknown) => {
    updateSection(
      'activities',
      activities.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  const removeActivity = (id: string) => {
    updateSection('activities', activities.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-2xl font-semibold">Activities & Leadership</h2>
        <p className="mt-1 text-sm text-muted-foreground font-sans">List your extracurricular activities, clubs, sports, volunteering, and work experience.</p>
      </div>

      {activities.length === 0 && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 font-sans">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>No activities listed. This will significantly impact your evaluation scores. If you participate in anything outside of class — clubs, sports, volunteering, work, family responsibilities — add it here.</span>
        </div>
      )}

      {activities.length > 0 && activities.length < 3 && (
        <div className="rounded-lg bg-blue-50 p-3 text-sm text-gray-500 italic font-sans">
          💡 Most competitive applicants list 5-10 activities. Adding more activities gives our evaluation engine more data to work with, producing more accurate and useful results.
        </div>
      )}

      {activities.map((activity, i) => (
        <div key={activity.id} className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground font-sans">Activity {i + 1}</span>
            <Button variant="ghost" size="icon" onClick={() => removeActivity(activity.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="font-sans text-xs">Activity Name</Label>
              <Input placeholder="e.g. Debate Team" value={activity.name} onChange={(e) => updateActivity(activity.id, 'name', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="font-sans text-xs">Your Role</Label>
              <Input placeholder="e.g. Team Captain" value={activity.role} onChange={(e) => updateActivity(activity.id, 'role', e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="font-sans text-xs">Description</Label>
            <Textarea rows={2} placeholder="Brief description of your involvement and impact" value={activity.description} onChange={(e) => updateActivity(activity.id, 'description', e.target.value)} />
          </div>
          <div className="flex items-center gap-6">
            <div className="space-y-1.5">
              <Label className="font-sans text-xs">Years Active</Label>
              <Input type="number" min="1" max="6" className="w-20" value={activity.yearsActive} onChange={(e) => updateActivity(activity.id, 'yearsActive', parseInt(e.target.value) || 1)} />
            </div>
            <div className="flex items-center gap-2 pt-4">
              <Switch checked={activity.isLeadership} onCheckedChange={(v) => updateActivity(activity.id, 'isLeadership', v)} />
              <Label className="font-sans text-xs">Leadership Role</Label>
            </div>
          </div>
        </div>
      ))}

      <Button variant="outline" onClick={addActivity} className="w-full gap-2 border-dashed">
        <Plus className="h-4 w-4" /> Add Activity
      </Button>
    </div>
  );
}
