import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useApplication } from '@/contexts/ApplicationContext';
import { X } from 'lucide-react';

const POPULAR_UNIVERSITIES = [
  'Stanford University', 'MIT', 'Harvard University', 'Yale University',
  'Princeton University', 'Columbia University', 'University of Pennsylvania',
  'Duke University', 'Northwestern University', 'UC Berkeley',
  'UCLA', 'University of Michigan', 'University of Washington',
  'Carnegie Mellon University', 'Georgia Tech', 'NYU',
  'University of Virginia', 'University of Southern California',
  'Boston University', 'University of Texas at Austin',
];

export default function StepUniversities() {
  const { data, updateSection } = useApplication();
  const [search, setSearch] = useState('');
  const universities = data.universities;

  const filtered = POPULAR_UNIVERSITIES.filter(
    (u) => u.toLowerCase().includes(search.toLowerCase()) && !universities.includes(u)
  );

  const addUniversity = (name: string) => {
    if (!universities.includes(name)) {
      updateSection('universities', [...universities, name]);
    }
    setSearch('');
  };

  const removeUniversity = (name: string) => {
    updateSection('universities', universities.filter((u) => u !== name));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim()) {
      e.preventDefault();
      addUniversity(search.trim());
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Target Universities</h2>
        <p className="mt-1 text-sm text-muted-foreground font-sans">
          Select the universities you'd like to be evaluated against. You can add one or many.
        </p>
      </div>

      {universities.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {universities.map((u) => (
            <Badge key={u} variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm font-sans">
              {u}
              <button onClick={() => removeUniversity(u)} className="ml-1 hover:text-destructive transition-colors">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <Label className="font-sans">Search Universities</Label>
        <Input
          placeholder="Type a university name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {search && filtered.length > 0 && (
        <div className="rounded-xl border border-border bg-card max-h-48 overflow-y-auto">
          {filtered.map((u) => (
            <button
              key={u}
              onClick={() => addUniversity(u)}
              className="block w-full px-4 py-2.5 text-left text-sm font-sans text-foreground hover:bg-accent transition-colors"
            >
              {u}
            </button>
          ))}
        </div>
      )}

      {!search && universities.length === 0 && (
        <div>
          <p className="text-xs text-muted-foreground font-sans mb-3">Popular universities:</p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_UNIVERSITIES.slice(0, 10).map((u) => (
              <button
                key={u}
                onClick={() => addUniversity(u)}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground font-sans hover:bg-accent hover:text-foreground transition-colors"
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
