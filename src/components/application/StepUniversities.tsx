import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useApplication } from '@/contexts/ApplicationContext';
import { X } from 'lucide-react';

const SUPPORTED_UNIVERSITIES = [
  'University of Washington',
  'Washington State University',
  'Stanford University',
  'Massachusetts Institute of Technology',
  'Harvard University',
  'University of California, Berkeley',
  'University of California, Los Angeles',
  'University of Southern California',
  'University of Michigan — Ann Arbor',
  'The University of Texas at Austin',
];

export default function StepUniversities() {
  const { data, updateSection } = useApplication();
  const [search, setSearch] = useState('');
  const [searchParams] = useSearchParams();
  const universities = data.universities;

  useEffect(() => {
    const schoolParam = searchParams.get('school');
    if (schoolParam && SUPPORTED_UNIVERSITIES.includes(schoolParam)) {
      updateSection('universities', [schoolParam]);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = SUPPORTED_UNIVERSITIES.filter(
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
      if (filtered.length > 0) {
        addUniversity(filtered[0]);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-2xl font-semibold">Target Universities</h2>
        <p className="mt-1 text-sm text-muted-foreground font-sans">
          Select the universities you'd like to be evaluated against. You can add one or many.
        </p>
        <p className="mt-1 text-xs text-gray-500 font-sans">Select at least one university (required)</p>
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

      {search && (
        <div className="rounded-xl border border-border bg-card max-h-48 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map((u) => (
              <button
                key={u}
                onClick={() => addUniversity(u)}
                className="block w-full px-4 py-2.5 text-left text-sm font-sans text-foreground hover:bg-accent transition-colors"
              >
                {u}
              </button>
            ))
          ) : (
            <p className="px-4 py-3 text-sm text-muted-foreground font-sans">
              This university is not yet supported. More schools coming soon.
            </p>
          )}
        </div>
      )}

      {!search && universities.length === 0 && (
        <div>
          <p className="text-xs text-muted-foreground font-sans mb-3">Popular universities:</p>
          <div className="flex flex-wrap gap-2">
            {SUPPORTED_UNIVERSITIES.map((u) => (
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
